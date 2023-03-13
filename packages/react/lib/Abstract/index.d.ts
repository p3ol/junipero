import { ReactNode, ComponentPropsWithoutRef } from 'react';

declare interface AbstractProps extends ComponentPropsWithoutRef<any> {
  className?: string;
  children?: ReactNode | JSX.Element;
}

declare function Abstract(props: AbstractProps): ReactNode | JSX.Element;

export default Abstract;
