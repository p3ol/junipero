![junipero](https://storage.googleapis.com/junipero-cdn/images/logo-github.png)

<div align="center">

[![npm](https://img.shields.io/npm/v/@junipero/core.svg)](https://www.npmjs.com/package/@junipero/core)

<br />
<h3>@junipero/core</h3>
<p>Simple utilities we commonly use inside Junipero packages</p>

</div>

## Installation

```bash
yarn add @junipero/core
```

## Usage

```javascript
import { classNames } from '@junipero/core';

export default ({ className, disabled }) => (
  <div className={classNames('text', { disabled }, className)} />
);
```

## Documentation

This package is not really intended for public usage.
Use it at your own risks.

## Contributing

Please check the [CONTRIBUTING.md](https://github.com/p3ol/junipero/blob/master/CONTRIBUTING.md) doc for contribution guidelines.

## License

This software is licensed under [MIT](https://github.com/p3ol/junipero/blob/master/LICENSE).
