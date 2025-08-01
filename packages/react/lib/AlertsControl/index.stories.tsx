import { useRef } from 'react';
import { slideInDownMenu } from '@junipero/transitions';

import { useAlerts } from '../hooks';
import Alerts, { type AlertsRef } from '../Alerts';
import AlertsControl from '.';

export default { title: 'react/AlertsControl' };

const icon = <i className="material-icons">info</i>;

const Comp = () => {
  const { add } = useAlerts();
  const ref = useRef<AlertsRef>(null);

  return (
    <>
      <p>
        <button
          onClick={() => add({
            type: 'success',
            duration: 5000,
            title: 'Title',
            content: 'Content',
            icon,
            index: '1',
          })}
        >
          Add alert
        </button>
      </p>
      <Alerts ref={ref} animateAlert={slideInDownMenu} />
    </>
  );
};

export const Basic = () => (
  <AlertsControl>
    <Comp />
  </AlertsControl>
);
