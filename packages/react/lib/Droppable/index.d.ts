import { ComponentPropsWithoutRef, ReactNode } from 'react';

declare interface DroppableProps extends ComponentPropsWithoutRef<any> {
  className?: string;
  children?: ReactNode | JSX.Element;
  disabled?: boolean;
  onDrop?(data: any, direction: string, e: Event): void;
  onDragOver?(e: Event, direction: string): void;
  onDragLeave?(e: Event): void;
}

declare function Droppable(props: DroppableProps):
  ReactNode | JSX.Element;

export default Droppable;
