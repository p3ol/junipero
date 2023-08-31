import { ComponentPropsWithRef, ElementType, ReactNode } from 'react';
import { ForwardedProps } from '../utils';
declare interface TouchableZoneProps extends ComponentPropsWithRef<any> {
    children?: ReactNode | JSX.Element;
    className?: string;
    tag?: string | ElementType;
}
declare const TouchableZone: ForwardedProps<TouchableZoneProps, any>;
export default TouchableZone;
