import { forwardRef, useImperativeHandle, useRef } from 'react';
import { classNames } from '@junipero/core';

const Card = forwardRef(({ className, ...rest }, ref) => {
  const innerRef = useRef();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  return (
    <div
      { ...rest }
      className={classNames('junipero', 'card', className)}
      ref={innerRef}
    />
  );
});

Card.displayName = 'Card';
Card.propTypes = {};

export default Card;
