import {
  type ComponentPropsWithRef,
  type MutableRefObject,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import {
  type JuniperoRef,
  type StateReducer,
  classNames,
  mockState,
  useEventListener,
  endOfDay,
  startOfDay,
} from '@junipero/react';
import * as d3 from 'd3';

import { type ChartContextType, ChartContext } from '../contexts';
import Axis, { type AxisObject } from '../Axis';

export declare interface ChartRef extends JuniperoRef {
  innerRef: MutableRefObject<SVGSVGElement>;
  axis: Array<AxisObject>;
}

export declare interface ChartProps extends ComponentPropsWithRef<'svg'> {
  axis: Array<AxisObject>;
  redrawThreshold?: number;
  linearDomainMaxMargin?: number;
  bandDomainInnerPadding?: number;
  bandDomainOuterPadding?: number;
}

export declare interface ChartState {
  width: number;
  height: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
  cursor?: { x: number, y: number };
}

const Chart = forwardRef<ChartRef, ChartProps>(({
  children,
  className,
  redrawThreshold = 10,
  axis: axisProp,
  linearDomainMaxMargin = 1.3,
  bandDomainInnerPadding = 0.2,
  bandDomainOuterPadding = 0.1,
  ...rest
}, ref) => {
  const innerRef = useRef<SVGSVGElement>();
  const resizeTimerRef = useRef<NodeJS.Timeout>();
  const [state, dispatch] = useReducer<
    StateReducer<ChartState>
  >(mockState, {
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

    let domain: ReturnType<typeof d3.scaleLinear<number>> |
      ReturnType<typeof d3.scaleTime<number>> |
      ReturnType<typeof d3.scaleBand>;

    switch (a.scale) {
      case d3.scaleTime:
        domain = d3.scaleTime().domain(d3.extent(d3.timeDay.range(
          startOfDay(a.min ?? d3.min(a.data as Date[])),
          endOfDay(a.max ?? d3.max(a.data as Date[])),
          1
        )));
        break;
      case d3.scaleLinear:
        domain = a.scale().domain([
          a.min as number ?? d3.min(a.data as number[]),
          (a.max as number ?? d3.max(a.data as number[])) *
            linearDomainMaxMargin,
        ]);
        break;
      case d3.scaleBand:
        domain = (a.scale() as ReturnType<typeof d3.scaleBand>)
          .domain(a.data)
          .paddingInner(bandDomainInnerPadding)
          .paddingOuter(bandDomainOuterPadding);
        break;
      default:
        domain = (a.scale as typeof d3.scaleLinear)().domain([
          a.min ?? d3.min(a.data as number[]),
          a.max ?? d3.max(a.data as number[]),
        ]);
    }

    let range: ReturnType<typeof domain.range>;

    switch (a.type) {
      case d3.axisBottom:
      case d3.axisTop:
        range = domain.range([
          state.paddingLeft,
          state.width - state.paddingRight,
        ]) as ReturnType<typeof domain.range>;
        break;
      default:
        range = domain.range([
          state.height - state.paddingBottom - state.paddingTop,
          -state.paddingTop,
        ]) as ReturnType<typeof domain.range>;
    }

    return { ...a, domain, range } as AxisObject;
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
      width: rect.width || innerRef.current.clientWidth ||
        Number(styles.width),
      height: rect.height || innerRef.current.clientHeight ||
        Number(styles.height),
      paddingLeft: parseInt(styles.paddingLeft || '0', 10),
      paddingRight: parseInt(styles.paddingRight || '0', 10),
      paddingTop: parseInt(styles.paddingTop || '0', 10),
      paddingBottom: parseInt(styles.paddingBottom || '0', 10),
    });
  };

  /* istanbul ignore next: cannot be tested */
  const onMouseMove = useCallback((e: MouseEvent) => {
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

  const getContext = useCallback((): ChartContextType => ({
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

export default Chart;
