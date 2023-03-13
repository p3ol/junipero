import {
  ComponentPropsWithRef,
  ElementType,
  MutableRefObject,
  ReactNode,
} from 'react';

export declare type FieldAddonRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

declare interface FieldAddonProps extends ComponentPropsWithRef<any> {
  className?: string;
  children?: ReactNode | JSX.Element;
  tag?: string | ElementType;
  ref?: MutableRefObject<FieldAddonRef | undefined>;
}

declare function FieldAddon(props: FieldAddonProps): ReactNode | JSX.Element;

export default FieldAddon;
