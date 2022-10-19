declare interface BadgeProps {
  className?: String;
  tag?: String | JSX.Element;
  [key: string]: any;
}

declare function Badge(props: BadgeProps): JSX.Element;

export default Badge;
