import {
  type RefObject,
  type ReactNode,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames, omit } from '@junipero/core';

import type { JuniperoRef, SpecialComponentPropsWithRef } from '../types';
import type { TransitionProps } from '../Transition';
import { useAlerts } from '../hooks';
import Alert, { type AlertObject } from '../Alert';

export declare interface AlertsRef extends JuniperoRef {
  alerts: Array<AlertObject>;
  innerRef: RefObject<HTMLDivElement>;
}

export declare type AlertsTypes =
  | 'danger'
  | 'default'
  | 'primary'
  | 'success'
  | 'warning';

export declare interface AlertsProps
  extends SpecialComponentPropsWithRef<'div', AlertsRef> {
  animationTimeout?: number;
  icons?: {
    [type in AlertsTypes]?: ReactNode;
  };
  animateAlert?(
    alert: ReactNode,
    opts: {
      opened: boolean;
      index: string | number;
    } & Partial<TransitionProps>,
  ): ReactNode;
}

const Alerts = ({
  ref,
  className,
  animateAlert,
  animationTimeout,
  icons,
  ...rest
}: AlertsProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
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
};

Alerts.displayName = 'Alerts';

export default Alerts;
