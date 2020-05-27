import React from 'react';

import BreadCrumb from './index';

export default { title: 'BreadCrumb' };

export const withItems = () => (
  <BreadCrumb items={['One', 'Two', 'Three']} />
);
