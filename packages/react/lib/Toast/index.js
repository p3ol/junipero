import { forwardRef, useState, useImperativeHandle, useRef } from 'react';
import { classNames } from '@junipero/core';
import { useTimeout } from '@junipero/hooks';
import PropTypes from 'prop-types';

const Toast = forwardRef(({
  index,
  tag: Tag = 'div',
  animationTimeout = 100,
  pausable = true,
  lifespan = 0,
  animate,
  children,
  className,
  onDismiss,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...rest
}, ref) => {
  const innerRef = useRef();
  const startTimeRef = useRef(Date.now() + animationTimeout);
  const [remaining, setRemaining] = useState(lifespan);
  const [enabled, setEnabled] = useState(true);
  const [paused, setPaused] = useState(false);

  useImperativeHandle(ref, () => ({
    enabled,
    paused,
    remaining,
    innerRef,
    isJunipero: true,
  }));

  useTimeout(() => {
    setEnabled(false);
  }, remaining, [remaining, paused], { enabled: lifespan > 0 && !paused });

  useTimeout(() => {
    onDismiss?.(index);
  }, animationTimeout, [enabled], { enabled: !enabled && !paused });

  const onClick_ = e => {
    onClick?.(e);
    setEnabled(false);
  };

  const onMouseEnter_ = e => {
    onMouseEnter?.(e);

    if (!pausable) {
      return;
    }

    setPaused(true);
    setRemaining(remaining - (Date.now() - startTimeRef.current));
  };

  const onMouseLeave_ = e => {
    onMouseLeave?.(e);

    if (!pausable) {
      return;
    }

    startTimeRef.current = Date.now();
    setPaused(false);
  };

  const content = (
    <Tag
      index={index}
      ref={innerRef}
      className={classNames('junipero toast', className)}
      onClick={onClick_}
      onMouseEnter={onMouseEnter_}
      onMouseLeave={onMouseLeave_}
      { ...rest }
    >
      { children }
      { lifespan > 0 && (
        <div
          className="countdown"
          style={{
            animationDuration: `${lifespan}ms`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        />
      ) }
    </Tag>
  );

  return animate ? animate(content, { opened: enabled, index }) : content;
});

Toast.displayName = 'Toast';
Toast.propTypes = {
  index: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  lifespan: PropTypes.number,
  animate: PropTypes.func,
  animationTimeout: PropTypes.number,
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.node,
  ]),
  pausable: PropTypes.bool,
  onDismiss: PropTypes.func,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

export default Toast;
