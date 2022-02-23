import { forwardRef } from 'react';
import { classNames } from '@poool/junipero-utils';

const Badge = forwardRef(({ className, ...rest }, ref) => (
  <span
    { ...rest }
    ref={ref}
    className={classNames('junipero', 'badge', className)}
  />
));

export default Badge;
