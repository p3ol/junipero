import React, {
  forwardRef,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { classNames, mockState } from '@poool/junipero-utils';
import { useEventListener } from '@poool/junipero-hooks';

const RadioField = forwardRef(({
  className,
  disabled = false,
  globalEventsTarget = global,
  id,
  options = [],
  value,
  onChange = () => {},
  ...rest
}, ref) => {
  const innersRef = useRef([]);
  const inputsRef = useRef([]);
  const [state, dispatch] = useReducer(mockState, {
    focused: null,
  });

  useEventListener('keypress', e => {
    onKeyPress_(e);
  }, globalEventsTarget);

  useImperativeHandle(ref, () => ({
    innersRef,
    inputsRef,
    focused: state.focused,
  }));

  const onKeyPress_ = e => {
    const foundIndex = options.findIndex(o => o.value === state.focused);

    /* istanbul ignore if: just in case */
    if (foundIndex < 0) {
      return false;
    }

    const inputValue = inputsRef.current[foundIndex]?.value;

    if (
      value !== inputValue &&
      (e.key === 'Enter' || e.key === ' ')
    ) {
      onChange({ value: inputValue });
      e.preventDefault?.();

      return false;
    }

    return true;
  };

  const onChange_ = (item, e) => {
    if (disabled || item.disabled) {
      return;
    }

    onChange({ value: e?.target?.value });
  };

  const onFocus_ = item => {
    dispatch({ focused: item.value });
  };

  const onBlur_ = () => {
    dispatch({ focused: null });
  };

  const isChecked = item =>
    value === item.value;

  const isFocused = item =>
    state.focused === item.value;

  return (
    <div
      className={classNames(
        'junipero',
        'field',
        'radio',
        className,
      )}
    >
      { options.map((item, index) => (
        <label
          htmlFor={id}
          ref={el => {
            innersRef.current[index] = el;
          }}
          key={index}
          className={classNames(
            {
              checked: isChecked(item),
              focused: isFocused(item),
              boxed: !!item.description,
              disabled: disabled || item.disabled,
            },
          )}
          onFocus={onFocus_.bind(null, item)}
          onBlur={onBlur_}
          tabIndex={!item.disabled ? 1 : null}
        >
          <input
            { ...rest }
            id={id}
            name={item.value}
            ref={el => {
              inputsRef.current[index] = el;
            }}
            type="radio"
            value={item.value}
            checked={isChecked(item)}
            onChange={onChange_.bind(null, item)}
            tabIndex={-1}
          />
          <div className="inner" />
          <div className="label">
            <div>{ item.title }</div>
            {
              item.description &&
              <div className="description">{item.description}</div>
            }
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
  options: PropTypes.array,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
    PropTypes.bool,
  ]),
};

export default RadioField;
