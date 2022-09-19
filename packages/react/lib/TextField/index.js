import { classNames } from '@junipero/core';
import PropTypes from 'prop-types';

const TextField = ({ className, rows, ...rest }) => {
  const Tag = rows > 1 ? 'textarea' : 'input';

  return (
    <Tag
      className={classNames('junipero', 'text-field', className)}
      rows={rows}
      {...rest}
    />
  );
};

TextField.displayName = 'TextField';
TextField.propTypes = {
  className: PropTypes.string,
  rows: PropTypes.number,
};

export default TextField;
