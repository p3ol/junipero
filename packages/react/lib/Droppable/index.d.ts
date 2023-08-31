import { ComponentPropsWithoutRef } from 'react';
import { ForwardedProps } from '../utils';
declare interface DroppableProps extends ComponentPropsWithoutRef<any> {
    className?: string;
    children?: JSX.Element;
    disabled?: boolean;
    onDrop?(data: any, direction: 'before' | 'after', e: Event): void;
    onDragOver?(e: Event, direction: 'before' | 'after'): void;
    onDragLeave?(e: Event): void;
}
declare const Droppable: ForwardedProps<DroppableProps, any>;
export default Droppable;
