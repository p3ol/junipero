import { ComponentPropsWithoutRef, ReactNode } from 'react';

export declare interface DroppableProps extends ComponentPropsWithoutRef<any> {
  className?: string;
  children?: ReactNode | JSX.Element;
  disabled?: boolean;
  onDrop?(data: any, direction: 'before' | 'after', e: Event): void;
  onDragOver?(e: Event, direction: 'before' | 'after'): void;
  onDragLeave?(e: Event): void;
}

declare function Droppable(props: DroppableProps):
  ReactNode | JSX.Element;

export default Droppable;
