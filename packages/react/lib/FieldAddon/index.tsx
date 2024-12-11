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
import { useFieldControl } from '../hooks';

export declare interface FieldAddonRef extends JuniperoRef {}

export declare interface FieldAddonProps
  extends SpecialComponentPropsWithRef<any, FieldAddonRef> {
  tag?: ElementType;
}

const FieldAddon = ({
  ref,
  tag: Tag = 'div',
  className,
  ...rest
}: FieldAddonProps) => {
  const innerRef = useRef<HTMLElement>(null);
  const { focused } = useFieldControl();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  return (
    <Tag
      { ...rest }
      className={classNames(
        'junipero field-addon',
        { focused },
        className,
      )}
      ref={innerRef}
    />
  );
};

FieldAddon.displayName = 'FieldAddon';

export default FieldAddon;
