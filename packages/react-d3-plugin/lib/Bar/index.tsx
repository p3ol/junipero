import {
  type RefObject,
  type ReactNode,
  useImperativeHandle,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import {
  type TooltipProps,
  type TooltipRef,
  type JuniperoRef,
  type SpecialComponentPropsWithRef,
  Tooltip,
  classNames,
} from '@junipero/react';
import * as d3 from 'd3';

import { useChart } from '../hooks';
import { scaleBandInvert } from '../utils';

export declare interface BarRef extends JuniperoRef {
  innerRef: RefObject<SVGGElement>;
  tooltipRef: RefObject<TooltipRef>;
}

export declare interface BarProps extends Omit<
  SpecialComponentPropsWithRef<'g', BarRef>,
  'offset' | 'order'
> {
  xAxisIndex: number;
  yAxisIndex: number;
  minBarWidth?: number;
  tooltip?(opts: {
    position: number | Date;
    xIndex: number;
  }): ReactNode;
  tooltipProps?: TooltipProps;
  order?(series: d3.Series<any, any>): number[];
  offset?(series: d3.Series<any, any>, order: Iterable<number>): void;
}

const Bar = ({
  ref,
  className,
  tooltipProps,
  xAxisIndex,
  yAxisIndex,
  minBarWidth = 15,
  tooltip,
  order = d3.stackOrderNone,
  offset = d3.stackOffsetNone,
  ...rest
}: BarProps) => {
  const innerRef = useRef<SVGGElement>(null);
  const tooltipRef = useRef<TooltipRef>(null);
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
  }, [cursor, xAxis]);

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
      )(yAxis.data as Record<string, number>[]);
  }, [xAxis, yAxis, order, offset]);

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
};

Bar.displayName = 'Bar';

export default Bar;
