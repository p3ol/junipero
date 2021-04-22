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
  name,
  options = [],
  value,
  onChange = () => {},
  ...rest
}, ref) => {
  const innerRef = useRef();
  const inputRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    focused: null,
  });

  useEventListener('keypress', e => {
    onKeyPress_(e);
  }, globalEventsTarget);

  useImperativeHandle(ref, () => ({
    innerRef,
    inputRef,
    focused: state.focused,
    internalValue: state.checked,
  }));

  const onKeyPress_ = e => {
    const input = e.target.querySelector('input');

    if (!input) {
      return;
    }

    if (
      value !== input.value &&
      (e.key === 'Enter' || e.key === ' ')
    ) {
      e.preventDefault?.();
      onChange({ value: input.value });

      return false;
    }

    return true;
  };

  const onChange_ = (item, e) => {
    if (item.disabled) {
      return;
    }

    onChange({ value: e.target.value });
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
    <div>
      { options.map((item, index) => (
        <label
          ref={innerRef}
          key={index}
          className={classNames(
            'junipero',
            'field',
            'radio',
            {
              active: state.active,
              checked: isChecked(item),
              focused: isFocused(item),
              boxed: !!item.description,
              disabled: disabled || item.disabled,
            },
            className
          )}
          onFocus={onFocus_.bind(null, item)}
          onBlur={onBlur_}
          tabIndex={!item.disabled ? 1 : null}
        >
          <input
            { ...rest }
            id={id}
            name={name}
            ref={inputRef}
            type="radio"
            value={item.value}
            checked={isChecked(item)}
            onChange={onChange_.bind(null, item)}
            tabIndex={-1}
          />
          <div className="inner">
          </div>
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
  name: PropTypes.array,
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
