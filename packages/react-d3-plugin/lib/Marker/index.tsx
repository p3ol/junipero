import {
  type ComponentPropsWithRef,
  type MutableRefObject,
  type ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {
  type TooltipProps,
  type TooltipRef,
  type JuniperoRef,
  Tooltip,
  classNames,
  startOfDay,
} from '@junipero/react';
import * as d3 from 'd3';

import { useChart } from '../hooks';

export declare interface MarkerRef extends JuniperoRef {
  innerRef: MutableRefObject<SVGGElement>;
  tooltipRef: MutableRefObject<TooltipRef>;
  position: number | Date;
  xIndex: number;
  x: number;
  y: number;
}

export declare interface MarkerProps extends ComponentPropsWithRef<'g'> {
  series?: Array<Array<number | Date>> | Array<number | Date>;
  xAxisIndex?: number;
  yAxisIndexes?: Array<number>;
  tooltip?(opts: {
    position: number | Date;
    xIndex: number;
  }): ReactNode | JSX.Element;
  tooltipProps?: TooltipProps;
  lineCapShift?: number;
}

const Marker = forwardRef<MarkerRef, MarkerProps>(({
  series,
  yAxisIndexes,
  tooltip,
  tooltipProps,
  xAxisIndex = 0,
  lineCapShift = 0,
  ...rest
}, ref) => {
  const innerRef = useRef<SVGGElement>();
  const tooltipRef = useRef<TooltipRef>();
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
    const xValue = xAxis?.domain?.(xAxis.scale === d3.scaleTime
      ? startOfDay(xAxis?.data?.[xIndex] as Date)
      : xAxis?.data?.[xIndex] as number);
    const yValue = Math.min(...(series
      ? series.map(s => (yAxisIndexes || [1]).map(i =>
        axis[i]?.domain?.((s as Array<number | Date>)[xIndex]) as number
      )).flat()
      : (yAxisIndexes || [1]).map(i =>
        axis[i]?.domain?.(axis[i]?.data?.[xIndex] as number))as number[]
    ));

    return {
      position,
      xIndex,
      x: xValue as number || 0,
      y: yValue as number || 0,
    };
  }, [yAxisIndexes, xAxisIndex, cursor, series]);

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
});

Marker.displayName = 'Marker';

export default Marker;
