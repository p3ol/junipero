import Alert from './index';

export default { title: 'react/Alert' };

const icon = <i className="material-icons">info</i>;

export const basic = () =>
  ['', 'primary', 'success', 'warning', 'danger'].map(t => (
    <Alert key={t} icon={icon} title="Title" { ...t && { className: t }}>
      This is an alert
    </Alert>
  ));
