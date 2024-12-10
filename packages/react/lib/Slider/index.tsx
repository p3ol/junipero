import {
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
  type ReactNode,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import {
  classNames,
  getFloatPrecision,
  ensureMinMax,
} from '@junipero/core';
import { useEventListener } from '@junipero/hooks';

import type { JuniperoRef, SpecialComponentPropsWithRef } from '../types';
import type { TransitionProps } from '../Transition';
import { mockState } from '../utils';
import Tooltip, { type TooltipRef } from '../Tooltip';

export declare interface SliderRef extends JuniperoRef {
  moving: boolean;
  precision: number;
  value: number;
  reset: () => void;
  fillRef: RefObject<HTMLDivElement>;
  handleRef: RefObject<HTMLDivElement>;
  innerRef: RefObject<HTMLDivElement>;
  slideRef: RefObject<HTMLDivElement>;
  tooltipRef: RefObject<TooltipRef>;
}

export declare interface SliderProps
  extends SpecialComponentPropsWithRef<'div', SliderRef> {
  disabled?: boolean;
  globalEventsTarget?: EventTarget;
  max?: number;
  min?: number;
  maxValue?: number;
  minValue?: number;
  step?: number;
  tooltipEnabled?: boolean;
  value?: number;
  animateTooltip?(
    tooltip: ReactNode,
    opts: {
      opened: boolean;
    } & Partial<TransitionProps>
  ): ReactNode;
  onMove?(value: number): void;
  parseTitle?(value: number): ReactNode;
}

export declare interface SliderState {
  value: number;
  precision: number;
  moving: boolean;
}

const Slider = ({
  ref,
  className,
  value = 0,
  disabled = false,
  globalEventsTarget = globalThis,
  min = 0,
  minValue = 0,
  max = 100,
  maxValue = 100,
  step = 1,
  tooltipEnabled = true,
  animateTooltip,
  onMove,
  onMouseDown,
  parseTitle = v => v,
  ...rest
}: SliderProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<TooltipRef>(null);
  const [state, dispatch] = useReducer(mockState<SliderState>, {
    value: parseFloat(
      ensureMinMax(Math.round(value / step) * step, minValue, maxValue
      ).toFixed(getFloatPrecision(step))),
    precision: getFloatPrecision(step),
    moving: false,
  });

  useEffect(() => {
    state.precision = getFloatPrecision(step);
    state.value = parseFloat(
      ensureMinMax(Math.round(value / step) * step, min, max)
        .toFixed(state.precision)
    );
    dispatch({ precision: state.precision, value: state.value });
  }, [value, step]);

  useImperativeHandle(ref, () => ({
    innerRef,
    fillRef,
    slideRef,
    handleRef,
    tooltipRef,
    value: state.value,
    moving: state.moving,
    precision: state.precision,
    reset,
    isJunipero: true,
  }));

  useEventListener('mousemove', e => {
    onMouseMove_(e);
  }, { target: globalEventsTarget, enabled: state.moving && !disabled });

  useEventListener('mouseup', e => {
    onMouseUp_();
  }, { target: globalEventsTarget, enabled: state.moving && !disabled });

  const onMouseDown_ = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || disabled) {
      return;
    }

    e.preventDefault();

    handleRef.current?.focus();
    tooltipRef.current?.open();
    state.moving = true;
    dispatch({ moving: true });
    onMouseMove_(e);
    onMouseDown?.(e);
  };

  const onMouseMove_ = (e: MouseEvent<HTMLDivElement>) => {
    if (!state.moving || !slideRef.current || disabled) {
      return;
    }

    const previousValue = state.value;
    const offset = slideRef.current?.getBoundingClientRect();
    const width = slideRef.current?.offsetWidth;
    const position = max * (
      (e.pageX - (offset.left - document.body.scrollLeft)) / width
    ) || 0;

    state.value = parseFloat(
      Math.max(minValue, Math.min(maxValue, Math.round(position / step) * step))
        .toFixed(state.precision)
    );

    dispatch({ value: state.value });

    if (state.value !== previousValue) {
      onMove?.(state.value);
    }
  };

  const onMouseUp_ = () => {
    if (!state.moving) {
      return;
    }

    tooltipRef.current?.close();
    dispatch({ moving: false });
  };

  const onKeyDown_ = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      state.value = ensureMinMax(state.value - step, minValue, maxValue);
      dispatch({ value: state.value });
    } else if (e.key === 'ArrowRight') {
      state.value = ensureMinMax(state.value + step, minValue, maxValue);
      dispatch({ value: state.value });
    } else if (e.key === 'ArrowUp') {
      dispatch({ value: min });
    } else if (e.key === 'ArrowDown') {
      dispatch({ value: max });
    }
  };

  const reset = () => {
    dispatch({
      value: ensureMinMax(value, minValue, maxValue),
      precision: getFloatPrecision(step),
      moving: false,
    });
  };

  const getFillSize = () =>
    state.value / max;

  const getHandlePosition = () =>
    slideRef.current?.offsetWidth * getFillSize();

  return (
    <div
      { ...rest }
      ref={innerRef}
      className={classNames(
        'junipero',
        'slider',
        { disabled },
        className,
      )}
      onMouseDown={onMouseDown_}
    >
      <div
        className="slide"
        ref={slideRef}
      >
        <div
          className="fill"
          ref={fillRef}
          style={{ width: `${getFillSize() * 100}%` }}
        />
      </div>
      <Tooltip
        ref={tooltipRef}
        text={parseTitle(state.value)}
        trigger="manual"
        disabled={!tooltipEnabled || disabled}
        animate={animateTooltip}
      >
        <div
          className={classNames(
            'handle',
            { moving: state.moving }
          )}
          ref={handleRef}
          tabIndex={0}
          style={{
            transform: `translate3d(${getHandlePosition()}px, 0, 0)`,
          }}
          onKeyDown={onKeyDown_}
        />
      </Tooltip>
    </div>
  );
};

Slider.displayName = 'Slider';

export default Slider;
