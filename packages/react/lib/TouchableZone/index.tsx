import {
  type ElementType,
  type MutableRefObject,
  forwardRef,
} from 'react';
import { classNames } from '@junipero/core';

import type { ForwardedProps, SpecialComponentPropsWithRef } from '../types';

export declare interface TouchableZoneRef
  extends MutableRefObject<HTMLElement> {}

export declare interface TouchableZoneProps
  extends SpecialComponentPropsWithRef {
  tag?: string | ElementType;
}

const TouchableZone = forwardRef<TouchableZoneRef, TouchableZoneProps>(({
  className,
  children,
  tag: Tag = 'a',
  ...rest
}, ref) => (
  <Tag
    { ...rest }
    ref={ref}
    className={classNames('junipero touchable-zone', className)}
  >
    { children }
  </Tag>
)) as ForwardedProps<TouchableZoneRef, TouchableZoneProps>;

TouchableZone.displayName = 'TouchableZone';

export default TouchableZone;
