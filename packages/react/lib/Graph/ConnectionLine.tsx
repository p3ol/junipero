import type { GraphAnchor, GraphHandlePosition } from './store';
import { CONNECTION_CURSOR_KEY, CONNECTION_KEY } from './store';
import { type GraphEdgeType, getEdgePath } from '../GraphEdge/paths';
import { useGraph, useGraphSubscription } from '../hooks';

export declare interface GraphConnectionLineProps {
  type?: GraphEdgeType;
}

const OPPOSITES: Record<GraphHandlePosition, GraphHandlePosition> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

/**
 * Line following the pointer while a connection is being dragged from a
 * handle. Rendered automatically by <Graph />.
 */
const GraphConnectionLine = ({ type = 'bezier' }: GraphConnectionLineProps) => {
  const graph = useGraph();

  useGraphSubscription([CONNECTION_KEY, CONNECTION_CURSOR_KEY]);

  const pending = graph?.connection;
  const from = pending &&
    graph.getAnchor(pending.from.nodeId, pending.from.handleId, pending.from.type);

  if (!from) {
    return null;
  }

  // Snap to the hovered handle if it would make a valid connection
  const hovered = pending.hovered;
  const to: GraphAnchor = (
    hovered && pending.hoveredValid &&
    graph.getAnchor(hovered.nodeId, hovered.handleId, hovered.type)
  ) || { ...graph.cursor, position: OPPOSITES[from.position] };

  const { path, bounds } = getEdgePath(type, from, to);
  const width = Math.max(bounds.maxX - bounds.minX, 1);
  const height = Math.max(bounds.maxY - bounds.minY, 1);

  return (
    <svg
      className="junipero graph-connection-line"
      style={{
        position: 'absolute',
        left: bounds.minX,
        top: bounds.minY,
        width,
        height,
        overflow: 'visible',
        pointerEvents: 'none',
      }}
      viewBox={`${bounds.minX} ${bounds.minY} ${width} ${height}`}
    >
      <path className="graph-connection-line-path" d={path} fill="none" />
    </svg>
  );
};

GraphConnectionLine.displayName = 'GraphConnectionLine';

export default GraphConnectionLine;
