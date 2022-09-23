import { forwardRef, useImperativeHandle, useRef } from 'react';
import { classNames } from '@junipero/core';
import PropTypes from 'prop-types';

const Tag = forwardRef(({
  className,
  children,
  onDelete,
  tag: Comp = 'span',
  ...rest
}, ref) => {
  const innerRef = useRef();

  useImperativeHandle(ref, () => ({
    isJunipero: true,
    innerRef,
  }));

  const onDelete_ = e => {
    e.stopPropagation();
    onDelete?.();
  };

  const content = onDelete ? <span>{ children }</span> : children;

  return (
    <Comp
      { ...rest }
      ref={innerRef}
      className={classNames('junipero', 'tag', className)}
    >
      { content }
      { onDelete && (
        <a className="delete" onClick={onDelete_} />
      ) }
    </Comp>
  );
});

Tag.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.object,
    PropTypes.func,
  ]),
  onDelete: PropTypes.func,
};

export default Tag;
