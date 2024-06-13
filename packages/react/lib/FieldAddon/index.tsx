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
import { useFieldControl } from '../hooks';

export declare interface FieldAddonRef extends JuniperoRef {
  innerRef: MutableRefObject<HTMLElement>;
}

export declare interface FieldAddonProps extends SpecialComponentPropsWithRef {
  tag?: string | ElementType;
}

const FieldAddon = forwardRef<FieldAddonRef, FieldAddonProps>(({
  tag: Tag = 'div',
  className,
  ...rest
}, ref) => {
  const innerRef = useRef<HTMLElement>();
  const { focused } = useFieldControl();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  return (
    <Tag
      className={classNames(
        'junipero field-addon',
        { focused },
        className,
      )}
      ref={innerRef}
      { ...rest }
    />
  );
}) as ForwardedProps<FieldAddonRef, FieldAddonProps>;

FieldAddon.displayName = 'FieldAddon';

export default FieldAddon;
