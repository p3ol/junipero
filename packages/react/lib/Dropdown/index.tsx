import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useReducer,
  useEffect,
  MutableRefObject,
  ComponentPropsWithRef,
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
  UseClickProps,
  UseDismissProps,
  UseHoverProps,
  Placement,
} from '@floating-ui/react';
import PropTypes from 'prop-types';

import { DropdownContext, DropdownContextType } from '../contexts';
import { ForwardedProps, MockState } from '../utils';

export declare type DropdownRef = {
  isJunipero: boolean;
  opened: boolean;
  toggle(): void;
  open(): void;
  close(): void;
  innerRef: MutableRefObject<any>;
};

declare interface DropdownProps extends ComponentPropsWithRef<any> {
  clickOptions?: UseClickProps;
  className?: string;
  container?: string | Element | DocumentFragment;
  disabled?: boolean;
  dismissOptions?: UseDismissProps;
  floatingOptions?: {middleware?: any[]};
  hoverOptions?: UseHoverProps;
  openend?: boolean;
  placement?: Placement;
  trigger?: 'click' | 'hover' | 'manual';
  onToggle?(props: { opened: boolean }): void;
  ref?: MutableRefObject<DropdownRef | undefined>;
}
const Dropdown = forwardRef(({
  className,
  container,
  disabled,
  floatingOptions,
  clickOptions,
  hoverOptions,
  dismissOptions,
  opened = false,
  placement = 'bottom-start',
  trigger = 'click',
  onToggle,
  ...rest
}: DropdownProps, ref) => {
  const innerRef = useRef();

  type DropdownState = {
    opened: boolean,
    visible: boolean
  };

  const [state, dispatch] = useReducer<MockState<DropdownState>>(mockState, {
    opened: opened ?? false,
    visible: opened ?? false,
  });
  const { x, y, refs, strategy, context } = useFloating({
    open: state.opened,
    onOpenChange: (...args) => onOpenChange(...args),
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
      ...clickOptions || {},
    }),
    useHover(context, {
      enabled: trigger === 'hover',
      handleClose: safePolygon(),
      ...hoverOptions || {},
    }),
    useDismiss(context, {
      enabled: trigger === 'click',
      ...dismissOptions || {},
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

  const onOpenChange = (o: boolean, _: Event) => {
    if (disabled && o) {
      return;
    }

    dispatch({ opened: o, visible: true });
    onToggle?.({ opened: o });
  };

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

    dispatch({ opened: true, visible: true });
    onToggle?.({ opened: true });
  };

  const close = () => {
    if (disabled) {
      return;
    }

    dispatch({ opened: false });
    onToggle?.({ opened: false });
  };

  const onAnimationExit = () => {
    dispatch({ visible: false });
  };

  const getContext = useCallback<() => DropdownContextType>(() => ({
    opened: state.opened,
    visible: state.visible,
    container,
    x,
    y,
    refs,
    strategy,
    toggle,
    open,
    close,
    getReferenceProps,
    getFloatingProps,
    onAnimationExit,
  }), [
    state.opened,
    state.visible,
    x,
    y,
    refs,
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
}) as ForwardedProps<DropdownProps, DropdownRef>;

Dropdown.displayName = 'Dropdown';
Dropdown.propTypes = {
  clickOptions: PropTypes.object,
  container: PropTypes.any, //TODO fixme
  disabled: PropTypes.bool,
  dismissOptions: PropTypes.object,
  floatingOptions: PropTypes.object,
  hoverOptions: PropTypes.object,
  opened: PropTypes.bool,
  placement: PropTypes.any, //TODO fixme
  trigger: PropTypes.oneOf(['click', 'hover', 'manual']),
  onToggle: PropTypes.func,
};

export default Dropdown;
