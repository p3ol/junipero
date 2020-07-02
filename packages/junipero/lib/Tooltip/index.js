import React, {
  forwardRef,
  useEffect,
  useState,
  useReducer,
  useImperativeHandle,
} from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { usePopper } from 'react-popper';

import { ensureNode, classNames, mockState } from '@poool/junipero-utils';
import { useEventListener } from '@poool/junipero-hooks';

const Tooltip = forwardRef(({
  animate,
  className,
  clickOutsideTarget,
  children,
  container,
  text,
  apparition = 'insert',
  disabled = false,
  globalEventsTarget = global,
  opened = false,
  placement = 'top',
  popperOptions = {},
  trigger = 'hover',
  onToggle = () => {},
  ...rest
}, ref) => {
  const [innerRef, setInnerRef] = useState();
  const [tooltipRef, setTooltipRef] = useState();
  const [arrowRef, setArrowRef] = useState();
  const [state, dispatch] = useReducer(mockState, {
    opened: false,
  });
  const { styles, attributes, update, forceUpdate } = usePopper(
    innerRef,
    tooltipRef,
    {
      ...popperOptions,
      placement,
      modifiers: [
        ...(popperOptions.modifiers || []),
        { name: 'arrow', options: { element: arrowRef } },
        {
          name: 'offset',
          options: {
            offset: [arrowRef && /-(start|end)/.test(placement) ? -5 : 0, 16],
          },
        },
      ],
    }
  );

  useEffect(() => {
    dispatch({ opened: disabled ? false : opened });
  }, [opened, disabled]);

  useEventListener('click', e => {
    onClickOutside_(e);
  }, globalEventsTarget);

  useImperativeHandle(ref, () => ({
    innerRef: { current: innerRef },
    tooltipRef: { current: tooltipRef },
    arrowRef: { current: arrowRef },
    opened: state.opened,
    update,
    forceUpdate,
    toggle,
    open,
    close,
  }));

  const onClickOutside_ = e => {
    if (!tooltipRef) {
      return;
    }

    if (
      !tooltipRef.contains(e.target) &&
      tooltipRef !== e.target &&
      (
        !clickOutsideTarget ||
        (
          !clickOutsideTarget.contains(e.target) &&
          clickOutsideTarget !== e.target
        )
      )
    ) {
      close();
    }
  };

  const toggle = opened => {
    if (disabled) {
      return;
    }

    state.opened = opened ?? !state.opened;
    dispatch({ opened: state.opened });
    onToggle({ opened: state.opened });
  };

  const open = () => toggle(true);

  const close = () => toggle(false);

  const getHandlers = () => {
    const handlers = {};

    switch (trigger) {
      case 'click':
        handlers.onClick = toggle.bind(null, null);
        break;
      default:
        handlers.onMouseEnter = open;
        handlers.onMouseLeave = close;
    }

    return handlers;
  };

  const tooltip = (
    <div
      className={classNames(
        'junipero',
        'tooltip',
        className,
      )}
      data-placement={placement}
      style={styles?.popper || {}}
      { ...attributes?.popper || {} }
      ref={setTooltipRef}
    >
      { text }
      <div ref={setArrowRef} style={styles?.arrow} className="arrow" />
    </div>
  );

  return (
    <>
      { !children || typeof children === 'string' ? (
        <span
          { ...rest }
          ref={setInnerRef}
          { ...getHandlers() }
          children={children}
        />
      ) : React.cloneElement(
        React.Children.only(children),
        { ...rest, ref: setInnerRef, ...getHandlers() }
      ) }

      { state.opened || animate || apparition === 'css'
        ? container
          ? createPortal(
            animate ? animate(tooltip, { opened: state.opened }) : tooltip,
            ensureNode(container)
          )
          : animate ? animate(tooltip, { opened: state.opened }) : tooltip
        : null
      }
    </>
  );
});

Tooltip.propTypes = {
  animate: PropTypes.func,
  apparition: PropTypes.string,
  clickOutsideTarget: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
  ]),
  container: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
  ]),
  disabled: PropTypes.bool,
  globalEventsTarget: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
  ]),
  onToggle: PropTypes.func,
  opened: PropTypes.bool,
  placement: PropTypes.string,
  popperOptions: PropTypes.object,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
  ]),
  trigger: PropTypes.string,
};

export default Tooltip;
