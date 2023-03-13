import { ReactNode, MutableRefObject } from 'react';

import { FixedArray } from '../utils';

export declare type CalendarRef = {
  value: Date;
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

declare interface CalendarProps extends React.ComponentPropsWithRef<any> {
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
