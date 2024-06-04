import { useRef } from 'react';

import { AlertsRef } from '../Alerts';
import Alert from './index';

export default { title: 'react/Alert' };

const icon = <i className="material-icons">info</i>;

export const basic = () =>
  ['', 'primary', 'success', 'warning', 'danger'].map(t => {

    const test = useRef<AlertsRef>(null);

    return (
      <Alert key={t} title="Title" { ...t && { className: t }}>
      coucou
      </Alert>
    );
  }
  );
