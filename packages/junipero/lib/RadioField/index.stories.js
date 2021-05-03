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
    <RadioField
      options={basicOptions}
      onChange={onChange}
      value={state}
      parseTitle={o => o.title}
      parseValue={o => o.value}
    />
  );
};

export const basicDisabled = () => (
  <RadioField
    disabled
    options={basicOptions}
    parseTitle={o => o.title}
    parseValue={o => o.value}
  />
);

export const basicOneDisabled = () => {
  const [state, setState] = useState('Apple');

  const onChange = ({ value }) => {
    setState(value);
  };

  return (
    <RadioField
      options={basicOptionsOneDisabled}
      onChange={onChange}
      value={state}
      parseTitle={o => o.title}
      parseValue={o => o.value}
    />
  );
};

export const basicDisabledOneActive = () => {
  const [state, setState] = useState('Apple');

  const onChange = ({ value }) => {
    setState(value);
  };

  return (
    <RadioField
      disabled
      options={basicOptions}
      onChange={onChange}
      value={state}
      parseTitle={o => o.title}
      parseValue={o => o.value}
    />
  );
};

export const withDescription = () => {
  const [state, setState] = useState('Apple');

  const onChange = ({ value }) => {
    setState(value);
  };

  return (
    <RadioField
      className="boxed"
      options={withDescriptions}
      onChange={onChange}
      value={state}
      parseTitle={o => o.title}
      parseValue={o => o.value}
    />
  );
};

export const withDescriptionDisabled = () => {
  const [state, setState] = useState('');

  const onChange = ({ value }) => {
    setState(value);
  };

  return (
    <RadioField
      disabled
      className="boxed"
      options={withDescriptions}
      onChange={onChange}
      value={state}
      parseTitle={o => o.title}
      parseValue={o => o.value}
    />
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
    <RadioField
      disabled
      className="boxed"
      options={withDescriptions_}
      onChange={onChange}
      value={state}
      parseTitle={o => o.title}
      parseValue={o => o.value}
    />
  );
};

export const boxedWithoutDescription = () => {
  const [state, setState] = useState('Apple');

  const onChange = ({ value }) => {
    setState(value);
  };

  return (
    <RadioField
      className="boxed"
      options={basicOptions}
      onChange={onChange}
      value={state}
      parseTitle={o => o.title}
      parseValue={o => o.value}
    />
  );
};
