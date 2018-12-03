[![npm](https://img.shields.io/npm/v/@poool/junipero.svg?style=flat-square)](https://www.npmjs.com/package/@poool/junipero)
[![GitHub](https://img.shields.io/github/license/p3ol/junipero.svg?style=flat-square)](https://github.com/p3ol/junipero)

# Junipero

> A collection of lightweight and beautifully designed React components

## Installation

```bash
yarn add @poool/junipero
```

## Usage

```javascript
import React, { Component } from 'react';
import { TextField } from '@poool/junipero';

class Example extends Component {
  render() {
    return (
      <TextField />
    );
  }
}
```

#### Dependencies

These libraries are not bundled with Junipero and required at runtime:
- [react](https://www.npmjs.com/package/react)
- [prop-types](https://www.npmjs.com/package/prop-types)
- [react-popper](https://www.npmjs.com/package/react-popper)

## [Documentation](https://junipero.design)

https://junipero.design

## Contributing

Please check the [CONTRIBUTING.md](https://github.com/p3ol/junipero/blob/master/CONTRIBUTING.md) doc for contribution guidelines.

## Development

Install dependencies:

```bash
yarn install
```

Run examples at http://localhost:65000/ with webpack dev server:

```bash
yarn serve
```

## License

This software is licensed under [MIT](https://github.com/p3ol/junipero/blob/master/LICENSE).
