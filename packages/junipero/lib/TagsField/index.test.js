import { createRef } from 'react';
import { fireEvent, render, act } from '@testing-library/react';

import TagsField from './';

describe('<TagsField />', () => {
  const autoCompleteOptions = [
    'Dave',
    'Astor',
    'Astrid',
    'Freeman',
    'Lizbeth',
    'Annette',
  ];

  const autoCompleteObjectOptions = [
    { name: 'Dave', value: 'Dave' },
    { name: 'Astrid', value: 'Astrid' },
    { name: 'Freeman', value: 'Freeman' },
    { name: 'Lizbeth', value: 'Lizbeth' },
    { name: 'Annette', value: 'Annette' },
  ];

  const autoComplete = val => {
    const search = new RegExp(val, 'i');

    return autoCompleteOptions.filter(item => search.test(item));
  };

  const autoCompleteWithObjects = val => {
    const search = new RegExp(val, 'i');

    return autoCompleteObjectOptions.filter(item => search.test(item.name));
  };

  it('should render', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <TagsField placeholder="Type here" ref={ref} />
    );
    expect(container.querySelectorAll('.junipero.tags-input').length).toBe(1);
    expect(ref.current?.inputRef.current).toBeDefined();
    unmount();
  });

  it('should have default handlers defined', () => {
    const ref = createRef();
    const { unmount } = render(<TagsField ref={ref} />);

    expect(ref.current.innerRef).toBeDefined();
    expect(ref.current.wrapperRef).toBeDefined();
    expect(ref.current.inputRef).toBeDefined();
    expect(ref.current.dropdownRef).toBeDefined();
    expect(ref.current.menuRef).toBeDefined();
    expect(ref.current.internalValue).toBeDefined();
    expect(ref.current.inputValue).toBeDefined();
    expect(ref.current.dirty).toBeDefined();
    expect(ref.current.opened).toBeDefined();
    expect(ref.current.searchResults).toBeDefined();
    expect(ref.current.searching).toBeDefined();
    expect(ref.current.valid).toBeDefined();
    expect(ref.current.focus).toBeDefined();
    expect(ref.current.blur).toBeDefined();
    expect(ref.current.reset).toBeDefined();
    expect(ref.current.add).toBeDefined();
    expect(ref.current.remove).toBeDefined();

    unmount();
  });

  it('should update internal value on value prop change', () => {
    const ref = createRef();
    const { rerender, unmount } = render(<TagsField ref={ref} value={[]} />);
    expect(ref.current.internalValue).toBeDefined();
    expect(ref.current.internalValue.length).toBe(0);
    rerender(<TagsField ref={ref} value={['test']} />);
    expect(ref.current.internalValue.length).toBe(1);
    rerender(<TagsField ref={ref} value={null} />);
    expect(ref.current.internalValue.length).toBe(0);
    unmount();
  });

  it('should focus on input when clicked on', () => {
    const { container, unmount } = render(<TagsField value={[]} />);
    fireEvent.mouseDown(container.querySelector('.wrapper'));
    expect(container.querySelectorAll('input:focus').length).toBe(1);
    unmount();
  });

  it('should not focus on input when clicked on if field is disabled', () => {
    const { container, unmount } = render(
      <TagsField disabled={true} value={[]} />
    );
    fireEvent.mouseDown(container.querySelector('.wrapper'));
    expect(container.querySelectorAll('input:focus').length).toBe(0);
    unmount();
  });

  it('should set field as focused when focusing input', async () => {
    const ref = createRef();
    const { container, unmount } = render(<TagsField ref={ref} value={[]} />);
    await act(async () => { container.querySelector('input').focus(); });
    expect(ref.current.focused).toBe(true);
    unmount();
  });

  it('should not set field as focused when focusing input if field ' +
    'is disabled', async () => {
    const ref = createRef();
    const { container, unmount } = render(
      <TagsField ref={ref} disabled={true} value={[]} />
    );
    await act(async () => { container.querySelector('input').focus(); });
    expect(ref.current.focused).toBe(false);
    unmount();
  });

  it('should set field as unfocused when bluring input', async () => {
    const ref = createRef();
    const { container, unmount } = render(<TagsField ref={ref} value={[]} />);
    await act(async () => { container.querySelector('input').focus(); });
    expect(ref.current.focused).toBe(true);
    await act(async () => { container.querySelector('input').blur(); });
    expect(ref.current.focused).toBe(false);
    unmount();
  });

  it('should update internal input value on input change event', () => {
    const ref = createRef();
    const { container, unmount } = render(<TagsField ref={ref} value={[]} />);
    fireEvent
      .change(container.querySelector('input'), { target: { value: 'test' } });
    expect(ref.current.inputValue).toBe('test');
    unmount();
  });

  it('shouldn\'t update internal input value on input change event if ' +
    'field is disabled', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <TagsField ref={ref} disabled value={[]} />
    );
    fireEvent
      .change(container.querySelector('input'), { target: { value: 'test' } });
    expect(ref.current.inputValue).toBe('');
    unmount();
  });

  it('should select last tag when hitting backspace and input is empty', () => {
    const { container, unmount } = render(<TagsField value={['One', 'Two']} />);
    fireEvent.keyDown(container.querySelector('input'), { key: 'Backspace' });
    expect(container.querySelectorAll('.tag')[1])
      .toBe(document.activeElement);
    unmount();
  });

  it('should unselect last tag when hitting esc key', () => {
    const { container, unmount } = render(<TagsField value={['One', 'Two']} />);
    fireEvent.keyDown(container.querySelector('input'), { key: 'Backspace' });
    expect(container.querySelectorAll('.tag')[1]).toBe(document.activeElement);
    fireEvent
      .keyDown(container.querySelector('.tag:focus'), { key: 'Escape' });
    expect(container.querySelector('input')).toBe(document.activeElement);
    unmount();
  });

  it('should remove a previously added tag when hitting backspace and ' +
    'input is empty', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <TagsField ref={ref} value={['One', 'Two']} />
    );
    expect(ref.current.internalValue.length).toBe(2);
    fireEvent.keyDown(container.querySelector('input'), { key: 'Backspace' });
    expect(container.querySelectorAll('.tag')[1]).toBe(document.activeElement);
    fireEvent
      .keyDown(container.querySelector('.tag:focus'), { key: 'Backspace' });
    expect(ref.current.internalValue.length).toBe(1);
    unmount();
  });

  it('shouldn\'t select, unselect or remove selected tag if field is ' +
    'disabled', async () => {
    const ref = createRef();
    const { container, rerender, unmount } = render(
      <TagsField ref={ref} disabled={true} value={['One']} />
    );
    await act(async () => { container.querySelector('input').focus(); });
    expect(container.querySelectorAll('input:focus').length).toBe(0);
    fireEvent.keyDown(container.querySelector('input'), { key: 'Backspace' });
    expect(container.querySelectorAll('.tag:focus').length).toBe(0);
    rerender(<TagsField ref={ref} disabled={false} value={['One']} />);
    fireEvent.keyDown(container.querySelector('input'), { key: 'Backspace' });
    expect(container.querySelectorAll('.tag')[0]).toBe(document.activeElement);
    rerender(<TagsField ref={ref} disabled={true} value={['One']} />);
    fireEvent.keyDown(container.querySelector('input'), { key: 'Backspace' });
    expect(ref.current.internalValue.length).toBe(1);
    unmount();
  });

  it('should add a new tag when hitting enter and input is not empty', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <TagsField ref={ref} value={['One']} />
    );
    fireEvent
      .change(container.querySelector('input'), { target: { value: 'Two' } });
    fireEvent.keyPress(container.querySelector('input'),
      { key: 'Enter', charCode: 13 });
    fireEvent
      .change(container.querySelector('input'), { target: { value: '' } });
    fireEvent.keyPress(container.querySelector('input'),
      { key: 'Enter', charCode: 13 });
    expect(ref.current.internalValue.length).toBe(2);
    expect(ref.current.internalValue[1]).toBe('Two');
    unmount();
  });

  it('should not add a new tag when hitting any key except enter inside ' +
    'input', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <TagsField ref={ref} value={['One']} />
    );
    fireEvent
      .change(container.querySelector('input'), { target: { value: 'Two' } });
    fireEvent.keyPress(container.querySelector('input'),
      { key: 'LeftArrow', charCode: 37 });
    expect(ref.current.internalValue.length).toBe(1);
    expect(ref.current.internalValue.pop()).toBe('One');
    unmount();
  });

  it('should not add a new tag when hitting enter inside input if field is ' +
    'disabled', () => {
    const ref = createRef();
    const { container, rerender, unmount } = render(
      <TagsField ref={ref} value={['One']} />
    );
    fireEvent
      .change(container.querySelector('input'), { target: { value: 'Two' } });
    rerender(<TagsField ref={ref} disabled={true} value={['One']} />);
    fireEvent.keyPress(container.querySelector('input'),
      { key: 'Enter', charCode: 13 });
    expect(ref.current.internalValue.length).toBe(1);
    expect(ref.current.internalValue.pop()).toBe('One');
    unmount();
  });

  it('should reset field to prop value when calling reset', async () => {
    const ref = createRef();
    const { container, unmount } = render(
      <TagsField ref={ref} value={['One']} />
    );
    fireEvent
      .change(container.querySelector('input'), { target: { value: 'Two' } });
    fireEvent.keyPress(container.querySelector('input'),
      { key: 'Enter', charCode: 13 });
    expect(ref.current.internalValue.length).toBe(2);
    fireEvent.keyDown(container.querySelector('input'), { key: 'Backspace' });
    expect(container.querySelectorAll('.tag')[1]).toBe(document.activeElement);
    fireEvent
      .change(container.querySelector('input'), { target: { value: 'Three' } });
    expect(ref.current.inputValue).toBe('Three');

    await act(async () => { ref.current.reset(); });
    expect(ref.current.internalValue.length).toBe(1);
    expect(ref.current.internalValue.pop()).toBe('One');
    expect(container.querySelectorAll('.tag:focus').length).toBe(0);
    expect(ref.current.inputValue).toBe('');
    unmount();
  });

  it('should not open search dropdown when changing input without ' +
    'matching anything', async () => {
    jest.useFakeTimers();
    const { container, unmount } = render(
      <TagsField value={[]} search={autoComplete} />
    );
    fireEvent
      .change(container.querySelector('input'), { target: { value: 'Q' } });
    await act(async () => { jest.runAllTimers(); });
    expect(container.querySelectorAll('.junipero.dropdown-menu').length)
      .toBe(0);
    unmount();
    jest.useRealTimers();
  });

  it('should allow to show search options using objects', async () => {
    const ref = createRef();
    jest.useFakeTimers();
    const { container, unmount } = render(
      <TagsField
        ref={ref}
        value={[]}
        search={autoCompleteWithObjects}
        parseTitle={o => o?.name || o}
      />
    );
    fireEvent
      .change(container.querySelector('input'), { target: { value: 'Dav' } });
    await act(async () => { jest.runAllTimers(); });
    expect(container.querySelector('.junipero.dropdown-item a').innerHTML)
      .toBe('Dave');
    fireEvent.click(container.querySelector('.junipero.dropdown-item a'));
    expect(ref.current.internalValue[0]?.value).toBe('Dave');
    unmount();
    jest.useRealTimers();
  });

  it('should open search dropdown and show an item when changing ' +
    'input and matching an available option', async () => {
    jest.useFakeTimers();
    const ref = createRef();
    const { container, unmount } = render(
      <TagsField ref={ref} value={[]} search={autoComplete} />
    );
    fireEvent
      .change(container.querySelector('input'), { target: { value: 'Liz' } });
    expect(ref.current.searching).toBe(true);
    expect(ref.current.searchResults).toBeNull();
    await act(async () => { jest.runAllTimers(); });
    expect(ref.current.searchResults?.length).toBe(1);
    expect(container.querySelector('.junipero.dropdown-item a').innerHTML)
      .toBe('Lizbeth');
    unmount();
    jest.useRealTimers();
  });

  it('should add last input value when bluring input', async () => {
    const ref = createRef();
    jest.useFakeTimers();
    const { container, unmount } = render(
      <TagsField ref={ref} value={[]} search={autoComplete} />
    );
    await act(async () => { container.querySelector('input').focus(); });
    expect(ref.current.focused).toBe(true);
    fireEvent
      .change(container.querySelector('input'), { target: { value: 'Liz' } });
    await act(async () => { jest.runAllTimers(); });
    expect(container.querySelector('.junipero.dropdown-item a').innerHTML)
      .toBe('Lizbeth');
    await act(async () => { container.querySelector('input').blur(); });
    expect(ref.current.internalValue[0]).toBe('Liz');
    expect(ref.current.focused).toBe(false);
    expect(container.querySelectorAll('.junipero.dropdown-menu').length)
      .toBe(0);
    await act(async () => { container.querySelector('input').focus(); });
    fireEvent
      .change(container.querySelector('input'), { target: { value: 'Liz' } });
    await act(async () => { jest.runAllTimers(); });
    expect(container.querySelectorAll('.junipero.dropdown-menu').length)
      .toBe(1);
    fireEvent.keyDown(container.querySelector('input'), { key: 'Escape' });
    expect(container.querySelectorAll('.junipero.dropdown-menu').length)
      .toBe(0);
    unmount();
    jest.useRealTimers();
  });

  it('should close autocomplete dropdown when hitting backspace and input ' +
    'going empty', async () => {
    const ref = createRef();
    jest.useFakeTimers();
    const { container, unmount } = render(
      <TagsField ref={ref} value={[]} search={autoComplete} />
    );
    await act(async () => { container.querySelector('input').focus(); });
    expect(ref.current.focused).toBe(true);
    fireEvent
      .change(container.querySelector('input'), { target: { value: 'Liz' } });
    await act(async () => { jest.runAllTimers(); });
    expect(container.querySelectorAll('.junipero.dropdown-menu').length)
      .toBe(1);
    expect(container.querySelectorAll('.junipero.dropdown-item').length)
      .toBe(1);
    fireEvent
      .change(container.querySelector('input'), { target: { value: '' } });
    expect(container.querySelectorAll('.junipero.dropdown-menu').length)
      .toBe(0);
    unmount();
    jest.useRealTimers();
  });

  it('should not show options already tagged in the field if component prop ' +
    'autoCompleteUniqueValues is set to true', async () => {
    const ref = createRef();
    jest.useFakeTimers();
    const { container, unmount } = render(
      <TagsField
        ref={ref}
        value={['Lizbeth']}
        search={autoComplete}
        onlyAllowOneOccurence
      />
    );
    await act(async () => { container.querySelector('input').focus(); });
    expect(ref.current.focused).toBe(true);
    fireEvent
      .change(container.querySelector('input'), { target: { value: 'Liz' } });
    await act(async () => { jest.runAllTimers(); });
    expect(container.querySelectorAll('.no-results').length).toBe(1);
    unmount();
    jest.useRealTimers();
  });

  it('should add a new tag when selecting an option in autocomplete ' +
    'dropdown', async () => {
    const ref = createRef();
    jest.useFakeTimers();
    const { container, unmount } = render(
      <TagsField
        ref={ref}
        value={[]}
        search={autoComplete}
      />
    );
    await act(async () => { container.querySelector('input').focus(); });
    expect(ref.current.focused).toBe(true);
    fireEvent
      .change(container.querySelector('input'), { target: { value: 'Free' } });
    await act(async () => { jest.runAllTimers(); });
    expect(container.querySelector('.junipero.dropdown-item a').innerHTML)
      .toBe('Freeman');
    fireEvent.click(container.querySelector('.junipero.dropdown-item a'));
    expect(ref.current.internalValue.length).toBe(1);
    expect(ref.current.internalValue.pop()).toBe('Freeman');
    unmount();
    jest.useRealTimers();
  });

  it('should fire onToggle event when opened/closed', async () => {
    const ref = createRef();
    jest.useFakeTimers();
    const onToggle = jest.fn();
    const { container, unmount } = render(
      <TagsField
        ref={ref}
        value={[]}
        search={autoComplete}
        onToggle={onToggle}
      />
    );
    fireEvent
      .change(container.querySelector('input'), { target: { value: 'Dav' } });
    await act(async () => { jest.runAllTimers(); });
    expect(ref.current.opened).toBe(true);
    expect(onToggle)
      .toHaveBeenLastCalledWith(expect.objectContaining({ opened: true }));
    fireEvent
      .change(container.querySelector('input'), { target: { value: '' } });
    await act(async () => { jest.runAllTimers(); });
    expect(ref.current.opened).toBe(false);
    expect(onToggle)
      .toHaveBeenLastCalledWith(expect.objectContaining({ opened: false }));
    unmount();
    jest.useRealTimers();
  });

  it('should reopen options when bluring input and autoAddOnBlur is ' +
    'disabled', async () => {
    const ref = createRef();
    jest.useFakeTimers();
    const { container, unmount } = render(
      <TagsField
        ref={ref}
        value={[]}
        search={autoComplete}
        autoAddOnBlur={false}
      />
    );
    fireEvent
      .change(container.querySelector('input'), { target: { value: 'Dav' } });
    await act(async () => { jest.runAllTimers(); });
    expect(ref.current.opened).toBe(true);
    expect(container.querySelectorAll('.junipero.dropdown-item a')[0].innerHTML)
      .toBe('Dave');
    fireEvent.click(document.body);
    expect(ref.current.opened).toBe(false);
    expect(container.querySelectorAll('.junipero.dropdown-item a').length)
      .toBe(0);
    await act(async () => { container.querySelector('input').focus(); });
    expect(ref.current.opened).toBe(true);
    expect(container.querySelector('.junipero.dropdown-item a').innerHTML)
      .toBe('Dave');
    unmount();
    jest.useRealTimers();
  });

  it('should allow to select tags using arrow keys', async () => {
    const ref = createRef();
    const { container, rerender, unmount } = render(
      <TagsField
        ref={ref}
        value={['Astor', 'Astrid', 'Dave']}
      />
    );
    fireEvent.keyDown(container.querySelector('input'), { key: 'ArrowLeft' });
    expect(container.querySelector('.tag:focus').textContent).toBe('Dave');
    fireEvent
      .keyDown(container.querySelector('.tag:focus'), { key: 'ArrowLeft' });
    expect(container.querySelector('.tag:focus').textContent).toBe('Astrid');
    fireEvent
      .keyDown(container.querySelector('.tag:focus'), { key: 'ArrowLeft' });
    expect(container.querySelector('.tag:focus').textContent).toBe('Astor');
    fireEvent
      .keyDown(container.querySelector('.tag:focus'), { key: 'ArrowLeft' });
    expect(container.querySelector('.tag:focus').textContent).toBe('Astor');
    fireEvent
      .keyDown(container.querySelector('.tag:focus'), { key: 'ArrowRight' });
    expect(container.querySelector('.tag:focus').textContent).toBe('Astrid');
    fireEvent
      .keyDown(container.querySelector('.tag:focus'), { key: 'ArrowRight' });
    fireEvent
      .keyDown(container.querySelector('.tag:focus'), { key: 'ArrowRight' });
    expect(container.querySelectorAll('input:focus').length).toBe(1);
    await act(async () => { container.querySelector('input').blur(); });
    rerender(
      <TagsField
        ref={ref}
        disabled={true}
        value={['Astor', 'Astrid', 'Dave']}
      />
    );
    fireEvent.keyDown(container.querySelector('input'), { key: 'ArrowLeft' });
    expect(container.querySelectorAll('.tag:focus').length).toBe(0);
    fireEvent
      .keyDown(container.querySelectorAll('.tag')[1], { key: 'ArrowLeft' });
    expect(container.querySelectorAll('.tag:focus').length).toBe(0);
    unmount();
  });

  it('should not to select an already picked option', async () => {
    const ref = createRef();
    jest.useFakeTimers();
    const { container, unmount } = render(
      <TagsField
        ref={ref}
        value={['Astor']}
        options={autoCompleteOptions}
      />
    );
    await act(async () => { container.querySelector('input').focus(); });
    expect(container
      .querySelectorAll('.junipero.dropdown-item a')[1].textContent
    ).toBe('Astor');
    fireEvent.click(container.querySelectorAll('.junipero.dropdown-item a')[1]);
    expect(ref.current.internalValue[1]).toBeUndefined();
    unmount();
    jest.useRealTimers();
  });

  it('should allow to select an already picked option if ' +
    'onlyAllowOneOccurence is disabled', async () => {
    const ref = createRef();
    jest.useFakeTimers();
    const { container, unmount } = render(
      <TagsField
        ref={ref}
        value={['Astor']}
        options={autoCompleteOptions}
        onlyAllowOneOccurence={false}
      />
    );
    await act(async () => { container.querySelector('input').focus(); });
    expect(
      container.querySelectorAll('.junipero.dropdown-item a')[1].textContent
    ).toBe('Astor');
    fireEvent.click(container.querySelectorAll('.junipero.dropdown-item a')[1]);
    expect(ref.current.internalValue[1]).toBe('Astor');
    unmount();
    jest.useRealTimers();
  });

  it('should not allow to remove a tag when input is disabled', async () => {
    const ref = createRef();
    const { rerender, unmount } = render(
      <TagsField
        ref={ref}
        disabled={true}
        value={['Astor']}
      />
    );
    await act(async () => { ref.current.remove(0); });
    expect(ref.current.internalValue[0]).toBe('Astor');
    rerender(
      <TagsField
        ref={ref}
        disabled={false}
        value={['Astor']}
      />
    );
    await act(async () => { ref.current.remove(0); });
    expect(ref.current.internalValue[0]).toBeUndefined();
    unmount();
  });

  it('should update available options when adding unique value', async () => {
    const ref = createRef();
    jest.useFakeTimers();
    const { container, rerender, unmount } = render(
      <TagsField
        ref={ref}
        value={[]}
        options={autoCompleteOptions}
      />
    );
    await act(async () => { container.querySelector('input').focus(); });
    fireEvent.click(container.querySelectorAll('.junipero.dropdown-item a')[1]);
    expect(ref.current.internalValue[0]).toBe('Astor');
    await act(async () => {
      container.querySelector('input').blur();
      container.querySelector('input').focus();
    });
    expect(
      container.querySelectorAll('.junipero.dropdown-item a')[1].textContent
    ).toBe('Astrid');
    fireEvent.click(container.querySelectorAll('.junipero.dropdown-item a')[1]);
    expect(ref.current.internalValue[1]).toBe('Astrid');
    await act(async () => {
      container.querySelector('input').blur();
      container.querySelector('input').focus();
    });
    expect(
      container.querySelectorAll('.junipero.dropdown-item a')[1].textContent
    ).toBe('Freeman');
    await act(async () => { ref.current.remove(1); });
    expect(ref.current.internalValue[1]).toBeUndefined();
    expect(
      container.querySelectorAll('.junipero.dropdown-item a')[1].textContent
    ).toBe('Astrid');
    await act(async () => { ref.current.remove(0); });
    expect(ref.current.internalValue[0]).toBeUndefined();
    expect(
      container.querySelectorAll('.junipero.dropdown-item a')[1].textContent
    ).toBe('Astor');
    rerender(
      <TagsField
        ref={ref}
        value={[]}
        options={autoCompleteOptions}
        onlyAllowOneOccurence={false}
      />
    );
    await act(async () => {
      container.querySelector('input').blur();
      container.querySelector('input').focus();
    });
    fireEvent.click(container.querySelectorAll('.junipero.dropdown-item a')[1]);
    await act(async () => {
      container.querySelector('input').blur();
      container.querySelector('input').focus();
    });
    expect(
      container.querySelectorAll('.junipero.dropdown-item a')[1].textContent
    ).toBe('Astor');
    await act(async () => { ref.current.remove(0); });
    expect(
      container.querySelectorAll('.junipero.dropdown-item a')[1].textContent
    ).toBe('Astor');
    unmount();
    jest.useRealTimers();
  });

  it('should set input as invalid if dirty and validation fails', async () => {
    const ref = createRef();
    jest.useFakeTimers();
    const { container, unmount } = render(
      <TagsField
        ref={ref}
        value={[]}
        validateTag={tag => parseInt(tag) > 0}
        validateInput={val => parseInt(val) > 0}
      />
    );
    fireEvent
      .change(container.querySelector('input'), { target: { value: 'Ast' } });
    expect(ref.current.inputValid).toBe(false);
    fireEvent
      .change(container.querySelector('input'), { target: { value: '10' } });
    expect(ref.current.inputValid).toBe(true);
    await act(async () => { ref.current.add('Dave'); });
    expect(ref.current.valid).toBe(false);
    unmount();
    jest.useRealTimers();
  });

  it('should reset field with value prop tags', async () => {
    const ref = createRef();
    const { rerender, unmount } = render(
      <TagsField
        ref={ref}
        value={['Astor']}
      />
    );
    await act(async () => { ref.current.remove(0); });
    expect(ref.current.internalValue[0]).toBeUndefined();
    await act(async () => { ref.current.reset(); });
    expect(ref.current.internalValue[0]).toBe('Astor');
    rerender(<TagsField ref={ref} />);
    await act(async () => { ref.current.reset(); });
    expect(ref.current.internalValue[0]).toBeUndefined();
    unmount();
  });
});
