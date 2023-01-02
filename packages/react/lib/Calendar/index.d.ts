import { MutableRefObject } from 'react';

import { FixedArray } from '../utils';

export declare type CalendarRef = {
  innerRef: MutableRefObject<any>;
  value: Date;
  isJunipero: Boolean;
};

declare interface CalendarProps extends React.ComponentPropsWithRef<any> {
  className?: String;
  min?: Date;
  max?: Date;
  active?: Date;
  disabled?: Boolean;
  monthNames?: FixedArray<String, 12>;
  weekDaysName?: FixedArray<String, 7>;
  onSelect?: (value: Date) => void;
  ref?: MutableRefObject<CalendarRef | undefined>;
}

declare function Calendar(props: CalendarProps): JSX.Element;

export default Calendar;
