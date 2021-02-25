import React from 'react';
import { Text } from 'react-native';
import { render, wait } from '@testing-library/react-native';

import Card from './';

describe('<Card />', () => {
  it('should render the card component', async () => {
    const { getByTestId } = render(<Card><Text>Content</Text></Card>);
    await wait(() => { getByTestId('Card'); });
    expect(getByTestId('Card')).toBeDefined();
  });
});
