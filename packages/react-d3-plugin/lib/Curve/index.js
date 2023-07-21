import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { classNames } from '@junipero/react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import { useChart } from '../hooks';

const Curve = forwardRef(({
  serie,
  className,
  type = 'line',
  curve = d3.curveMonotoneX,
  xAxisIndex,
  yAxisIndex,
  lineCapShift = 10,
}, ref) => {
  const innerRef = useRef();
  const defsRef = useRef();
  const lineRef = useRef();
  const areaRef = useRef();
  const [selected, setSelected] = useState();
  const {
    axis,
    width,
    height,
    paddingLeft,
    paddingRight,
    paddingBottom,
    cursor,
  } = useChart();

  const xAxis = useMemo(() => (
    axis[xAxisIndex]
  ), [axis, xAxisIndex]);

  const yAxis = useMemo(() => (
    axis[yAxisIndex]
  ), [axis, yAxisIndex]);

  useImperativeHandle(ref, () => ({
    innerRef,
    defsRef,
    lineRef,
    areaRef,
    isJunipero: true,
  }));

  useEffect(() => {
    if (!xAxis?.range || !xAxis?.findSelectionIndex || !cursor) {
      setSelected();

      return;
    }

    const position = xAxis.range.invert(cursor.x);
    const selectionIndex = xAxis.findSelectionIndex(position, xAxis.data);

    setSelected([
      xAxis?.data[selectionIndex],
      (serie || yAxis?.data || [])[selectionIndex],
    ]);
  }, [cursor, xAxis, yAxis, serie]);

  useEffect(() => {
    if (!xAxis || !yAxis) {
      return;
    }

    const yData = xAxis.data.map((d, i) => [
      d,
      (serie || yAxis.data || [])[i],
    ]);

    const isMonoData = yData.length === 1;

    // Line
    d3
      .select(lineRef.current)
      .datum(isMonoData ? [...yData, ...yData] : yData)
      .attr('d', d3
        .line()
        .curve(curve)
        .x((d, i) => isMonoData
          ? Math
            .min(width - paddingRight - paddingLeft, i * width) - lineCapShift
          : xAxis.range(d[0]) - paddingLeft - lineCapShift
        )
        .y(d => yAxis.range(d[1] ?? 0))
      );

    if (type === 'area') {
      // Gradient
      d3
        .select(defsRef.current)
        .append('linearGradient')
        .attr('id', 'gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%')
        .call(g => g
          .append('stop')
          .attr('offset', '0%')
          .attr('stop-color', 'var(--main-color)')
          .attr('stop-opacity', 0.4)
        )
        .call(g => g
          .append('stop')
          .attr('offset', '80%')
          .attr('stop-color', 'var(--gradient-stop-color)')
          .attr('stop-opacity', 0)
        );

      // Area
      d3
        .select(areaRef.current)
        .datum(isMonoData ? [...yData, ...yData] : yData)
        .attr('d', d3
          .area()
          .curve(curve)
          .x((d, i) => isMonoData
            ? Math
              .min(width - paddingRight - paddingLeft, i * width) - lineCapShift
            : xAxis.range(d[0]) - paddingLeft - lineCapShift
          )
          .y0(height - paddingBottom)
          .y1(d => yAxis.range(d[1] ?? 0))
        )
        .style('fill', 'url(#gradient)');
    }
  }, [
    xAxis,
    xAxis?.data,
    yAxis,
    yAxis?.data,
    height,
    paddingLeft,
    paddingRight,
    paddingBottom,
    serie,
  ]);

  return (
    <g
      ref={innerRef}
      className={classNames('junipero curve', className)}
    >
      <defs ref={defsRef} />
      <g>
        { type === 'area' && (
          <path ref={areaRef} className="area" />
        ) }

        <path ref={lineRef} className="line" />
      </g>
      { selected && (
        <g
          className="dot"
          transform={
            'translate(' +
              (
                (xAxis?.range?.(selected[0]) || 0) - paddingLeft - lineCapShift
              ) +
              ', ' +
              (yAxis?.range?.(selected[1]) || 0) +
            ')'
          }
        >
          <circle r={8} />
        </g>
      ) }
    </g>
  );
});

Curve.displayName = 'Curve';
Curve.propTypes = {
  serie: PropTypes.arrayOf(PropTypes.any),
  type: PropTypes.oneOf(['line', 'area']),
  xAxisIndex: PropTypes.number.isRequired,
  yAxisIndex: PropTypes.number.isRequired,
  curve: PropTypes.oneOf([
    d3.curveLinear,
    d3.curveLinearClosed,
    d3.curveStep,
    d3.curveStepBefore,
    d3.curveStepAfter,
    d3.curveBasis,
    d3.curveBasisClosed,
    d3.curveBasisOpen,
    d3.curveBundle,
    d3.curveNatural,
    d3.curveCardinal,
    d3.curveCardinalClosed,
    d3.curveCardinalOpen,
    d3.curveCatmullRom,
    d3.curveCatmullRomClosed,
    d3.curveCatmullRomOpen,
    d3.curveMonotoneX,
    d3.curveMonotoneY,
  ]),
  lineCapShift: PropTypes.number,
};

export default Curve;
