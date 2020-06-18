import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

import { classNames } from '../utils';

const BreadCrumb = forwardRef(({
  className,
  items = [],
  itemTag: Item = 'span',
  animateItem = item => item,
  ...rest
}, ref) => {
  const innerRef = useRef();

  useImperativeHandle(ref, () => ({
    innerRef,
  }));

  return (
    <div
      { ...rest }
      ref={innerRef}
      className={classNames(
        'junipero',
        'breadcrumb',
        className,
      )}
    >
      { items.map((item, index) =>
        animateItem(<Item className="item" key={index}>{item}</Item>, index)
      ) }
    </div>
  );
});

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
