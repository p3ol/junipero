import {
  type RefObject,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { classNames } from '@junipero/core';

import type { JuniperoRef, SpecialComponentPropsWithRef } from '../types';
import type { GraphEdgeType } from '../GraphEdge/paths';
import {
  type GraphConnectEndParams,
  type GraphConnection,
  type GraphHandleInfo,
  type GraphPoint,
  GraphStore,
  NODES_KEY,
} from './store';
import { GraphContext } from '../contexts';
import GraphConnectionLine from './ConnectionLine';

export declare interface GraphRef extends JuniperoRef {
  store: GraphStore;
  /** Bounding box of all the nodes, in graph coordinates */
  getBounds: () => ReturnType<GraphStore['getBounds']>;
  /** Converts a screen (client) position to graph coordinates */
  toGraphPoint: (clientX: number, clientY: number) => GraphPoint;
  innerRef: RefObject<HTMLDivElement | null>;
}

export declare interface GraphProps extends
  SpecialComponentPropsWithRef<'div', GraphRef> {
  /**
   * Automatically size & position the graph element to wrap all of its
   * nodes (e.g. so an InfiniteCanvas can fit it into view). Disable it to
   * size the element yourself, in which case nodes are positioned from its
   * top-left corner.
   */
  autoSize?: boolean;
  /** Path style of the line drawn while dragging a new connection */
  connectionLineType?: GraphEdgeType;
  onConnect?: (connection: GraphConnection) => void;
  onConnectStart?: (from: GraphHandleInfo) => void;
  onConnectEnd?: (params: GraphConnectEndParams) => void;
  isValidConnection?: (connection: GraphConnection) => boolean;
}

// Size of the hidden element used to find the graph's on-screen origin and
// scale, whatever css transforms are applied to its parents.
// ps: This doesn't need to be a customizable prop
export const PROBE_SIZE = 100;

const Graph = ({
  ref,
  className,
  style,
  children,
  autoSize = true,
  connectionLineType = 'bezier',
  onConnect,
  onConnectStart,
  onConnectEnd,
  isValidConnection,
  ...rest
}: GraphProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);
  const [store] = useState(() => new GraphStore());

  const toGraphPoint = useCallback((clientX: number, clientY: number) => {
    const rect = probeRef.current?.getBoundingClientRect();
    const scaleX = (rect?.width || PROBE_SIZE) / PROBE_SIZE;
    const scaleY = (rect?.height || PROBE_SIZE) / PROBE_SIZE;

    return {
      x: (clientX - (rect?.left ?? 0)) / scaleX,
      y: (clientY - (rect?.top ?? 0)) / scaleY,
    };
  }, []);

  useLayoutEffect(() => {
    store.options = {
      toGraphPoint,
      onConnect,
      onConnectStart,
      onConnectEnd,
      isValidConnection,
    };
  });

  useImperativeHandle(ref, () => ({
    store,
    getBounds: () => store.getBounds(),
    toGraphPoint,
    innerRef,
    isJunipero: true,
  }), [store, toGraphPoint]);

  // Applied directly to the DOM (instead of through state) so that the
  // bounds are already correct for any parent layout effect (e.g. an
  // InfiniteCanvas fitting its content into view on mount), and so that
  // moving a node doesn't re-render the whole graph
  useLayoutEffect(() => {
    const elmt = innerRef.current;
    const content = contentRef.current;

    if (!elmt || !content) {
      return;
    }

    if (!autoSize) {
      content.style.left = '0px';
      content.style.top = '0px';

      return;
    }

    const applyBounds = () => {
      const { minX, minY, maxX, maxY } = store.getBounds();

      elmt.style.left = `${minX}px`;
      elmt.style.top = `${minY}px`;
      elmt.style.width = `${maxX - minX}px`;
      elmt.style.height = `${maxY - minY}px`;
      content.style.left = `${-minX}px`;
      content.style.top = `${-minY}px`;
    };

    applyBounds();

    const unsubscribe = store.subscribe([NODES_KEY], applyBounds);

    return () => {
      unsubscribe();
      ['left', 'top', 'width', 'height'].forEach(prop => {
        elmt.style.removeProperty(prop);
      });
    };
  }, [store, autoSize]);

  return (
    <GraphContext value={store}>
      <div
        { ...rest }
        ref={innerRef}
        className={classNames(
          'junipero graph',
          { 'auto-size': autoSize },
          className,
        )}
        style={{ position: 'relative', ...style }}
      >
        <div
          ref={contentRef}
          className="graph-content"
          style={{ position: 'absolute' }}
        >
          <div
            ref={probeRef}
            className="graph-probe"
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: PROBE_SIZE,
              height: PROBE_SIZE,
              visibility: 'hidden',
              pointerEvents: 'none',
            }}
          />
          { children }
          <GraphConnectionLine type={connectionLineType} />
        </div>
      </div>
    </GraphContext>
  );
};

Graph.displayName = 'Graph';

export default Graph;
