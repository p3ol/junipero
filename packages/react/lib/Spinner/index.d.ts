import { ReactNode, ComponentPropsWithoutRef } from 'react';

declare interface SpinnerProps extends ComponentPropsWithoutRef<any> {
  className?: string;
}

declare function Spinner(props: SpinnerProps): ReactNode | JSX.Element;

export default Spinner;
