import {
  Children,
  forwardRef,
  cloneElement,
  useImperativeHandle,
  useReducer,
  useRef,
  useEffect,
} from 'react';
import { createPortal } from 'react-dom';
import { ensureNode, classNames, mockState } from '@junipero/core';
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
} from '@floating-ui/react-dom-interactions';
import PropTypes from 'prop-types';

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
}, ref) => {
  const handleRef = useRef();
  const innerRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    opened: opened ?? false,
  });

  const { x, y, reference, floating, strategy, context } = useFloating({
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
    isJunipero: true,
  }));

  const onOpenChange = o => {
    if (disabled && o) {
      return;
    }

    dispatch({ opened: o });
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

  const setReference = r => {
    handleRef.current = r?.isJunipero ? r.innerRef.current : r;
    reference(r?.isJunipero ? r.innerRef.current : r);
  };

  const setFloatingRef = r => {
    innerRef.current = r;
    floating(r);
  };

  const tooltipInner = (
    <div className="tooltip-inner">
      { text }
    </div>
  );

  const tooltip = (
    <div
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
        ? animate(tooltipInner, { opened: state.opened })
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
      ) : cloneElement(Children.only(children), {
        ...getReferenceProps(),
        ref: setReference,
      })}

      {
        state.opened || animate || apparition === 'css'
          ? container
            ? createPortal(tooltip, ensureNode(container))
            : tooltip
          : null
      }
    </>
  );
});

Tooltip.displayName = 'Tooltip';
Tooltip.propTypes = {
  animate: PropTypes.func,
  apparition: PropTypes.string,
  container: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
    PropTypes.func,
    PropTypes.string,
  ]),
  disabled: PropTypes.bool,
  onToggle: PropTypes.func,
  opened: PropTypes.bool,
  placement: PropTypes.string,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
  ]),
  trigger: PropTypes.string,
  clickOptions: PropTypes.object,
  dismissOptions: PropTypes.object,
  floatingOptions: PropTypes.object,
  hoverOptions: PropTypes.object,
};

export default Tooltip;
