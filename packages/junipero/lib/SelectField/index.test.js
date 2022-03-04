import { createRef } from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import SelectField from './';

describe('<SelectField />', () => {
  const options = ['One', 'Two', 'Three', 'Four'];
  const optionsWithGroups = [
    {
      title: 'Group 1',
      options: ['One', 'Two', 'Three'],
    }, {
      title: 'Group 2',
      options: ['Four', 'Five', 'Six'],
    },
  ];

  it('should render', async () => {
    const ref = createRef();
    const { container, unmount } = render(<SelectField ref={ref} />);
    expect(container.querySelectorAll('.junipero.select').length).toBe(1);
    unmount();
  });

  it('should initialize if value prop is defined on mount', () => {
    const ref = createRef();
    const { unmount } = render(<SelectField ref={ref} required value="One" />);
    expect(ref.current.internalValue).toBe('One');
    unmount();
  });

  it('should update internal value when value prop changes', () => {
    const ref = createRef();
    const { rerender, unmount } = render(
      <SelectField ref={ref} value="One" options={options} />
    );
    expect(ref.current.internalValue).toBe('One');
    rerender(<SelectField ref={ref} value="Two" options={options} />);
    expect(ref.current.internalValue).toBe('Two');
    unmount();
  });

  it('should dissociate field title parsing from options parsing', async () => {
    const ref = createRef();
    const { container, getByText, unmount } = render(
      <SelectField
        ref={ref}
        value="One"
        options={options}
        parseTitle={(o, isFieldValue) => o && isFieldValue
          ? `Custom parsed title: ${o}`
          : o
        }
      />
    );
    expect(ref.current.internalValue).toBe('One');
    expect(getByText('Custom parsed title: One')).toBeTruthy();
    await act(async () => { container.querySelector('.base').focus(); });
    expect(ref.current.opened).toBe(true);
    expect(getByText('One')).toBeTruthy();
    unmount();
  });

  it('should close menu when disabled prop changes', async () => {
    const ref = createRef();
    const { container, rerender, unmount } = render(
      <SelectField ref={ref} options={options} />
    );
    await act(async () => { container.querySelector('.base').focus(); });
    expect(ref.current.opened).toBe(true);
    rerender(
      <SelectField ref={ref} options={options} disabled={true} />
    );
    expect(ref.current.opened).toBe(false);
    unmount();
  });

  it('should reset internal value when calling reset method for ' +
    'native', async () => {
    const ref = createRef();
    const { getByText, unmount } = render(
      <SelectField autoFocus={true} ref={ref} value="One" options={options} />
    );
    fireEvent.click(getByText('Two'));
    expect(ref.current.internalValue).toBe('Two');
    await act(async () => { ref.current.reset(); });
    expect(ref.current.internalValue).toBe('One');
    unmount();
  });

  it('should search for items on search field change', async () => {
    const search = jest.fn(() => ['Three']);
    jest.useFakeTimers();

    const { container, unmount } = render(
      <SelectField autoFocus search={search} value="One" options={options} />
    );
    fireEvent.change(container.querySelector('.search input'),
      { target: { value: 'test' } });

    await act(async () => { jest.runAllTimers(); });
    expect(search).toHaveBeenCalledTimes(1);
    expect(search).toHaveBeenCalledWith('test');
    jest.useRealTimers();
    unmount();
  });

  it('should show an empty text when no search result is found', async () => {
    const search = jest.fn(() => []);
    jest.useFakeTimers();

    const ref = createRef();
    const { container, unmount } = render(
      <SelectField
        autoFocus
        search={search}
        ref={ref}
        value="One"
        options={options}
      />
    );
    fireEvent.change(container.querySelector('.search input'),
      { target: { value: 'test' } });

    await act(async () => { jest.runAllTimers(); });
    expect(search).toHaveBeenCalledTimes(1);
    expect(search).toHaveBeenCalledWith('test');
    expect(container.querySelector('.no-results').outerHTML)
      .toBe('<div class="no-results">No result found :(</div>');
    jest.useRealTimers();
    unmount();
  });

  it('shouldn\'t call search callback when search value is not set or ' +
    'empty', async () => {
    const search = jest.fn(() => ['Three']);
    jest.useFakeTimers();

    const { container, unmount } = render(
      <SelectField autoFocus search={search} value="One" options={options} />
    );
    fireEvent.change(container.querySelector('.search input'),
      { target: { value: '' } });

    await act(async () => { jest.runAllTimers(); });
    expect(search).not.toHaveBeenCalled();
    jest.useRealTimers();
    unmount();
  });

  it('should fire onToggle event when opened/closed', async () => {
    const onToggle = jest.fn();
    const ref = createRef();
    const { unmount } = render(
      <SelectField ref={ref} options={options} onToggle={onToggle} />
    );
    await act(async () => { ref.current.focus(); });
    expect(ref.current.opened).toBe(true);
    expect(onToggle)
      .toHaveBeenLastCalledWith(expect.objectContaining({ opened: true }));
    await act(async () => { ref.current.blur(); });
    expect(ref.current.opened).toBe(false);
    expect(onToggle)
      .toHaveBeenLastCalledWith(expect.objectContaining({ opened: false }));
    unmount();
  });

  it('should set a custom text if options aren\'t provided or empty', () => {
    const { container, unmount } = render(
      <SelectField autoFocus noItems="There is no data here." />
    );
    expect(container.querySelector('.no-items').outerHTML)
      .toBe('<div class="no-items">There is no data here.</div>');
    unmount();
  });

  it('should accept a value not included in provided options and' +
    ' set it as first index', () => {
    const ref = createRef();
    const { getByText, unmount } = render(
      <SelectField autoFocus ref={ref} options={options} value="Five" />
    );
    expect(ref.current.internalValue).toBe('Five');
    fireEvent.click(getByText('One'));
    expect(ref.current.internalValue).toBe('One');
    unmount();
  });

  it('should update internal value when options change', () => {
    const ref = createRef();
    const { rerender, unmount } = render(
      <SelectField
        ref={ref}
        options={[]}
        value={5}
        parseValue={o => o.value || o}
      />
    );

    expect(ref.current.internalValue).toBe(5);

    rerender(
      <SelectField
        ref={ref}
        options={[
          { title: 'Four', value: 4 },
          { title: 'Five', value: 5 },
          { title: 'Six', value: 6 },
        ]}
        parseValue={o => o.value || o}
        value={4}
      />
    );

    expect(ref.current.internalValue?.value).toBe(4);
    unmount();
  });

  it('should allow to select items using keyboard arrows', () => {
    const ref = createRef();
    const { container, getByText, unmount } = render(
      <SelectField
        autoFocus
        ref={ref}
        options={options}
      />
    );

    expect(document.activeElement)
      .toBe(container.querySelector('.dropdown-toggle .base'));
    fireEvent.keyDown(document.body, { key: 'ArrowDown' });
    expect(document.activeElement)
      .toBe(container.querySelectorAll('.dropdown-item')[0]);
    fireEvent.keyDown(document.body, { key: 'ArrowDown' });
    fireEvent.keyDown(document.body, { key: 'ArrowDown' });
    fireEvent.keyDown(document.body, { key: 'ArrowDown' });
    expect(document.activeElement)
      .toBe(container.querySelectorAll('.dropdown-item')[3]);
    fireEvent.keyDown(document.body, { key: 'ArrowDown' });
    expect(document.activeElement)
      .toBe(container.querySelectorAll('.dropdown-item')[0]);
    fireEvent.keyDown(document.body, { key: 'ArrowUp' });
    expect(document.activeElement)
      .toBe(container.querySelectorAll('.dropdown-item')[3]);
    fireEvent.keyDown(document.body, { key: 'ArrowUp' });
    fireEvent.keyDown(document.body, { key: 'ArrowUp' });
    fireEvent.keyDown(document.body, { key: 'ArrowUp' });
    expect(document.activeElement)
      .toBe(container.querySelectorAll('.dropdown-item')[0]);
    fireEvent.keyDown(document.body, { key: 'ArrowUp' });
    expect(document.activeElement)
      .toBe(container.querySelectorAll('.dropdown-item')[3]);

    // lmao keyPress doesn't work without charCode, when keyDown... does work
    fireEvent.keyPress(getByText('Four'), { key: 'Enter', charCode: 13 });
    expect(ref.current.internalValue).toBe('Four');

    unmount();
  });

  it('should not trigger keyboard actions when menu is not opened', () => {
    const ref = createRef();
    const { unmount } = render(<SelectField ref={ref} />);
    expect(document.activeElement).toBe(document.body);
    fireEvent.keyDown(document.body, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(document.body);
    unmount();
  });

  it('should not try to select an item if no options are specified', () => {
    const ref = createRef();
    const { container, unmount } = render(<SelectField autoFocus ref={ref} />);
    expect(document.activeElement)
      .toBe(container.querySelector('.dropdown-toggle .base'));
    fireEvent.keyDown(document.body, { key: 'ArrowDown' });
    expect(document.activeElement)
      .toBe(container.querySelector('.dropdown-toggle .base'));
    unmount();
  });

  it('should allow to group options', () => {
    const { getByText, unmount } = render(
      <SelectField
        autoFocus
        parseTitle={o => o.title || o}
        options={optionsWithGroups}
      />
    );
    expect(getByText('Group 1')).toBeTruthy();
    unmount();
  });

});
