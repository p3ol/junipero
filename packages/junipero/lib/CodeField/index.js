import {
  useReducer,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import { classNames, mockState } from '@poool/junipero-utils';

const CodeField = forwardRef(({
  className,
  value,
  valid,
  autoFocus = false,
  disabled = false,
  required = false,
  size = 6,
  validate = val => !!val || !required,
  onChange = () => {},
  ...rest
}, ref) => {
  const innerRef = useRef();
  const inputsRef = useRef([]);
  const [state, dispatch] = useReducer(mockState, {
    valid: valid ?? false,
    values: value?.split('').slice(0, size) || [],
    dirty: false,
  });

  useEffect(() => {
    if (value) {
      dispatch({
        values: value.split('').slice(0, size),
        valid: validate(value, { dirty: state.dirty }),
      });
    }
  }, [value]);

  useImperativeHandle(ref, () => ({
    innerRef,
    inputsRef,
    internalValue: state.values?.join(''),
    dirty: state.dirty,
    valid: state.valid,
    focus,
    blur,
    reset,
    isJunipero: true,
  }));

  const focus = (index = 0) => {
    inputsRef.current[index]?.focus();
  };

  const blur = index => {
    inputsRef.current[index]?.blur();
  };

  const reset = () => {
    dispatch({
      dirty: false,
      values: value?.split('').slice(0, size) || [],
      valid: valid ?? false,
    });
  };

  const onChange_ = (index, e) => {
    if (disabled) {
      return;
    }

    state.values[index] = e?.target?.value || '';
    state.valid = validate?.(state.values.join(''),
      { dirty: state.dirty }) || false;
    dispatch({ values: state.values, dirty: true, valid: state.valid });
    onChange({ value: state.values.join(''), valid: state.valid });

    if (state.values[index]) {
      focus(index + 1);
    }
  };

  const onKeyDown_ = (index, e) => {
    if (disabled) {
      return;
    }

    const current = inputsRef.current?.[index];
    const prev = inputsRef.current?.[index - 1];
    const next = inputsRef.current?.[index + 1];

    switch (e.key) {
      case 'Backspace':
        /* istanbul ignore if: cannot test selections in jest/enzyme */
        if (
          current.selectionStart !== current.selectionEnd ||
          current.selectionStart === 1 ||
          index === 0
        ) {
          return;
        }

        onChange_(index - 1, { target: { value: '' } });
        prev?.focus();
        break;

      case 'ArrowLeft':
        /* istanbul ignore if: cannot test selections in jest/enzyme */
        if (current.selectionStart !== current.selectionEnd || index === 0) {
          return;
        }

        prev.selectionStart = current.selectionStart;
        prev.selectionEnd = current.selectionStart;
        prev.focus();
        break;

      case 'ArrowRight':
        /* istanbul ignore if: cannot test selections in jest/enzyme */
        if (
          current.selectionStart !== current.selectionEnd ||
          index === size - 1
        ) {
          return;
        }

        next.selectionStart = current.selectionStart;
        next.selectionEnd = current.selectionStart;
        next.focus();
        break;
    }
  };

  return (
    <div
      { ...rest }
      className={classNames(
        'junipero',
        'field',
        'code',
        {
          dirty: state.dirty,
          invalid: !state.valid && state.dirty,
        },
        className
      )}
      ref={innerRef}
    >
      <div className="wrapper">
        { Array.from({ length: size }).map((item, index) => (
          <input
            ref={ref => { inputsRef.current[index] = ref; }}
            disabled={disabled}
            size={1}
            maxLength={1}
            autoFocus={index === 0 && autoFocus}
            type="tel"
            key={index}
            value={state.values[index] || ''}
            required={required}
            onChange={onChange_.bind(null, index)}
            onKeyDown={onKeyDown_.bind(null, index)}
          />
        )) }
      </div>
    </div>
  );
});

CodeField.propTypes = {
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  size: PropTypes.number,
  valid: PropTypes.bool,
  value: PropTypes.string,
  validate: PropTypes.func,
  onChange: PropTypes.func,
};

export default CodeField;
