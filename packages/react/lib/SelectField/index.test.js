import { createRef } from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { focus, blur, reset, sleep } from '~test-utils';
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

  it('should allow to clear a single value', () => {
    const { unmount, container } = render(
      <SelectField
        placeholder="Name"
        value="Item 1"
        options={['Item 1', 'Item 2', 'Item 3']}
      />
    );
    expect(container).toMatchSnapshot();

    fireEvent.click(container.querySelector('.icons .remove'));
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should render multiple values', () => {
    const { unmount, container, getByText } = render(
      <SelectField
        placeholder="Name"
        options={['Item 1', 'Item 2', 'Item 3']}
        value={['Item 1', 'Item 2']}
        multiple
        autoFocus
      />
    );
    expect(container).toMatchSnapshot();

    // Remove item 2
    fireEvent.click(getByText('Item 2').parentNode.querySelector('.remove'));
    expect(container).toMatchSnapshot();

    // Add item 3
    fireEvent.click(container.querySelector('input'));
    fireEvent.click(getByText('Item 3'));
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should allow to clear multiple values at once', () => {
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

    fireEvent.click(container.querySelector('.icons .remove'));
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

  it('should allow to search for an existing value', async () => {
    const user = userEvent.setup();
    const { unmount, container } = render(
      <SelectField
        placeholder="Name"
        options={['Item 1', 'Item 2', 'Item 3']}
        searchThreshold={0}
        autoFocus
      />
    );

    await user.type(container.querySelector('input'), 'Item 3');
    // Cannot use .useFakeTimers() as user.type uses timers :/
    await sleep(1);

    expect(container).toMatchSnapshot();

    await user.clear(container.querySelector('input'));
    await sleep(1);
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should allow to search for an external value', async () => {
    const user = userEvent.setup();
    const { unmount, container, getByText } = render(
      <SelectField
        placeholder="Name"
        options={['Item 1', 'Item 2', 'Item 3']}
        searchThreshold={0}
        onSearch={() => ['Item 4']}
        autoFocus
      />
    );

    await user.type(container.querySelector('input'), 'Item');
    // Cannot use .useFakeTimers() as user.type uses timers :/
    await sleep(1);
    expect(container).toMatchSnapshot();

    fireEvent.click(getByText('Item 4'));
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should allow arbitrary values', async () => {
    const user = userEvent.setup();
    const { unmount, container } = render(
      <SelectField
        placeholder="Name"
        options={['Item 1', 'Item 2', 'Item 3']}
        allowArbitraryItems
        autoFocus
        multiple
      />
    );

    const input = container.querySelector('input');
    await user.type(input, 'Item 4{enter}');

    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should allow to delete items when hitting backspace', async () => {
    const user = userEvent.setup();
    const { unmount, container } = render(
      <SelectField
        placeholder="Name"
        options={['Item 1', 'Item 2', 'Item 3']}
        value={['Item 1', 'Item 2', 'Item 4']}
        multiple
        autoFocus
      />
    );

    await user.click(container.querySelector('input'));

    // Select item 4
    await user.keyboard('{Backspace}');
    expect(container).toMatchSnapshot();

    // Remove item 4
    await user.keyboard('{Backspace}');
    expect(container).toMatchSnapshot();

    // Move to item 2
    await user.keyboard('{ArrowLeft}');
    expect(container).toMatchSnapshot();

    // Move to item 1
    await user.keyboard('{ArrowLeft}');
    expect(container).toMatchSnapshot();

    // Move back to item 2
    await user.keyboard('{ArrowRight}');
    expect(container).toMatchSnapshot();

    // Unselect any item
    await user.keyboard('{ArrowRight}');
    expect(container).toMatchSnapshot();

    unmount();
  });
});
