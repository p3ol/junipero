import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@poool/junipero-utils';

const Card = forwardRef(({
  tag: Tag = 'div',
  className,
  ...rest
}, ref) => (
  <Tag
    { ...rest }
    ref={ref}
    className={classNames('junipero card', className)}
  />
));

Card.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.object,
    PropTypes.func,
  ]),
};

export default Card;
