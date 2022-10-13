import { forwardRef, useReducer, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { classNames, mockState } from '@junipero/core';

import { useFieldControl } from '../hooks';

const RadioField = forwardRef(({
  className,
  disabled = false,
  required = false,
  id,
  valid = true,
  name,
  options = [],
  value,
  parseValue = val => val?.value ?? val,
  parseTitle = val => val?.title ?? val?.toString?.(),
  parseDescription = val => val?.description || '',
  onChange,
  onValidate = (val, { required }) =>
    (val !== undefined && val !== null) || !required,
  ...rest
}, ref) => {
  const inputRefs = useRef([]);
  const innerRefs = useRef([]);
  const wrapperRef = useRef();

  const [state, dispatch] = useReducer(mockState, {
    dirty: false,
    value,
    valid,
  });

  useImperativeHandle(ref, () => ({
    innerRefs,
    inputRefs,
    dirty: state.dirty,
    internalValue: state.value,
    isJunipero: true,
    valid: state.valid,
  }));

  const { update: updateControl } = useFieldControl();

  const isChecked = option =>
    state.value === option || state.value === parseValue(option);

  const onChange_ = option => {

    if (disabled || option.disabled) {
      /* istanbul ignore next: canoot be tested */
      return;
    }

    const valid = onValidate(parseValue(option), { dirty: true, required });

    dispatch({
      value: option,
      valid,
      dirty: true,
    });

    onChange?.({
      value: parseValue(option),
      valid,
    });

    updateControl?.({
      dirty: state.dirty,
      valid,
    });
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
      id={id}
      className={classNames(
        'junipero',
        'radio-field',
        {
          disabled,
          invalid: !state.valid,
        },
        className,
      )}
      ref={wrapperRef}
    >
      { options.map((option, index) => (
        <label
          key={index}
          ref={el => { innerRefs.current[index] = el; }}
          className={classNames(
            {
              checked: isChecked(option),
              disabled: disabled || option.disabled,
            },
          )}
          onKeyDown={onKeyDown.bind(null, option)}
          tabIndex={disabled ? -1 : index + 1}
        >
          <input
            id={option.id || option.value}
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
  id: PropTypes.string,
  name: PropTypes.string,
};

export default RadioField;
