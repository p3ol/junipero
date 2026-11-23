import {
  type PointerEvent as ReactPointerEvent,
  type MouseEvent as ReactMouseEvent,
  type RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { classNames } from '@junipero/core';

import type { JuniperoRef, SpecialComponentPropsWithRef } from '../types';
import type { GraphPoint } from '../Graph/store';
import {
  type GraphNodeContextType,
  GraphNodeContext,
} from '../contexts';
import { useGraph } from '../hooks';

export declare interface GraphNodeRef extends JuniperoRef {
  id: string;
  x: number;
  y: number;
  moving: boolean;
  innerRef: RefObject<HTMLDivElement | null>;
}

export declare interface GraphNodeProps extends Omit<
  SpecialComponentPropsWithRef<'div', GraphNodeRef>,
  'id' | 'draggable'
> {
  /** Unique node id, used by edges & connections to reference this node */
  id: string;
  /** Position of the node's top-left corner, in canvas coordinates */
  x?: number;
  y?: number;
  /** Whether the node can be moved around by dragging it */
  draggable?: boolean;
  /** Snap the node's position to a grid of this size while moving */
  step?: number;
  selected?: boolean;
  /**
   * CSS selector restricting which part of the node can be used to drag it
   * (e.g. `.node-header`). Elements with a `nodrag` class, form fields and
   * handles never start a drag.
   */
  dragHandle?: string;
  onMoveStart?: (
    position: GraphPoint,
    e: ReactPointerEvent<HTMLDivElement>,
  ) => void;
  onMove?: (position: GraphPoint, e: PointerEvent) => void;
  onMoveEnd?: (position: GraphPoint, e: PointerEvent) => void;
}

export interface DragState {
  pointerId: number;
  offsetX: number;
  offsetY: number;
  x: number;
  y: number;
  moved: boolean;
}

export const NO_DRAG_SELECTOR = [
  '.junipero.graph-handle',
  '.nodrag',
  'input',
  'textarea',
  'select',
  '[contenteditable="true"]',
].join(', ');

const GraphNode = ({
  ref,
  id,
  x = 0,
  y = 0,
  step = 1,
  draggable = true,
  selected = false,
  dragHandle,
  className,
  style,
  children,
  onPointerDown,
  onClickCapture,
  onMoveStart,
  onMove,
  onMoveEnd,
  ...rest
}: GraphNodeProps) => {
  const graph = useGraph();
  const innerRef = useRef<HTMLDivElement>(null);
  const drag = useRef<DragState | null>(null);
  const justMoved = useRef(false);
  const [position, setPosition] = useState({ x, y });
  const [moving, setMoving] = useState(false);
  const [prevProps, setPrevProps] = useState({ x, y });

  // Follow x/y props, unless the user is currently moving the node
  if (prevProps.x !== x || prevProps.y !== y) {
    setPrevProps({ x, y });

    if (!moving) {
      setPosition({ x, y });
    }
  }

  // Read through refs so that window listeners don't need to be re-attached
  // when callbacks aren't memoized by the consumer
  const callbacks = useRef({ onMove, onMoveEnd });

  useLayoutEffect(() => {
    callbacks.current = { onMove, onMoveEnd };
  });

  useImperativeHandle(ref, () => ({
    id,
    x: position.x,
    y: position.y,
    moving,
    innerRef,
    isJunipero: true,
  }), [id, position.x, position.y, moving]);

  useLayoutEffect(() => {
    graph?.setNode(id, { x: position.x, y: position.y });
  }, [graph, id, position.x, position.y]);

  useLayoutEffect(() => {
    const elmt = innerRef.current;

    if (!graph || !elmt) {
      return;
    }

    const measure = () => {
      graph.setNode(id, {
        width: elmt.offsetWidth,
        height: elmt.offsetHeight,
      });
      graph.measureHandles(id);
    };

    measure();

    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(measure)
      : null;
    observer?.observe(elmt);

    return () => {
      observer?.disconnect();
      graph.removeNode(id);
    };
  }, [graph, id]);

  const toGraphPoint = useCallback((clientX: number, clientY: number) => (
    graph?.options.toGraphPoint(clientX, clientY) ?? { x: clientX, y: clientY }
  ), [graph]);

  const onPointerDown_ = (e: ReactPointerEvent<HTMLDivElement>) => {
    onPointerDown?.(e);
    justMoved.current = false;

    const target = e.target as Element;

    if (
      !draggable ||
      e.button !== 0 ||
      e.defaultPrevented ||
      target.closest(NO_DRAG_SELECTOR) ||
      (dragHandle && !target.closest(dragHandle))
    ) {
      return;
    }

    // Don't let a parent node (or the canvas) handle this drag too
    e.stopPropagation();

    const pointer = toGraphPoint(e.clientX, e.clientY);

    drag.current = {
      pointerId: e.pointerId,
      offsetX: pointer.x - position.x,
      offsetY: pointer.y - position.y,
      x: position.x,
      y: position.y,
      moved: false,
    };
    setMoving(true);
    onMoveStart?.({ ...position }, e);
  };

  useEffect(() => {
    if (!moving) {
      return;
    }

    const snap = (value: number) => Math.round(value / step) * step;

    const onPointerMove = (e: PointerEvent) => {
      const current = drag.current;

      if (!current || e.pointerId !== current.pointerId) {
        return;
      }

      // Use canvas coordinates (instead of a screen delta) so the node stays
      // under the pointer even if the canvas is zoomed/panned mid-drag
      const pointer = toGraphPoint(e.clientX, e.clientY);
      const next = {
        x: snap(pointer.x - current.offsetX),
        y: snap(pointer.y - current.offsetY),
      };

      if (next.x === current.x && next.y === current.y) {
        return;
      }

      if (!current.moved) {
        globalThis.getSelection?.()?.removeAllRanges();
      }

      Object.assign(current, next, { moved: true });
      setPosition(next);
      callbacks.current.onMove?.(next, e);
    };

    const onPointerUp = (e: PointerEvent) => {
      const current = drag.current;

      if (!current || e.pointerId !== current.pointerId) {
        return;
      }

      drag.current = null;
      justMoved.current = current.moved;
      setMoving(false);
      callbacks.current.onMoveEnd?.({ x: current.x, y: current.y }, e);
    };

    globalThis.addEventListener('pointermove', onPointerMove);
    globalThis.addEventListener('pointerup', onPointerUp);
    globalThis.addEventListener('pointercancel', onPointerUp);

    return () => {
      globalThis.removeEventListener('pointermove', onPointerMove);
      globalThis.removeEventListener('pointerup', onPointerUp);
      globalThis.removeEventListener('pointercancel', onPointerUp);
    };
  }, [moving, step, toGraphPoint]);

  // A drag shouldn't also count as a click on the node or its content
  const onClickCapture_ = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (justMoved.current) {
      justMoved.current = false;
      e.stopPropagation();

      return;
    }

    onClickCapture?.(e);
  };

  const context = useMemo<GraphNodeContextType>(() => ({
    id,
    innerRef,
  }), [id]);

  return (
    <GraphNodeContext value={context}>
      <div
        { ...rest }
        ref={innerRef}
        data-node-id={id}
        className={classNames(
          'junipero graph-node',
          { draggable, moving, selected },
          className,
        )}
        style={{
          ...style,
          position: 'absolute',
          left: position.x,
          top: position.y,
        }}
        onPointerDown={onPointerDown_}
        onClickCapture={onClickCapture_}
      >
        { children }
      </div>
    </GraphNodeContext>
  );
};

GraphNode.displayName = 'GraphNode';

export default GraphNode;
