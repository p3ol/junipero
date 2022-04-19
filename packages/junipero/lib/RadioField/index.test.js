import { createRef } from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { cloneDeep } from '@poool/junipero-utils';

import RadioField from './';

describe('<RadioField />', () => {
  const basicOptions = [
    { title: 'Apple', value: 'Apple' },
    { title: 'Pear', value: 'Pear' },
    { title: 'Orange', value: 'Orange' },
  ];

  const withDescriptions = [
    { title: 'Apple', value: 'Apple', description: 'This is a description' },
    { title: 'Pear', value: 'Pear', description: 'This is a description' },
    { title: 'Orange', value: 'Orange', description: 'This is a description' },
  ];

  it('should render', () => {
    const { container, unmount } = render(
      <RadioField options={basicOptions} />
    );
    expect(container.querySelectorAll('.junipero.radio label').length).toBe(3);
    unmount();
  });

  it('should render no options without error', () => {
    const { container, unmount } = render(
      <RadioField />
    );
    expect(container.querySelectorAll('.junipero.radio label').length).toBe(0);
    unmount();
  });

  it('should render with descriptions', () => {
    const { container, unmount } = render(
      <RadioField className="boxed" options={withDescriptions} />
    );
    expect(container
      .querySelectorAll('.junipero.radio.boxed .description').length).toBe(3);
    unmount();
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <RadioField ref={ref} options={basicOptions} />
    );
    expect(ref.current.innerRefs.current.length).toBe(3);
    expect(ref.current.inputRefs.current.length).toBe(3);
    expect(ref.current.valid).toBe(false);
    expect(container.querySelectorAll('input')[0])
      .toBe(ref.current.inputRefs.current[0]);
    unmount();
  });

  it('should correctly fire onChange event', () => {
    const onChange = jest.fn();
    const { container, unmount } = render(
      <RadioField
        onChange={onChange}
        options={basicOptions}
        parseValue={o => o.value}
      />
    );
    fireEvent.click(container.querySelectorAll('input')[1]);
    expect(onChange)
      .toHaveBeenLastCalledWith(expect.objectContaining({
        value: 'Pear',
        valid: true,
      }));
    unmount();
  });

  it('should not throw error if no onChange', () => {
    let error = null;
    const { container, unmount } = render(
      <RadioField
        options={basicOptions}
      />
    );

    try {
      fireEvent.click(container.querySelectorAll('input')[1]);
    } catch (e) {
      error = e;
    }

    expect(error).toBeNull();
    unmount();
  });

  it('should not fire onChange event if all disabled', () => {
    const onChange = jest.fn();
    const { container, unmount } = render(
      <RadioField
        disabled
        onChange={onChange}
        options={basicOptions}
      />
    );
    fireEvent.click(container.querySelectorAll('input')[1]);
    expect(onChange).not.toHaveBeenCalled();
    unmount();
  });

  it('should not fire onChange if element is disabled', () => {
    const options_ = cloneDeep(basicOptions);
    options_[0].disabled = true;
    const onChange = jest.fn();
    const { container, unmount } = render(
      <RadioField
        onChange={onChange}
        options={basicOptions}
      />
    );
    fireEvent.click(container.querySelectorAll('input')[0]);
    fireEvent.click(container.querySelectorAll('input')[1]);
    expect(onChange).toHaveBeenCalled();
    expect(onChange).not
      .toHaveBeenCalledWith(expect.objectContaining({ value: 'Apple' }));
    unmount();
  });

  it('should fire onChange on focused element on enter hit', async () => {
    const onChange = jest.fn();
    const { container, unmount } = render(
      <RadioField
        options={basicOptions}
        onChange={onChange}
        parseValue={o => o.value}
      />
    );

    await act(async () => { container.querySelectorAll('label')[0].focus(); });
    expect(container.querySelectorAll('.junipero.radio .focused').length)
      .toBe(1);
    expect(container.querySelectorAll('.junipero.radio .checked').length)
      .toBe(0);
    fireEvent.keyDown(container.querySelectorAll('label')[0], { key: 'Enter' });
    expect(onChange)
      .toHaveBeenLastCalledWith(expect.objectContaining({ value: 'Apple' }));
    unmount();
  });

  it('should fire onChange on focused element on space hit', async () => {
    const onChange = jest.fn();
    const { container, unmount } = render(
      <RadioField
        options={basicOptions}
        onChange={onChange}
        parseValue={o => o.value}
      />
    );

    await act(async () => { container.querySelectorAll('label')[1].focus(); });
    expect(container.querySelectorAll('.junipero.radio .focused').length)
      .toBe(1);
    expect(container.querySelectorAll('.junipero.radio .checked').length)
      .toBe(0);
    fireEvent.keyDown(container.querySelectorAll('label')[1], { key: ' ' });
    expect(onChange)
      .toHaveBeenLastCalledWith(expect.objectContaining({ value: 'Pear' }));
    unmount();
  });

  it('should toggle focused state on focus', async () => {
    const { container, unmount } = render(
      <RadioField options={basicOptions} />
    );
    await act(async () => { container.querySelectorAll('label')[0].focus(); });
    expect(container.querySelectorAll('.junipero.radio .focused').length)
      .toBe(1);
    await act(async () => { container.querySelectorAll('label')[0].blur(); });
    expect(container.querySelectorAll('.junipero.radio .focused').length)
      .toBe(0);
    unmount();
  });

  it('should not uncheck on enter hit if checked', async () => {
    const onChange = jest.fn();

    const { container, unmount } = render(
      <RadioField
        options={basicOptions}
        onChange={onChange}
        value="Apple"
        parseValue={o => o.value}
      />
    );
    await act(async () => { container.querySelectorAll('label')[0].focus(); });
    expect(container.querySelectorAll('.junipero.radio .checked').length)
      .toBe(1);
    fireEvent.keyDown(container.querySelectorAll('label')[0], { key: 'Enter' });
    expect(container.querySelectorAll('.junipero.radio .checked').length)
      .toBe(1);
    unmount();
  });
});
