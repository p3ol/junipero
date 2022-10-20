declare interface DraggableProps extends React.ComponentPropsWithRef<any> {
  className?: String;
  children?: React.ReactNode;
  disabled?: Boolean;
  data?: any;
  dragImage?: any;
  dragImageOffset?: { x: number; y: number };
  onDrag?: (e: Event) => void;
  onBeforeDragStart?: (e: Event) => void;
  onDragStart?: (e: Event) => void;
  onDragEnd?: (e: Event) => void;
}

declare function Draggable(props: DraggableProps): JSX.Element;

export default Draggable;
