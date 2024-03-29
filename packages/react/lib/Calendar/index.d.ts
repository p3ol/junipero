import { ReactNode, MutableRefObject, ComponentPropsWithRef } from 'react';

import { FixedArray } from '../utils';

export declare type CalendarRef = {
  value: Date;
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

export declare interface CalendarProps extends ComponentPropsWithRef<any> {
  active?: Date;
  className?: string;
  disabled?: boolean;
  max?: Date;
  min?: Date;
  monthNames?: FixedArray<string, 12>;
  weekDaysName?: FixedArray<string, 7>;
  onSelect?(value: Date): void;
  ref?: MutableRefObject<CalendarRef | undefined>;
}

declare function Calendar(props: CalendarProps): ReactNode | JSX.Element;

export default Calendar;
