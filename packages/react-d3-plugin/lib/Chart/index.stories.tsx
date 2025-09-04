import { ReactNode, useCallback, useMemo, useState } from 'react';
import * as d3 from 'd3';
import { closestIndexTo, startOfMonth, startOfYear } from '@junipero/core';
import { Card } from '@junipero/react';

import Chart from '.';
import Bar from '../Bar';
import Curve from '../Curve';
import Marker from '../Marker';
import { AxisObject } from '../Axis';

export default { title: 'react-d3-plugin/Chart' };

const data: [Date, number][] = [
  [new Date('2020-01-01'), 10],
  [new Date('2020-01-02'), 50],
  [new Date('2020-01-03'), 30],
  [new Date('2020-01-04'), 40],
  [new Date('2020-01-05'), 20],
];

const alternativeData: [Date, number][] = [
  [new Date('2020-01-01'), 4000],
  [new Date('2020-01-02'), 2000],
  [new Date('2020-01-03'), 5000],
  [new Date('2020-01-04'), 3000],
  [new Date('2020-01-05'), 7000],
];

const barData: [Date, { free: number, premium:number}][] = [
  [new Date('2020-01-01'), { free: 37, premium: 63 }],
  [new Date('2020-01-02'), { free: 16, premium: 84 }],
  [new Date('2020-01-03'), { free: 49, premium: 51 }],
  [new Date('2020-01-04'), { free: 61, premium: 39 }],
  [new Date('2020-01-05'), { free: 27, premium: 73 }],
];

const axis: [
  AxisObject<Date[]>,
  AxisObject<number[]>,
  AxisObject<number[]>,
] = [{
  type: 'axisBottom',
  scale: 'scaleTime',
  data: data.map(d => d[0]),
  findSelectionIndex: (position: Date) =>
    closestIndexTo(position, data.map(d => d[0])),
  parseTitle: (d: Date) => d.toLocaleDateString(),
  ticks: null,
}, {
  type: 'axisLeft',
  scale: 'scaleLinear',
  data: data.map(d => d[1]),
  grid: true,
  min: 0,
  tickSize: 20,
  parseTitle: d => `${d}%`,
}, {
  type: 'axisRight',
  scale: 'scaleLinear',
  data: alternativeData.map(d => d[1]),
  tickSize: 20,
  min: 0,
}];

const barAxis: [
  AxisObject<Date[]>,
  AxisObject<{ premium: number, free: number }[]>,
] = [{
  type: 'axisBottom',
  scale: 'scaleBand',
  data: barData.map(d => d[0]) as any,
  parseTitle: (d: Date) => d?.toLocaleDateString(),
  ticks: null,
}, {
  type: 'axisLeft',
  scale: 'scaleLinear',
  grid: true,
  min: 0,
  max: 100,
  data: barData.map(d => d[1]),
}];
const Wrapper = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      height: '100vh',
      flexDirection: 'column',
    }}
  >
    <Card style={{ padding: '20px 30px 90px 70px' }}>
      { children }
    </Card>
  </div>
);

export const Basic = () => (
  <Wrapper>
    <Chart
      width={1000}
      height={500}
      axis={axis.slice(0, 2)}
    >
      <Marker
        xAxisIndex={0}
        yAxisIndexes={[1]}
      />
      <Curve
        type="area"
        xAxisIndex={0}
        yAxisIndex={1}
      />
    </Chart>
  </Wrapper>
);

export const DoubleCurves = () => (
  <Wrapper>
    <Chart
      width={1000}
      height={500}
      axis={axis.slice(0, 2)}
    >
      <Marker
        series={[
          data.map(d => d[1]),
          data.slice().reverse().map(d => d[1]),
        ]}
        xAxisIndex={0}
        yAxisIndexes={[1]}
      />
      <Curve
        type="area"
        xAxisIndex={0}
        yAxisIndex={1}
      />
      <Curve
        type="line"
        serie={data.slice().reverse().map(d => d[1])}
        xAxisIndex={0}
        yAxisIndex={1}
        className="curve:serie-sunglow"
      />
    </Chart>
  </Wrapper>
);

export const DoubleAxis = () => (
  <Wrapper>
    <Chart
      width={1000}
      height={500}
      axis={axis}
      style={{ paddingRight: 50 }}
    >
      <Marker
        xAxisIndex={0}
        yAxisIndexes={[1, 2]}
      />
      <Curve
        type="area"
        xAxisIndex={0}
        yAxisIndex={1}
      />
      <Curve
        xAxisIndex={0}
        yAxisIndex={2}
        className="curve:serie-sunglow"
      />
    </Chart>
  </Wrapper>
);

export const Bars = () => (
  <Wrapper>
    <Chart
      width={1000}
      height={500}
      axis={barAxis}
      style={{ paddingRight: 50 }}
      linearDomainMaxMargin={1}
    >
      <Bar
        xAxisIndex={0}
        yAxisIndex={1}
        tooltip={({ xIndex }: { xIndex: number}) => (
          <div>
            <div>{ (barAxis[0].data[xIndex])?.toISOString() }</div>
            <div>Free: { barAxis[1].data[xIndex]?.free }</div>
            <div>Premium: { barAxis[1].data[xIndex]?.premium }</div>
          </div>
        )}
        className="bar-nth-2:serie-sunglow"
      />
    </Chart>
  </Wrapper>
);

export const Responsive = () => (
  <Wrapper>
    <Chart
      width="calc(100vw - 300px)"
      height="calc(100vh - 300px)"
      axis={axis}
      style={{ paddingRight: 50 }}
    >
      <Marker
        xAxisIndex={0}
        yAxisIndexes={[1, 2]}
      />
      <Curve
        type="area"
        xAxisIndex={0}
        yAxisIndex={1}
      />
      <Curve
        xAxisIndex={0}
        yAxisIndex={2}
        className="alternative"
      />
    </Chart>
  </Wrapper>
);

export const WithTooltip = () => (
  <Wrapper>
    <Chart
      width={1000}
      height={500}
      style={{ paddingRight: 50 }}
      axis={axis}
    >
      <Marker
        xAxisIndex={0}
        yAxisIndexes={[1, 2]}
        tooltip={({ xIndex }: {xIndex: number}) => (
          <div>
            <div>{ axis[0].data[xIndex].toISOString() }</div>
            <div>Data: { data[xIndex][1] }</div>
            <div>
              Alternative data: { alternativeData[xIndex][1] }
            </div>
          </div>
        )}
      />
      <Curve
        type="area"
        xAxisIndex={0}
        yAxisIndex={1}
      />
      <Curve
        xAxisIndex={0}
        yAxisIndex={2}
        className="alternative"
      />
    </Chart>
  </Wrapper>
);

export const WithGranularity = () => {
  const [granularity, setGranularity] = useState('day');

  const rollup = useCallback((
    data: [Date, number][], opts: {aggregate?: string} = {}
  ) => {
    switch (granularity) {
      case 'year':
      case 'month':
        return Array.from(d3.rollup(
          data,
          v => opts.aggregate === 'mean'
            ? d3.mean(v, d => d[1])
            : d3.sum(v, d => d[1]),
          d => granularity === 'month'
            ? startOfMonth(d[0])
            : startOfYear(d[0])
        ));
      default:
        return data;
    }
  }, [granularity]);

  const data_ = useMemo(() => rollup(data, { aggregate: 'mean' }), [rollup]);
  const alternativeData_ = useMemo(() => rollup(alternativeData), [rollup]);

  const axis_ = useMemo(() => [{
    ...axis[0],
    data: data_.map(d => d[0]),
  }, {
    ...axis[1],
    data: data_.map(d => d[1]),
  }, {
    ...axis[2],
    data: alternativeData_.map(d => d[1]),
  }], [data_, alternativeData_]);

  return (
    <Wrapper>
      <div style={{ display: 'flex', justifyContent: 'end', gap: 10 }}>
        <span>Current: { granularity }</span>
        <button onClick={() => setGranularity('day')}>Day</button>
        <button onClick={() => setGranularity('month')}>Month</button>
        <button onClick={() => setGranularity('year')}>Year</button>
      </div>
      <Chart
        width={1000}
        height={500}
        style={{ paddingRight: 50 }}
        axis={axis_}
      >
        <Marker
          xAxisIndex={0}
          yAxisIndexes={[1, 2]}
        />
        <Curve
          type="area"
          xAxisIndex={0}
          yAxisIndex={1}
        />
        <Curve
          xAxisIndex={0}
          yAxisIndex={2}
          className="alternative"
        />
      </Chart>
    </Wrapper>
  );
};
