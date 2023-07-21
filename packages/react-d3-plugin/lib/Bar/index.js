import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { Tooltip, classNames } from '@junipero/react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import { useChart } from '../hooks';
import { scaleBandInvert } from '../utils';

const Bar = forwardRef(({
  className,
  minBarWidth = 15,
  tooltip,
  tooltipProps,
  xAxisIndex,
  yAxisIndex,
}, ref) => {
  const innerRef = useRef();
  const tooltipRef = useRef();
  const {
    axis,
    cursor,
  } = useChart();

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
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone)
      .keys(xAxis.stackKeys)(xAxis.data);
  }, [xAxis?.stackKeys, xAxis?.data]);

  const barWidth = xAxis?.domain?.bandwidth() > minBarWidth
    ? xAxis?.domain?.bandwidth()
    : minBarWidth;

  const bars = (
    <g
      ref={innerRef}
      className={classNames('junipero bar', className)}
    >
      { barStacks.map((barStack, i) => (
        <g className={classNames('rectangles', barStack.key)} key={i}>
          { barStack.map((bar, j) => {
            return (
              <rect
                key={j}
                width={barWidth}
                height={yAxis.range(bar[0]) - yAxis.range(bar[1])}
                x={xAxis.range(bar.data.date)}
                y={yAxis.range(bar[1])}
              />
            );
          }) }
        </g>
      )) }
    </g>
  );

  if (!xAxis || !yAxis) {
    return null;
  }

  return (
    <>
      { bars }
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
};

export default Bar;
