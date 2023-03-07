import React, {
  ComponentPropsWithRef,
  ElementType,
  MutableRefObject,
} from 'react';

export declare type FieldGroupRef = {
  isJunipero: Boolean;
  innerRef: MutableRefObject<any>;
};
declare interface FieldGroupProps extends ComponentPropsWithRef<any> {
  className?: String;
  children?: React.ReactNode;
  tag?: String | ElementType;
  ref?: MutableRefObject<FieldGroupRef | undefined>;
}

declare function FieldGroup(props: FieldGroupProps): JSX.Element;

export default FieldGroup;
