import React, { createRef } from 'react';
import { render, wait, fireEvent, act } from '@testing-library/react-native';
import sinon from 'sinon';

import SelectField from './';

describe('<SelectField />', () => {

  it('should render', async () => {
    const ref = createRef();
    const { getByTestId } = render(
      <SelectField
        ref={ref}
        placeholder="Choose one item"
      />
    );
    await wait(() => getByTestId('SelectField/Main'));
    expect(getByTestId('SelectField/Main')).toBeTruthy();
  });
});

it('should be able to select a value', async () => {
  const ref = createRef();
  const { getByTestId } = render(
    <SelectField
      ref={ref}
      options={['One', 'Two']}
      placeholder="Choose one item"
    />
  );
  await wait(() => getByTestId('SelectField/Main'));
  fireEvent.press(getByTestId('SelectField/Field'));
  expect(ref.current.active).toBe(true);
  fireEvent.press(getByTestId('One'));
  expect(ref.current.selectedOption).toBe('One');
});
