import {
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';

import type { JuniperoRef, SpecialComponentPropsWithRef } from '../types';
import type { AlertObject } from '../Alert';
import { type AlertsContextType, AlertsContext } from '../contexts';

export declare interface AlertsControlRef extends JuniperoRef {
  alerts: AlertObject[];
  add(alert: AlertObject): void;
  dismiss(alert: AlertObject): void;
}

export declare interface AlertsControlProps extends Omit<
  SpecialComponentPropsWithRef<
    typeof AlertsContext.Provider,
    AlertsControlRef
  >,
  'value'
> {
  alerts?: AlertObject[];
  generateId?: (alert: AlertObject) => string | number;
}

const AlertsControl = ({
  ref,
  alerts: alertsProp,
  generateId,
  ...rest
}: AlertsControlProps) => {
  const [alerts, setAlerts] = useState<AlertObject[]>(alertsProp || []);

  useImperativeHandle(ref, () => ({
    alerts,
    add,
    dismiss,
    isJunipero: true,
  }));

  const add = useCallback((alert: AlertObject) => {
    alert.id = alert.id ||
      generateId ? generateId(alert) : Math.random().toString(36);

    setAlerts(a => a.concat(alert));
  }, [generateId]);

  const dismiss = useCallback((alert: AlertObject) => {
    setAlerts(a => a.filter(a => a !== alert));
  }, []);

  const getContext = useCallback<() => AlertsContextType>(() => ({
    alerts,
    add,
    dismiss,
  }), [alerts, add, dismiss]);

  return (
    <AlertsContext.Provider { ...rest } value={getContext()} />
  );
};

AlertsControl.displayName = 'AlertsControl';

export default AlertsControl;
