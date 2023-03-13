import { ReactNode } from 'react';

declare interface AbstractProps extends React.ComponentPropsWithoutRef<any> {
  className?: string;
  children?: ReactNode | JSX.Element;
}

declare function Abstract(props: AbstractProps): ReactNode | JSX.Element;

export default Abstract;
