import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@poool/junipero-utils';

const BreadCrumb = forwardRef(({
  className,
  children,
  items,
  itemTag: Item = 'span',
  animateItem = item => item,
  ...rest
}, ref) => (
  <div
    { ...rest }
    ref={ref}
    className={classNames(
      'junipero',
      'breadcrumb',
      className,
    )}
  >
    { items?.map((item, index) =>
      animateItem((
        <Item
          className="item"
          key={index}
        >
          { item }
        </Item>
      ), index)
    ) }
    { children }
  </div>
));

BreadCrumb.propTypes = {
  items: PropTypes.array,
  itemTag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.object,
    PropTypes.func,
  ]),
  animateItem: PropTypes.func,
};

export default BreadCrumb;
