import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import { AlertsContext } from '../contexts';

const AlertsControl = forwardRef(({
  alerts: alertsProp,
  generateId,
  ...rest
}, ref) => {
  const [alerts, setAlerts] = useState(alertsProp || []);

  useImperativeHandle(ref, () => ({
    alerts,
    add,
    dismiss,
    isJunipero: true,
  }));

  const add = alert => {
    alert.id = alert.id ||
      generateId ? generateId(alert) : Math.random().toString(36);

    setAlerts(a => [].concat(a).concat(alert));
  };

  const dismiss = alert => {
    setAlerts(a => a.filter(a => a !== alert));
  };

  const getContext = useCallback(() => ({
    alerts,
    add,
    dismiss,
  }), [alerts]);

  return (
    <AlertsContext.Provider { ...rest } value={getContext()} />
  );
});

AlertsControl.displayName = 'AlertsControl';
AlertsControl.propTypes = {
  alerts: PropTypes.array,
  generateId: PropTypes.func,
};

export default AlertsControl;
