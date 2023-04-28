import { ComponentPropsWithRef, ReactNode } from 'react';

declare interface DraggableProps extends ComponentPropsWithRef<any> {
  children?: ReactNode | JSX.Element;
  className?: string;
  data?: any;
  disabled?: boolean;
  dragImage?: Element;
  dragImageOffset?: { x: number; y: number };
  onDrag?(e: Event): void;
  onBeforeDragStart?(e: Event): void;
  onDragStart?(e: Event): void;
  onDragEnd?(e: Event): void;
}

declare function Draggable(props: DraggableProps): ReactNode | JSX.Element;

export default Draggable;
