import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { classNames } from '@junipero/react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import { useChart } from '../hooks';
import { getAxisType } from '../utils';

const Axis = forwardRef(({
  className,
  axis,
}, ref) => {
  const innerRef = useRef();
  const ticksRef = useRef();
  const gridRef = useRef();
  const {
    width,
    height,
    paddingRight,
    paddingTop,
    paddingBottom,
    paddingLeft,
  } = useChart();

  useImperativeHandle(ref, () => ({
    innerRef,
    gridRef,
    isJunipero: true,
  }));

  const shift = useMemo(() => {
    if (!axis) {
      return [0, 0];
    }

    switch (axis.type) {
      case d3.axisLeft: return [0, 0];
      case d3.axisRight: return [width - paddingRight - paddingLeft, 0];
      case d3.axisTop: return [0, 0];
      default: return [-paddingLeft, height - paddingTop - paddingBottom];
    }
  }, [
    axis?.type,
    width,
    height,
    paddingRight,
    paddingTop,
    paddingBottom,
    paddingLeft,
  ]);

  useEffect(() => {
    if (!axis) {
      return;
    }

    d3
      .select(ticksRef.current)
      .call(axis.type(axis.range)
        .ticks(axis.ticks ?? 5)
        .tickSize(axis.tickSize ?? 5)
        .tickFormat(d => (
          axis.parseTitle || (v => v)
        )?.(d, { type: 'tick', axis }))
      )
      .call(g => g.select('.domain').remove());

    if (axis.grid) {
      d3
        .select(gridRef.current)
        .call(axis.type(axis.range)
          .ticks(axis.ticks ?? 5)
          .tickSize(-(width - paddingLeft - paddingRight))
          .tickFormat('')
        )
        .call(g => g.select('.domain').remove());
    }
  }, [
    axis?.type,
    axis?.range,
    axis?.ticks,
    axis?.tickSize,
    axis?.grid,
    axis?.parseTitle,
    width,
    paddingRight,
  ]);

  return (
    <g
      className={classNames(
        'junipero axis',
        { [getAxisType(axis?.type)]: !!axis?.type },
        className
      )}
      ref={innerRef}
    >
      <g
        ref={ticksRef}
        className="junipero extra ticks"
        transform={`translate(${shift[0]}, ${shift[1]})`}
      />

      { axis?.grid && (
        <g ref={gridRef} className="grid" />
      ) }
    </g>
  );
});

Axis.displayName = 'Axis';
Axis.propTypes = {
  axis: PropTypes.shape({
    type: PropTypes.oneOf([
      d3.axisLeft,
      d3.axisRight,
      d3.axisTop,
      d3.axisBottom,
    ]),
    scale: PropTypes.oneOf([
      d3.scaleTime,
      d3.scaleLinear,
      d3.scaleBand,
    ]),
    range: PropTypes.func,
    data: PropTypes.arrayOf(PropTypes.any),
    min: PropTypes.any,
    max: PropTypes.any,
    parseTitle: PropTypes.func,
    ticks: PropTypes.number,
    tickSize: PropTypes.number,
    grid: PropTypes.bool,
    stackKeys: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default Axis;
