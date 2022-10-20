declare interface DropdownItemProps
  extends React.ComponentsPropsWithoutRef<any> {
  className?: String;
}

declare function DropdownItem(props: DropdownItemProps): JSX.Element;

export default DropdownItem;
