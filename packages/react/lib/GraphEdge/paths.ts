import type {
  GraphAnchor,
  GraphHandlePosition,
  GraphPoint,
} from '../Graph/store';

export declare type GraphEdgeType = 'bezier' | 'straight' | 'step';

export declare interface GraphEdgePath {
  /** SVG path data, in canvas coordinates */
  path: string;
  /** Where to put the label (middle of the path), in canvas coordinates */
  labelX: number;
  labelY: number;
  /** Bounding box of the path (including control points) */
  bounds: { minX: number; minY: number; maxX: number; maxY: number };
}

export declare interface GraphEdgePathOptions {
  /** Bezier only: how much the curve bends when handles face away */
  curvature?: number;
  /** Step only: radius of the rounded corners */
  borderRadius?: number;
}

const getBounds = (points: GraphPoint[]) => ({
  minX: Math.min(...points.map(p => p.x)),
  minY: Math.min(...points.map(p => p.y)),
  maxX: Math.max(...points.map(p => p.x)),
  maxY: Math.max(...points.map(p => p.y)),
});

const isHorizontal = (position: GraphHandlePosition) =>
  position === 'left' || position === 'right';

const getControlOffset = (distance: number, curvature: number) =>
  distance >= 0 ? 0.5 * distance : curvature * 25 * Math.sqrt(-distance);

const getControlPoint = (
  { x, y, position }: GraphAnchor,
  other: GraphPoint,
  curvature: number,
): GraphPoint => {
  switch (position) {
    case 'left':
      return { x: x - getControlOffset(x - other.x, curvature), y };
    case 'right':
      return { x: x + getControlOffset(other.x - x, curvature), y };
    case 'top':
      return { x, y: y - getControlOffset(y - other.y, curvature) };
    case 'bottom':
    default:
      return { x, y: y + getControlOffset(other.y - y, curvature) };
  }
};

export const getBezierPath = (
  source: GraphAnchor,
  target: GraphAnchor,
  { curvature = 0.25 }: GraphEdgePathOptions = {},
): GraphEdgePath => {
  const c1 = getControlPoint(source, target, curvature);
  const c2 = getControlPoint(target, source, curvature);

  return {
    path: `M${source.x},${source.y} ` +
      `C${c1.x},${c1.y} ${c2.x},${c2.y} ${target.x},${target.y}`,
    // Cubic bezier at t = 0.5
    labelX: (source.x + 3 * c1.x + 3 * c2.x + target.x) / 8,
    labelY: (source.y + 3 * c1.y + 3 * c2.y + target.y) / 8,
    // A bezier curve always fits inside the hull of its control points
    bounds: getBounds([source, c1, c2, target]),
  };
};

export const getStraightPath = (
  source: GraphPoint,
  target: GraphPoint,
): GraphEdgePath => ({
  path: `M${source.x},${source.y} L${target.x},${target.y}`,
  labelX: (source.x + target.x) / 2,
  labelY: (source.y + target.y) / 2,
  bounds: getBounds([source, target]),
});

const getRoundedPolyline = (points: GraphPoint[], radius: number) =>
  points.reduce((path, point, i) => {
    if (i === 0) {
      return `M${point.x},${point.y}`;
    }

    const prev = points[i - 1];
    const next = points[i + 1];

    if (!next || radius <= 0) {
      return `${path} L${point.x},${point.y}`;
    }

    const r = Math.min(
      radius,
      Math.hypot(point.x - prev.x, point.y - prev.y) / 2,
      Math.hypot(next.x - point.x, next.y - point.y) / 2,
    );
    const dirIn = {
      x: Math.sign(point.x - prev.x),
      y: Math.sign(point.y - prev.y),
    };
    const dirOut = {
      x: Math.sign(next.x - point.x),
      y: Math.sign(next.y - point.y),
    };

    return `${path} L${point.x - dirIn.x * r},${point.y - dirIn.y * r} ` +
      `Q${point.x},${point.y} ${point.x + dirOut.x * r},${point.y + dirOut.y * r}`;
  }, '');

export const getStepPath = (
  source: GraphAnchor,
  target: GraphAnchor,
  { borderRadius = 5 }: GraphEdgePathOptions = {},
): GraphEdgePath => {
  const midX = (source.x + target.x) / 2;
  const midY = (source.y + target.y) / 2;
  const points = isHorizontal(source.position)
    ? [
      source,
      { x: midX, y: source.y },
      { x: midX, y: target.y },
      target,
    ]
    : [
      source,
      { x: source.x, y: midY },
      { x: target.x, y: midY },
      target,
    ];

  return {
    path: getRoundedPolyline(points, borderRadius),
    labelX: midX,
    labelY: midY,
    bounds: getBounds(points),
  };
};

export const getEdgePath = (
  type: GraphEdgeType,
  source: GraphAnchor,
  target: GraphAnchor,
  options?: GraphEdgePathOptions,
): GraphEdgePath => {
  switch (type) {
    case 'straight':
      return getStraightPath(source, target);
    case 'step':
      return getStepPath(source, target, options);
    case 'bezier':
    default:
      return getBezierPath(source, target, options);
  }
};
