import {
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
  forwardRef,
} from 'react';
import { type ForwardedProps, classNames } from '@junipero/core';
import PropTypes from 'prop-types';

export declare interface TouchableZoneProps extends ComponentPropsWithRef<any> {
  children?: ReactNode | JSX.Element;
  className?: string
  tag?: string | ElementType;
}

const TouchableZone = forwardRef(({
  className,
  children,
  tag: Tag = 'a',
  ...rest
}: TouchableZoneProps, ref) => (
  <Tag
    { ...rest }
    ref={ref}
    className={classNames('junipero touchable-zone', className)}
  >
    { children }
  </Tag>
)) as ForwardedProps<TouchableZoneProps, any>;

TouchableZone.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.elementType,
  ]),
};

export default TouchableZone;
