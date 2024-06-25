import {
  type MutableRefObject,
  type ComponentPropsWithRef,
  type ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import {
  type TooltipProps,
  type TooltipRef,
  type JuniperoRef,
  Tooltip,
  classNames,
} from '@junipero/react';
import * as d3 from 'd3';

import { useChart } from '../hooks';
import { scaleBandInvert } from '../utils';

export declare interface BarRef extends JuniperoRef {
  innerRef: MutableRefObject<SVGGElement>;
  tooltipRef: MutableRefObject<TooltipRef>;
}

export declare interface BarProps
  extends Omit<ComponentPropsWithRef<'g'>, 'offset' | 'order'> {
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

const Bar = forwardRef<BarRef, BarProps>(({
  className,
  tooltip,
  tooltipProps,
  xAxisIndex,
  yAxisIndex,
  minBarWidth = 15,
  order = d3.stackOrderNone,
  offset = d3.stackOffsetNone,
  ...rest
}, ref) => {
  const innerRef = useRef<SVGGElement>();
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

    const xIndex = scaleBandInvert(xAxis.range as d3.ScaleBand<Date>)(cursor.x);
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
        { ...rest }
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

export default Bar;
