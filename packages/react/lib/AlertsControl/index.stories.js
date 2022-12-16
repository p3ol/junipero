import { slideInDownMenu } from '@junipero/transitions';

import { useAlerts } from '../hooks';
import Alerts from '../Alerts';
import AlertsControl from '.';

export default { title: 'react/AlertsControl' };

const icon = <i className="material-icons">info</i>;

const Comp = () => {
  const { add } = useAlerts();

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
          })}
        >
          Add alert
        </button>
      </p>
      <Alerts
        animate={(alert, index) =>
          slideInDownMenu(alert, { in: true, key: index })
        }
      />
    </>
  );
};

export const basic = () => (
  <AlertsControl>
    <Comp />
  </AlertsControl>
);
