import React, { useState } from 'react';

import RadioField from './index';

export default { title: 'junipero/RadioField' };

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

export const basicDisabled = () => {
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
        options={basicOptionsOneDisabled}
        onChange={onChange}
        value={state}
      />
    </>
  );
};

export const basicDisabledOneActive = () => {
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

export const withDescriptionDisabled = () => {
  const [state, setState] = useState('');

  const onChange = ({ value }) => {
    setState(value);
  };

  return (
    <>
      <RadioField
        disabled
        options={withDescriptions}
        onChange={onChange}
        value={state}
      />
    </>
  );
};

export const withDescriptionDisabledOneActive = () => {
  const withDescriptions_ = [...withDescriptions];
  withDescriptions_[2].disabled = true;
  const [state, setState] = useState('Pear');

  const onChange = ({ value }) => {
    setState(value);
  };

  return (
    <>
      <RadioField
        disabled
        options={withDescriptions_}
        onChange={onChange}
        value={state}
      />
    </>
  );
};
