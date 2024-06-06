import {
  type MutableRefObject,
  type ComponentPropsWithRef,
  type ReactNode,
  Children,
  forwardRef,
  cloneElement,
  useImperativeHandle,
  useReducer,
  useRef,
  useEffect,
} from 'react';
import { createPortal } from 'react-dom';
import {
  type ForwardedProps,
  type MockState,
  classNames,
  ensureNode,
  mockState,
  omit,
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
import PropTypes from 'prop-types';

export declare type TooltipRef = {
  opened: boolean;
  open(): void;
  close(): void;
  toggle(): void;
  update(): void;
  innerRef: MutableRefObject<any>;
  handleRef: MutableRefObject<any>;
  isJunipero: boolean;
};

export declare interface TooltipProps extends ComponentPropsWithRef<any> {
  apparition?: string;
  children?: ReactNode | JSX.Element;
  className?: string;
  clickOptions?: UseClickProps;
  container?: JSX.Element | HTMLElement | DocumentFragment | string;
  disabled?: boolean;
  dismissOptions?: UseDismissProps;
  floatingOptions?: UseFloatingOptions & {
    boundary?: Boundary;
  };
  hoverOptions?: UseHoverProps;
  opened?: boolean;
  text?: ReactNode | JSX.Element;
  placement?: Placement;
  trigger?: string;
  animate?(
    tooltipInner: ReactNode | JSX.Element,
    opts?: { opened?: boolean, onExited?: () => void }
  ): JSX.Element | ReactNode;
  onToggle?(props: { opened: boolean }): void;
  ref?: MutableRefObject<TooltipRef | undefined>;
}

export declare interface TooltipState {
  opened: boolean,
  visible: boolean
}

const Tooltip = forwardRef(({
  animate,
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
  onToggle,
  ...rest
}: TooltipProps, ref) => {
  const handleRef = useRef();
  const innerRef = useRef();
  const [state, dispatch] = useReducer<MockState<TooltipState>>(mockState, {
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

  const setReference: React.RefCallback<any> = (r: TooltipRef) => {
    handleRef.current = r?.isJunipero ? r.innerRef.current : r;
    refs.setReference(r?.isJunipero ? r.innerRef.current : r);
  };

  const setFloatingRef = (r: any) => {
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

  return (
    <>
      { !children || typeof children === 'string' ? (
        <span
          { ...getReferenceProps() }
          ref={setReference}
        >
          { children }
        </span>
      ) : cloneElement(Children.only<JSX.Element>(children as JSX.Element), {
        ...getReferenceProps(),
        ref: setReference,
      }) }

      { state.opened || (animate && state.visible) || apparition === 'css'
        ? container
          ? createPortal(tooltip, ensureNode(container))
          : tooltip
        : null
      }
    </>
  );
}) as ForwardedProps<TooltipProps, TooltipRef>;

Tooltip.displayName = 'Tooltip';
Tooltip.propTypes = {
  animate: PropTypes.func,
  apparition: PropTypes.string,
  container: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.instanceOf(DocumentFragment),
    PropTypes.any, // TODO: fix this
  ]),
  disabled: PropTypes.bool,
  onToggle: PropTypes.func,
  opened: PropTypes.bool,
  placement: PropTypes.any,
  text: PropTypes.oneOfType([
    PropTypes.node,
  ]),
  trigger: PropTypes.string,
  clickOptions: PropTypes.object,
  dismissOptions: PropTypes.object,
  floatingOptions: PropTypes.object,
  hoverOptions: PropTypes.object,
};

export default Tooltip;
