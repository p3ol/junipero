![junipero](https://storage.googleapis.com/junipero-cdn/images/logo-github.png)

<div align="center">

[![npm](https://img.shields.io/npm/v/@poool/junipero-utils.svg)](https://www.npmjs.com/package/@poool/junipero-utils)

<br />
<h3>junipero-utils</h3>
<p>Simple utilities we commonly use inside Junipero packages</p>

</div>

## Installation

```bash
yarn add @poool/junipero-utils
```

## Usage

```javascript
import React from 'react';
import { classNames } from '@poool/junipero-utils';

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
