import {
  type ComponentPropsWithoutRef,
  type MutableRefObject,
  type ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames, omit } from '@junipero/core';

import type { JuniperoRef } from '../types';
import type { TransitionProps } from '../Transition';
import { useAlerts } from '../hooks';
import Alert, { type AlertObject } from '../Alert';

export declare interface AlertsRef extends JuniperoRef {
  alerts: Array<AlertObject>;
  innerRef: MutableRefObject<HTMLDivElement>;
}

export declare type AlertsTypes =
  | 'danger'
  | 'default'
  | 'primary'
  | 'success'
  | 'warning';

export declare interface AlertsProps extends ComponentPropsWithoutRef<'div'> {
  animationTimeout?: number;
  icons?: {
    [type in AlertsTypes]?: ReactNode | JSX.Element;
  };
  animateAlert?(
    alert: ReactNode | JSX.Element,
    opts: {
      opened: boolean;
      index: string | number;
    } & Partial<TransitionProps>,
  ): ReactNode | JSX.Element;
}

const Alerts = forwardRef<AlertsRef, AlertsProps>(({
  className,
  animateAlert,
  animationTimeout,
  icons,
  ...rest
}: AlertsProps, ref) => {
  const innerRef = useRef<HTMLDivElement>();
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
});

Alerts.displayName = 'Alerts';

export default Alerts;
