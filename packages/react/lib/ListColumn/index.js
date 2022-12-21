import { forwardRef, useEffect, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

import { useList } from '../hooks';

const ListColumn = forwardRef(({
  id,
  children,
  ...rest
}, ref) => {
  const { registerColumn } = useList();

  useImperativeHandle(ref, () => ({
    id,
    isJunipero: true,
  }));

  useEffect(() => {
    if (!registerColumn) {
      console?.warn?.('ListColumn must be used inside a List component');

      return;
    }

    registerColumn({ id, title: children, ...rest });
  }, []);

  return null;
});

ListColumn.displayName = 'ListColumn';
ListColumn.propTypes = {
  id: PropTypes.string.isRequired,
};

export default ListColumn;