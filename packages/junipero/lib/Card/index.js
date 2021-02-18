import React from 'react';
import { classNames } from '@poool/junipero-utils';

const Card = ({ className, ...rest }) => (
  <div { ...rest } className={classNames('junipero', 'card', className)}/>
);

export default Card;
