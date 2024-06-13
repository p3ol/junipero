import {
  type ReactNode,
  type MutableRefObject,
  type ElementType,
  forwardRef,
  useRef,
  useImperativeHandle,
} from 'react';
import { classNames } from '@junipero/core';

import type {
  ForwardedProps,
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';

export declare interface TabObject {
  title: ReactNode | JSX.Element;
  content: ReactNode | JSX.Element;
  props?: { disabled?: boolean };
}

export declare interface TabRef extends JuniperoRef {
  innerRef: MutableRefObject<HTMLElement>;
}

export declare interface TabProps extends SpecialComponentPropsWithRef {
  tag?: string | ElementType;
  title?: JSX.Element | ReactNode;
}

const Tab = forwardRef<TabRef, TabProps>(({
  className,
  tag: Tag = 'div',
  title: _,
  ...rest
}, ref) => {
  const innerRef = useRef<HTMLElement>();

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
}) as ForwardedProps<TabRef, TabProps>;

Tab.displayName = 'Tab';

export default Tab;
