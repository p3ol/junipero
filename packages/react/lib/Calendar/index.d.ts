import { ComponentPropsWithRef, MutableRefObject } from 'react';
import { FixedArray } from '../utils';
export declare type CalendarRef = {
    value: Date;
    isJunipero: boolean;
    innerRef: MutableRefObject<any>;
};
declare interface CalendarProps extends ComponentPropsWithRef<any> {
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
declare const Calendar: import("react").ForwardRefExoticComponent<Omit<CalendarProps, "ref"> & import("react").RefAttributes<CalendarRef>>;
export default Calendar;
