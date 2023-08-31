import { ComponentPropsWithRef, ElementType, MutableRefObject, ReactNode } from 'react';
import { ForwardedProps } from '../utils';
export declare type TagRef = {
    isJunipero: boolean;
    innerRef: MutableRefObject<any>;
};
export declare interface TagProps extends ComponentPropsWithRef<any> {
    children?: ReactNode | JSX.Element;
    className?: string;
    tag?: string | ElementType;
    onDelete?: () => void;
    ref?: MutableRefObject<TagRef | undefined>;
}
declare const Tag: ForwardedProps<TagProps, TagRef>;
export default Tag;
