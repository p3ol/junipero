import { cleanup, render } from '@testing-library/react';
import * as d3 from 'd3';

import Curve from '../Curve';
import Marker from '../Marker';
import Chart from '.';

describe('<Chart />', () => {
  it('should render', () => {
    const computedStylesMock = jest.spyOn(globalThis, 'getComputedStyle')
      .mockReturnValueOnce({
        width: '1000',
        height: '500',
        paddingLeft: '0',
        paddingRight: '0',
        paddingTop: '0',
        paddingBottom: '0',
      } as any);

    const { container, unmount } = render(
      <Chart
        width={1000}
        height={500}
        axis={[{
          type: d3.axisBottom,
          scale: d3.scaleTime,
          data: [
            new Date('2020-10-01T00:00:00.000Z'),
            new Date('2020-10-02T00:00:00.000Z'),
          ],
          parseTitle: (d: Date) => d.toISOString(),
          ticks: null,
        }, {
          type: d3.axisLeft,
          scale: d3.scaleLinear,
          data: [0, 100],
          grid: true,
          min: 0,
          tickSize: 20,
        }]}
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

    expect(container).toMatchSnapshot();

    unmount();
    computedStylesMock.mockRestore();
  });

  afterEach(() => {
    cleanup();
  });
});
