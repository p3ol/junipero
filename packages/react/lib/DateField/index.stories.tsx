import { action } from 'storybook/actions';
import { slideInDownMenu } from '@junipero/transitions';

import FieldControl from '../FieldControl';
import Label from '../Label';
import Abstract from '../Abstract';
import DateField from './index';

export default { title: 'react/DateField' };

export const Basic = () => (
  <DateField
    placeholder="Date of birth"
    onChange={action('change')}
    onToggle={action('toggle')}
  />
);

export const AutoFocused = () => (
  <DateField autoFocus onChange={action('change')} />
);

export const WithValue = () => (
  <DateField
    value={new Date(2019, 0, 1, 8, 22, 12)}
    onChange={action('change')}
  />
);

export const Disabled = () => (
  <DateField disabled value={new Date()} />
);

export const WithValidation = () => (
  <FieldControl>
    <Label>Enter your birthdate</Label>
    <DateField
      onValidate={val => val?.getFullYear() === 2020}
      onChange={action('change')}
    />
    <Abstract>This is the date you were born.</Abstract>
  </FieldControl>
);

export const WithMinAndMax = () => (
  <DateField
    value={new Date(2020, 6, 1)}
    min={new Date(2020, 0, 1)}
    max={new Date(2020, 11, 31)}
    onChange={action('change')}
  />
);

export const WithoutTime = () => (
  <DateField
    value={new Date(2020, 6, 1, 8, 22, 12)}
    time={false}
    onChange={action('change')}
  />
);

export const AlwaysOpened = () => (
  <DateField
    opened={true}
    trigger="manual"
    placeholder="Date of birth"
    onChange={action('change')}
  />
);

export const Animated = () => (
  <DateField animateMenu={slideInDownMenu} />
);

export const DateOnly = () => (
  <DateField time={false} onChange={action('change')} />
);
