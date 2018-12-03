import React from 'react';
import ReactDOM from 'react-dom';

import { injectStyles } from '../src/utils';

import App from './components/App';

import styles from './theme/index.styl';
injectStyles(styles);

ReactDOM.render(<App />, document.getElementById('app'));
