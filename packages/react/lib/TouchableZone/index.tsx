import type {
  ComponentPropsWithoutRef,
  ElementType,
  RefObject,
} from 'react';
import { classNames } from '@junipero/core';

export declare type TouchableZoneRef = HTMLAnchorElement;

export declare interface TouchableZoneProps
  extends ComponentPropsWithoutRef<'a'> {
  ref?: RefObject<TouchableZoneRef>;
  tag?: string | ElementType;
}

const TouchableZone = ({
  ref,
  className,
  children,
  tag: Tag = 'a',
  ...rest
}: TouchableZoneProps) => (
  <Tag
    { ...rest }
    ref={ref}
    className={classNames('junipero touchable-zone', className)}
  >
    { children }
  </Tag>
);

TouchableZone.displayName = 'TouchableZone';

export default TouchableZone;
