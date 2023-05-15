import { forwardRef, useImperativeHandle, useRef } from 'react';
import { classNames } from '@junipero/core';
import PropTypes from 'prop-types';

const Card = forwardRef(({ className, tag: Tag = 'div', ...rest }, ref) => {
  const innerRef = useRef();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  return (
    <Tag
      { ...rest }
      className={classNames('junipero', 'card', className)}
      ref={innerRef}
    />
  );
});

Card.displayName = 'Card';
Card.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.object,
    PropTypes.func,
  ]),
};

export default Card;
