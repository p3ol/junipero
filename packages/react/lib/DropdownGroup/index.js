import { classNames } from '@junipero/core';
import PropTypes from 'prop-types';

const DropdownGroup = ({ children, title, className }) => (
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
