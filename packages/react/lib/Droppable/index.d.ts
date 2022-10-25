import React, { MutableRefObject } from "react";

export declare type DroppableRef = {
  innerRef: MutableRefObject<any>;
  isJunipero: Boolean;
};

declare interface DroppableProps extends React.ComponentPropsWithRef<any> {
  children?: React.ReactNode;
  ref?: MutableRefObject<DroppableRef | undefined>;
}

declare function Droppable(props: DroppableProps): JSX.Element;

export default Droppable;
