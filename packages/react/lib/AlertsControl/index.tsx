import {
  ComponentProps,
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ComponentRef,
  ForwardedRef,
  MutableRefObject,
  PropsWithRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import { AlertsContext, AlertsContextType } from '../contexts';
import { AlertObject } from '../Alert';
import { ForwardedProps } from '../utils';

export declare type AlertsControlRef ={
  alerts: Array<AlertObject>;
  isJunipero: boolean;
  add(alert: AlertObject): void;
  dismiss(alert: AlertObject): void;
} | React.RefAttributes<HTMLElement>;

declare interface AlertsControlProps extends ComponentPropsWithRef<any> {
  alerts?: Array<AlertObject>;
  generateId?: (alert: AlertObject) => string | number;
  ref?: MutableRefObject<AlertsControlRef | undefined>;
  children?: React.ReactNode;
}

const AlertsControl = forwardRef(({
  alerts: alertsProp,
  generateId,
  ...rest
}: AlertsControlProps, ref) => {
  const [alerts, setAlerts] = useState(alertsProp || []);

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
}) as ForwardedProps<AlertsControlProps, AlertsControlRef>;

AlertsControl.displayName = 'AlertsControl';
AlertsControl.propTypes = {
  alerts: PropTypes.array,
  generateId: PropTypes.func,
};
export default AlertsControl;
