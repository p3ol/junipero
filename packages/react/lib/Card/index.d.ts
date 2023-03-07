import React, { ElementType, MutableRefObject } from 'react';

export declare type CardRef = {
  innerRef: MutableRefObject<any>;
  isJunipero: Boolean;
};
declare interface CardProps extends React.ComponentPropsWithRef<any> {
  className?: String;
  tag?: String | ElementType;
  ref?: MutableRefObject<CardRef | undefined>;
}

declare function Card(props: CardProps): JSX.Element;

export default Card;
