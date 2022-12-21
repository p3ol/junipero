import { forwardRef, useImperativeHandle, useRef } from 'react';

const ListCell = forwardRef(({
  ...rest
}, ref) => {
  const innerRef = useRef();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  return (
    <td { ...rest } ref={innerRef} />
  );
});

ListCell.displayName = 'ListCell';

export default ListCell;
