import {
  ComponentPropsWithRef,
  MutableRefObject,
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { Tooltip, classNames, TooltipProps, TooltipRef } from '@junipero/react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import { useChart } from '../hooks';

export declare type MarkerRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
  tooltipRef: MutableRefObject<any>;
  position: number | Date;
  xIndex: number;
  x: number;
  y: number;
};

export declare interface MarkerProps extends ComponentPropsWithRef<any> {
  children?: ReactNode | JSX.Element;
  className?: string;
  ref?: MutableRefObject<MarkerRef | undefined>;
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

const Marker = forwardRef(({
  series,
  yAxisIndexes,
  tooltip,
  tooltipProps,
  xAxisIndex = 0,
  lineCapShift = 10,
}: MarkerProps, ref) => {
  const innerRef = useRef<any>();
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
  }: {
    position?: number | Date,
    xIndex?: number,
    x: number,
    y: number
  } = useMemo(() => {
    if (!cursor) {
      return { x: 0, y: 0 };
    }

    const xAxis = axis[xAxisIndex];
    const position = (
      xAxis.range as d3.ScaleTime<number, number, never>
    ).invert(cursor.x);

    const test: number[] = (yAxisIndexes || [1]).map(i =>
      axis[i]?.domain?.(axis[i]?.data?.[xIndex] as number))as number[];

    const xIndex = axis[xAxisIndex]?.findSelectionIndex?.(position);
    const xValue = xAxis?.domain?.(xAxis?.data?.[xIndex] as number);
    const values = series
      ? series.map(s => (yAxisIndexes || [1]).map(i =>
        axis[i]?.domain?.((s as Array<number | Date>)[xIndex]) as number
      )).flat()
      : test;

    const yValue = Math.min(...values);

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
Marker.propTypes = {
  series: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any)),
  xAxisIndex: PropTypes.number,
  yAxisIndexes: PropTypes.arrayOf(PropTypes.number),
  tooltip: PropTypes.func,
  tooltipProps: PropTypes.object,
  lineCapShift: PropTypes.number,
};

export default Marker;
