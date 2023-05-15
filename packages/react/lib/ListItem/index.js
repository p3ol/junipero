import { forwardRef, useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';

const ListItem = forwardRef(({
  item,
  children,
  ...rest
}, ref) => {
  const innerRef = useRef();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  return (
    <tr { ...rest } ref={innerRef}>
      { item ? item.map((it, i) => (
        <td key={i}>{ it }</td>
      )) : children }
    </tr>
  );
});

ListItem.displayName = 'ListItem';
ListItem.propTypes = {
  item: PropTypes.array,
};

export default ListItem;
