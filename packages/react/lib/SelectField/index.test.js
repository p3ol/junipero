import { createRef } from 'react';
import { render, act, fireEvent } from '@testing-library/react';

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

  it('should be invalid if validation fails', async () => {
    const ref = createRef();
    const { unmount, container, getByText } = render(
      <SelectField
        ref={ref}
        placeholder="Name"
        options={['Item 1', 'Item 2', 'Item 3']}
        onValidate={() => false}
        autoFocus
      />
    );

    fireEvent.click(getByText('Item 1'));
    await act(async () => { ref.current.blur(); });
    expect(container).toMatchSnapshot();
    unmount();
  });
});
