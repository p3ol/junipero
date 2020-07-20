import React from 'react';
import { render, wait, fireEvent } from '@testing-library/react-native';
import sinon from 'sinon';

import Button from './';

describe('<TextField />', () => {

  it('should render', async () => {

    const onClick = sinon.spy();

    const { getByTestId } = render(<Button onClick={onClick}>Click</Button>);
    await wait(() => getByTestId('Button'));
    expect(getByTestId('Button')).toBeDefined();
    console.log(render(<Button onClick={onClick}>Click</Button>).debug());

    fireEvent.press(getByTestId('Button'));
    expect(onClick.called).toBe(true);

  });
  it('should not be able to press if button is disabled', async () => {

    const onPress = sinon.spy();

    const { getByTestId } = render(<Button disabled onPress={onPress} />);
    await wait(() => getByTestId('Button'));

    fireEvent.press(getByTestId('Button'));
    expect(onPress.called).toBe(false);
  });
});
