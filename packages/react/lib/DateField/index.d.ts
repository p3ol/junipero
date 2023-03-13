import { ReactNode, MutableRefObject, ComponentPropsWithRef } from 'react';

import { FixedArray } from '../utils';

export declare type DateFieldRef = {
  dirty: boolean;
  focused: boolean;
  isJunipero: boolean;
  opened: boolean;
  valid: boolean;
  value: Date;
  blur(): void;
  focus(): void;
  reset(): void;
  innerRef: MutableRefObject<any>;
};

declare interface DateFieldProps extends ComponentPropsWithRef<any> {
  autoFocus?: boolean;
  className?: string;
  clearable?: boolean;
  disabled?: boolean;
  max?: Date;
  min?: Date;
  monthNames?: FixedArray<string, 12>;
  opened?: boolean;
  placeholder?: string;
  required?: boolean;
  time?: boolean;
  timePlaceholder?: string;
  trigger?: 'click' | 'hover' | 'manual';
  valid?: boolean;
  value?: Date;
  weekDaysName?: FixedArray<string, 7>;
  animateMenu?(
    menu: ReactNode | JSX.Element,
    opts: { opened: boolean }
  ): ReactNode | JSX.Element;
  onBlur?(e: Event): void;
  onChange?(props: { value: Date; valid: boolean }): void;
  onFocus?(e: Event): void;
  onToggle?(props: { opened: boolean }): void;
  onValidate?(
    value: Date,
    options: { required?: boolean; dirty?: boolean }
  ): boolean;
  parseTime?(time: string): FixedArray<number, 3>;
  parseTitle?(value: Date): string;
  parseValue?(value: Date, options: { required?: boolean }): Date;
  ref?: MutableRefObject<DateFieldRef | undefined>;
}

declare function DateField(props: DateFieldProps): ReactNode | JSX.Element;

export default DateField;
