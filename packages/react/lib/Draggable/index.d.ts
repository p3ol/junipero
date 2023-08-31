import { DragEvent, ComponentPropsWithRef } from 'react';
declare interface DraggableProps extends ComponentPropsWithRef<any> {
    children?: JSX.Element;
    className?: string;
    data?: any;
    disabled?: boolean;
    dragImage?: Element;
    dragImageOffset?: {
        x: number;
        y: number;
    };
    onDrag?(e: Event): void;
    onBeforeDragStart?(e: DragEvent): void;
    onDragStart?(e: DragEvent, target?: DOMRect): void;
    onDragEnd?(e: DragEvent): void;
}
declare const Draggable: import("react").ForwardRefExoticComponent<Omit<DraggableProps, "ref"> & import("react").RefAttributes<any>>;
export default Draggable;
