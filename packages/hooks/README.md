![junipero](https://storage.googleapis.com/junipero-cdn/images/logo-github.png)

<div align="center">

[![npm](https://img.shields.io/npm/v/@junipero/hooks.svg)](https://www.npmjs.com/package/@junipero/hooks)

<br />
<h3>@junipero/hooks</h3>
<p>Custom React hooks we use everywhere</p>

</div>

## Installation

```bash
yarn add @junipero/hooks
```

## Usage

```javascript
import { useEventListener, useTimeout } from '@junipero/hooks';

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
* `target` {`DOMNode`} Custom event target (default: `globalThis`)

#### `useInterval(handler: Function, time: Number, changes: Array)`

* `handler` {`Function`} Interval callback
* `time` {`Number`} Time in ms before next interval
* `changes` {`Array`} Reset timer when any value changes (just like `useEffect`)

#### `useTimeout(handler: Function, time: Number, changes: Array)`

* `handler` {`Function`} Timeout callback
* `time` {`Number`} Time in ms before timeout
* `changes` {`Array`} Reset timer when any value changes (just like `useEffect`)

## Contributing

Please check the [CONTRIBUTING.md](https://github.com/p3ol/junipero/blob/master/CONTRIBUTING.md) doc for contribution guidelines.

## License

This software is licensed under [MIT](https://github.com/p3ol/junipero/blob/master/LICENSE).
