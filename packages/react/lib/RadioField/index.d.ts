import { ReactNode, ComponentPropsWithRef, MutableRefObject } from 'react';

export declare type RadioFieldRef = {
  dirty: boolean;
  isJunipero: boolean;
  valid: boolean;
  value: any;
  innerRef: MutableRefObject<any>;
  inputRefs: Array<MutableRefObject<any>>;
  optionRefs: Array<MutableRefObject<any>>;
};

export declare interface RadioFieldProps extends ComponentPropsWithRef<any> {
  className?: string;
  disabled?: boolean;
  name?: string;
  options?: Array<any>;
  required?: boolean;
  valid?: boolean;
  value?: any;
  onChange?(props: { value: any; valid: boolean }): void;
  onValidate?(
    value: any,
    flags: { dirty: boolean; required: boolean }
  ): boolean;
  parseDescription?(option: any): string;
  parseTitle?(option: any): string;
  parseValue?(option: any): any;
  ref?: MutableRefObject<RadioFieldRef | undefined>;
}

declare function RadioField(props: RadioFieldProps): ReactNode | JSX.Element;

export default RadioField;
