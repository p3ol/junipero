import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { classNames } from '@junipero/core';
import PropTypes from 'prop-types';

export declare interface DropdownGroupProps
  extends ComponentPropsWithoutRef<any> {
  children?: JSX.Element | ReactNode;
  className?: string;
  title?: ReactNode | JSX.Element;
}

const DropdownGroup = ({
  children,
  title,
  className,
}: DropdownGroupProps): JSX.Element => (
  <div className={classNames('dropdown-group', className)}>
    <div className="junipero extra group-title">{ title }</div>
    <div className="options">
      { children }
    </div>
  </div>
);

DropdownGroup.displayName = 'DropdownGroup';
DropdownGroup.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
  ]),
};

export default DropdownGroup;
