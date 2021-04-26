import React from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@poool/junipero-utils';

const Alert = ({
  className,
  icon,
  title,
  tag: Tag = 'a',
  children,
  onClose,
  ...rest
}) => {
  const onClose_ = e => {
    e.preventDefault();
    onClose?.();
  };

  return (
    <Tag
      { ...rest }
      className={classNames('junipero', 'alert', className)}
    >
      <div className="border">
        { icon && (
          <span className="icon">{ icon }</span>
        ) }
      </div>
      <div className="content">
        <h5 className="junipero title">{ title }</h5>
        <div className="junipero text secondary">{ children }</div>
      </div>
      <span role="button" className="close" onClick={onClose_}>×</span>
    </Tag>
  );
};

Alert.propTypes = {
  icon: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
  ]),
  tag: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
  ]),
  title: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
  ]),
  onClose: PropTypes.func,
};

export default Alert;
