import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import PropTypes from 'prop-types';

import {
  classNames,
  mockState,
  getFloatPrecision,
  ensureMinMax,
} from '../utils';
import { useEventListener } from '../hooks';

const SliderField = forwardRef(({
  className,
  value = 0,
  disabled = false,
  globalEventsTarget = global,
  min = 0,
  max = 100,
  step = 1,
  onChange = () => {},
  onMouseDown = () => {},
  ...rest
}, ref) => {
  const innerRef = useRef();
  const fillRef = useRef();
  const handleRef = useRef();
  const slideRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    value: parseFloat(ensureMinMax(Math.round(value / step) * step, min, max)
      .toFixed(getFloatPrecision(step))),
    precision: getFloatPrecision(step),
    dirty: false,
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
    internalValue: state.value,
    moving: state.moving,
    precision: state.precision,
    reset,
  }));

  useEventListener('mousemove', e => {
    onMouseMove_(e);
  }, globalEventsTarget);

  useEventListener('mouseup', e => {
    onMouseUp_(e);
  }, globalEventsTarget);

  const onMouseDown_ = e => {
    if (e.button !== 0) {
      return;
    }

    e.preventDefault();

    handleRef.current?.focus();
    state.moving = true;
    dispatch({ moving: true });
    onMouseMove_(e);
    onMouseDown(e);
  };

  const onMouseMove_ = e => {
    if (!state.moving || !slideRef.current || disabled) {
      return;
    }

    const offset = slideRef.current?.getBoundingClientRect();
    const width = slideRef.current?.offsetWidth;
    const position = max * (
      (e.pageX - (offset.left - document.body.scrollLeft)) / width
    ) || 0;

    state.value = parseFloat(
      Math.max(min, Math.min(max, Math.round(position / step) * step))
        .toFixed(state.precision)
    );

    dispatch({ value: state.value, dirty: true });
    onChange({ value: state.value, dirty: true });
  };

  const onMouseUp_ = () => {
    if (!state.moving) {
      return;
    }

    dispatch({ moving: false });
  };

  const onKeyDown_ = e => {
    if (e.key === 'ArrowLeft') {
      state.value = ensureMinMax(state.value - step, min, max);
      dispatch({ value: state.value });
    } else if (e.key === 'ArrowRight') {
      state.value = ensureMinMax(state.value + step, min, max);
      dispatch({ value: state.value });
    } else if (e.key === 'ArrowUp') {
      dispatch({ value: min });
    } else if (e.key === 'ArrowDown') {
      dispatch({ value: max });
    }
  };

  const reset = () => {
    dispatch({
      value: ensureMinMax(value, min, max),
      precision: getFloatPrecision(step),
      dirty: false,
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
        'field',
        'slider',
        {
          disabled,
        },
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
      <div
        className={classNames(
          'handle',
          {
            moving: state.moving,
          }
        )}
        ref={handleRef}
        tabIndex={0}
        style={{
          transform: `translateX(${getHandlePosition()}px)`,
        }}
        onKeyDown={onKeyDown_}
      />
    </div>
  );
});

SliderField.propTypes = {
  disabled: PropTypes.bool,
  globalEventsTarget: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
  ]),
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func,
  onMouseDown: PropTypes.func,
  step: PropTypes.number,
  value: PropTypes.number,
};

export default SliderField;
