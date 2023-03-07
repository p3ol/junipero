import React, { MutableRefObject } from 'react';

export declare type CheckboxFieldRef = {
  innerRef: MutableRefObject<any>;
  inputRef: MutableRefObject<any>;
  checked: Boolean;
  isJunipero: Boolean;
};

declare interface CheckboxFieldProps extends React.ComponentPropsWithRef<any> {
  checked?: Boolean;
  valid?: Boolean;
  disabled?: Boolean;
  required?: Boolean;
  children?: React.ReactNode;
  value?: any;
  id?: String;
  name?: String;
  className?: String;
  onChange?: (changeEvent: { value: any; checked: Boolean }) => void;
  onValidate?: (
    value: any,
    { dirty, required }: { dirty?: Boolean; required?: Boolean }
  ) => Boolean;
  ref?: MutableRefObject<CheckboxFieldRef | undefined>;
}

declare function CheckboxField(props: CheckboxFieldProps): JSX.Element;

export default CheckboxField;
