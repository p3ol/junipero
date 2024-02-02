import { classNames } from '@junipero/core';
import PropTypes from 'prop-types';
import { ComponentPropsWithoutRef, ReactNode } from 'react';

export declare interface DropdownGroupProps extends ComponentPropsWithoutRef<any> {
  children?: JSX.Element | ReactNode;
  className?: string;
  title?: ReactNode | JSX.Element;
}

const DropdownGroup = ({ children, title, className }: DropdownGroupProps) => (
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
