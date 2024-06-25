import {
  type MutableRefObject,
  type ComponentPropsWithRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { type JuniperoRef, classNames } from '@junipero/react';
import * as d3 from 'd3';

import { useChart } from '../hooks';

export declare interface CurveRef extends JuniperoRef {
  innerRef: MutableRefObject<SVGGElement>;
  defsRef: MutableRefObject<SVGDefsElement>;
  lineRef: MutableRefObject<SVGPathElement>;
  areaRef: MutableRefObject<SVGPathElement>;
}

export declare interface CurveProps extends ComponentPropsWithRef<'g'> {
  serie?: Array<number | Date>;
  type?: 'line' | 'area';
  curve?: d3.CurveFactory;
  xAxisIndex: number;
  yAxisIndex: number;
  lineCapShift?: number;
}

const Curve = forwardRef<CurveRef, CurveProps>(({
  serie,
  className,
  type = 'line',
  curve = d3.curveMonotoneX,
  xAxisIndex,
  yAxisIndex,
  lineCapShift = 10,
  ...rest
}, ref) => {
  const innerRef = useRef<SVGGElement>();
  const defsRef = useRef<SVGDefsElement>();
  const lineRef = useRef<SVGPathElement>();
  const areaRef = useRef<SVGPathElement>();
  const [selected, setSelected] = useState(null);
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
      setSelected(null);

      return;
    }

    const position = (
      xAxis.range as d3.ScaleTime<number, number, never>
    ).invert(cursor.x);
    const selectionIndex = xAxis.findSelectionIndex(
      position, (xAxis.data as (number | Date)[])
    );

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
      ((serie as [number, number]) || yAxis.data || [])[i],
    ]);

    const isMonoData = yData.length === 1;
    const compute = d3
      .line()
      .curve(curve).x((d, i) => isMonoData
        ? Math
          .min(width - paddingRight - paddingLeft, i * width) - lineCapShift
        : xAxis.range(d[0]) - paddingLeft - lineCapShift
      ).y(d => yAxis.range(d[1]));
    // Line
    d3
      .select(lineRef.current)
      .datum(isMonoData ? [...yData, ...yData] : yData)
      .attr('d', compute as any);//TODO: fix this

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
      const compute2 = d3
        .area()
        .curve(curve)
        .x((d, i) => isMonoData
          ? Math
            .min(width - paddingRight - paddingLeft, i * width) - lineCapShift
          : xAxis.range(d[0]) - paddingLeft - lineCapShift
        )
        .y0(height - paddingBottom)
        .y1(d => yAxis.range(d[1] ?? 0));
      // Area
      d3
        .select(areaRef.current)
        .datum(isMonoData ? [...yData, ...yData] : yData)
        .attr('d', compute2 as any)//TODO: fix this
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
      { ...rest }
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

export default Curve;
