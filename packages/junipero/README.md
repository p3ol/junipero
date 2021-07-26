![junipero](https://storage.googleapis.com/junipero-cdn/images/logo-github.png)

<div align="center">

[![npm](https://img.shields.io/npm/v/@poool/junipero.svg)](https://www.npmjs.com/package/@poool/junipero)

<br />
<p>Simple and beautiful React components for the web</p>

</div>

## Installation

```bash
yarn add @poool/junipero
```

## Usage

```javascript
import React from 'react';
import { TextField } from '@poool/junipero';

export default () => (
  <TextField />
);
```

Don't forget to import styles, for example using `style-loader` and `webpack`:

```javascript
import '@poool/junipero/dist/junipero.min.css';
```

Or import them directly inside your own styles using `less`, `sass` or `stylus`:

```css
@import "~@poool/junipero/dist/junipero.min.css";
```

#### Dependencies

These libraries are not bundled with Junipero and required at runtime:
- [react](https://www.npmjs.com/package/react)
- [react-dom](https://www.npmjs.com/package/react-dom)
- [prop-types](https://www.npmjs.com/package/prop-types)
- [react-popper](https://www.npmjs.com/package/react-popper)
- [@popperjs/core](https://www.npmjs.com/package/@popperjs/core)

## [Documentation](https://junipero.design)

https://junipero.design

## Contributing

Please check the [CONTRIBUTING.md](https://github.com/p3ol/junipero/blob/master/CONTRIBUTING.md) doc for contribution guidelines.

## License

This software is licensed under [MIT](https://github.com/p3ol/junipero/blob/master/LICENSE).
