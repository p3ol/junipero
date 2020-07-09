![junipero](https://storage.googleapis.com/junipero-cdn/images/logo-github.png)

<div align="center">

[![npm](https://img.shields.io/npm/v/@poool/junipero-hooks.svg)](https://www.npmjs.com/package/@poool/junipero-hooks)

<br />
<h3>junipero-hooks</h3>
<p>Custom React hooks we use inside Junipero packages</p>

</div>

## Installation

```bash
yarn add @poool/junipero-hooks
```

## Usage

```javascript
import React from 'react';
import { useEventListener, useTimeout } from '@poool/junipero-hooks';

export default () => {
  useTimeout(() => {
    console.log('This has been executed 1s after first render!');
  }, 1000);

  useEventListener('click', () => {
    console.log('You clicked inside the current document');
  });

  return <div />;
};
```

## Documentation

#### `useEventListener(name: String, handler: Function, target: DOMNode)`

* `name` {`String`} Event name
* `handler` {`Function`}
  * `event` {`Object`} Event data
* `target` {`DOMNode`} Custom event target (default: `global`)

#### `useTimeout(handler: Function, time: Number, changes: Array)`

* `handler` {`Function`} Timeout callback
* `time` {`Number`} Time in ms before timeout
* `changes` {`Array`} Reset timer when any value changes (just like `useEffect`)

## Contributing

Please check the [CONTRIBUTING.md](https://github.com/p3ol/junipero/blob/master/CONTRIBUTING.md) doc for contribution guidelines.

## License

This software is licensed under [MIT](https://github.com/p3ol/junipero/blob/master/LICENSE).
