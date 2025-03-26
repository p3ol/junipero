import {
  type RefObject,
  type ReactNode,
  type ReactElement,
  type ComponentPropsWithoutRef,
  type LazyExoticComponent,
  type FunctionComponent,
  type Usable,
  cloneElement,
  useImperativeHandle,
  useReducer,
  useRef,
  useEffect,
  use,
} from 'react';
import { createPortal } from 'react-dom';
import {
  classNames,
  ensureNode,
  omit,
  mockState,
} from '@junipero/core';
import {
  type UseDismissProps,
  type UseClickProps,
  type UseHoverProps,
  type UseFloatingOptions,
  type Placement,
  type OpenChangeReason,
  type Boundary,
  offset,
  flip,
  shift,
  autoUpdate,
  useFloating,
  useInteractions,
  useClick,
  useHover,
  useDismiss,
} from '@floating-ui/react';

import type {
  JuniperoInnerRef,
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';
import type { TransitionProps } from '../Transition';

export declare interface TooltipRef extends JuniperoRef {
  opened: boolean;
  open(): void;
  close(): void;
  toggle(): void;
  update(): void;
  handleRef: RefObject<JuniperoRef | JuniperoInnerRef>;
  innerRef: RefObject<HTMLDivElement>;
}

export declare interface TooltipProps
  extends SpecialComponentPropsWithRef<any, TooltipRef> {
  apparition?: string;
  clickOptions?: UseClickProps;
  container?: string | ReactElement | HTMLElement | DocumentFragment;
  disabled?: boolean;
  dismissOptions?: UseDismissProps;
  floatingOptions?: UseFloatingOptions & {
    boundary?: Boundary;
  };
  hoverOptions?: UseHoverProps;
  opened?: boolean;
  text?: ReactNode;
  placement?: Placement;
  trigger?: 'hover' | 'click' | 'manual';
  animate?(
    tooltipInner: ReactNode,
    opts?: { opened?: boolean } & Partial<TransitionProps>
  ): ReactNode;
  onToggle?(props: { opened: boolean }): void;
}

export declare interface TooltipState {
  opened: boolean,
  visible: boolean
}

const Tooltip = ({
  ref,
  apparition,
  children,
  className,
  clickOptions,
  container,
  disabled,
  dismissOptions,
  floatingOptions,
  hoverOptions,
  opened,
  text,
  placement = 'top',
  trigger = 'hover',
  animate,
  onToggle,
  ...rest
}: TooltipProps) => {
  const handleRef = useRef<JuniperoRef | JuniperoInnerRef>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducer(mockState<TooltipState>, {
    opened: opened ?? false,
    visible: opened ?? false,
  });
  const { x, y, refs, strategy, context, update } = useFloating({
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
      ...hoverOptions || {},
    }),
    useDismiss(context, {
      enabled: trigger === 'click',
      ...dismissOptions || {},
    }),
  ]);

  useEffect(() => {
    dispatch({ opened: disabled ? false : !!opened });
  }, [disabled, opened]);

  useImperativeHandle(ref, () => ({
    opened: state.opened,
    innerRef,
    handleRef,
    open,
    close,
    toggle,
    update,
    isJunipero: true,
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

  const setReference = (
    r: JuniperoRef | JuniperoInnerRef
  ) => {
    handleRef.current = (r as JuniperoRef)?.isJunipero
      ? (r as JuniperoRef).innerRef.current : r;
    refs.setReference(
      ((r as JuniperoRef)?.isJunipero
        ? (r as JuniperoRef).innerRef.current : r) as HTMLElement
    );
  };

  const setFloatingRef = (r: HTMLDivElement) => {
    innerRef.current = r;
    refs.setFloating(r);
  };

  const onAnimationExit = () => {
    dispatch({ visible: false });
  };

  const tooltipInner = (
    <div className="tooltip-inner">
      { text }
    </div>
  );

  const tooltip = (
    <div
      { ...rest }
      className={classNames(
        'junipero',
        'tooltip',
        className,
      )}
      data-placement={placement}
      style={{
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
        ...rest.style || {},
      }}
      { ...getFloatingProps() }
      ref={setFloatingRef}
    >
      { animate
        ? animate(tooltipInner, {
          opened: state.opened,
          onExited: onAnimationExit,
        })
        : tooltipInner
      }
    </div>
  );
  
  type ReactElt = ReactElement<
    ComponentPropsWithoutRef<any>
  >

  type ReactLazy = LazyExoticComponent<FunctionComponent> & {
    _payload: Usable<ReactElt>
  };

  const child: ReactElt| ReactLazy = children && typeof children !== 'string'
    ? Array.isArray(children) ? children[0] : children
    : null;

  return (
    <>
      { !children || typeof children === 'string' ? (
        <span
          { ...getReferenceProps() }
          ref={setReference}
        >
          { children }
        </span>
      ) : cloneElement(
        (child as ReactLazy).$$typeof === Symbol.for('react.lazy')
          ? use<ReactElt>((child as ReactLazy)._payload) : child as ReactElt,
        {
          ...getReferenceProps(),
          ref: setReference,
        }
      ) }

      { state.opened || (animate && state.visible) || apparition === 'css'
        ? container
          ? createPortal(tooltip, ensureNode(container))
          : tooltip
        : null
      }
    </>
  );
};

Tooltip.displayName = 'Tooltip';

export default Tooltip;
