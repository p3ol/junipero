import { ReactNode, ComponentPropsWithRef, MutableRefObject } from 'react';

export declare type TextFieldRef = {
  dirty: boolean;
  focused: boolean;
  isJunipero: boolean;
  valid: boolean;
  value: string | number;
  blur(): void;
  focus(): void;
  reset(): void;
  setDirty(dirty: boolean): void;
  innerRef: MutableRefObject<any>;
  inputRef: MutableRefObject<any>;
};

export declare interface TextFieldProps extends ComponentPropsWithRef<any> {
  autoFocus?: boolean;
  children?: ReactNode | JSX.Element;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  type?: string;
  valid?: boolean;
  value?: string | number;
  onBlur?(event: Event): void;
  onChange?(
    field: { value: string | number; valid: boolean; dirty: boolean }
  ): void;
  onFocus?(event: Event): void;
  onWheel?(event: Event): void;
  onValidate?(
    val: string | number,
    flags: { required: boolean; dirty: boolean }
  ): boolean;
  ref?: MutableRefObject<TextFieldRef | undefined>;
}

declare function TextField(props: TextFieldProps): ReactNode | JSX.Element;

export default TextField;
