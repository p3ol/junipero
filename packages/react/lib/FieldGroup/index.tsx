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

export declare type FieldGroupRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

export declare interface FieldGroupProps extends ComponentPropsWithRef<any> {
  className?: string;
  children?: ReactNode | JSX.Element | string;
  tag?: string | ElementType;
  ref?: MutableRefObject<FieldGroupRef | undefined>;
}

const FieldGroup = forwardRef(({
  tag: Tag = 'div',
  className,
  ...rest
}: FieldGroupProps, ref) => {
  const innerRef = useRef();

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
}) as ForwardedProps<FieldGroupProps, FieldGroupRef>;

FieldGroup.displayName = 'FieldGroup';
FieldGroup.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.elementType,
  ]),
};

export default FieldGroup;
