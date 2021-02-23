import React from 'react';
import { render, wait } from '@testing-library/react-native';

import Tag from './';

describe('<Tag />', () => {

  it('should render all different themes', async () => {
    const { getByTestId } = render(
      <React.Fragment>
        <Tag testID="press" theme="basic">New</Tag>
        <Tag theme="primary">New</Tag>
        <Tag theme="secondary">New</Tag>
        <Tag theme="ternary">New</Tag>
        <Tag theme="warning">New</Tag>
        <Tag theme="danger">New</Tag>
        <Tag theme="success">New</Tag>
      </React.Fragment>
    );
    await wait(() => {
      getByTestId('basic');
      getByTestId('primary');
      getByTestId('secondary');
      getByTestId('ternary');
      getByTestId('warning');
      getByTestId('danger');
      getByTestId('success');
    });
    expect(getByTestId('basic')).toBeDefined();
    expect(getByTestId('primary')).toBeDefined();
    expect(getByTestId('secondary')).toBeDefined();
    expect(getByTestId('ternary')).toBeDefined();
    expect(getByTestId('warning')).toBeDefined();
    expect(getByTestId('danger')).toBeDefined();
    expect(getByTestId('success')).toBeDefined();
  });
});
