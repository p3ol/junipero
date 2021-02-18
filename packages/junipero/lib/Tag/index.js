import React from 'react';
import { classNames } from '@poool/junipero-utils';

const Tag = ({ className, ...rest }) => (
  <span {...rest} className={classNames('junipero', 'tag', className)}/>
);

export default Tag;
