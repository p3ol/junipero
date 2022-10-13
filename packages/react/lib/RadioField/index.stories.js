import { cloneDeep } from '@junipero/core';
import { action } from '@storybook/addon-actions';

import RadioField from '.';
import Abstract from '../Abstract';
import FieldControl from '../FieldControl';
import Label from '../Label';

export default { title: 'react/RadioField' };
const basicOptions = [
  { title: 'Apple', value: 'Apple' },
  { title: 'Pear', value: 'Pear' },
  { title: 'Orange', value: 'Orange' },
];

const basicOptionsOneDisabled = [
  { title: 'Apple', value: 'Apple' },
  { title: 'Pear', value: 'Pear' },
  { title: 'Orange', value: 'Orange', disabled: true },
];

const withDescriptions = [
  { title: 'Apple', value: 'Apple', description: 'This is a description' },
  { title: 'Pear', value: 'Pear', description: 'This is a description' },
  { title: 'Orange', value: 'Orange', description: 'This is a description' },
];
export const basic = () => (
  <RadioField options={basicOptions} onChange={action('change')} />
);

export const withDescription = () => (
  <RadioField options={[1, 2, 3, 4, 5]} onChange={action('change')} />
);

export const withPresetValue = () => (
  <RadioField
    options={withDescriptions}
    value="Orange"
    onChange={action('change')}
  />
);

export const disabled = () => (
  <RadioField
    options={withDescriptions}
    disabled={true}
    onChange={action('change')}
  />
);

export const disabledWithPresetValue = () => (
  <RadioField
    options={withDescriptions}
    value="Pear"
    disabled={true}
    onChange={action('change')}
  />
);

export const withOneDisabled = () => (
  <RadioField
    options={basicOptionsOneDisabled}
    onChange={action('change')}
  />
);

export const withCustomValidation = () => {
  const withOneProhibed = cloneDeep(withDescriptions);
  withOneProhibed[2].description = 'You should not choose this fruit';

  return (
    <RadioField
      options={withOneProhibed}
      onValidate={
        (value, { dirty }) => value !== withOneProhibed[2].value || !dirty
      }
      onChange={action('change')}
    />
  );
};

export const withLabelAndAbstract = () => {
  const withOneProhibed = cloneDeep(withDescriptions);
  withOneProhibed[2].description = 'You should not choose this fruit';

  return (
    <FieldControl className="info">
      <Label>Choose your favorite fruit</Label>
      <RadioField
        options={withOneProhibed}
        onValidate={
          (value, { dirty }) => value !== withOneProhibed[2].value || !dirty
        }
        onChange={action('change')}
      />
      <Abstract className="info">
        You can choose between those 3 fruits
      </Abstract>
    </FieldControl>
  );
};

export const boxedWithDescription = () => (
  <RadioField
    options={withDescriptions}
    className="boxed"
    onChange={action('change')}
  />
);

export const boxed = () => (
  <RadioField
    options={basicOptions}
    className="boxed"
    onValidate={
      (value, { dirty }) => value !== basicOptions[2].value || !dirty
    }
    onChange={action('change')}
  />
);

export const boxedWithOneDisabled = () => {
  const withOneDisabled = cloneDeep(withDescriptions);
  withOneDisabled[2].disabled = true;

  return (
    <RadioField
      options={withOneDisabled}
      className="boxed"
      value={withOneDisabled[2].value}
      onChange={action('change')}
    />
  );
};
