import React, { MutableRefObject } from "react";

export declare type CardRef = {
  innerRef: MutableRefObject<any>;
  isJunipero: Boolean;
};
declare interface CardProps extends React.ComponentPropsWithRef {
  className?: String;
  tag?: String | ElemenType;
  ref?: MutableRefObject<CardRef | undefined>;
}

declare function Card(props: CardProps): JSX.Element;

export default Card;
