import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useReducer,
  useEffect,
} from 'react';
import { classNames, mockState } from '@junipero/core';
import {
  offset,
  autoUpdate,
  flip,
  shift,
  safePolygon,
  useFloating,
  useInteractions,
  useDismiss,
  useClick,
  useHover,
} from '@floating-ui/react-dom-interactions';
import PropTypes from 'prop-types';

import { DropdownContext } from '../contexts';

const Dropdown = forwardRef(({
  className,
  container,
  disabled,
  floatingOptions,
  opened = false,
  placement = 'bottom-start',
  trigger = 'click',
  onToggle,
  ...rest
}, ref) => {
  const innerRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    opened,
  });
  const { x, y, reference, floating, strategy, context } = useFloating({
    open: state.opened,
    onOpenChange: o => {
      dispatch({ opened: o });
      onToggle?.({ opened: o });
    },
    placement,
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    ...floatingOptions || {},
    middleware: floatingOptions?.middleware || [
      offset(10),
      flip(),
      shift(),
    ],
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context, {
      enabled: trigger === 'click',
    }),
    useHover(context, {
      enabled: trigger === 'hover',
      handleClose: safePolygon(),
    }),
    useDismiss(context, {
      enabled: trigger === 'click',
    }),
  ]);

  useEffect(() => {
    if (disabled && state.opened) {
      close();
    }
  }, [disabled]);

  useImperativeHandle(ref, () => ({
    opened: state.opened,
    toggle,
    open,
    close,
    isJunipero: true,
    innerRef,
  }));

  const toggle = () => {
    if (disabled) {
      return;
    }

    if (state.opened) {
      close();
    } else {
      open();
    }
  };

  const open = () => {
    if (disabled) {
      return;
    }

    dispatch({ opened: true });
    onToggle?.({ opened: true });
  };

  const close = () => {
    if (disabled) {
      return;
    }

    dispatch({ opened: false });
    onToggle?.({ opened: false });
  };

  const getContext = useCallback(() => ({
    opened: state.opened,
    container,
    x,
    y,
    reference,
    floating,
    strategy,
    toggle,
    open,
    close,
    getReferenceProps,
    getFloatingProps,
  }), [
    state.opened,
    x,
    y,
    reference,
    floating,
    strategy,
  ]);

  return (
    <DropdownContext.Provider value={getContext()}>
      <div
        { ...rest }
        className={classNames(
          'junipero dropdown',
          {
            opened: state.opened,
            disabled,
          },
          className
        )}
        ref={innerRef}
      />
    </DropdownContext.Provider>
  );
});

Dropdown.displayName = 'Dropdown';
Dropdown.propTypes = {
  container: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
    PropTypes.node,
  ]),
  disabled: PropTypes.bool,
  opened: PropTypes.bool,
  placement: PropTypes.string,
  trigger: PropTypes.oneOf(['click', 'hover', 'manual']),
  floatingOptions: PropTypes.object,
  onToggle: PropTypes.func,
};

export default Dropdown;
