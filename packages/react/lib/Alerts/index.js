import { forwardRef, useImperativeHandle, useRef } from 'react';
import { classNames } from '@junipero/core';
import PropTypes from 'prop-types';

import { useAlerts } from '../hooks';
import Alert from '../Alert';

const Alerts = forwardRef(({ className, animate, ...rest }, ref) => {
  const innerRef = useRef();
  const { alerts } = useAlerts();

  useImperativeHandle(ref, () => ({
    innerRef,
    alerts,
    isJunipero: true,
  }));

  const anim = animate || (a => a);

  return (
    <div
      {...rest}
      ref={innerRef}
      className={classNames('junipero', 'alerts', className)}
    >
      { alerts?.map((alert, index) => anim((
        <Alert
          key={index}
          index={index}
          icon={alert.icon}
          title={alert.title}
          lifespan={alert.duration ?? alert.lifespan}
          onDismiss={alert.onDismiss}
          className={alert.type}
        >
          { alert.content }
        </Alert>
      ), index)) }
    </div>
  );
});

Alerts.displayName = 'Alerts';
Alerts.propTypes = {
  animate: PropTypes.func,
};

export default Alerts;
