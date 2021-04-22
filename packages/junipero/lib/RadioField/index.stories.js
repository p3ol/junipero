import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';

import RadioField from './index';

export default { title: 'junipero/RadioField' };

const basicOptions = [
  { title: 'Apple', value: 'Apple' },
  { title: 'Pear', value: 'Pear' },
  { title: 'Orange', value: 'Orange' },
];

const basicOptions2 = [
  { title: 'Apple', value: 'Apple' },
  { title: 'Pear', value: 'Pear' },
  { title: 'Orange', value: 'Orange', disabled: true },
];

const withDescriptions = [
  { title: 'Apple', value: 'Apple', description: 'This is a description' },
  { title: 'Pear', value: 'Pear', description: 'This is a description' },
  { title: 'Orange', value: 'Orange', description: 'This is a description' },
];

export const basic = () => {
  const [state, setState] = useState('Apple');

  const onChange = ({ value }) => {
    setState(value);
  };

  return (
    <>
      <RadioField options={basicOptions} onChange={onChange} value={state} />
    </>
  );
};

export const basicAllDisabled = () => {
  return (
    <>
      <RadioField
        disabled
        options={basicOptions}
      />
    </>
  );
};

export const basicOneDisabled = () => {
  const [state, setState] = useState('Apple');

  const onChange = ({ value }) => {
    setState(value);
  };

  return (
    <>
      <RadioField
        options={basicOptions2}
        onChange={onChange}
        value={state}
      />
    </>
  );
};

export const basicDisabledWithActive = () => {
  const [state, setState] = useState('Apple');

  const onChange = ({ value }) => {
    setState(value);
  };

  return (
    <>
      <RadioField
        disabled
        options={basicOptions}
        onChange={onChange}
        value={state}
      />
    </>
  );
};

export const withDescription = () => {
  const [state, setState] = useState('Apple');

  const onChange = ({ value }) => {
    setState(value);
  };

  return (
    <>
      <RadioField
        options={withDescriptions}
        onChange={onChange}
        value={state}
      />
    </>
  );
};

// export const basic = () => {
//   const [checked, setChecked] = useState(false);

//   const onChange = value => {
//     setChecked(value.checked);
//   };

//   return (
//     <>
//       <RadioField checked={checked}
//         onChange={value => onChange(value)}
//         label="Enabled"/>
//       <button onClick={() => setChecked(false)}>reset</button>
//     </>

//   );
// };

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

// export const withDescription = () => {
//   return (
//     <RadioField
//       label="Super title"
//       description="This is a description"
//       onChange={action('change')}
//       checked
//     />
//   );
// };

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
        onChange={value => onChange(value)}
        value='strong'
        checked={intelligence === 'strong'}
      />
      <RadioField
        label="This one's smarter"
        description="This is a description"
        onChange={value => onChange(value)}
        value='smart'
        checked={intelligence === 'smart'}
      />
    </>
  );
};
