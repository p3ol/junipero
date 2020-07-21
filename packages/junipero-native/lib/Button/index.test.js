import React, { createRef } from 'react';
import { Text } from 'react-native';
import { render, wait, fireEvent } from '@testing-library/react-native';
import sinon from 'sinon';

import Button from './';

describe('<Button />', () => {

  it('should render', async () => {
    const { getByTestId } = render(<Button>Click</Button>);
    await wait(() => getByTestId('Button'));
    expect(getByTestId('Button')).toBeDefined();
    fireEvent.press(getByTestId('Button'));

  });

  it('should fire onPress event by clicking the button', async () => {
    const onPress = sinon.spy();
    const { getByTestId } = render(<Button onPress={onPress}>Click</Button>);
    await wait(() => getByTestId('Button'));
    fireEvent.press(getByTestId('Button'));
    expect(onPress.called).toBe(true);
  });

  it('should not be able to press if button is disabled', async () => {
    const onPress = sinon.spy();
    const { getByTestId } = render(
      <Button disabled onPress={onPress}>Click</Button>
    );
    await wait(() => getByTestId('Button'));
    fireEvent.press(getByTestId('Button'));
    fireEvent.pressIn(getByTestId('Button'));
    fireEvent.pressOut(getByTestId('Button'));
    expect(onPress.called).toBe(false);
  });

  it('should render with the provided component as children', async () => {
    const { getByTestId } =
      render(<Button><Text testID='title'>Click</Text></Button>);
    await wait(() => getByTestId('title'));
    expect(getByTestId('title')).toBeDefined();
  });

  it('should toggle button active state on click', async () => {
    const ref = createRef();
    const { getByTestId } = render(<Button ref={ref}> Click </Button>);
    await wait(() => getByTestId('Button'));
    fireEvent.pressIn(getByTestId('Button'));
    expect(ref.current.active).toBe(true);
    fireEvent.pressOut(getByTestId('Button'));
    expect(ref.current.active).toBe(false);
  });
});
