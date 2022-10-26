import React, { MutableRefObject } from 'react';

export declare type RadioFieldRef = {
  optionRefs: Array<MutableRefObject<any>>;
  inputRefs: Array<MutableRefObject<any>>;
  innterRef: MutableRefObject<any>;
  dirty: Boolean;
  value: any;
  isJunipero: Boolean;
  valid: Boolean;
};

declare interface RadioFieldProps extends React.ComponentPropsWithRef<any> {
  disabled?: Boolean;
  required?: Boolean;
  valid?: Boolean;
  options?: Array<any>;
  className?: String;
  name?: String;
  value?: any;
  onChange?: (props: { value: any; valid: Boolean }) => void;
  onValidate?: (
    value: any,
    options: { dirty?: Boolean; required?: Boolean }
  ) => Boolean;
  parseValue?: (option: any) => any;
  parseTitle?: (option: any) => String;
  parseDescription?: (option: any) => String;
  ref?: MutableRefObject<RadioFieldRef | undefined>;
}

declare function RadioField(props: RadioFieldProps): JSX.Element;

export default RadioField;
