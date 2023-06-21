<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://cdn.junipero.design/v3/logo/junipero-logo-dark.svg" />
  <img src="https://cdn.junipero.design/v3/logo/junipero-logo.svg" height="50" />
</picture>

<br />

[![npm](https://img.shields.io/npm/v/@junipero/theme.svg)](https://www.npmjs.com/package/@junipero/theme)

<h3>@junipero/theme</h3>
<p>Theme base for Junipero</p>

</div>

## Installation

```bash
yarn add @junipero/theme
```

## Usage

```javascript
import '@junipero/theme/dist/junipero.min.css';
```

If you need to tree-shake some unneeded styles, you can import every component/utility manually instead:

```css
@import "@junipero/theme/dist/css/reset.min.css";
@import "@junipero/theme/dist/css/icons.min.css";
@import "@junipero/theme/dist/css/texts.min.css";
@import "@junipero/theme/dist/css/transitions.min.css";
@import "@junipero/theme/dist/css/Label.min.css";
@import "@junipero/theme/dist/css/Abstract.min.css";
@import "@junipero/theme/dist/css/TextField.min.css";
/* ...and so on */
```

The full list is available inside the `dist/css` folder.

## [Documentation](https://junipero.design/foundations)

https://junipero.design/foundations

## Contributing

Please check the [CONTRIBUTING.md](https://github.com/p3ol/junipero/tree/master/CONTRIBUTING.md) doc for contribution guidelines.

## License

This software is licensed under [MIT](https://github.com/p3ol/junipero/tree/master/LICENSE).
