declare interface DropdownGroupProps
  extends React.ComponentsPropsWithoutRef<any> {
  children?: React.ReactNode;
  tile?: String;
  className?: String;
}

declare function DropdownGroup(props: DropdownGroupProps): JSX.Element;

export default DropdownGroup;
