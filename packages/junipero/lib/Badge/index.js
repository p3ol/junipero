import React from 'react';
import { classNames } from '@poool/junipero-utils';

const Badge = ({ className, ...rest }) => (
  <span {...rest} className={classNames('junipero', 'badge', className)}/>
);

export default Badge;
