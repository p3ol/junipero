import { ElementType, MutableRefObject } from 'react';

export declare type BadgeRef = {
  isJunipero: Boolean;
  innerRef: MutableRefObject<any>;
};
declare interface BadgeProps extends React.ComponentPropsWithRef<any> {
  className?: String;
  tag?: String | ElementType;
  ref?: MutableRefObject<BadgeRef | undefined>;
}

declare function Badge(props: BadgeProps): JSX.Element;

export default Badge;
