import {
  type ElementType,
  type MutableRefObject,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames } from '@junipero/core';

import type {
  ForwardedProps,
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';

export declare interface FieldGroupRef extends JuniperoRef {
  innerRef: MutableRefObject<HTMLElement>;
}

export declare interface FieldGroupProps extends SpecialComponentPropsWithRef {
  tag?: string | ElementType;
}

const FieldGroup = forwardRef<FieldGroupRef, FieldGroupProps>(({
  tag: Tag = 'div',
  className,
  ...rest
}, ref) => {
  const innerRef = useRef<HTMLElement>();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  return (
    <Tag
      className={classNames('junipero field-group', className)}
      ref={innerRef}
      { ...rest }
    />
  );
}) as ForwardedProps<FieldGroupRef, FieldGroupProps>;

FieldGroup.displayName = 'FieldGroup';

export default FieldGroup;
