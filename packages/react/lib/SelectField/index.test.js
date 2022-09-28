import { createRef } from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { blur, reset } from '~test-utils';
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
    await blur(ref.current);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should allow to reset the field', async () => {
    const user = userEvent.setup();
    const ref = createRef();
    const onChange = jest.fn();
    const { unmount, container, getByText } = render(
      <SelectField
        ref={ref}
        value="John"
        options={['John', 'David']}
        onChange={onChange}
      />
    );

    const input = container.querySelector('input');
    await user.click(input);
    await user.click(getByText('David'));
    await blur(ref.current);

    expect(container).toMatchSnapshot();
    expect(onChange)
      .toHaveBeenLastCalledWith(expect.objectContaining({ value: 'David' }));

    await reset(ref.current);
    expect(container).toMatchSnapshot();

    unmount();
  });
});
