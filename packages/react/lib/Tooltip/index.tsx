import {
  Children,
  forwardRef,
  cloneElement,
  useImperativeHandle,
  useReducer,
  useRef,
  useEffect,
  MutableRefObject,
  ComponentPropsWithRef,
  ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { classNames, mockState, omit } from '@junipero/core';
import {
  useFloating,
  useInteractions,
  useClick,
  useHover,
  useDismiss,
  offset,
  flip,
  shift,
  autoUpdate,
  UseDismissProps,
  UseClickProps,
  UseHoverProps,
  Placement,
  UseFloatingOptions,
} from '@floating-ui/react';
import PropTypes from 'prop-types';

import { ForwardedProps, MockState } from '../utils';

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
  container?: Element | DocumentFragment;
  disabled?: boolean;
  dismissOptions?: UseDismissProps;
  floatingOptions?: UseFloatingOptions;
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
}:TooltipProps, ref) => {
  const handleRef = useRef();
  const innerRef = useRef();

  type TooltipState = {
    opened: boolean,
    visible: boolean
  };

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
        boundary: floatingOptions?.boundary,
      }),
      shift({
        boundary: floatingOptions?.boundary,
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

  const setReference = r => {
    handleRef.current = r?.isJunipero ? r.innerRef.current : r;
    refs.setReference(r?.isJunipero ? r.innerRef.current : r);
  };

  const setFloatingRef = r => {
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
        ...getReferenceProps(), //TODO fixme
        ref: setReference,
      }) }

      { state.opened || (animate && state.visible) || apparition === 'css'
        ? container
          ? createPortal(tooltip, container)
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
  container: PropTypes.any,
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
