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
import AccessibilityStore from '../AccessibilityStore';

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
  withAccessibility?: boolean;
  onToggle?(props: { opened: boolean }): void;
}

export declare interface DropdownState {
  opened: boolean;
  visible: boolean;
  highlightedOptionId: string | null;
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
  withAccessibility = true,
  onToggle,
  ...rest
}: DropdownProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducer(mockState<DropdownState>, {
    opened: opened ?? false,
    visible: opened ?? false,
    highlightedOptionId: null,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const open = useCallback(() => {
    if (disabled) {
      return;
    }

    dispatch({ opened: true, visible: true });
    onToggle?.({ opened: true });
  }, [disabled, onToggle]);

  const close = useCallback(() => {
    if (disabled) {
      return;
    }

    dispatch({ opened: false });
    onToggle?.({ opened: false });
  }, [disabled, onToggle]);

  const toggle = useCallback(() => {
    if (disabled) {
      return;
    }

    if (state.opened) {
      close();
    } else {
      open();
    }
  }, [disabled, state.opened, open, close]);

  const onAnimationExit = useCallback(() => {
    dispatch({ visible: false });
  }, []);

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
    state.opened, state.visible,
    x, y, refs, strategy,
    toggle, open, close,
    getReferenceProps, getFloatingProps, onAnimationExit, container,
  ]);

  const dropdown = (
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

  return withAccessibility ? (
    <AccessibilityStore>{ dropdown }</AccessibilityStore>
  ) : dropdown;
};

Dropdown.displayName = 'Dropdown';

export default Dropdown;
