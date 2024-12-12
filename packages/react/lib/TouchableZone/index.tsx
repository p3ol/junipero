import type {
  ComponentPropsWithoutRef,
  ElementType,
  Ref,
} from 'react';
import { classNames } from '@junipero/core';

export declare type TouchableZoneRef = HTMLAnchorElement;

export declare interface TouchableZoneProps
  extends ComponentPropsWithoutRef<'a'> {
  ref?: Ref<TouchableZoneRef>;
  tag?: ElementType;
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
