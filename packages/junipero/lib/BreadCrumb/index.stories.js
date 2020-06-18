import React from 'react';

import BreadCrumb from './index';

export default { title: 'junipero/BreadCrumb' };

export const basic = () => (
  <BreadCrumb items={['One', 'Two', 'Three']} />
);

export const withLinks = () => (
  <BreadCrumb
    items={[
      <a key={0} href="#">One</a>,
      <a key={1} href="#">Two</a>,
      'Three',
    ]}
  />
);
