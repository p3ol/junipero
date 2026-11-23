import {
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';
import { classNames } from '@junipero/core';

import type { JuniperoRef, SpecialComponentPropsWithRef } from '../types';
import {
  type GraphHandleInfo,
  type GraphHandlePosition,
  type GraphHandleType,
  CONNECTION_KEY,
} from '../Graph/store';
import { useGraph, useGraphNode, useGraphSubscription } from '../hooks';

export declare interface GraphHandleRef extends JuniperoRef {
  id: string;
  nodeId: string;
  type: GraphHandleType;
  innerRef: RefObject<HTMLDivElement | null>;
}

export declare interface GraphHandleProps extends Omit<
  SpecialComponentPropsWithRef<'div', GraphHandleRef>,
  'id'
> {
  /** Unique id inside its node, defaults to the handle's type */
  id?: string;
  /**
   * `source` handles start edges, `target` handles end them. A connection can
   * be dragged from either one, but always links a source to a target.
   */
  type: GraphHandleType;
  /** Side of the node the handle sits on, also gives the edges' direction */
  position?: GraphHandlePosition;
  connectable?: boolean;
}

const GraphHandle = ({
  ref,
  id: idProp,
  type,
  position = type === 'source' ? 'right' : 'left',
  connectable = true,
  className,
  onPointerDown,
  onPointerEnter,
  onPointerLeave,
  ...rest
}: GraphHandleProps) => {
  const id = idProp ?? type;
  const graph = useGraph();
  const node = useGraphNode();
  const nodeId = node?.id;
  const innerRef = useRef<HTMLDivElement>(null);

  useGraphSubscription([CONNECTION_KEY]);

  useImperativeHandle(ref, () => ({
    id,
    nodeId,
    type,
    innerRef,
    isJunipero: true,
  }), [id, nodeId, type]);

  // Center of the handle relative to its node, ignoring any css transform
  // applied to the graph (e.g. zoom), as offsets are unscaled
  const measure = useCallback(() => {
    const elmt = innerRef.current;
    const nodeElmt = node?.innerRef.current;
    let x = 0;
    let y = 0;
    let current: HTMLElement | null = elmt;

    while (current && current !== nodeElmt) {
      x += current.offsetLeft;
      y += current.offsetTop;
      current = current.offsetParent as HTMLElement | null;
    }

    return {
      x: x + (elmt?.offsetWidth ?? 0) / 2,
      y: y + (elmt?.offsetHeight ?? 0) / 2,
    };
  }, [node]);

  useLayoutEffect(() => {
    if (!graph || !nodeId) {
      return;
    }

    graph.setHandle(nodeId, id, { type, position, connectable, measure });

    return () => {
      graph.removeHandle(nodeId, id);
    };
  }, [graph, nodeId, id, type, position, connectable, measure]);

  const info: GraphHandleInfo = { nodeId, handleId: id, type };
  const pending = graph?.connection;
  const isOrigin = pending?.from.nodeId === nodeId &&
    pending?.from.handleId === id;
  const isHovered = pending?.hovered?.nodeId === nodeId &&
    pending?.hovered?.handleId === id;

  const onPointerDown_ = (e: ReactPointerEvent<HTMLDivElement>) => {
    onPointerDown?.(e);

    if (!graph || !nodeId || !connectable || e.button !== 0) {
      return;
    }

    // Prevent the node from being dragged & text from being selected
    e.preventDefault();
    e.stopPropagation();

    const pointerId = e.pointerId;

    // Touch pointers are implicitly captured by the element they started on,
    // which would prevent other handles from receiving pointerenter events
    if (e.currentTarget.hasPointerCapture?.(pointerId)) {
      e.currentTarget.releasePointerCapture(pointerId);
    }

    const toGraphPoint = (evt: PointerEvent | ReactPointerEvent) =>
      graph.options.toGraphPoint(evt.clientX, evt.clientY);

    const onMove = (evt: PointerEvent) => {
      if (evt.pointerId === pointerId) {
        graph.moveConnection(toGraphPoint(evt));
      }
    };

    const onUp = (evt: PointerEvent) => {
      if (evt.pointerId !== pointerId) {
        return;
      }

      globalThis.removeEventListener('pointermove', onMove);
      globalThis.removeEventListener('pointerup', onUp);
      globalThis.removeEventListener('pointercancel', onCancel);
      graph.endConnection(toGraphPoint(evt));
    };

    const onCancel = (evt: PointerEvent) => {
      if (evt.pointerId !== pointerId) {
        return;
      }

      globalThis.removeEventListener('pointermove', onMove);
      globalThis.removeEventListener('pointerup', onUp);
      globalThis.removeEventListener('pointercancel', onCancel);
      graph.cancelConnection();
    };

    globalThis.addEventListener('pointermove', onMove);
    globalThis.addEventListener('pointerup', onUp);
    globalThis.addEventListener('pointercancel', onCancel);
    graph.startConnection(info, toGraphPoint(e));
  };

  const onPointerEnter_ = (e: ReactPointerEvent<HTMLDivElement>) => {
    onPointerEnter?.(e);

    if (graph?.connection && !isOrigin) {
      graph.hoverHandle(info);
    }
  };

  const onPointerLeave_ = (e: ReactPointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(e);

    if (isHovered) {
      graph.hoverHandle(null);
    }
  };

  return (
    <div
      { ...rest }
      ref={innerRef}
      data-node-id={nodeId}
      data-handle-id={id}
      data-handle-type={type}
      className={classNames(
        'junipero graph-handle',
        type,
        position,
        {
          connectable,
          connecting: isOrigin,
          valid: isHovered && pending.hoveredValid,
          invalid: isHovered && !pending.hoveredValid,
        },
        className,
      )}
      onPointerDown={onPointerDown_}
      onPointerEnter={onPointerEnter_}
      onPointerLeave={onPointerLeave_}
    />
  );
};

GraphHandle.displayName = 'GraphHandle';

export default GraphHandle;
