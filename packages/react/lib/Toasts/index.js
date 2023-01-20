import { forwardRef, useImperativeHandle, useRef } from 'react';
import { classNames } from '@junipero/core';
import PropTypes from 'prop-types';

import { useToasts } from '../hooks';
import Toast from '../Toast';

const Toasts = forwardRef(({
  className,
  animateToast,
  animationTimeout,
  ...rest
}, ref) => {
  const innerRef = useRef();
  const { toasts, dismiss } = useToasts();

  useImperativeHandle(ref, () => ({
    innerRef,
    toasts,
    isJunipero: true,
  }));

  const onDismiss = (toast, index) => {
    dismiss?.(toast, index);
    toast?.onDismiss?.(toast, index);
  };

  return (
    <div
      {...rest}
      ref={innerRef}
      className={classNames('junipero', 'toasts', className)}
    >
      { toasts?.map((toast, index) => (
        <Toast
          { ...toast }
          key={toast.id ?? index}
          index={toast.id ?? index}
          animate={toast.animate ?? animateToast}
          animationTimeout={toast.animationTimeout ?? animationTimeout}
          lifespan={toast.duration ?? toast.lifespan}
          onDismiss={onDismiss.bind(null, toast, index)}
        >
          { toast.content }
        </Toast>
      )) }
    </div>
  );
});

Toasts.displayName = 'Toasts';
Toasts.propTypes = {
  animateToast: PropTypes.func,
  animationTimeout: PropTypes.number,
};

export default Toasts;
