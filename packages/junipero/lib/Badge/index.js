import React from 'react';
import { classNames } from '@poool/junipero-utils';

export default ({ className, ...rest }) => (
  <span
    { ...rest }
    className={classNames('junipero', 'badge', className)}
  />
);
