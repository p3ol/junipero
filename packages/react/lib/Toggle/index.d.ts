import React, { MutableRefObject } from 'react';

export declare type ToggleRef = {
  innerRef: MutableRefObject<any>,
  inputRef: MutableRefObject<any>,
  checked: Boolean,
  isJunipero: Boolean,
};

declare interface ToggleProps extends React.ComponentPropsWithRef<any> {
  checked?: Boolean,
  disabled?: Boolean,
  tabIndex?: number,
  children?: React.ReactNode,
  className?: String,
  value?: any,
  onChange?: (props: {value?: any, checked?: Boolean}) => void,
  ref?: MutableRefObject<ToggleRef | undefined>
}

declare function Toggle(props: ToggleProps): JSX.Element;

export default Toggle;
