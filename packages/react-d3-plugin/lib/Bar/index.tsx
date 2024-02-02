import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useMemo,
  MutableRefObject,
  ComponentPropsWithRef,
  ReactNode,
} from 'react';
import { Tooltip, classNames } from '@junipero/react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { TooltipProps, TooltipRef } from '@junipero/react/lib';

import { useChart } from '../hooks';
import { scaleBandInvert } from '../utils';

export declare type BarRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
  tooltipRef: MutableRefObject<any>;
};

export declare interface BarProps extends ComponentPropsWithRef<any> {
  children?: ReactNode | JSX.Element;
  className?: string;
  ref?: MutableRefObject<BarRef | undefined>;
  xAxisIndex: number;
  yAxisIndex: number;
  minBarWidth?: number;
  tooltip?(opts: {
    position: number | Date;
    xIndex: number;
  }): ReactNode | JSX.Element;
  tooltipProps?: TooltipProps;
  order?(series: d3.Series<any, any>): number[];
  offset?(series: d3.Series<any, any>, order: Iterable<number>): void;
}

const Bar = forwardRef(({
  className,
  tooltip,
  tooltipProps,
  xAxisIndex,
  yAxisIndex,
  minBarWidth = 15,
  order = d3.stackOrderNone,
  offset = d3.stackOffsetNone,
}: BarProps, ref) => {
  const innerRef = useRef();
  const tooltipRef = useRef<TooltipRef>();
  const { axis, cursor } = useChart();

  const xAxis = useMemo(() => (
    axis[xAxisIndex]
  ), [axis, xAxisIndex]);

  const yAxis = useMemo(() => (
    axis[yAxisIndex]
  ), [axis, yAxisIndex]);

  useEffect(() => {
    if (tooltip && cursor) {
      // Force tooltip update
      tooltipRef.current?.update?.();
    }
  }, [tooltip, cursor]);

  useImperativeHandle(ref, () => ({
    innerRef,
    tooltipRef,
    isJunipero: true,
  }));

  const { position, xIndex } = useMemo(() => {
    if (!xAxis || !cursor) {
      return {
        position: null,
        xIndex: null,
      };
    }

    const xIndex = scaleBandInvert(xAxis.range)(cursor.x);
    const position = xAxis.range.domain()[xIndex];

    return { position, xIndex };
  }, [cursor, xAxis, yAxis]);

  const barStacks = useMemo(() => {
    if (!xAxis || !yAxis) {
      return [];
    }

    return d3
      .stack()
      .order(order)
      .offset(offset)
      .keys(
        yAxis.stackKeys || Object.keys(yAxis.data?.[0] || [])
      )(yAxis.data as {[key: string]: number}[]);
  }, [yAxis?.stackKeys, yAxis?.data, xAxis]);

  const barWidth = useMemo(() => (
    (xAxis?.domain as ReturnType<typeof d3.scaleBand>)
      ?.bandwidth() > minBarWidth
      ? (xAxis?.domain as ReturnType<typeof d3.scaleBand>)?.bandwidth()
      : minBarWidth
  ), [xAxis?.domain, minBarWidth]);

  if (!xAxis || !yAxis) {
    return null;
  }

  return (
    <>
      <g
        ref={innerRef}
        className={classNames('junipero bar', className)}
      >
        { barStacks.map((barStack, i) => (
          <g className={classNames('serie', barStack.key)} key={i}>
            { barStack.map((bar, j) => (
              <rect
                key={j}
                width={barWidth}
                height={yAxis.range(bar[0]) - yAxis.range(bar[1])}
                x={xAxis.range(xAxis.data?.[j] as Date)}
                y={yAxis.range(bar[1])}
              />
            )) }
          </g>
        )) }
      </g>
      { tooltip && cursor && (
        <Tooltip
          ref={tooltipRef}
          text={tooltip({ position, xIndex })}
          container={tooltipProps?.container || 'body'}
          opened={true}
          { ...tooltipProps }
          className={classNames('chart-tooltip', tooltipProps?.className)}
        >
          <g transform={`translate(${cursor.x}, ${cursor.y})`} />
        </Tooltip>
      ) }
    </>
  );
});

Bar.displayName = 'Bar';
Bar.propTypes = {
  xAxisIndex: PropTypes.number.isRequired,
  yAxisIndex: PropTypes.number.isRequired,
  minBarWidth: PropTypes.number,
  tooltip: PropTypes.func,
  tooltipProps: PropTypes.object,
  order: PropTypes.oneOf([
    d3.stackOrderNone,
    d3.stackOrderAppearance,
    d3.stackOrderAscending,
    d3.stackOrderDescending,
    d3.stackOrderInsideOut,
    d3.stackOrderReverse,
  ]),
  offset: PropTypes.oneOf([
    d3.stackOffsetNone,
    d3.stackOffsetExpand,
    d3.stackOffsetDiverging,
    d3.stackOffsetSilhouette,
    d3.stackOffsetWiggle,
  ]),
};

export default Bar;
