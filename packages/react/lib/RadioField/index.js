import { forwardRef, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { classNames, mockState } from '@junipero/core';

const RadioField = forwardRef(({
  className,
  disabled = false,
  id,
  name,
  options = [],
  value,
  parseValue = val => val.value ?? val,
  parseTitle = val => val?.title ?? val?.toString?.(),
  parseDescription = val => val?.description || '',
  onChange = () => {},
  ...rest
}, ref) => {
  const inputRefs = useRef([]);
  const innerRefs = useRef([]);
  const wrapperRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    focused: null,
    dirty: false,
    value,
    valid: false,
  });

  const isChecked = option =>
    state.value === option || state.value === parseValue(option);

  const onChange_ = option => {
    dispatch({ value: option, valid: true, dirty: true });
    onChange({ value: parseValue(option), valid: true });
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

  return (
    <div
      { ...rest }
      id={id}
      className={classNames(
        'junipero',
        'radio-field',
        { disabled, dirty: state.dirty },
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
            <div className="title">{ parseTitle(option, true) }</div>

            { option.description && (
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
  options: PropTypes.array,
  parseValue: PropTypes.func,
  parseDescription: PropTypes.func,
  parseTitle: PropTypes.func,
  value: PropTypes.any,
  id: PropTypes.string,
  name: PropTypes.string,
};

export default RadioField;
