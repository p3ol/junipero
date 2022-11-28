import { MutableRefObject } from 'react';

export declare type SelectFieldRef = {
  innerRef: MutableRefObject<any>;
  searchInputRef: MutableRefObject<any>;
  value: any;
  valid: Boolean;
  dirty: Boolean;
  focused: Boolean;
  opened: Boolean;
  focus: () => void;
  blur: () => void;
  reset: () => void;
  isJunipero: Boolean;
};

declare interface SelectFieldProps extends React.ComponentPropsWithRef<any> {
  animateMenu: (menu: JSX.Element, opts: { opened: Boolean }) => JSX.Element;
  className?: String;
  options?: Array<any>;
  placeholder?: String;
  valid?: Boolean;
  value?: any;
  allowArbitraryItems?: Boolean;
  autoFocus?: Boolean;
  clearable?: Boolean;
  disabled?: Boolean;
  multiple?: Boolean;
  noOptionsLabel?: String;
  searchable?: Boolean;
  searchMinCharacters?: number;
  searchThreshold?: number;
  required?: Boolean;
  onChange?: (props: { value: any; valid: Boolean }) => void;
  parseTitle?: (option: any) => String;
  parseValue?: (option: any) => any;
  onBlur?: (event: Event) => void;
  onFocus?: (event: Event) => void;
  onKeyPress?: (event: Event) => void;
  onKeyUp?: (event: Event) => void;
  onValidate?: (
    value: any,
    props: { required?: Boolean; multiple?: Boolean }
  ) => Boolean;
  onSearch?: (search: String) => Promise<Array<any>>;
  ref?: MutableRefObject<SelectFieldRef | undefined>;
}

declare function SelectField(props: SelectFieldProps): JSX.Element;

export default SelectField;
