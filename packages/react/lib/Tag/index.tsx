import { classNames } from '@junipero/core';
import PropTypes from 'prop-types';
import { ComponentPropsWithRef, ElementType, MutableRefObject, ReactNode, forwardRef, useImperativeHandle, useRef } from 'react';

import { Remove } from '../icons';
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
const Tag = forwardRef(({
  className,
  children,
  onDelete,
  tag: Comp = 'span',
  ...rest
}: TagProps, ref) => {
  const innerRef = useRef();

  useImperativeHandle(ref, () => ({
    isJunipero: true,
    innerRef,
  }));

  const onDelete_ = e => {
    e.stopPropagation();
    onDelete?.();
  };

  const content = onDelete ? <span>{ children }</span> : children;

  return (
    <Comp
      { ...rest }
      ref={innerRef}
      className={classNames('junipero', 'tag', className)}
    >
      { content }
      { onDelete && (
        <Remove onClick={onDelete_} />
      ) }
    </Comp>
  );
}) as ForwardedProps<TagProps, TagRef>;

Tag.displayName = 'Tag';
Tag.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.any, //TODO fix me
  ]),
  onDelete: PropTypes.func,
};

export default Tag;
