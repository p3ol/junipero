import { Fragment, forwardRef, useImperativeHandle, useRef } from 'react';
import { classNames } from '@junipero/core';
import PropTypes from 'prop-types';

import { useAlerts } from '../hooks';
import Alert from '../Alert';

const Alerts = forwardRef(({
  className,
  animateAlert,
  icons,
  ...rest
}, ref) => {
  const innerRef = useRef();
  const { alerts, dismiss } = useAlerts();

  useImperativeHandle(ref, () => ({
    innerRef,
    alerts,
    isJunipero: true,
  }));

  const onDismiss = (alert, index) => {
    dismiss?.(alert, index);
    alert?.onDismiss?.(alert, index);
  };

  return (
    <div
      {...rest}
      ref={innerRef}
      className={classNames('junipero', 'alerts', className)}
    >
      { alerts?.map((alert, index) => (
        <Alert
          key={alert.id ?? index}
          animate={animateAlert}
          icon={alert.icon ?? icons?.[alert.type] ?? icons?.default}
          title={alert.title}
          lifespan={alert.duration ?? alert.lifespan}
          onDismiss={onDismiss.bind(null, alert, index)}
          className={alert.type}
        >
          { alert.content }
        </Alert>
      )) }
    </div>
  );
});

Alerts.displayName = 'Alerts';
Alerts.propTypes = {
  animateAlert: PropTypes.func,
  icons: PropTypes.object,
};

export default Alerts;
