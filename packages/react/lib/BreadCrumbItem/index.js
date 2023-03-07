import { forwardRef, useImperativeHandle, useRef } from 'react';
import { classNames } from '@junipero/core';
import PropTypes from 'prop-types';

const BreadCrumbItem = forwardRef(({
  animate,
  className,
  tag: Tag = 'span',
  ...rest
}, ref) => {
  const innerRef = useRef();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  const rendered = (
    <Tag
      { ...rest }
      className={classNames(
        'item',
        className
      )}
      ref={innerRef}
    />
  );

  return animate ? animate(rendered) : rendered;
});

BreadCrumbItem.displayName = 'BreadCrumbItem';
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
