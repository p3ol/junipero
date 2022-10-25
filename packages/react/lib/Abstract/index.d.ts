declare interface AbstractProps extends React.ComponentPropsWithoutRef<any> {
  className?: String;
}

declare function Abstract(props: AbstractProps): JSX.Element;

export default Abstract;
