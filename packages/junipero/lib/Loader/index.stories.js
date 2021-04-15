import React from 'react';

import Loader from './index';

export default { title: 'junipero/Loader' };

export const dots = () => (
  <>
    <p><Loader /></p>
    <p><Loader className="primary" /></p>
  </>
);

export const bar = () => (
  <>
    <Loader type="bar" active={true} />
    <p><br /></p>
    <Loader className="primary mt-4" type="bar" active={true} />
  </>
);

export const spinner = () => (
  <>
    <p><Loader type="spinner" /></p>
    <p><Loader className="primary" type="spinner" /></p>
  </>
);
