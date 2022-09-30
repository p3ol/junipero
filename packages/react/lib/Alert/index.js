import { forwardRef, useImperativeHandle, useRef } from 'react';
import { classNames } from '@junipero/core';
import { useTimeout } from '@junipero/hooks';
import PropTypes from 'prop-types';

import { useAlerts } from '../hooks';
import { Remove } from '../icons';
import Card from '../Card';

const Alert = forwardRef(({
  className,
  index,
  icon,
  title,
  lifespan,
  tag: Tag = 'div',
  children,
  onDismiss,
  ...rest
}, ref) => {
  const innerRef = useRef();
  const { dismiss } = useAlerts();

  useTimeout(() => {
    dismiss?.(index);
  }, lifespan || 5000, [], { enabled: !!lifespan });

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  const onClose_ = e => {
    e.preventDefault();
    dismiss?.(index);
    onDismiss?.();
  };

  return (
    <Tag
      { ...rest }
      ref={ref}
      className={classNames('junipero', 'alert', className)}
      onClick={onClose_}
    >
      <Card>
        { icon && (
          <div className="type-icon">{ icon }</div>
        ) }
        <div className="content">
          <h6 className="junipero">{ title }</h6>
          <div className="junipero secondary">{ children }</div>
        </div>
        <Remove className="close" />
      </Card>
    </Tag>
  );
});

Alert.displayName = 'Alert';
Alert.propTypes = {
  index: PropTypes.any,
  icon: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
  ]),
  lifespan: PropTypes.number,
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
  onDismiss: PropTypes.func,
};

export default Alert;
