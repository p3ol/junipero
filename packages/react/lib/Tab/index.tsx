import {
  type ReactNode,
  type MutableRefObject,
  type ComponentPropsWithRef,
  type ElementType,
  forwardRef,
  useRef,
  useImperativeHandle,
} from 'react';
import { type ForwardedProps, classNames } from '@junipero/core';
import PropTypes from 'prop-types';

export declare interface TabObject {
  title: ReactNode | JSX.Element;
  content: ReactNode | JSX.Element;
  props?: { disabled?: boolean },
}

export declare type TabRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

export declare interface TabProps extends ComponentPropsWithRef<any> {
  className?: string;
  tag?: string | ElementType;
  title?: JSX.Element | ReactNode;
  ref?: MutableRefObject<TabRef | undefined>;
}

const Tab = forwardRef(({
  className,
  tag: Tag = 'div',
  title: _,
  ...rest
}: TabProps, ref) => {
  const innerRef = useRef();

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
}) as ForwardedProps<TabProps, TabRef>;

Tab.displayName = 'Tab';
Tab.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.any, //TODO find a proper type
  ]),
  title: PropTypes.oneOfType([
    PropTypes.string,
  ]),
};

export default Tab;
