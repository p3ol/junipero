import {
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
  type ReactNode,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
  Fragment,
  useCallback,
} from 'react';
import {
  classNames,
  getFloatPrecision,
  ensureMinMax,
  mockState,
} from '@junipero/core';
import { useEventListener } from '@junipero/hooks';

import type { JuniperoRef, SpecialComponentPropsWithRef } from '../types';
import type { TransitionProps } from '../Transition';
import Tooltip, { type TooltipRef } from '../Tooltip';

export declare interface MultiThumbSliderRef extends JuniperoRef {
  moving: boolean;
  precision: number;
  values: number[];
  names: string[];
  reset: () => void;
  fillRef: RefObject<HTMLDivElement>;
  handleRef: RefObject<HTMLDivElement>;
  innerRef: RefObject<HTMLDivElement>;
  slideRef: RefObject<HTMLDivElement>;
  tooltipRef: RefObject<TooltipRef>;
}

export declare interface MultiThumbSliderProps
  extends SpecialComponentPropsWithRef<'div', MultiThumbSliderRef> {
  disabled?: boolean;
  globalEventsTarget?: EventTarget;
  max?: number;
  min?: number;
  maxValue?: number;
  minValue?: number;
  customMaxValue?: number;
  step?: number;
  tooltipEnabled?: boolean;
  values?: number[];
  names?: string[]
  remainderName?: string;
  animateTooltip?(
    tooltip: ReactNode,
    opts: {
      opened: boolean;
    } & Partial<TransitionProps>
  ): ReactNode;
  onMove?(index: number, value: number): void;
  parseTitle?(value: string): ReactNode;
}

export declare interface MultiThumbSliderState {
  values: number[];
  precision: number;
  moving: boolean;
  indexHandled?: number;
}

const MultiThumbSlider = ({
  ref,
  className,
  values,
  names = [],
  disabled = false,
  globalEventsTarget = globalThis,
  min = 0,
  minValue = 0,
  max = 100,
  maxValue = 100,
  customMaxValue = 100,
  step = 1,
  tooltipEnabled = true,
  remainderName = 'Unset',
  animateTooltip,
  onMove,
  onMouseDown,
  ...rest
}: MultiThumbSliderProps) => {
  const precision = getFloatPrecision(step);
  const range = max - min;

  const getNormalizedParts = (parts: number[] = []) => {
    if (range <= 0) {
      return [];
    }

    const safeParts = parts.map(v => ensureMinMax(v, 0, 100));
    const total = safeParts.reduce((acc, v) => acc + v, 0);

    return total < 100
      ? [...safeParts, 100 - total]
      : safeParts;
  };

  const normalizeToStep = (value: number, minV: number, maxV: number) => {
    return parseFloat(ensureMinMax(
      Math.round(value / step) * step, minV, maxV
    ).toFixed(precision));
  };

  const getHandleValues = (parts: number[] = []) => {
    const normalizedParts = getNormalizedParts(parts);

    const handles: number[] = [];
    let cursor = min;

    normalizedParts.slice(0, -1).forEach(part => {
      const previous = handles[handles.length - 1] ?? minValue;
      const segmentValue = (part / 100) * range;

      cursor = ensureMinMax(cursor + segmentValue, minValue, maxValue);
      handles.push(normalizeToStep(cursor, previous, maxValue));
    });

    return handles;
  };

  const innerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<TooltipRef>(null);
  const [state, dispatch] = useReducer(mockState<MultiThumbSliderState>, {
    values: getHandleValues(values),
    precision,
    moving: false,
    indexHandled: null,
  });

  useEffect(() => {
    if (!values) {
      return;
    }

    const handleValues = getHandleValues(values);
    dispatch({ precision, values: handleValues });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  useImperativeHandle(ref, () => ({
    innerRef,
    fillRef,
    slideRef,
    handleRef,
    tooltipRef,
    values: state.values,
    names,
    moving: state.moving,
    precision: state.precision,
    reset,
    isJunipero: true,
  }));

  useEventListener('mousemove', e => {
    onMouseMove_(e);
  }, [], { target: globalEventsTarget, enabled: state.moving && !disabled });

  useEventListener('mouseup', () => {
    onMouseUp_();
  }, [], { target: globalEventsTarget, enabled: state.moving && !disabled });

  const onMouseDown_ = (e: MouseEvent<HTMLDivElement>) => {
    if (e?.button !== 0 || disabled) {
      return;
    }

    e?.preventDefault?.();

    const index = parseInt(
      (e?.currentTarget as HTMLDivElement)?.dataset?.handleindex || '0'
    );

    (e?.currentTarget as HTMLDivElement)?.focus();
    state.moving = true;
    dispatch({ moving: true, indexHandled: index });
    onMouseMove_(e);
    onMouseDown?.(e);
  };

  const onMouseMove_ = (e: MouseEvent<HTMLDivElement>) => {
    if (
      !slideRef.current || disabled ||
      !state.moving || state.indexHandled === null
    ) {
      return;
    }

    const previousValues = [...state.values];
    const offset = slideRef.current?.getBoundingClientRect();
    const width = slideRef.current?.offsetWidth;
    const position = min + range * (
      (e.pageX - (offset.left - document.body.scrollLeft)) / width
    ) || min;

    const newValues = [...state.values];
    const prevValue = newValues[state.indexHandled - 1] ?? minValue;
    const nextValue = newValues[state.indexHandled + 1] ?? maxValue;
    newValues[state.indexHandled] = normalizeToStep(
      position,
      prevValue,
      nextValue
    );

    dispatch({ values: newValues });

    newValues.forEach((v, i) => {
      if (v !== previousValues[i]) {
        onMove?.(i, v);
      }
    });
  };

  const onMouseUp_ = () => {
    if (!state.moving) {
      return;
    }

    dispatch({ moving: false, indexHandled: null });
  };

  const onKeyDown_ = (i: number, e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      state.values[i] = ensureMinMax(
        state.values[i] - step, minValue, maxValue
      );
      dispatch({ values: state.values });
    } else if (e.key === 'ArrowRight') {
      state.values[i] = ensureMinMax(
        state.values[i] + step, minValue, maxValue
      );
      dispatch({ values: state.values });
    }
  };

  const reset = () => {
    dispatch({
      values: getHandleValues(values),
      precision,
      moving: false,
      indexHandled: null,
    });
  };

  const getValueRatio = useCallback((value: number) =>
    range > 0 ? ensureMinMax((value - min) / range, 0, 1) : 0
  , [range, min]);

  const getHandlePosition = (i: number) =>
    slideRef.current?.offsetWidth * getValueRatio(state.values[i]);

  const getSegmentBounds = useCallback((i: number) => ({
    startValue: i > 0 ? state.values[i - 1] : min,
    endValue: i < state.values.length ? state.values[i] : max,
  }), [state.values, min, max]);

  const getFillStyle = useCallback((i: number) => {
    const { startValue, endValue } = getSegmentBounds(i);
    const startRatio = getValueRatio(startValue);
    const endRatio = getValueRatio(endValue);
    const widthRatio = Math.max(0, endRatio - startRatio);

    return {
      width: `${widthRatio * 100}%`,
      transform: `translate3d(${
        (slideRef.current?.offsetWidth ?? 0) * startRatio
      }px, 0, 0)`,
      backgroundColor: `rgb(${92 + i * 50}, 86, 223)`,
    };
  }, [getSegmentBounds, getValueRatio]);

  const getSegmentValue = useCallback((i: number) => {
    const { startValue, endValue } = getSegmentBounds(i);

    return parseFloat(Math.max(0, endValue - startValue).toFixed(precision));
  }, [getSegmentBounds, precision]);

  const getSegmentPercent = useCallback((i: number) => range > 0
    ? parseFloat(((getSegmentValue(i) / range) * 100).toFixed(2))
    : 0, [getSegmentValue, range]);

  const getSegmentName = useCallback((i: number) =>
    names[i] ?? remainderName
  , [names, remainderName]);

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
    >
      <div
        className="slide"
        ref={slideRef}
      >
        { Array.from({ length: state.values.length + 1 }).map((_, i) => (
          <div
            key={i}
            className="fill"
            ref={fillRef}
            style={getFillStyle(i)}
          />
        ))}
      </div>
      { state.values.map((_, i) => (
        <Tooltip
          key={i}
          ref={tooltipRef}
          text={(
            <div className="my-3">
              { Array
                .from({ length: state.values.length + 1 })
                .map((_, i) => (
                  <Fragment key={i}>
                    { i === names?.length && (<hr className="my-2" />)}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-[2px]"
                        style={{
                          backgroundColor: `rgb(${92 + i * 50}, 86, 223)`,
                        }}
                      />
                      <div>{ getSegmentPercent(i) } %</div>
                      <div className="text-xs text-gray-500">
                        { customMaxValue !== 100 && (
                          <span className="mr-1">
                            ({ getSegmentValue(i) * customMaxValue / 100 })
                          </span>
                        )}
                        { getSegmentName(i) }
                      </div>

                    </div>
                  </Fragment>
                ))
              }
            </div>
          )}
          trigger="manual"
          opened={
            !!tooltipEnabled && !disabled &&
            state.moving && state.indexHandled === i
          }
          disabled={!tooltipEnabled || disabled}
          animate={animateTooltip}
        >
          <div
            className={classNames(
              'handle',
              { moving: state.moving && state.indexHandled === i }
            )}
            ref={handleRef}
            data-handleindex={i}
            tabIndex={0}
            style={{
              position: 'absolute',
              transform: `translate3d(${getHandlePosition(i)}px, 0, 0)`,
              left: 0,
            }}
            onMouseDown={onMouseDown_}
            onKeyDown={onKeyDown_.bind(null, i)}
          />
        </Tooltip>
      ))}
    </div>
  );
};

MultiThumbSlider.displayName = 'MultiThumbSlider';

export default MultiThumbSlider;
