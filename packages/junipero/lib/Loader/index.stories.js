import React from 'react';

import Loader from './index';

export default { title: 'junipero/Loader' };

export const dots = () => (
  <Loader />
);

export const bar = () => (
  <Loader type="bar" active={true} />
);

export const spinner = () => (
  <Loader type="spinner" />
);
