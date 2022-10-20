import React, { ComponentPropsWithRef, MutableRefObject } from "react";

export declare type TextFieldRef = {
  innerRef: MutableRefObject<any>;
  inputRef: MutableRefObject<any>;
  value: String;
  valid: Boolean;
  dirty: Boolean;
  focused: Boolean;
  focus: () => void;
  blur: () => void;
  reset: () => void;
  setDirty: (dirty: Boolean) => void;
  isJunipero: Boolean;
};

declare interface TextFieldProps extends ComponentPropsWithRef<any> {
  autoFocus?: Boolean;
  children: React.ReactNode;
  className: String;
  valid: Boolean;
  value?: String;
  disabled: Boolean;
  required?: Boolean;
  type?: String;
  onBlur?: (event: Event) => void;
  onFocus?: (event: Event) => void;
  onChange?: (props: { value: String; valid: Boolean; dirty: Boolean }) => void;
  onValidate?: (
    val: String,
    options: { required?: Boolean; dirty?: Boolean }
  ) => Boolean;
  ref?: MutableRefObject<TextFieldRef | undefined>;
}

declare function TextField(props: TextFieldProps): JSX.Element;

export default TextField;
