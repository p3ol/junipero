import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@poool/junipero-utils';

const Loader = forwardRef(({
  className,
  tag: Tag = 'div',
  active = false,
  type = 'dots',
  ...rest
}, ref) => (
  <Tag
    { ...rest }
    ref={ref}
    className={classNames(
      'junipero',
      'loader',
      type,
      { active },
      className,
    )}
  >
    { type === 'dots' && Array.from({ length: 3 }).map((_, i) => (
      <span className="dot" key={i} />
    )) }

    { type === 'bar' && (
      <span className="inner" />
    )}
  </Tag>
));

Loader.propTypes = {
  active: PropTypes.bool,
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.object,
    PropTypes.func,
  ]),
  type: PropTypes.oneOf(['dots', 'bar', 'spinner']),
};

export default Loader;
