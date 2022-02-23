import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@poool/junipero-utils';

const Tab = forwardRef(({
  className,
  tag: Tag = 'div',
  title: _,
  ...rest
}, ref) => (
  <Tag
    { ...rest }
    className={classNames(
      'junipero',
      'tab',
      className,
    )}
    ref={ref}
  />
));

Tab.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.object,
    PropTypes.func,
  ]),
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
  ]),
};

export default Tab;
