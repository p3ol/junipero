import {
  ReactNode,
  ComponentPropsWithRef,
  ElementType,
  MutableRefObject,
} from 'react';

export declare type FieldGroupRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

declare interface FieldGroupProps extends ComponentPropsWithRef<any> {
  className?: string;
  children?: ReactNode | JSX.Element;
  tag?: string | ElementType;
  ref?: MutableRefObject<FieldGroupRef | undefined>;
}

declare function FieldGroup(props: FieldGroupProps): ReactNode | JSX.Element;

export default FieldGroup;
