import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useReducer,
} from 'react';
import { mockState } from '@junipero/core';
import PropTypes from 'prop-types';

import { AlertsContext } from '../contexts';

const AlertsControl = forwardRef(({ alerts, ...rest }, ref) => {
  const [state, dispatch] = useReducer(mockState, {
    alerts: alerts ?? [],
  });

  useImperativeHandle(ref, () => ({
    alerts: state.alerts,
    add,
    dismiss,
    isJunipero: true,
  }));

  const add = alert => {
    state.alerts.push(alert);
    dispatch({ alerts: state.alerts });
  };

  const dismiss = index => {
    state.alerts.splice(index, 1);
    dispatch({ alerts: state.alerts });
  };

  const getContext = useCallback(() => ({
    alerts: state.alerts,
    add,
    dismiss,
  }), [state.alerts]);

  return (
    <AlertsContext.Provider { ...rest } value={getContext()} />
  );
});

AlertsControl.displayName = 'AlertsControl';
AlertsControl.propTypes = {
  alerts: PropTypes.array,
};

export default AlertsControl;
