import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@poool/junipero-utils';

const BaseField = forwardRef(({
  className,
  label,
  placeholder,
  value,
  autoFocus = false,
  forceLabel = false,
  dirty = false,
  valid = true,
  empty = true,
  focused = false,
  disabled = false,
  tabIndex = 0,
  onBlur = () => {},
  onFocus = () => {},
  ...rest
}, ref) => {
  const innerRef = useRef();

  useImperativeHandle(ref, () => ({
    innerRef,
    focus,
    blur,
    isJunipero: true,
  }));

  useEffect(() => {
    if (autoFocus) {
      innerRef.current?.focus?.();
    }
  }, [autoFocus]);

  const focus = () => {
    innerRef.current?.focus?.();
  };

  const blur = () => {
    innerRef.current?.blur?.();
  };

  return (
    <div
      { ...rest }
      tabIndex={tabIndex}
      className={classNames(
        'junipero',
        'base',
        {
          invalid: !valid && dirty,
          focused,
          dirty,
          empty,
          disabled,
          labeled: !!label,
          'label-enforced': forceLabel,
        },
        className,
      )}
      ref={innerRef}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      { empty && placeholder && (
        <span className="placeholder">{ placeholder }</span>
      )}
      <span className="label">{ label || placeholder }</span>
      <div className="value">{ value }</div>
    </div>
  );
});

BaseField.propTypes = {
  autoFocus: PropTypes.bool,
  dirty: PropTypes.bool,
  disabled: PropTypes.bool,
  empty: PropTypes.bool,
  focused: PropTypes.bool,
  forceLabel: PropTypes.bool,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
    PropTypes.bool,
  ]),
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
  ]),
  tabIndex: PropTypes.number,
  valid: PropTypes.bool,
  value: PropTypes.any,
};

export default BaseField;
