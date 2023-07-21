<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://cdn.junipero.design/v3/logo/junipero-logo-dark.svg" />
  <img src="https://cdn.junipero.design/v3/logo/junipero-logo.svg" height="50" />
</picture>

<br />

[![npm](https://img.shields.io/npm/v/@junipero/transitions.svg)](https://www.npmjs.com/package/@junipero/transitions)

<h3>@junipero/transitions</h3>
<p>A collection of React transitions we use everywhere</p>

</div>

## Installation

```bash
yarn add @junipero/transitions
```

## Usage

```javascript
import { slideInUpMenu } from '@junipero/transitions';
import { Tooltip } from '@junipero/react';

export default () => (
  <Tooltip animate={slideInUpMenu}>
    Info
  </Tooltip>
);
```

## [Documentation](https://junipero.design/components/transition)

https://junipero.design/components/transition

## Contributing

Please check the [CONTRIBUTING.md](https://github.com/p3ol/junipero/blob/master/CONTRIBUTING.md) doc for contribution guidelines.

## License

This software is licensed under [MIT](https://github.com/p3ol/junipero/blob/master/LICENSE).
