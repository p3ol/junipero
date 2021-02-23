import React from 'react';
import PropTypes from 'prop-types';

import { classNames } from '@poool/junipero-utils';

const Alert = ({
  className,
  onClick,
  onClose = () => {},
  icon = '',
  title,
  theme = 'success',
  text,
}) => {

  const _onClose = () => {
    onClose();
  };

  return (
    <div className={classNames('junipero', 'alert', theme, className)}>
      <div className="alert-header">
        <span className={classNames('icon', className)}>{icon}</span>
      </div>
      <div className="alert-body">
        <span className={classNames('alert-title', theme)}>{title}</span>
        <span className="alert-text">{text}</span>
        <span className="alert-esc" onClick={_onClose}>×</span>
      </div>
    </div>
  );
};

export default Alert;

Alert.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  theme: PropTypes.string,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
};
