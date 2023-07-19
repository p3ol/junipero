import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Tooltip } from '@junipero/react';
import PropTypes from 'prop-types';

import { useChart } from '../hooks';

const Marker = forwardRef(({
  series,
  yAxisIndexes,
  xAxisIndex = 0,
  tooltip,
  tooltipProps,
}, ref) => {
  const innerRef = useRef();
  const tooltipRef = useRef();
  const { axis, cursor, height, paddingBottom, paddingLeft } = useChart();

  const { position, xIndex, x, y } = useMemo(() => {
    if (!cursor) {
      return [0, 0];
    }

    const xAxis = axis[xAxisIndex];
    const position = xAxis.range.invert(cursor.x);

    const xIndex = axis[xAxisIndex]?.findSelectionIndex?.(position);
    const xValue = xAxis?.domain?.(xAxis?.data?.[xIndex]);

    const yValue = Math.min(...series
      ? series.map(s => (yAxisIndexes || [1]).map(i =>
        axis[i]?.domain?.(s[xIndex])
      )).flat()
      : (yAxisIndexes || [1]).map(i =>
        axis[i]?.domain?.(axis[i]?.data?.[xIndex]))
    );

    return {
      position,
      xIndex,
      x: xValue || 0,
      y: yValue || 0,
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

  if (!cursor) {
    return null;
  }

  const markerContent = (
    <g
      ref={innerRef}
      className="junipero marker"
      transform={`translate(${x - paddingLeft}, ${y})`}
    >
      <line
        x={0}
        y={0}
        x1={0}
        y1={height - (y + paddingBottom)}
      />
    </g>
  );

  return tooltip ? (
    <Tooltip
      ref={tooltipRef}
      text={tooltip({ position, xIndex })}
      container={tooltipProps?.container || 'body'}
      opened={true}
      {...tooltipProps}
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
};

export default Marker;
