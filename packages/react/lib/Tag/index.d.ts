import {
  ReactNode,
  ComponentPropsWithRef,
  ElementType,
  MutableRefObject,
} from 'react';

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

declare function Tag(props: TagProps): ReactNode | JSX.Element;

export default Tag;
