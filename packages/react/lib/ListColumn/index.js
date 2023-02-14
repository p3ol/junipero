import { forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

const ListColumn = forwardRef(({
  id,
}, ref) => {
  useImperativeHandle(ref, () => ({
    id,
    isJunipero: true,
  }));

  return null;
});

ListColumn.displayName = 'ListColumn';
ListColumn.propTypes = {
  id: PropTypes.string.isRequired,
};

export default ListColumn;
