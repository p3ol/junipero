import React, { createRef } from 'react';
import { Text, View } from 'react-native';
import { render, waitFor, fireEvent } from '@testing-library/react-native';

import Button from './';

describe('<Button />', () => {

  it('should render all different themes', async () => {
    const { getByTestId } = render(
      <View>
        <Button testID="press" theme="basic">Click</Button>
        <Button testID="primary" theme="primary">Click</Button>
        <Button testID="secondary" theme="secondary">Click</Button>
        <Button testID="warning" theme="warning">Click</Button>
        <Button testID="danger" theme="danger">Click</Button>
        <Button testID="success" theme="success">Click</Button>
      </View>
    );
    expect(getByTestId('press/Inner')).toBeDefined();
    expect(getByTestId('primary/Inner')).toBeDefined();
    expect(getByTestId('secondary/Inner')).toBeDefined();
    expect(getByTestId('warning/Inner')).toBeDefined();
    expect(getByTestId('danger/Inner')).toBeDefined();
    expect(getByTestId('success/Inner')).toBeDefined();
    fireEvent.press(getByTestId('press'));
  });

  it('should fire onPress event by clicking the button', async () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Button testID="Button" onPress={onPress}>Click</Button>
    );
    await waitFor(() => getByTestId('Button'));
    fireEvent.press(getByTestId('Button'));
    expect(onPress).toHaveBeenCalled();
  });

  it('should not be able to press if button is disabled', async () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Button testID="Button" disabled onPress={onPress}>Click</Button>
    );
    await waitFor(() => getByTestId('Button'));
    fireEvent.press(getByTestId('Button'));
    fireEvent(getByTestId('Button'), 'pressIn');
    fireEvent(getByTestId('Button'), 'pressOut');
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should render with the provided component as children', async () => {
    const { getByTestId } =
      render(<Button><Text testID="title">Click</Text></Button>);
    await waitFor(() => getByTestId('title'));
    expect(getByTestId('title')).toBeDefined();
  });

  it('should toggle button active state on click', async () => {
    const ref = createRef();
    const { getByTestId } = render(
      <Button testID="Button" ref={ref}> Click </Button>
    );
    await waitFor(() => getByTestId('Button'));
    fireEvent(getByTestId('Button'), 'pressIn');
    expect(ref.current.active).toBe(true);
    fireEvent(getByTestId('Button'), 'pressOut');
    expect(ref.current.active).toBe(false);
  });
});
