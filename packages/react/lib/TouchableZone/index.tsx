import { ComponentPropsWithRef, ElementType, ReactNode, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@junipero/core';

import { ForwardedProps } from '../utils';

declare interface TouchableZoneProps extends ComponentPropsWithRef<any> {
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
  tag: PropTypes.any, //TODO fixme
};

export default TouchableZone;
