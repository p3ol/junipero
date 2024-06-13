import {
  type ComponentPropsWithRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';

import type { JuniperoRef } from '../types';
import type { AlertObject } from '../Alert';
import { type AlertsContextType, AlertsContext } from '../contexts';

export declare interface AlertsControlRef extends JuniperoRef {
  alerts: AlertObject[];
  add(alert: AlertObject): void;
  dismiss(alert: AlertObject): void;
}

export declare interface AlertsControlProps extends Omit<
  ComponentPropsWithRef<typeof AlertsContext.Provider>, 'value'
> {
  alerts?: AlertObject[];
  generateId?: (alert: AlertObject) => string | number;
}

const AlertsControl = forwardRef<AlertsControlRef, AlertsControlProps>(({
  alerts: alertsProp,
  generateId,
  ...rest
}, ref) => {
  const [alerts, setAlerts] = useState<AlertObject[]>(alertsProp || []);

  useImperativeHandle(ref, () => ({
    alerts,
    add,
    dismiss,
    isJunipero: true,
  }));

  const add = (alert: AlertObject) => {
    alert.id = alert.id ||
      generateId ? generateId(alert) : Math.random().toString(36);

    setAlerts(a => a.concat(alert));
  };

  const dismiss = (alert: AlertObject) => {
    setAlerts(a => a.filter(a => a !== alert));
  };

  const getContext = useCallback<() => AlertsContextType>(() => ({
    alerts,
    add,
    dismiss,
  }), [alerts]);

  return (
    <AlertsContext.Provider { ...rest } value={getContext()} />
  );
});

AlertsControl.displayName = 'AlertsControl';

export default AlertsControl;
