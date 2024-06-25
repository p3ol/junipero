import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { classNames } from '@junipero/core';

export declare interface DropdownGroupProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  title?: ReactNode | JSX.Element;
}

const DropdownGroup = ({
  children,
  title,
  className,
  ...rest
}: DropdownGroupProps) => (
  <div { ...rest } className={classNames('dropdown-group', className)}>
    <div className="junipero extra group-title">{ title }</div>
    <div className="options">
      { children }
    </div>
  </div>
);

DropdownGroup.displayName = 'DropdownGroup';

export default DropdownGroup;
