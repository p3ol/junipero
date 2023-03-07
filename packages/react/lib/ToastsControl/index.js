import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import { ToastsContext } from '../contexts';

const ToastsControl = forwardRef(({
  toasts: toastsProp,
  generateId,
  ...rest
}, ref) => {
  const [toasts, setToasts] = useState(toastsProp || []);

  useImperativeHandle(ref, () => ({
    toasts,
    add,
    dismiss,
    isJunipero: true,
  }));

  const add = toast => {
    toast.id = toast.id ||
      generateId ? generateId(toast) : Math.random().toString(36);

    setToasts(t => t.concat(toast));
  };

  const dismiss = toast => {
    setToasts(t => t.filter(i => i !== toast));
  };

  const getContext = useCallback(() => ({
    toasts,
    add,
    dismiss,
  }), [toasts]);

  return (
    <ToastsContext.Provider { ...rest } value={getContext()} />
  );
});

ToastsControl.displayName = 'ToastsControl';
ToastsControl.propTypes = {
  toasts: PropTypes.array,
  generateId: PropTypes.func,
};

export default ToastsControl;
