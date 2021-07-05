import React, {
  forwardRef,
  useImperativeHandle,
  useReducer,
  useRef,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { classNames, exists, mockState } from '@poool/junipero-utils';

const RadioField = forwardRef(({
  className,
  disabled = false,
  id,
  name,
  options = [],
  value,
  parseTitle = val => val?.toString?.(),
  parseDescription = val => val?.description || '',
  parseValue = val => val,
  onBlur = () => {},
  onFocus = () => {},
  onChange = () => {},
  ...rest
}, ref) => {
  const wrapperRef = useRef();
  const innerRefs = useRef([]);
  const inputRefs = useRef([]);
  const [state, dispatch] = useReducer(mockState, {
    focused: null,
    dirty: false,
    value,
  });

  useEffect(() => {
    if (
      exists(value) &&
      value !== state.value &&
      parseValue(value) !== state.value
    ) {
      dispatch({
        value: options?.find(o => parseValue(o) === parseValue(value)),
      });
    }
  }, [value, options]);

  useImperativeHandle(ref, () => ({
    innerRefs,
    inputRefs,
    focused: state.focused,
    dirty: state.dirty,
    internalValue: state.value,
    isJunipero: true,
  }));

  const onKeyDown_ = (option, e) => {
    if (
      state.value !== option &&
      state.value !== parseValue(option) &&
      (e.key === 'Enter' || e.key === ' ')
    ) {
      onChange_(option);
    }

    return true;
  };

  const onChange_ = option => {
    if (disabled || option.disabled) {
      return;
    }

    dispatch({ value: option, dirty: true });
    onChange({ value: parseValue(option) });
  };

  const onFocus_ = (option, index, e) => {
    dispatch({ focused: option });
    onFocus(option, index, e);
  };

  const onBlur_ = (option, index, e) => {
    dispatch({ focused: null });
    onBlur(option, index, e);
  };

  const isChecked = option =>
    state.value === option || state.value === parseValue(option);

  const isFocused = option =>
    state.focused === option;

  return (
    <div
      { ...rest }
      className={classNames(
        'junipero',
        'field',
        'radio',
        { disabled, dirty: state.dirty },
        className,
      )}
      ref={wrapperRef}
    >
      { options.map((option, index) => (
        <label
          htmlFor={id}
          ref={el => { innerRefs.current[index] = el; }}
          key={index}
          className={classNames(
            {
              checked: isChecked(option),
              focused: isFocused(option),
              disabled: disabled || option.disabled,
            },
          )}
          onKeyDown={onKeyDown_.bind(null, option)}
          onFocus={onFocus_.bind(null, option, index)}
          onBlur={onBlur_.bind(null, option, index)}
          tabIndex={!option.disabled ? index + 1 : null}
        >
          <input
            id={id}
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

            { option.description && (
              <div className="description">{ parseDescription(option) }</div>
            ) }
          </div>
        </label>
      )
      )}
    </div>
  );
});

RadioField.propTypes = {
  disabled: PropTypes.bool,
  description: PropTypes.string,
  globalEventsTarget: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
  ]),
  id: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.array,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  parseTitle: PropTypes.func,
  parseDescription: PropTypes.func,
  parseValue: PropTypes.func,
  value: PropTypes.any,
};

export default RadioField;
