import {
  type ReactNode,
  type ElementType,
  useRef,
  useImperativeHandle,
} from 'react';
import { classNames } from '@junipero/core';

import type {
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';

export declare interface TabObject {
  title: ReactNode;
  content: ReactNode;
  props?: { disabled?: boolean };
}

export declare interface TabRef extends JuniperoRef {}

export declare interface TabProps
  extends SpecialComponentPropsWithRef<any, TabRef> {
  tag?: ElementType;
  title?: ReactNode;
}

const Tab = ({
  ref,
  className,
  title: _,
  tag: Tag = 'div',
  ...rest
}: TabProps) => {
  const innerRef = useRef<HTMLElement>(null);

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  return (
    <Tag
      { ...rest }
      className={classNames(
        'tab',
        className,
      )}
      ref={innerRef}
    />
  );
};

Tab.displayName = 'Tab';

export default Tab;
