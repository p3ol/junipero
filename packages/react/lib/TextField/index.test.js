import { createRef } from 'react';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { blur, reset } from '~test-utils';
import Label from '../Label';
import Abstract from '../Abstract';
import FieldControl from '../FieldControl';
import TextField from './';

describe('<TextField />', () => {
  it('should render', () => {
    const { unmount, container } = render(<TextField placeholder="Name" />);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should be invalid if validation fails', async () => {
    const user = userEvent.setup();
    const { unmount, container } = render(
      <TextField
        placeholder="Name"
        onValidate={() => false}
      />
    );

    const input = container.querySelector('input');
    await user.type(input, 'John');
    await blur(input);
    expect(container).toMatchSnapshot();

    unmount();
  });
  it('should return number if type is number', async () => {
    const onChangeMock = jest.fn();
    const user = userEvent.setup();
    const { unmount, container } = render(
      <TextField
        type="number"
        min={1}
        onChange={onChangeMock}
      />
    );

    const input = container.querySelector('input');
    await user.type(input, '3');
    await blur(input);
    
    expect(onChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({ value: 3 })
    );

    unmount();
  });
  
  it('should be invalid if number is out of range', async () => {
    const user = userEvent.setup();
    const { unmount, container } = render(
      <TextField
        type="number"
        min={1}
      />
    );

    const input = container.querySelector('input');
    await user.type(input, '-1');
    await blur(input);

    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should allow to be used with a FieldControl', async () => {
    const user = userEvent.setup();
    const { unmount, container } = render(
      <FieldControl>
        <Label htmlFor="name">Name</Label>
        <TextField id="name" placeholder="Name" onValidate={() => false} />
        <Abstract>Enter your name</Abstract>
      </FieldControl>
    );

    const input = container.querySelector('input');
    await user.type(input, 'John');
    await blur(input);

    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should allow to reset the field', async () => {
    const user = userEvent.setup();
    const ref = createRef();
    const onChange = jest.fn();
    const { unmount, container } = render(
      <TextField ref={ref} value="John" onChange={onChange} />
    );
    const input = container.querySelector('input');

    await user.clear(input);
    await user.type(input, 'Jane');
    await blur(input);

    expect(container).toMatchSnapshot();
    expect(onChange)
      .toHaveBeenLastCalledWith(expect.objectContaining({ value: 'Jane' }));

    await reset(ref.current);
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should not allow to change value when disabled', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { unmount, container } = render(
      <TextField onChange={onChange} disabled />
    );
    const input = container.querySelector('input');
    await user.type(input, 'Jane');
    await blur(input);

    expect(onChange).not.toHaveBeenCalled();
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should render a textarea if rows is set to > 1', () => {
    const { unmount, container } = render(<TextField rows={2} />);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should blur on scroll', async () => {
    const user = userEvent.setup();
    const { unmount, container } = render(<TextField type="number" />);

    const input = container.querySelector('input');
    await user.click(input);
    expect(container).toMatchSnapshot('focused');
    fireEvent.wheel(container.querySelector('.junipero.text-field input'), {
      deltaY: 30,
    });
    expect(container).toMatchSnapshot('unfocused');
    unmount();
  });

  it('should do the given action on scroll if onWheel is set', async () => {
    const user = userEvent.setup();
    const customWheel = jest.fn();
    const { unmount, container } = render(
      <TextField type="number" onWheel={customWheel} />
    );

    const input = container.querySelector('input');
    await user.click(input);
    expect(container).toMatchSnapshot('focused');
    fireEvent.wheel(container.querySelector('.junipero.text-field input'), {
      deltaY: 30,
    });
    expect(customWheel).toHaveBeenCalled();
    expect(container).toMatchSnapshot('always focused');
    unmount();
  });
});
