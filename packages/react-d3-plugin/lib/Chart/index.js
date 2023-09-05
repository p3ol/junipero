import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import {
  classNames,
  mockState,
  useEventListener,
} from '@junipero/react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { endOfDay, startOfDay } from '@junipero/core';

import { ChartContext } from '../contexts';
import Axis from '../Axis';

const Chart = forwardRef(({
  children,
  className,
  redrawThreshold = 10,
  axis: axisProp,
  linearDomainMaxMargin = 1.3,
  bandDomainInnerPadding = 0.2,
  bandDomainOuterPadding = 0.1,
  ...rest
}, ref) => {
  const innerRef = useRef();
  const resizeTimerRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    width: 0,
    height: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    cursor: null,
  });

  const axis = useMemo(() => (axisProp || []).map(a => {
    if (!state.width || !state.height) {
      return null;
    }

    let domain;

    switch (a.scale) {
      case d3.scaleTime:
        domain = d3.scaleTime().domain(d3.extent(d3.timeDay.range(
          startOfDay(a.min ?? d3.min(a.data)),
          endOfDay(a.max ?? d3.max(a.data)),
          1
        )));
        break;
      case d3.scaleLinear:
        domain = a.scale().domain([
          a.min ?? d3.min(a.data),
          (a.max ?? d3.max(a.data)) * linearDomainMaxMargin,
        ]);
        break;
      case d3.scaleBand:
        domain = a
          .scale()
          .domain(a.data)
          .paddingInner(bandDomainInnerPadding)
          .paddingOuter(bandDomainOuterPadding);
        break;
      default:
        domain = a.scale().domain([
          a.min ?? d3.min(a.data),
          a.max ?? d3.max(a.data),
        ]);
    }

    let range;

    switch (a.type) {
      case d3.axisBottom:
      case d3.axisTop:
        range = domain.range([
          state.paddingLeft,
          state.width - state.paddingRight,
        ]);
        break;
      default:
        range = domain.range([
          state.height - state.paddingBottom - state.paddingTop,
          -state.paddingTop,
        ]);
    }

    return { ...a, domain, range };
  }), [
    axisProp,
    state.width,
    state.height,
    state.paddingLeft,
    state.paddingRight,
    state.paddingTop,
    state.paddingBottom,
  ]);

  useImperativeHandle(ref, () => ({
    innerRef,
    axis,
    isJunipero: true,
  }));

  useEffect(() => {
    onResize();
  }, []);

  useEventListener('resize', () => {
    clearTimeout(resizeTimerRef.current);
    resizeTimerRef.current = setTimeout(() => onResize(), redrawThreshold);
  });

  const onResize = () => {
    const styles = globalThis.getComputedStyle(innerRef.current);
    const rect = innerRef.current.getBoundingClientRect();

    dispatch({
      width: rect.width || innerRef.current.clientWidth || styles.width,
      height: rect.height || innerRef.current.clientHeight || styles.height,
      paddingLeft: parseInt(styles.paddingLeft || 0, 10),
      paddingRight: parseInt(styles.paddingRight || 0, 10),
      paddingTop: parseInt(styles.paddingTop || 0, 10),
      paddingBottom: parseInt(styles.paddingBottom || 0, 10),
    });
  };

  /* istanbul ignore next: cannot be tested */
  const onMouseMove = useCallback(e => {
    if (!axis || state.width === 0) {
      return;
    }

    const [x, y] = d3.pointer(e);

    dispatch({ cursor: { x, y } });
  }, [state.width]);

  useEffect(() => {
    d3
      .select(innerRef.current)
      .on('mousemove', onMouseMove)
      .on('mouseout', onMouseOut);

    return () => {
      d3
        .select(innerRef.current)
        .on('mousemove', null)
        .on('mouseout', null);
    };
  }, [onMouseMove]);

  /* istanbul ignore next: cannot be tested */
  const onMouseOut = () => {
    dispatch({ cursor: null });
  };

  const getContext = useCallback(() => ({
    axis,
    width: state.width,
    height: state.height,
    paddingLeft: state.paddingLeft,
    paddingRight: state.paddingRight,
    paddingTop: state.paddingTop,
    paddingBottom: state.paddingBottom,
    cursor: state.cursor,
  }), [
    axis,
    state.width,
    state.height,
    state.paddingLeft,
    state.paddingRight,
    state.paddingTop,
    state.paddingBottom,
    state.cursor,
  ]);

  return (
    <ChartContext.Provider value={getContext()}>
      <svg
        { ...rest }
        className={classNames('junipero chart', className)}
        ref={innerRef}
      >
        { axis.filter(a => !!a).map((a, i) => (
          <Axis key={i} axis={a} />
        )) }
        { children }
      </svg>
    </ChartContext.Provider>
  );
});

Chart.displayName = 'Chart';
Chart.propTypes = {
  redrawThreshold: PropTypes.number,
  axis: PropTypes.arrayOf(PropTypes.shape({
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
    findSelectionIndex: PropTypes.func,
    parseTitle: PropTypes.func,
    ticks: PropTypes.number,
    tickSize: PropTypes.number,
    grid: PropTypes.bool,
    stackKeys: PropTypes.arrayOf(PropTypes.string),
  })).isRequired,
  linearDomainMaxMargin: PropTypes.number,
  bandDomainInnerPadding: PropTypes.number,
  bandDomainOuterPadding: PropTypes.number,
};

export default Chart;
