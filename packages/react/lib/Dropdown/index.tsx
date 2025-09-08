import {
  type RefObject,
  type ReactElement,
  useCallback,
  useImperativeHandle,
  useRef,
  useReducer,
  useEffect,
  useId,
  useMemo,
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
  activeItem?: string;
  toggle(): void;
  open(): void;
  close(): void;
  setActiveItem(id?: string): void;
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
  onActiveItemChange?(id?: string): void;
}

export declare interface DropdownState {
  opened: boolean;
  visible: boolean;
  activeItem?: string;
  menuId?: string;
}

const Dropdown = ({
  ref,
  id: idProp,
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
  onActiveItemChange,
  ...rest
}: DropdownProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducer(mockState<DropdownState>, {
    opened: opened ?? false,
    visible: opened ?? false,
    activeItem: undefined,
    menuId: undefined,
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
  const fallbackId = useId();
  const id = useMemo(() => (
    idProp ?? `junipero-dropdown-${fallbackId}`
  ), [idProp, fallbackId]);
  const fallbackMenuId = useMemo(() => (
    `${id}-menu`
  ), [id]);

  useEffect(() => {
    if (disabled && state.opened) {
      close();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  useImperativeHandle(ref, () => ({
    opened: state.opened,
    activeItem: state.activeItem,
    toggle,
    open,
    close,
    setActiveItem,
    isJunipero: true,
    innerRef,
  }));

  const onOpenChange = (o: boolean, _: Event, __: OpenChangeReason) => {
    if (disabled && o) {
      return;
    }

    dispatch(s => ({
      ...s,
      opened: o,
      activeItem: o ? s.activeItem : undefined,
      visible: true,
    }));

    if (!o) {
      onActiveItemChange?.(undefined);
    }

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

    dispatch({ opened: false, activeItem: undefined });
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

  const setActiveItem = useCallback((id?: string) => {
    dispatch({ activeItem: id });
    onActiveItemChange?.(id);
  }, [onActiveItemChange]);

  const registerMenu = useCallback((id: string) => {
    dispatch({ menuId: id });
  }, []);

  const getContext = useCallback<() => DropdownContextType>(() => ({
    opened: state.opened,
    visible: state.visible,
    activeItem: state.activeItem,
    menuId: state.menuId,
    container,
    x,
    y,
    refs,
    strategy,
    fallbackMenuId,
    toggle,
    open,
    close,
    getReferenceProps,
    getFloatingProps,
    setActiveItem,
    registerMenu,
    onAnimationExit,
  }), [
    state.opened, state.visible, state.activeItem, state.menuId,
    x, y, refs, strategy, fallbackMenuId,
    toggle, open, close, setActiveItem, registerMenu,
    getReferenceProps, getFloatingProps, onAnimationExit,
    container,
  ]);

  return (
    <DropdownContext.Provider value={getContext()}>
      <div
        { ...rest }
        id={id}
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
