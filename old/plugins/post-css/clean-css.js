const PostCSS = require('postcss');
const CleanCSS = require('clean-css');

module.exports = (css, res) => {
  const cleancss = new CleanCSS();
  const minified = cleancss.minify(css.toString());

  res.root = PostCSS.parse(minified.styles);
  return res;
};
