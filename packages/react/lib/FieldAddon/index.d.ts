import React, {
  ComponentPropsWithRef,
  ElementType,
  MutableRefObject,
} from 'react';

export declare type FieldAddonRef = {
  isJunipero: Boolean;
  innerRef: MutableRefObject<any>;
};
declare interface FieldAddonProps extends ComponentPropsWithRef<any> {
  className?: String;
  children?: React.ReactNode;
  tag?: String | ElementType;
  ref?: MutableRefObject<FieldAddonRef | undefined>;
}

declare function FieldAddon(props: FieldAddonProps): JSX.Element;

export default FieldAddon;
