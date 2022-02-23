import { createRef } from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';

import CheckboxField from './';

describe('<CheckboxField />', () => {

  it('should render', async () => {
    const ref = createRef();
    const { getByTestId } = render(
      <CheckboxField ref={ref}>Check this</CheckboxField>
    );

    await waitFor(() => getByTestId('CheckboxField/Main'));
    expect(getByTestId('CheckboxField/Main')).toBeDefined();
    fireEvent.press(getByTestId('CheckboxField/Main'));
    expect(ref.current.internalValue).toBe(true);
    fireEvent(getByTestId('CheckboxField/Main'), 'focus');
    expect(ref.current.focused).toBe(true);
    fireEvent(getByTestId('CheckboxField/Main'), 'blur');
    expect(ref.current.focused).toBe(false);
  });

  it('should correctly fire onChange event', async () => {
    const onChange = jest.fn();
    const { getByTestId } = render(<CheckboxField onChange={onChange} />);
    await waitFor(() => getByTestId('CheckboxField/Main'));
    fireEvent.press(getByTestId('CheckboxField/Main'));
    expect(onChange)
      .toHaveBeenLastCalledWith(expect.objectContaining({ checked: true }));
    fireEvent.press(getByTestId('CheckboxField/Main'));
    expect(onChange)
      .toHaveBeenLastCalledWith(expect.objectContaining({ checked: false }));
  });

  it('should toggle checkbox active state on click', async () => {
    const ref = createRef();
    const { getByTestId } = render(<CheckboxField ref={ref} />);
    await waitFor(() => getByTestId('CheckboxField/Main'));
    fireEvent(getByTestId('CheckboxField/Main'), 'pressIn');
    expect(ref.current.active).toBe(true);
    fireEvent(getByTestId('CheckboxField/Main'), 'pressOut');
    expect(ref.current.active).toBe(false);
  });

  it('should toggle checkbox focused state on focus', async () => {
    const ref = createRef();
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const { getByTestId } = render(
      <CheckboxField onFocus={onFocus} onBlur={onBlur} ref={ref} />
    );
    await waitFor(() => getByTestId('CheckboxField/Main'));
    fireEvent(getByTestId('CheckboxField/Main'), 'focus');
    expect(ref.current.focused).toBe(true);
    expect(onFocus).toHaveBeenCalled();
    fireEvent(getByTestId('CheckboxField/Main'), 'blur');
    expect(ref.current.focused).toBe(false);
    expect(onBlur).toHaveBeenCalled();
  });
});
