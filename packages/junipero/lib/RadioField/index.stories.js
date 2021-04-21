import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';

import RadioField from './index';

export default { title: 'junipero/RadioField' };

export const basic = () => {
  const [checked, setChecked] = useState(false);

  const onChange = value => {
    setChecked(value.checked);
  };

  return (
    <>
      <RadioField checked={checked}
        onChange={value => onChange(value)}
        label="Enabled"/>
      <button onClick={() => setChecked(false)}>reset</button>
    </>

  );
};

export const disabled = () => {
  return (
    <RadioField label="Disabled" onChange={action('change')} disabled/>
  );
};

export const active = () => {
  return (
    <RadioField label="Active" onChange={action('change')} checked/>
  );
};

export const activeDisabled = () => {
  return (
    <RadioField
      label="Active and disabled"
      onChange={action('change')}
      disabled
      checked
    />
  );
};

export const withDescription = () => {
  return (
    <RadioField
      label="Super title"
      description="This is a description"
      onChange={action('change')}
      checked
    />
  );
};

export const withDescriptionAndUnchecked = () => {
  return (
    <RadioField
      label="Super title"
      description="This is a description"
      onChange={action('change')}
    />
  );
};

export const withDescriptionButDisabled = () => {
  return (
    <RadioField
      label="Super title"
      description="This is a description"
      onChange={action('change')}
      disabled
    />
  );
};

export const withDescriptionChecked = () => {
  return (
    <RadioField
      label="Super title"
      description="This is a description"
      onChange={action('change')}
      checked
    />
  );
};

export const twoRadiosCombined = () => {
  const [intelligence, setIntelligence] = useState('');

  const onChange = value => {
    setIntelligence(value.value);
  };

  return (
    <>
      <RadioField
        label="This one's stronger"
        description="This is a description"
        onChange={value => onChange(value, 'strong')}
        value='strong'
        checked={intelligence === 'strong'}
      />
      <RadioField
        label="This one's smarter"
        description="This is a description"
        onChange={value => onChange(value, 'smart')}
        value='smart'
        checked={intelligence === 'smart'}
      />
    </>
  );
};

export const multipleRadiosCombined = () => {
  const [intelligence, setIntelligence] = useState('strong');

  const onChange = value => {
    setIntelligence(value.value);
  };

  return (
    <>
      <RadioField
        label="This one's stronger"
        description="This is a description"
        onChange={value => onChange(value, 'strong')}
        value='strong'
        checked={intelligence === 'strong'}
      />
      <RadioField
        label="This one's dumb"
        description="This is a description"
        onChange={value => onChange(value, 'strong')}
        value='strong'
        checked={intelligence === 'dumb'}
        disabled
      />
      <RadioField
        label="This one's smarter"
        description="This is a description"
        onChange={value => onChange(value, 'smart')}
        value='smart'
        checked={intelligence === 'smart'}
      />
    </>
  );
};
