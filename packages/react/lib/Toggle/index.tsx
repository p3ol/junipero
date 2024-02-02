import {
  ComponentPropsWithRef,
  MutableRefObject,
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import { classNames, mockState } from '@junipero/core';
import PropTypes from 'prop-types';

import { ForwardedProps, MockState } from '../utils';

export declare type ToggleRef = {
  checked: boolean;
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
  inputRef: MutableRefObject<any>;
};

export declare interface ToggleProps extends ComponentPropsWithRef<any> {
  checked?: boolean;
  children?: ReactNode | JSX.Element;
  className?: string;
  disabled?: boolean;
  tabIndex?: number;
  value?: any;
  onChange?(field: { value: any; checked: boolean }): void;
  ref?: MutableRefObject<ToggleRef | undefined>;
}

const Toggle = forwardRef(({
  checked = false,
  disabled = false,
  tabIndex = 1,
  children,
  className,
  value,
  onChange,
  ...rest
}: ToggleProps, ref) => {
  const innerRef = useRef();
  const inputRef = useRef();

  type ToggleState = {
    checked: boolean;
  }
  const [state, dispatch] = useReducer<MockState<ToggleState>>(mockState, {
    checked,
  });

  useEffect(() => {
    dispatch({ checked });
  }, [checked]);

  useImperativeHandle(ref, () => ({
    innerRef,
    inputRef,
    checked: state.checked,
    isJunipero: true,
  }));

  const onKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      onChange_();
    }
  };

  const onChange_ = () => {
    if (disabled) {
      /* istanbul ignore next: canoot be tested */
      return;
    }

    state.checked = !state.checked;

    dispatch({ checked: state.checked });
    onChange?.({ value, checked: state.checked });
  };

  return (
    <label
      ref={innerRef}
      className={classNames(
        'junipero',
        'toggle-field',
        {
          disabled,
          checked: state.checked,
        },
        className
      )}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
    >
      <input
        { ...rest }
        ref={inputRef}
        type="checkbox"
        value={value}
        disabled={disabled}
        checked={state.checked}
        onChange={onChange_}
        tabIndex={-1}
      />
      <div className="inner">
        <div className="handle" />
      </div>
      { children && (
        <div className="label">
          {children}
        </div>
      ) }
    </label>
  );
}) as ForwardedProps<ToggleProps, ToggleRef>;

Toggle.displayName = 'Toggle';
Toggle.propTypes = {
  value: PropTypes.any,
  checked: PropTypes.bool,
  tabIndex: PropTypes.number,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Toggle;
