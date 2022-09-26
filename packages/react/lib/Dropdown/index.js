import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useReducer,
} from 'react';
import { classNames, mockState } from '@junipero/core';
import {
  offset,
  autoUpdate,
  flip,
  shift,
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
    }),
    useDismiss(context, {
      enabled: trigger === 'click',
    }),
  ]);

  useImperativeHandle(ref, () => ({
    opened: state.opened,
    toggle,
    open,
    close,
    isJunipero: true,
    innerRef,
  }));

  const toggle = () => {
    if (state.opened) {
      close();
    } else {
      open();
    }
  };

  const open = () => {
    dispatch({ opened: true });
    onToggle?.({ opened: true });
  };

  const close = () => {
    dispatch({ opened: false });
    onToggle?.({ opened: false });
  };

  const getContext = useCallback(() => ({
    opened: state.opened,
    trigger,
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
          { opened: state.opened },
          className
        )}
        ref={innerRef}
      />
    </DropdownContext.Provider>
  );
});

Dropdown.displayName = 'Dropdown';
Dropdown.propTypes = {
  opened: PropTypes.bool,
  placement: PropTypes.string,
  trigger: PropTypes.oneOf(['click', 'hover', 'manual']),
  floatingOptions: PropTypes.object,
  onToggle: PropTypes.func,
};

export default Dropdown;
