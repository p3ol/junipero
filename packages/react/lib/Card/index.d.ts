import { ReactNode, ElementType, MutableRefObject } from 'react';

export declare type CardRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

declare interface CardProps extends React.ComponentPropsWithRef<any> {
  children?: ReactNode | JSX.Element;
  className?: string;
  tag?: string | ElementType;
  ref?: MutableRefObject<CardRef | undefined>;
}

declare function Card(props: CardProps): ReactNode | JSX.Element;

export default Card;
