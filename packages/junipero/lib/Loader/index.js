import React from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@poool/junipero-utils';

const Loader = ({
  className,
  active = false,
  type = 'dots',
}) => (
  <div
    className={classNames(
      'junipero',
      'loader',
      type,
      {
        active,
      },
      className,
    )}
  >
    { type === 'dots' && Array.from({ length: 3 }).map((_, i) => (
      <span className="dot" key={i} />
    )) }

    { type === 'bar' && (
      <span className="inner" />
    )}
  </div>
);

Loader.propTypes = {
  active: PropTypes.bool,
  type: PropTypes.oneOf(['dots', 'bar', 'spinner']),
};

export default Loader;
