declare interface AbstractProps {
  className?: String;
  [key: string]: any;
}

declare function Abstract(props: AbstractProps): JSX.Element;

export default Abstract;
