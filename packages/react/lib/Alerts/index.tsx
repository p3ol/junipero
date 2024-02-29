import {
  ComponentPropsWithRef,
  MutableRefObject,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames, omit } from '@junipero/core';
import PropTypes from 'prop-types';

import { useAlerts } from '../hooks';
import Alert, { AlertObject } from '../Alert';
import { ForwardedProps } from '../utils';

export declare type AlertsRef = {
  alerts: Array<AlertObject>;
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

declare type AlertsTypes =
  'danger' |
  'default' |
  'primary'|
  'success' |
  'warning';

export declare interface AlertsProps extends ComponentPropsWithRef<any> {
  animationTimeout?: number;
  className?: string;
  icons?: {
    [type in AlertsTypes]?: ReactNode | JSX.Element
  };
  animateAlert?(
    alert: ReactNode | JSX.Element,
    opts: { opened: boolean; index: string | number }
  ): ReactNode | JSX.Element;
  ref?: MutableRefObject<AlertsRef | undefined>;
}

const Alerts = forwardRef(({
  className,
  animateAlert,
  animationTimeout,
  icons,
  ...rest
}: AlertsProps, ref) => {
  const innerRef = useRef();
  const { alerts, dismiss } = useAlerts();

  useImperativeHandle(ref, () => ({
    innerRef,
    alerts,
    isJunipero: true,
  }));

  const onDismiss = (alert: AlertObject, index: number) => {
    dismiss?.(alert);
    alert?.onDismiss?.(index);
  };

  return (
    <div
      {...rest}
      ref={innerRef}
      className={classNames('junipero', 'alerts', className)}
    >
      { alerts?.map((alert, index) => (
        <Alert
          { ...omit(alert, [
            'id', 'type', 'content', 'duration', 'lifespan', 'icon', 'animate',
            'animationTimeout', 'onDismiss',
          ]) }
          key={alert.id ?? index}
          index={alert.id ?? index}
          animate={alert.animate ?? animateAlert}
          animationTimeout={alert.animationTimeout ?? animationTimeout}
          icon={
            alert.icon ?? icons?.[alert.type as AlertsTypes] ?? icons?.default
          }
          lifespan={alert.duration ?? alert.lifespan}
          onDismiss={onDismiss.bind(null, alert)}
          className={alert.type}
        >
          { alert.content }
        </Alert>
      )) }
    </div>
  );
}) as ForwardedProps<AlertsProps, AlertsRef>;

Alerts.displayName = 'Alerts';
Alerts.propTypes = {
  animateAlert: PropTypes.func,
  animationTimeout: PropTypes.number,
  icons: PropTypes.object,
};

export default Alerts;
