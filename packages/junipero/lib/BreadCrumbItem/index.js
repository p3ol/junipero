import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@poool/junipero-utils';

const BreadCrumbItem = forwardRef(({
  animate,
  className,
  tag: Tag = 'span',
  ...rest
}, ref) => {
  const rendered = (
    <Tag
      { ...rest }
      className={classNames(
        'junipero breadcrumb-item',
        className
      )}
      ref={ref}
    />
  );

  return animate ? animate(rendered) : rendered;
});

BreadCrumbItem.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.object,
    PropTypes.func,
  ]),
  animate: PropTypes.func,
};

export default BreadCrumbItem;
