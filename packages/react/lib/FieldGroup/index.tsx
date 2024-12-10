import {
  type ElementType,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames } from '@junipero/core';

import type {
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';

export declare interface FieldGroupRef extends JuniperoRef {}

export declare interface FieldGroupProps
  extends SpecialComponentPropsWithRef<any, FieldGroupRef> {
  tag?: ElementType;
}

const FieldGroup = ({
  ref,
  className,
  tag: Tag = 'div',
  ...rest
}: FieldGroupProps) => {
  const innerRef = useRef<HTMLElement>(null);

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
};

FieldGroup.displayName = 'FieldGroup';

export default FieldGroup;
