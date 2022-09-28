import { render } from '@testing-library/react';

import SelectField from './index';

describe('<SelectField />', () => {
  it('should render', () => {
    const { unmount, container } = render(
      <SelectField
        placeholder="Name"
        options={['Item 1', 'Item 2', 'Item 3']}
        autoFocus
      />
    );
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should render multiple values', () => {
    const { unmount, container } = render(
      <SelectField
        placeholder="Name"
        options={['Item 1', 'Item 2', 'Item 3']}
        value={['Item 1', 'Item 2']}
        multiple
        autoFocus
      />
    );
    expect(container).toMatchSnapshot();
    unmount();
  });
});
