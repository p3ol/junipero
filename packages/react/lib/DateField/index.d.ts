import { MutableRefObject } from 'react';

import { FixedArray } from '../utils';

export declare type DateFieldRef = {
  innerRef: MutableRefObject<any>;
  value: Date;
  valid: Boolean;
  dirty: Boolean;
  focused: Boolean;
  opened: Boolean;
  focus: () => void;
  blur: () => void;
  reset: () => void;
  isJunipero: Boolean;
};

declare interface DateFieldProps extends React.ComponentPropsWithRef<any> {
  animateMenu: (menu: JSX.Element, opts: { opened: Boolean }) => JSX.Element;
  className?: String;
  min?: Date;
  max?: Date;
  opened?: Boolean;
  placeholder?: String;
  trigger?: 'click' | 'hover' | 'manual';
  value?: Date;
  valid?: Boolean;
  autoFocus?: Boolean;
  clearable?: Boolean;
  disabled?: Boolean;
  monthNames?: FixedArray<String, 12>;
  required?: Boolean;
  time?: Boolean;
  timePlaceholder?: String;
  weekDaysName?: FixedArray<String, 7>;
  onChange?: (props: { parsedValue: any; valid: Boolean }) => void;
  onFocus?: (e: Event) => any;
  onBlur?: (e: Event) => any;
  onToggle?: (props: { opened: Boolean }) => void;
  parseTitle?: (val: Date) => String;
  parseValue?: (value: Date, options: { required?: Boolean }) => any;
  parseTime?: (time: String) => FixedArray<number, 3>;
  onValidate?: (
    value: Date,
    options: { required?: Boolean; dirty?: Boolean }
  ) => Boolean;
  ref?: MutableRefObject<DateFieldRef | undefined>;
}

declare function DateField(props: DateFieldProps): JSX.Element;

export default DateField;
