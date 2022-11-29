
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@junipero/core';

const TouchableZone = forwardRef(({
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
    <span className="content">{ children }</span>
  </Tag>
));

TouchableZone.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.object,
    PropTypes.func,
  ]),
};

export default TouchableZone;
