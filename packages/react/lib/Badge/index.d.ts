import { ReactNode, ElementType, MutableRefObject } from 'react';

export declare type BadgeRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

declare interface BadgeProps extends React.ComponentPropsWithRef<any> {
  children?: ReactNode | JSX.Element;
  className?: string;
  tag?: string | ElementType;
  ref?: MutableRefObject<BadgeRef | undefined>;
}

declare function Badge(props: BadgeProps): ReactNode | JSX.Element;

export default Badge;
