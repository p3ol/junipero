import React, {
  ComponentPropsWithRef,
  ElementType,
  MutableRefObject,
} from "react";

export declare type TagRef = {
  isJunipero: Boolean;
  innerRef: MutableRefObject<any>;
};
declare interface TagProps extends ComponentPropsWithRef<any> {
  className?: String;
  children?: React.ReactNode;
  onDelete: () => void;
  tag: String | ElementType;
  ref?: MutableRefObject<TagRef | undefined>;
}

declare function Tag(props: TagProps): JSX.Element;

export default Tag;
