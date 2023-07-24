<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://cdn.junipero.design/v3/logo/junipero-logo-dark.svg" />
  <img src="https://cdn.junipero.design/v3/logo/junipero-logo.svg" height="50" />
</picture>

<br />

[![npm](https://img.shields.io/npm/v/@junipero/react-d3-plugin.svg)](https://www.npmjs.com/package/@junipero/react-d3-plugin)

<h3>@junipero/react-d3-plugin</h3>
<p>Simple and beautiful Charts using React, Junipero & D3</p>

</div>

## Installation

```bash
yarn add @junipero/react junipero/react-d3-plugin d3
```

## Usage

```jsx
import { Chart, Curve } from '@junipero/react-d3-plugin';
import * as d3 from 'd3';

export default () => (
  <Chart
    axis={[{
      type: d3.axisBottom,
      scale: d3.scaleTime,
      data: [new Date(2023, 0, 1), new Date(2023, 0, 2), new Date(2023, 0, 3)],
    }, {
      type: d3.axisLeft,
      scale: d3.scaleLinear,
      data: [10, 20, 30],
      grid: true,
    }]}
  >
    <Curve
      type="area"
      xAxisIndex={0}
      yAxisIndex={1}
    />
  </Chart>
);
```

Don't forget to add our default theme to your app using [@junipero/theme](https://github.com/p3ol/junipero/tree/master/packages/theme), or create your own theme.

#### Dependencies

These libraries are not bundled with this package and required at runtime:
- [react](https://www.npmjs.com/package/react)
- [react-dom](https://www.npmjs.com/package/react-dom)
- [d3](https://www.npmjs.com/package/d3)
- [@junipero/react](https://www.npmjs.com/package/@junipero/react)


## [Documentation](https://junipero.design/components)

https://junipero.design/components

## Contributing

Please check the [CONTRIBUTING.md](https://github.com/p3ol/junipero/tree/master/CONTRIBUTING.md) doc for contribution guidelines.

## License

This software is licensed under [MIT](https://github.com/p3ol/junipero/tree/master/LICENSE).
