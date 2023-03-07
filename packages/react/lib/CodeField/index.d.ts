import { MutableRefObject } from 'react';

export declare type CodeFieldRef = {
  innerRef: MutableRefObject<any>;
  inputsRef: Array<MutableRefObject<any>>;
  value: String;
  dirty: Boolean;
  valid: Boolean;
  focus: (index: number) => void;
  blur: (index: number) => void;
  reset: () => void;
  isJunipero: Boolean;
};

declare interface CodeFieldProps {
  className?: String;
  value?: String;
  valid?: Boolean;
  autoFocus?: Boolean;
  disabled?: Boolean;
  required?: Boolean;
  size?: number;
  onValidate?: (
    value: String,
    { dirty, required }: { dirty?: Boolean; required?: Boolean }
  ) => Boolean;
  onChange?: (changeProps: { value?: String; valid: Boolean }) => void;
  onPaste?: (e: Event) => any;
  onFocus?: (e: Event) => any;
  onBlur?: (e: Event) => any;
  ref?: MutableRefObject<CodeFieldRef | undefined>;
}

declare function CodeField(props: CodeFieldProps): JSX.Element;

export default CodeField;
