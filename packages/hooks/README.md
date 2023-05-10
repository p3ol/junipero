<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://cdn.junipero.design/v3/logo/junipero-logo-dark.svg" />
  <img src="https://cdn.junipero.design/v3/logo/junipero-logo.svg" height="50" />
</picture>

<br />

[![npm](https://img.shields.io/npm/v/@junipero/hooks.svg)](https://www.npmjs.com/package/@junipero/hooks)

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

https://beta.junipero.design/components/use-event-listener

## Contributing

Please check the [CONTRIBUTING.md](https://github.com/p3ol/junipero/blob/master/CONTRIBUTING.md) doc for contribution guidelines.

## License

This software is licensed under [MIT](https://github.com/p3ol/junipero/blob/master/LICENSE).
