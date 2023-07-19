import PropTypes from 'prop-types';
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';

import { useChart } from '../hooks';

const Marker = forwardRef(({
  series,
  yAxisIndexes,
  xAxisIndex = 0,
}, ref) => {
  const innerRef = useRef();
  const { axis, cursor, height, paddingBottom, paddingLeft } = useChart();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  const [x, y] = useMemo(() => {
    if (!cursor) {
      return [0, 0];
    }

    const xAxis = axis[xAxisIndex];
    const position = xAxis.range.invert(cursor.x);

    const xIndex = axis[xAxisIndex]?.findSelection?.(position);
    const xValue = xAxis?.domain?.(xAxis?.data?.[xIndex]);

    const yValue = Math.min(...series
      ? series.map(s => (yAxisIndexes || [1]).map(i =>
        axis[i]?.domain?.(s[xIndex])
      )).flat()
      : (yAxisIndexes || [1]).map(i =>
        axis[i]?.domain?.(axis[i]?.data?.[xIndex]))
    );

    return [xValue || 0, yValue || 0];
  }, [yAxisIndexes, xAxisIndex, cursor, series]);

  if (!cursor) {
    return null;
  }

  return (
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
});

Marker.displayName = 'Marker';
Marker.propTypes = {
  series: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any)),
  xAxisIndex: PropTypes.number,
  yAxisIndexes: PropTypes.arrayOf(PropTypes.number),
};

export default Marker;
