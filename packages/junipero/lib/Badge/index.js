import React from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@poool/junipero-utils';

const Badge = ({
  className,
  value,
}) => {

  return (
    <div
      className={classNames(
        'junipero',
        'badge',
        className,
      )}>
      <span>
        { value }
      </span>
    </div>
  );
};

export default Badge;

Badge.propTypes = {
  value: PropTypes.string,
};
