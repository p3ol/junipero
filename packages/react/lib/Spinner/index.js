import { classNames } from '@junipero/core';

const Spinner = ({ className, ...rest }) => (
  <div className={classNames('junipero spinner', className)} {...rest} />
);

Spinner.displayName = 'Spinner';

export default Spinner;
