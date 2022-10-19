declare interface AbstractProps extends React.ComponentPropsWithoutRef<any> {
  className?: String;
}

declare function Abstract(props: AbstractProps): React.ReactNode;

export default Abstract;
