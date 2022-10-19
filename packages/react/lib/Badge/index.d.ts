import { ElementType } from "react";

declare interface BadgeProps extends React.ComponentPropsWithRef<any> {
  className?: String;
  tag?: String | ElementType;
}

declare function Badge(props: BadgeProps): React.ReactNode;

export default Badge;
