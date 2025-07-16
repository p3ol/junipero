import {
  type RefObject,
  type ReactNode,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {
  type TooltipProps,
  type TooltipRef,
  type JuniperoRef,
  type SpecialComponentPropsWithRef,
  Tooltip,
  classNames,
  startOfDay,
} from '@junipero/react';
import * as d3 from 'd3';

import { useChart } from '../hooks';

export declare interface MarkerRef extends JuniperoRef {
  position: number | Date;
  xIndex: number;
  x: number;
  y: number;
  innerRef: RefObject<SVGGElement>;
  tooltipRef: RefObject<TooltipRef>;
}

export declare interface MarkerProps
  extends SpecialComponentPropsWithRef<'g', MarkerRef> {
  series?: (number | Date)[][] | (number | Date)[];
  xAxisIndex?: number;
  yAxisIndexes?: number[];
  tooltip?(opts: {
    position: number | Date;
    xIndex: number;
  }): ReactNode;
  tooltipProps?: TooltipProps;
  lineCapShift?: number;
}

const Marker = ({
  ref,
  series,
  yAxisIndexes,
  tooltip,
  tooltipProps,
  xAxisIndex = 0,
  lineCapShift = 0,
  ...rest
}: MarkerProps) => {
  const innerRef = useRef<SVGGElement>(null);
  const tooltipRef = useRef<TooltipRef>(null);
  const {
    axis,
    cursor,
    height,
    paddingBottom,
    paddingTop,
    paddingLeft,
  } = useChart();

  const {
    position,
    xIndex,
    x,
    y,
  } = useMemo<{
    position?: number | Date;
    xIndex?: number;
    x: number;
    y: number;
  }>(() => {
    if (!cursor) {
      return { x: 0, y: 0 };
    }

    const xAxis = axis[xAxisIndex];
    const position = (
      xAxis.range as d3.ScaleTime<number, number, never>
    ).invert(cursor.x);

    const xIndex = axis[xAxisIndex]?.findSelectionIndex?.(position);
    const xValue = xAxis?.domain?.(xAxis.scale === 'scaleTime'
      ? startOfDay(xAxis?.data?.[xIndex] as Date)
      : xAxis?.data?.[xIndex] as number);
    const yValue = Math.min(...(series
      ? series.map(s => (yAxisIndexes || [1]).map(i =>
        axis[i]?.domain?.((s as (number | Date)[])[xIndex]) as number
      )).flat()
      : (yAxisIndexes || [1]).map(i =>
        axis[i]?.domain?.(axis[i]?.data?.[xIndex] as number))as number[]
    ));

    return {
      position,
      xIndex,
      x: xValue as number || 0,
      y: yValue || 0,
    };
  }, [yAxisIndexes, xAxisIndex, series, cursor, axis]);

  useImperativeHandle(ref, () => ({
    innerRef,
    tooltipRef,
    position,
    xIndex,
    x,
    y,
    isJunipero: true,
  }));

  useEffect(() => {
    tooltipRef.current?.update?.();
  }, [x]);

  if (!cursor) {
    return null;
  }

  const markerContent = (
    <g
      { ...rest }
      ref={innerRef}
      className="junipero marker"
      transform={`translate(${x - paddingLeft - lineCapShift}, ${y})`}
    >
      <line
        x={0}
        y={0}
        x1={0}
        y1={height - y - paddingBottom - paddingTop}
      />
    </g>
  );

  return tooltip ? (
    <Tooltip
      ref={tooltipRef}
      text={tooltip({ position, xIndex })}
      container={tooltipProps?.container || 'body'}
      opened={true}
      { ...tooltipProps }
      className={classNames('chart-tooltip', tooltipProps?.className)}
    >
      { markerContent }
    </Tooltip>
  ) : markerContent;
};

Marker.displayName = 'Marker';

export default Marker;
