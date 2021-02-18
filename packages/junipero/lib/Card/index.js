import React from 'react';
import { classNames } from '@poool/junipero-utils';

export default ({ className, ...rest }) => (
  <div { ...rest } className={classNames('junipero', 'card', className)} />
);
