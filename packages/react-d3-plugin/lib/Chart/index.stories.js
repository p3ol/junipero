import * as d3 from 'd3';
import { closestIndexTo } from '@junipero/core';

import Chart from './';
import Curve from '../Curve';
import Marker from '../Marker';

export default { title: 'react-d3-plugin/Chart' };

const data = [
  [new Date('2020-01-01'), 10],
  [new Date('2020-01-02'), 50],
  [new Date('2020-01-03'), 30],
  [new Date('2020-01-04'), 40],
  [new Date('2020-01-05'), 20],
];

const alternativeData = [
  [new Date('2020-01-01'), 4000],
  [new Date('2020-01-02'), 2000],
  [new Date('2020-01-03'), 5000],
  [new Date('2020-01-04'), 3000],
  [new Date('2020-01-05'), 7000],
];

const axis = [{
  type: d3.axisBottom,
  scale: d3.scaleTime,
  data: data.map(d => d[0]),
  findSelection: position =>
    closestIndexTo(position, data.map(d => d[0])),
  parseTitle: d => d.toLocaleDateString(),
  ticks: null,
}, {
  type: d3.axisLeft,
  scale: d3.scaleLinear,
  data: data.map(d => d[1]),
  grid: true,
  min: 0,
  tickSize: 20,
  parseTitle: d => `${d}%`,
}, {
  type: d3.axisRight,
  scale: d3.scaleLinear,
  data: alternativeData.map(d => d[1]),
  tickSize: 20,
  min: 0,
}];

export const basic = () => (
  <Chart
    width={1000}
    height={500}
    style={{ padding: 50 }}
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
);

export const doubleCurves = () => (
  <Chart
    width={1000}
    height={500}
    style={{ padding: 50 }}
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
      className="alternative"
    />
  </Chart>
);

export const doubleAxis = () => (
  <Chart
    width={1000}
    height={500}
    style={{ padding: 50 }}
    axis={axis}
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
);
