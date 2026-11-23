import {
  type ReactNode,
  type RefObject,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { classNames } from '@junipero/core';

import type { JuniperoRef, SpecialComponentPropsWithRef } from '../types';
import { useGraphEdgeAnchors } from '../hooks';
import { type GraphEdgeType, getEdgePath } from './paths';

export declare type GraphEdgeLineStyle = 'solid' | 'dashed' | 'dotted';

export declare interface GraphEdgeRef extends JuniperoRef {
  innerRef: RefObject<SVGSVGElement | null>;
}

export declare interface GraphEdgeProps extends Omit<
  SpecialComponentPropsWithRef<'svg', GraphEdgeRef>,
  'type'
> {
  /** Id of the node this edge starts from */
  source: string;
  /** Id of the source node's handle, defaults to its first source handle */
  sourceHandle?: string;
  /** Id of the node this edge ends on */
  target: string;
  /** Id of the target node's handle, defaults to its first target handle */
  targetHandle?: string;
  type?: GraphEdgeType;
  /**
   * Stroke pattern of the edge. For custom patterns, set the
   * `--stroke-dasharray`, `--stroke-linecap` & `--stroke-width` css
   * variables on the edge (e.g. through `style` or `className`).
   */
  lineStyle?: GraphEdgeLineStyle;
  /** Bezier only: how much the curve bends when handles face away */
  curvature?: number;
  /** Step only: radius of the rounded corners */
  borderRadius?: number;
  label?: ReactNode;
  animated?: boolean;
  selected?: boolean;
  /** Draw an arrow at the target end of the edge */
  arrow?: boolean;
  /** Width & height of the arrow, in graph pixels */
  arrowSize?: number;
  /** Width of the invisible stroke used to make the edge easier to click */
  interactionWidth?: number;
}

// The arrow is drawn in a fixed viewBox, then scaled to `arrowSize`, so that
// its tip always stays on the end of the path
export const ARROW_VIEWBOX = 10;

const GraphEdge = ({
  ref,
  source,
  sourceHandle,
  target,
  targetHandle,
  type = 'bezier',
  lineStyle = 'solid',
  curvature,
  borderRadius,
  label,
  animated = false,
  selected = false,
  arrow = false,
  arrowSize = 10,
  interactionWidth = 20,
  className,
  style,
  ...rest
}: GraphEdgeProps) => {
  const innerRef = useRef<SVGSVGElement>(null);
  const markerId = useId();
  const anchors = useGraphEdgeAnchors({
    source,
    sourceHandle,
    target,
    targetHandle,
  });

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  const edge = useMemo(() => (
    anchors.source && anchors.target
      ? getEdgePath(type, anchors.source, anchors.target, {
        curvature,
        borderRadius,
      })
      : null
  ), [anchors, type, curvature, borderRadius]);

  if (!edge) {
    return null;
  }

  // Size the svg to the path's bounding box so it doesn't catch events (or
  // count in layout computations) outside of it. Strokes & markers can
  // still overflow thanks to `overflow: visible`.
  const { minX, minY, maxX, maxY } = edge.bounds;
  const width = Math.max(maxX - minX, 1);
  const height = Math.max(maxY - minY, 1);

  return (
    <>
      <svg
        { ...rest }
        ref={innerRef}
        data-source={source}
        data-target={target}
        className={classNames(
          'junipero graph-edge',
          type,
          lineStyle,
          { animated, selected },
          className,
        )}
        style={{
          ...style,
          position: 'absolute',
          left: minX,
          top: minY,
          width,
          height,
          overflow: 'visible',
        }}
        viewBox={`${minX} ${minY} ${width} ${height}`}
      >
        { arrow && (
          <defs>
            <marker
              id={markerId}
              className="graph-edge-arrow"
              viewBox={`0 0 ${ARROW_VIEWBOX} ${ARROW_VIEWBOX}`}
              refX={ARROW_VIEWBOX}
              refY={ARROW_VIEWBOX / 2}
              markerWidth={arrowSize}
              markerHeight={arrowSize}
              markerUnits="userSpaceOnUse"
              orient="auto-start-reverse"
            >
              <path
                d={
                  `M0,0 L${ARROW_VIEWBOX},${ARROW_VIEWBOX / 2} ` +
                  `L0,${ARROW_VIEWBOX} z`
                }
              />
            </marker>
          </defs>
        ) }
        <path
          className="graph-edge-path"
          d={edge.path}
          fill="none"
          markerEnd={arrow ? `url(#${markerId})` : undefined}
        />
        { interactionWidth > 0 && (
          <path
            className="graph-edge-interaction"
            d={edge.path}
            fill="none"
            stroke="transparent"
            strokeWidth={interactionWidth}
          />
        ) }
      </svg>

      { label !== undefined && label !== null && (
        <div
          className={classNames('junipero graph-edge-label', { selected })}
          style={{
            position: 'absolute',
            left: edge.labelX,
            top: edge.labelY,
            transform: 'translate(-50%, -50%)',
          }}
        >
          { label }
        </div>
      ) }
    </>
  );
};

GraphEdge.displayName = 'GraphEdge';

export default GraphEdge;
