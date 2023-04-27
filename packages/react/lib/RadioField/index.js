import {
  forwardRef,
  useReducer,
  useRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { classNames, mockState } from '@junipero/core';

import { useFieldControl } from '../hooks';

const RadioField = forwardRef(({
  disabled = false,
  required = false,
  valid = true,
  options = [],
  className,
  name,
  value,
  onChange,
  onValidate = (val, { required }) =>
    (val !== undefined && val !== null) || !required,
  parseValue = val => val?.value ?? val,
  parseTitle = val => val?.title ?? val?.toString?.(),
  parseDescription = val => val?.description || '',
  ...rest
}, ref) => {
  const inputRefs = useRef([]);
  const optionRefs = useRef([]);
  const innerRef = useRef();
  const { update: updateControl } = useFieldControl();
  const [state, dispatch] = useReducer(mockState, {
    dirty: false,
    value,
    valid,
  });

  useEffect(() => {
    if (
      value !== state.value
    ) {
      const valid = onValidate(value, { dirty: state.dirty, required });
      dispatch({
        value: options?.find(o => parseValue(o) === parseValue(value)),
        valid,
      });
      updateControl?.({
        dirty: state.dirty,
        valid,
      });
    }
  }, [value, options]);

  useImperativeHandle(ref, () => ({
    optionRefs,
    inputRefs,
    innerRef,
    dirty: state.dirty,
    value: state.value,
    isJunipero: true,
    valid: state.valid,
  }));

  const isChecked = option => parseValue(option) === parseValue(state.value);

  const onChange_ = option => {
    if (disabled || option.disabled) {
      /* istanbul ignore next: canoot be tested */
      return;
    }

    const valid = onValidate(parseValue(option), { dirty: true, required });
    dispatch({ value: option, valid, dirty: true });

    onChange?.({ value: parseValue(option), valid });

    updateControl?.({ dirty: true, valid });
  };

  const onKeyDown = (option, e) => {
    if (
      state.value !== option &&
      state.value !== parseValue(option) &&
      (e.key === 'Enter' || e.key === ' ')
    ) {
      onChange_(option);
    }

    return true;
  };

  const isDescriptionAvailable = option => {
    const desc = parseDescription(option);

    return desc !== null && desc !== undefined && desc !== '';
  };

  return (
    <div
      { ...rest }
      className={classNames(
        'junipero',
        'radio-field',
        { disabled },
        state.dirty ? 'dirty' : 'pristine',
        !state.valid && state.dirty ? 'invalid' : 'valid',
        className,
      )}
      ref={innerRef}
    >
      { options.map((option, index) => (
        <label
          key={index}
          ref={el => { optionRefs.current[index] = el; }}
          className={classNames({
            checked: isChecked(option),
            disabled: disabled || option.disabled,
          })}
          onKeyDown={onKeyDown.bind(null, option)}
          tabIndex={disabled ? -1 : index + 1}
        >
          <input
            id={option.id}
            name={name}
            ref={el => { inputRefs.current[index] = el; }}
            type="radio"
            value={parseValue(option)}
            checked={isChecked(option)}
            onChange={onChange_.bind(null, option)}
            tabIndex={-1}
          />
          <div className="inner" />
          <div className="label">
            <div className="title">{ parseTitle(option) }</div>
            { isDescriptionAvailable(option) && (
              <div className="description">{ parseDescription(option) }</div>
            ) }
          </div>
        </label>
      ))}
    </div>
  );
});

RadioField.displayName = 'RadioField';
RadioField.propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onValidate: PropTypes.func,
  required: PropTypes.bool,
  valid: PropTypes.bool,
  options: PropTypes.array,
  parseValue: PropTypes.func,
  parseDescription: PropTypes.func,
  parseTitle: PropTypes.func,
  value: PropTypes.any,
  name: PropTypes.string,
};

export default RadioField;
