import { ReactNode, ComponentPropsWithRef, MutableRefObject } from 'react';

export declare type SelectFieldRef = {
  dirty: boolean;
  focused: boolean;
  isJunipero: boolean;
  opened: boolean;
  value: any;
  valid: boolean;
  blur(): void;
  focus(): void;
  reset(): void;
  innerRef: MutableRefObject<any>;
  searchInputRef: MutableRefObject<any>;
};

declare interface SelectFieldProps extends ComponentPropsWithRef<any> {
  allowArbitraryItems?: boolean;
  autoFocus?: boolean;
  className?: string;
  clearable?: boolean;
  disabled?: boolean;
  keyboardHandler?: boolean;
  multiple?: boolean;
  noOptionsEnabled?: boolean;
  noOptionsLabel?: ReactNode | JSX.Element;
  options?: Array<any>;
  placeholder?: string;
  required?: boolean;
  searchable?: boolean;
  searchMinCharacters?: number;
  searchThreshold?: number;
  toggleClick?: boolean;
  valid?: boolean;
  value?: any;
  animateMenu?(
    menu: ReactNode | JSX.Element,
    opts: { opened: boolean }
  ): ReactNode | JSX.Element;
  onChange?(props: { value: any; valid: boolean }): void;
  onBlur?(event: Event): void;
  onFocus?(event: Event): void;
  onKeyPress?(event: Event): void;
  onKeyUp?(event: Event): void;
  onValidate?(
    value: any,
    flags: { required: boolean; multiple: boolean }
  ): boolean;
  onSearch?(search: string): Promise<Array<any>>;
  parseTitle?(option: any): string;
  parseValue?(option: any): any;
  ref?: MutableRefObject<SelectFieldRef | undefined>;
}

declare function SelectField(props: SelectFieldProps): ReactNode | JSX.Element;

export default SelectField;
