import { createRef } from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { blur, reset } from '~test-utils';
import FieldControl from '../FieldControl';
import Label from '../Label';
import Abstract from '../Abstract';
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

  it('should allow to be used with a FieldControl', async () => {
    const user = userEvent.setup();
    const { unmount, container, getByText } = render(
      <FieldControl>
        <Label htmlFor="name">Name</Label>
        <SelectField
          id="name"
          placeholder="Name"
          value="Marc"
          onValidate={() => false}
          options={['Marc', 'Linda']}
        />
        <Abstract>Enter your name</Abstract>
      </FieldControl>
    );

    const input = container.querySelector('input');
    await user.click(input);
    await user.click(getByText('Linda'));

    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should not allow to change value when disabled', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { unmount, container, queryByText } = render(
      <SelectField
        value="Marc"
        options={['Marc', 'Linda']}
        onChange={onChange}
        disabled
      />
    );

    const input = container.querySelector('input');
    await user.click(input);

    expect(queryByText('Linda')).toBeFalsy();

    expect(onChange).not.toHaveBeenCalled();
    expect(container).toMatchSnapshot();

    unmount();
  });
});
