import { ReactNode, ComponentPropsWithoutRef } from 'react';

declare interface LabelProps extends ComponentPropsWithoutRef<any> {
  className?: string;
}

declare function Label(props: LabelProps): ReactNode | JSX.Element;

export default Label;
