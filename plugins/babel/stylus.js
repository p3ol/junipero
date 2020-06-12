/* global process */

const fs = require('fs');
const { dirname, isAbsolute, resolve } = require('path');
const postCSS = require('postcss');
const autoprefixer = require('autoprefixer');
const stylus = require('stylus');

const cleanCSS = require('../post-css/clean-css');

/*
  MODULE REGEX WILL RETURN STYLUS NODE_MODULE IMPORT
  WILL RETURN TRUE FOR
  * @import '~module'
  * @require '~another-module'
  WILL RETURN FALSE FOR
  * @require 'module.styl'
  * @require 'module'
  * div ~ input
*/

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

const resolveModulePath = filename => {
  const dir = dirname(filename);
  if (isAbsolute(dir)) { return dir; }
  if (process.env.PWD) { return resolve(process.env.PWD, dir); }
  return resolve(dir);
};

module.exports = ({ types: t }) => {
  return {
    visitor: {
      ImportDeclaration: (path, state) => {
        const node = path.node;
        if (node && node.source && node.source.value &&
          node.source.type === 'StringLiteral' &&
          node.source.value.endsWith('.styl')
        ) {
          const jsFile = state.file.opts.filename;
          const stylusFile = node.source.value;
          const css = compileStylusFile(jsFile, stylusFile);

          const id = node.specifiers[0].local.name;
          path.replaceWith(
            t.variableDeclaration('var', [
              t.variableDeclarator(t.identifier(id), t.stringLiteral(css)),
            ])
          );
        }
      },
    },
  };
};
