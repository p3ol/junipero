import {
  type RefObject,
  type ReactElement,
  useCallback,
  useImperativeHandle,
  useRef,
  useReducer,
  useEffect,
} from 'react';
import { classNames, omit, mockState } from '@junipero/core';
import {
  type UseClickProps,
  type UseDismissProps,
  type UseHoverProps,
  type Placement,
  type OpenChangeReason,
  type UseFloatingOptions,
  type Boundary,
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
} from '@floating-ui/react';

import type { JuniperoRef, SpecialComponentPropsWithRef } from '../types';
import { DropdownContext, type DropdownContextType } from '../contexts';

export declare interface DropdownRef extends JuniperoRef {
  opened: boolean;
  toggle(): void;
  open(): void;
  close(): void;
  innerRef: RefObject<HTMLDivElement>;
}

export declare interface DropdownProps extends Omit<
  SpecialComponentPropsWithRef<'div', DropdownRef>,
  'onToggle'
>{
  clickOptions?: UseClickProps;
  container?: string | ReactElement | DocumentFragment | HTMLElement;
  disabled?: boolean;
  dismissOptions?: UseDismissProps;
  floatingOptions?: UseFloatingOptions & {
    boundary?: Boundary;
  };
  hoverOptions?: UseHoverProps;
  opened?: boolean;
  placement?: Placement;
  trigger?: 'click' | 'hover' | 'manual';
  onToggle?(props: { opened: boolean }): void;
}

export declare interface DropdownState {
  opened: boolean;
  visible: boolean;
}

const Dropdown = ({
  ref,
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
}: DropdownProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducer(mockState<DropdownState>, {
    opened: opened ?? false,
    visible: opened ?? false,
  });
  const { x, y, refs, strategy, context } = useFloating({
    open: state.opened,
    onOpenChange: (...args) => onOpenChange(...args),
    placement,
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    ...omit(floatingOptions || {}, ['boundary', 'middleware']),
    middleware: floatingOptions?.middleware || [
      offset(10),
      flip({
        boundary: floatingOptions?.boundary ||
          floatingOptions?.elements?.reference,
      }),
      shift({
        boundary: floatingOptions?.boundary ||
          floatingOptions?.elements?.reference,
      }),
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

  const onOpenChange = (o: boolean, _: Event, __: OpenChangeReason) => {
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
};

Dropdown.displayName = 'Dropdown';

export default Dropdown;
