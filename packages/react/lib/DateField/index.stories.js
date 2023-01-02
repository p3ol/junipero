import { action } from '@storybook/addon-actions';
import { slideInDownMenu } from '@junipero/transitions';

import FieldControl from '../FieldControl';
import Label from '../Label';
import Abstract from '../Abstract';
import DateField from './index';

export default { title: 'react/DateField' };

export const basic = () => (
  <DateField
    placeholder="Date of birth"
    onChange={action('change')}
    onToggle={action('toggle')}
  />
);

export const autoFocused = () => (
  <DateField autoFocus onChange={action('change')} />
);

export const withValue = () => (
  <DateField value={new Date(2019, 0, 1)} onChange={action('change')} />
);

export const disabled = () => (
  <DateField disabled value={new Date()} />
);

export const withValidation = () => (
  <FieldControl>
    <Label>Enter your birthdate</Label>
    <DateField
      onValidate={val => val?.getFullYear() === 2020}
      onChange={action('change')}
    />
    <Abstract>This is the date you were born.</Abstract>
  </FieldControl>
);

export const withMinAndMax = () => (
  <DateField
    value={new Date(2020, 6, 1)}
    min={new Date(2020, 0, 1)}
    max={new Date(2020, 11, 31)}
    onChange={action('change')}
  />
);

export const alwaysOpened = () => (
  <DateField
    opened={true}
    trigger="manual"
    placeholder="Date of birth"
    onChange={action('change')}
  />
);

export const animated = () => (
  <DateField animateMenu={slideInDownMenu} />
);

export const dateOnly = () => (
  <DateField time={false} onChange={action('change')} />
);
