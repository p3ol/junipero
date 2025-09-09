import {
  forwardRef,
  useImperativeHandle,
  useReducer,
  useRef,
  useEffect,
  useId,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { classNames, exists, mockState } from '@poool/junipero-utils';

const RadioField = forwardRef(({
  className,
  disabled = false,
  id: idProp,
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

  const fallbackId = useId();
  const id = useMemo(() => (
    idProp ?? `junipero-radio-field-${fallbackId}`
  ), [idProp, fallbackId]);

  const wrapperRef = useRef();
  const innerRefs = useRef([]);
  const inputRefs = useRef([]);
  const [state, dispatch] = useReducer(mockState, {
    focused: null,
    dirty: false,
    value,
    valid: false,
  });

  useEffect(() => {
    if (
      exists(value) &&
      value !== state.value &&
      parseValue(value) !== state.value
    ) {
      dispatch({
        value: options?.find(o => parseValue(o) === parseValue(value)),
        valid: true,
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
    valid: state.valid,
  }));

  const onKeyDown_ = (option, e) => {
    if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) {
      const i = options.indexOf(option);

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        innerRefs.current[(i + 1) % options.length]?.focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        innerRefs.current[(i - 1 + options.length) % options.length]?.focus();
      }
    }

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

    dispatch({ value: option, valid: true, dirty: true });
    onChange({ value: parseValue(option), valid: true });
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
      id={id}
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
