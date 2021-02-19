import React from 'react';
import PropTypes from 'prop-types';

import { classNames } from '@poool/junipero-utils';

const Alert = ({
  className,
  onClick,
  onClose,
  title,
  text,
}) => {

  const _onClose = () => {
    onClose();
  };

  return (
    <div className={classNames('junipero', 'alert', className)}>
      <div className="alert-header">
      </div>
      <div className="alert-body">
        <span className="alert-title">{title}</span>
        <span className="alert-text">{text}</span>
        <span className="alert-esc" onClick={_onClose}>×</span>
      </div>
    </div>
  );
};

export default Alert;

Alert.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
};
