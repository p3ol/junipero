const fs = require('fs');
const { dirname, isAbsolute, resolve } = require('path');
const postCSS = require('postcss');
const autoprefixer = require('autoprefixer');
const stylus = require('stylus');

const cleanCSS = require('../../plugins/post-css/clean-css');

const MODULE_REGEX = /(~*@).*/;

const fileExists = filename => {
  try {
    const stats = fs.statSync(filename);
    return stats.isFile(filename);
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    } else {
      throw Error(e);
    }
  }
};

const resolveModulePath = (filename) => {
  const dir = dirname(filename);
  if (isAbsolute(dir)) { return dir; }
  if (process.env.PWD) { return resolve(process.env.PWD, dir); }
  return resolve(dir);
};

const compileStylusFile = (jsFile, stylusFile) => {
  // try to resolve as file path
  const from = resolveModulePath(jsFile);
  let path = resolve(from, stylusFile);
  if (!fileExists(path)) {
    // try to resolve from node modules
    path = resolve('./node_modules', stylusFile);
  }

  if (!fileExists(path)) {
    throw Error('Cannot find stylus file: ' + stylusFile);
  }

  let stylusContent = fs.readFileSync(path, 'utf8');

  if (stylusContent.match(MODULE_REGEX) !== null) {
    const match = stylusContent.match(MODULE_REGEX);
    stylusContent = stylusContent
      .replace(MODULE_REGEX, match[0].replace('~', ''));
  }

  const parsed = stylus(stylusContent)
    .include(dirname(path))
    .include(resolve('./node_modules'))
    .render();

  return postCSS([
    autoprefixer,
    cleanCSS,
  ]).process(parsed).css;
};

module.exports = {
  process (src, filename) {
    return 'module.exports = ' +
      JSON.stringify(compileStylusFile(src, filename)) +
      ';';
  },
};
