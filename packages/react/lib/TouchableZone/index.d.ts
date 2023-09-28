import { ReactNode, ComponentPropsWithRef, ElementType } from 'react';

export declare interface TouchableZoneProps extends ComponentPropsWithRef<any> {
  children?: ReactNode | JSX.Element;
  className?: string
  tag?: string | ElementType;
}

declare function TouchableZone(props: TouchableZoneProps):
  ReactNode | JSX.Element;

export default TouchableZone;
