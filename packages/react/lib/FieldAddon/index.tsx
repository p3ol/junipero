import {
  type ComponentPropsWithRef,
  type ElementType,
  type MutableRefObject,
  type ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { type ForwardedProps, classNames } from '@junipero/core';
import PropTypes from 'prop-types';

import { useFieldControl } from '../hooks';

export declare type FieldAddonRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

export declare interface FieldAddonProps extends ComponentPropsWithRef<any> {
  className?: string;
  children?: ReactNode | JSX.Element;
  tag?: (string | ElementType);
  ref?: MutableRefObject<FieldAddonRef | undefined>;
}

const FieldAddon = forwardRef(({
  tag: Tag = 'div',
  className,
  ...rest
}: FieldAddonProps, ref) => {
  const innerRef = useRef();
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
}) as ForwardedProps<FieldAddonProps, FieldAddonRef>;

FieldAddon.displayName = 'FieldAddon';
FieldAddon.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.elementType,
  ]),
};

export default FieldAddon;
