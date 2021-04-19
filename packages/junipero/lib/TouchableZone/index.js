import React from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@poool/junipero-utils';

const TouchableZone = ({
  className,
  children,
  tag: Tag = 'a',
  ...res
}) => (
  <Tag
    { ...res }
    className={classNames('junipero touchable-zone', className)}
  >
    <span className="content">{ children }</span>
  </Tag>
);

TouchableZone.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
};

export default TouchableZone;
