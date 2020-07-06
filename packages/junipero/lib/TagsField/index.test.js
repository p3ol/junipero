import React, { createRef } from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

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
    const component = mount(<TagsField placeholder="Type here" ref={ref} />);
    expect(component.find('.junipero.tags-input').length).toBe(1);
    expect(ref.current?.inputRef.current).toBeDefined();
  });
  //
  it('should have default handlers defined', () => {
    const ref = createRef();
    mount(<TagsField ref={ref} />);

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
  });

  it('should update internal value on value prop change', () => {
    const ref = createRef();
    const component = mount(<TagsField ref={ref} value={[]} />);
    expect(ref.current.internalValue).toBeDefined();
    expect(ref.current.internalValue.length).toBe(0);
    component.setProps({ value: ['test'] });
    expect(ref.current.internalValue.length).toBe(1);
    component.setProps({ value: null });
    expect(ref.current.internalValue.length).toBe(0);
  });

  it('should focus on input when clicked on', () => {
    const component = mount(<TagsField value={[]} />);
    component.find('.wrapper').simulate('mousedown');
    expect(component.find('input').is(':focus')).toBe(true);
  });

  it('should not focus on input when clicked on if field is disabled', () => {
    const component = mount(<TagsField disabled={true} value={[]} />);
    component.find('.wrapper').simulate('mousedown');
    expect(component.find('input').is(':focus')).toBe(false);
  });

  it('should set field as focused when focusing input', () => {
    const ref = createRef();
    const component = mount(<TagsField ref={ref} value={[]} />);
    component.find('input').simulate('focus');
    expect(ref.current.focused).toBe(true);
  });

  it('should not set field as focused when focusing input if field ' +
    'is disabled', () => {
    const ref = createRef();
    const component = mount(<TagsField ref={ref} disabled={true} value={[]} />);
    component.find('input').simulate('focus');
    expect(ref.current.focused).toBe(false);
  });

  it('should set field as unfocused when bluring input', () => {
    const ref = createRef();
    const component = mount(<TagsField ref={ref} value={[]} />);
    component.find('input').simulate('focus');
    expect(ref.current.focused).toBe(true);
    component.find('input').simulate('blur');
    expect(ref.current.focused).toBe(false);
  });

  it('should update internal input value on input change event', () => {
    const ref = createRef();
    const component = mount(<TagsField ref={ref} value={[]} />);
    component.find('input').simulate('change', { target: { value: 'test' } });
    expect(ref.current.inputValue).toBe('test');
  });

  it('shouldn\'t update internal input value on input change event if ' +
    'field is disabled', () => {
    const ref = createRef();
    const component = mount(<TagsField ref={ref} disabled value={[]} />);
    component.find('input').simulate('change', { target: { value: 'test' } });
    expect(ref.current.inputValue).toBe('');
  });

  it('should select last tag when hitting backspace and input is empty', () => {
    const component = mount(<TagsField value={['One', 'Two']} />);
    component.find('input').simulate('keydown', { key: 'Backspace' });
    expect(component.find('.tag').at(1).getDOMNode())
      .toBe(document.activeElement);
  });

  it('should unselect last tag when hitting esc key', () => {
    const component = mount(<TagsField value={['One', 'Two']} />);
    component.find('input').simulate('keydown', { key: 'Backspace' });
    expect(component.find('.tag').at(1).getDOMNode())
      .toBe(document.activeElement);
    component.find('.tag:focus').simulate('keydown', { key: 'Escape' });
    expect(component.find('input').getDOMNode()).toBe(document.activeElement);
  });

  it('should remove a previously added tag when hitting backspace and ' +
    'input is empty', () => {
    const ref = createRef();
    const component = mount(<TagsField ref={ref} value={['One', 'Two']} />);
    expect(ref.current.internalValue.length).toBe(2);
    component.find('input').simulate('keydown', { key: 'Backspace' });
    expect(component.find('.tag').at(1).getDOMNode())
      .toBe(document.activeElement);
    component.find('.tag:focus').simulate('keydown', { key: 'Backspace' });
    component.update();
    expect(ref.current.internalValue.length).toBe(1);
  });

  it('shouldn\'t select, unselect or remove selected tag if field is ' +
    'disabled', () => {
    const ref = createRef();
    const component = mount(
      <TagsField ref={ref} disabled={true} value={['One']} />
    );
    component.find('input').simulate('focus');
    expect(component.find('input:focus').length).toBe(0);
    component.find('input').simulate('keydown', { key: 'Backspace' });
    expect(component.find('.tag:focus').length).toBe(0);
    component.setProps({ disabled: false });
    component.find('input').simulate('keydown', { key: 'Backspace' });
    expect(component.find('.tag').at(0).getDOMNode())
      .toBe(document.activeElement);
    component.setProps({ disabled: true });
    component.find('input').simulate('keydown', { key: 'Backspace' });
    expect(ref.current.internalValue.length).toBe(1);
  });

  it('should add a new tag when hitting enter and input is not empty', () => {
    const ref = createRef();
    const component = mount(<TagsField ref={ref} value={['One']} />);
    component.find('input').simulate('change', { target: { value: 'Two' } });
    component.find('input').simulate('keypress', { key: 'Enter' });
    component.find('input').simulate('change', { target: { value: '' } });
    component.find('input').simulate('keypress', { key: 'Enter' });
    expect(ref.current.internalValue.length).toBe(2);
    expect(ref.current.internalValue[1]).toBe('Two');
  });

  it('should not add a new tag when hitting any key except enter inside ' +
    'input', () => {
    const ref = createRef();
    const component = mount(<TagsField ref={ref} value={['One']} />);
    component.find('input').simulate('change', { target: { value: 'Two' } });
    component.find('input').simulate('keypress', { key: 'LeftArrow' });
    expect(ref.current.internalValue.length).toBe(1);
    expect(ref.current.internalValue.pop()).toBe('One');
  });

  it('should not add a new tag when hitting enter inside input if field is ' +
    'disabled', () => {
    const ref = createRef();
    const component = mount(<TagsField ref={ref} value={['One']} />);
    component.find('input').simulate('change', { target: { value: 'Two' } });
    component.setProps({ disabled: true });
    component.find('input').simulate('keypress', { key: 'Enter' });
    expect(ref.current.internalValue.length).toBe(1);
    expect(ref.current.internalValue.pop()).toBe('One');
  });

  it('should reset field to prop value when calling reset', () => {
    const ref = createRef();
    const component = mount(<TagsField ref={ref} value={['One']} />);
    component.find('input').simulate('change', { target: { value: 'Two' } });
    component.find('input').simulate('keypress', { key: 'Enter' });
    expect(ref.current.internalValue.length).toBe(2);
    component.find('input').simulate('keydown', { key: 'Backspace' });
    expect(component.find('.tag').at(1).getDOMNode())
      .toBe(document.activeElement);
    component.find('input').simulate('change', { target: { value: 'Three' } });
    expect(ref.current.inputValue).toBe('Three');

    act(() => { ref.current.reset(); });
    expect(ref.current.internalValue.length).toBe(1);
    expect(ref.current.internalValue.pop()).toBe('One');
    expect(component.find('.tag:focus').length).toBe(0);
    expect(ref.current.inputValue).toBe('');
  });

  it('should not open search dropdown when changing input without ' +
    'matching anything', () => {
    jest.useFakeTimers();
    const component = mount(
      <TagsField value={[]} search={autoComplete} />);
    component.find('input').simulate('change', { target: { value: 'Q' } });
    act(() => { jest.runAllTimers(); });
    component.update();
    expect(component.find('.junipero.dropdown-menu').length).toBe(0);
  });

  it('should allow to show search options using objects', async () => {
    const ref = createRef();
    jest.useFakeTimers();
    const component = mount(
      <TagsField
        ref={ref}
        value={[]}
        search={autoCompleteWithObjects}
        parseTitle={o => o?.name || o}
      />
    );
    component.find('input').simulate('change', { target: { value: 'Dav' } });
    await act(async () => { jest.runAllTimers(); });
    component.update();
    expect(component.find('.junipero.dropdown-menu').length).toBe(1);
    expect(component.find('.junipero.dropdown-item a').text()).toBe('Dave');
    component.find('.junipero.dropdown-item a').simulate('click');
    expect(ref.current.internalValue[0]?.value).toBe('Dave');
  });

  it('should open search dropdown and show an item when changing ' +
    'input and matching an available option', async () => {
    jest.useFakeTimers();
    const ref = createRef();
    const component = mount(
      <TagsField ref={ref} value={[]} search={autoComplete} />);
    component.find('input').simulate('change', { target: { value: 'Liz' } });
    expect(ref.current.searching).toBe(true);
    expect(ref.current.searchResults).toBeNull();
    await act(async () => { jest.runAllTimers(); });
    component.update();
    expect(ref.current.searchResults?.length).toBe(1);
    expect(component.find('.junipero.dropdown-menu').length).toBe(1);
    expect(component.find('.junipero.dropdown-item').length).toBe(1);
    expect(component.find('.junipero.dropdown-item a').text()).toBe('Lizbeth');
  });

  it('should add last input value when bluring input', async () => {
    const ref = createRef();
    jest.useFakeTimers();
    const component = mount(
      <TagsField ref={ref} value={[]} search={autoComplete} />
    );
    component.find('input').simulate('focus');
    expect(ref.current.focused).toBe(true);
    component.find('input').simulate('change', { target: { value: 'Liz' } });
    await act(async () => { jest.runAllTimers(); });
    component.update();
    expect(component.find('.junipero.dropdown-menu').length).toBe(1);
    expect(component.find('.junipero.dropdown-item').length).toBe(1);
    component.find('input').simulate('blur');
    expect(ref.current.internalValue[0]).toBe('Liz');
    expect(ref.current.focused).toBe(false);
    expect(component.find('.junipero.dropdown-menu').length).toBe(0);
    component.find('input').simulate('focus');
    component.find('input').simulate('change', { target: { value: 'Liz' } });
    await act(async () => { jest.runAllTimers(); });
    component.update();
    expect(component.find('.junipero.dropdown-menu').length).toBe(1);
    component.find('input').simulate('keydown', { key: 'Escape' });
    expect(component.find('.junipero.dropdown-menu').length).toBe(0);
  });

  it('should close autocomplete dropdown when hitting backspace and input ' +
    'going empty', async () => {
    const ref = createRef();
    jest.useFakeTimers();
    const component = mount(
      <TagsField ref={ref} value={[]} search={autoComplete} />
    );
    component.find('input').simulate('focus');
    expect(ref.current.focused).toBe(true);
    component.find('input').simulate('change', { target: { value: 'Liz' } });
    await act(async () => { jest.runAllTimers(); });
    component.update();
    expect(component.find('.junipero.dropdown-menu').length).toBe(1);
    expect(component.find('.junipero.dropdown-item').length).toBe(1);
    component.find('input').simulate('change', { target: { value: '' } });
    expect(component.find('.junipero.dropdown-menu').length).toBe(0);
  });

  it('should not show options already tagged in the field if component prop ' +
    'autoCompleteUniqueValues is set to true', async () => {
    const ref = createRef();
    jest.useFakeTimers();
    const component = mount(
      <TagsField
        ref={ref}
        value={['Lizbeth']}
        search={autoComplete}
        onlyAllowOneOccurence
      />
    );
    component.find('input').simulate('focus');
    expect(ref.current.focused).toBe(true);
    component.find('input').simulate('change', { target: { value: 'Liz' } });
    await act(async () => { jest.runAllTimers(); });
    component.update();
    expect(component.find('.no-results').length).toBe(1);
  });

  it('should add a new tag when selecting an option in autocomplete ' +
    'dropdown', async () => {
    const ref = createRef();
    jest.useFakeTimers();
    const component = mount(
      <TagsField
        ref={ref}
        value={[]}
        search={autoComplete}
      />
    );
    component.find('input').simulate('focus');
    expect(ref.current.focused).toBe(true);
    component.find('input').simulate('change', { target: { value: 'Free' } });
    await act(async () => { jest.runAllTimers(); });
    component.update();
    expect(component.find('.junipero.dropdown-menu').length).toBe(1);
    expect(component.find('.junipero.dropdown-item').length).toBe(1);
    expect(component.find('.junipero.dropdown-item a').text()).toBe('Freeman');
    component.find('.junipero.dropdown-item a').simulate('click');
    expect(ref.current.internalValue.length).toBe(1);
    expect(ref.current.internalValue.pop()).toBe('Freeman');
  });

  it('should fire onToggle event when opened/closed', async () => {
    const ref = createRef();
    jest.useFakeTimers();
    const onToggle = sinon.spy();
    const component = mount(
      <TagsField
        ref={ref}
        value={[]}
        search={autoComplete}
        onToggle={onToggle}
      />
    );

    component.find('input').simulate('change', { target: { value: 'Dav' } });
    await act(async () => { jest.runAllTimers(); });
    component.update();
    expect(ref.current.opened).toBe(true);
    expect(onToggle.calledWith(sinon.match({ opened: true }))).toBe(true);
    component.find('input').simulate('change', { target: { value: '' } });
    await act(async () => { jest.runAllTimers(); });
    component.update();
    expect(ref.current.opened).toBe(false);
    expect(onToggle.calledWith(sinon.match({ opened: false }))).toBe(true);
  });

  it('should reopen options when bluring input and autoAddOnBlur is ' +
    'disabled', async () => {
    const ref = createRef();
    jest.useFakeTimers();
    const component = mount(
      <TagsField
        ref={ref}
        value={[]}
        search={autoComplete}
        autoAddOnBlur={false}
      />
    );

    component.find('input').simulate('change', { target: { value: 'Dav' } });
    await act(async () => { jest.runAllTimers(); });
    component.update();
    expect(ref.current.opened).toBe(true);
    expect(component.find('.junipero.dropdown-item a').text()).toBe('Dave');
    component.find('input').simulate('blur');
    expect(ref.current.opened).toBe(false);
    expect(component.find('.junipero.dropdown-item a').length).toBe(0);
    component.find('input').simulate('focus');
    expect(ref.current.opened).toBe(true);
    expect(component.find('.junipero.dropdown-item a').text()).toBe('Dave');
  });

  it('should allow to select tags using arrow keys', async () => {
    const ref = createRef();
    const component = mount(
      <TagsField
        ref={ref}
        value={['Astor', 'Astrid', 'Dave']}
      />
    );

    component.find('input').simulate('keydown', { key: 'ArrowLeft' });
    expect(component.find('.tag:focus').text()).toBe('Dave');
    component.find('.tag:focus').simulate('keydown', { key: 'ArrowLeft' });
    expect(component.find('.tag:focus').text()).toBe('Astrid');
    component.find('.tag:focus').simulate('keydown', { key: 'ArrowLeft' });
    expect(component.find('.tag:focus').text()).toBe('Astor');
    component.find('.tag:focus').simulate('keydown', { key: 'ArrowLeft' });
    expect(component.find('.tag:focus').text()).toBe('Astor');
    component.find('.tag:focus').simulate('keydown', { key: 'ArrowRight' });
    expect(component.find('.tag:focus').text()).toBe('Astrid');
    component.find('.tag:focus').simulate('keydown', { key: 'ArrowRight' });
    component.find('.tag:focus').simulate('keydown', { key: 'ArrowRight' });
    expect(component.find('input:focus').length).toBe(1);
    component.find('input').simulate('blur');
    component.setProps({ disabled: true });
    component.find('input').simulate('keydown', { key: 'ArrowLeft' });
    expect(component.find('.tag:focus').length).toBe(0);
    component.find('.tag').at(1).simulate('keydown', { key: 'ArrowLeft' });
    expect(component.find('.tag:focus').length).toBe(0);
  });

  it('should not to select an already picked option', async () => {
    const ref = createRef();
    jest.useFakeTimers();
    const component = mount(
      <TagsField
        ref={ref}
        value={['Astor']}
        options={autoCompleteOptions}
      />
    );
    component.find('input').simulate('focus');
    expect(component.find('.junipero.dropdown-item a').at(1).text())
      .toBe('Astor');
    component.find('.junipero.dropdown-item a').at(1).simulate('click');
    expect(ref.current.internalValue[1]).toBeUndefined();
  });

  it('should allow to select an already picked option if ' +
    'onlyAllowOneOccurence is disabled', async () => {
    const ref = createRef();
    jest.useFakeTimers();
    const component = mount(
      <TagsField
        ref={ref}
        value={['Astor']}
        options={autoCompleteOptions}
        onlyAllowOneOccurence={false}
      />
    );
    component.find('input').simulate('focus');
    expect(component.find('.junipero.dropdown-item a').at(1).text())
      .toBe('Astor');
    component.find('.junipero.dropdown-item a').at(1).simulate('click');
    expect(ref.current.internalValue[1]).toBe('Astor');
  });

  it('should not allow to remove a tag when input is disabled', async () => {
    const ref = createRef();
    const component = mount(
      <TagsField
        ref={ref}
        disabled={true}
        value={['Astor']}
      />
    );
    act(() => { ref.current.remove(0); });
    expect(ref.current.internalValue[0]).toBe('Astor');
    component.setProps({ disabled: false });
    act(() => { ref.current.remove(0); });
    expect(ref.current.internalValue[0]).toBeUndefined();
  });

  it('should update available options when adding unique value', async () => {
    const ref = createRef();
    const component = mount(
      <TagsField
        ref={ref}
        value={[]}
        options={autoCompleteOptions}
      />
    );
    component.find('input').simulate('focus');
    component.find('.junipero.dropdown-item a').at(1).simulate('click');
    expect(ref.current.internalValue[0]).toBe('Astor');
    expect(component.find('.junipero.dropdown-item a').at(1).text())
      .toBe('Astrid');
    component.find('input').simulate('focus');
    component.find('.junipero.dropdown-item a').at(1).simulate('click');
    expect(ref.current.internalValue[1]).toBe('Astrid');
    expect(component.find('.junipero.dropdown-item a').at(1).text())
      .toBe('Freeman');
    act(() => { ref.current.remove(1); });
    expect(ref.current.internalValue[1]).toBeUndefined();
    expect(component.find('.junipero.dropdown-item a').at(1).text())
      .toBe('Astrid');
    act(() => { ref.current.remove(0); });
    expect(ref.current.internalValue[0]).toBeUndefined();
    expect(component.find('.junipero.dropdown-item a').at(1).text())
      .toBe('Astor');
    component.setProps({ onlyAllowOneOccurence: false });
    component.find('input').simulate('focus');
    component.find('.junipero.dropdown-item a').at(1).simulate('click');
    expect(component.find('.junipero.dropdown-item a').at(1).text())
      .toBe('Astor');
    act(() => { ref.current.remove(0); });
    expect(component.find('.junipero.dropdown-item a').at(1).text())
      .toBe('Astor');
  });

  it('should set input as invalid if dirty and validation fails', async () => {
    const ref = createRef();
    const component = mount(
      <TagsField
        ref={ref}
        value={[]}
        validateTag={tag => parseInt(tag) > 0}
        validateInput={val => parseInt(val) > 0}
      />
    );
    component.find('input').simulate('change', { target: { value: 'Ast' } });
    expect(ref.current.inputValid).toBe(false);
    component.find('input').simulate('change', { target: { value: '10' } });
    expect(ref.current.inputValid).toBe(true);
    act(() => { ref.current.add('Dave'); });
    expect(ref.current.valid).toBe(false);
  });

  it('should reset field with value prop tags', async () => {
    const ref = createRef();
    const component = mount(
      <TagsField
        ref={ref}
        value={['Astor']}
      />
    );
    act(() => { ref.current.remove(0); });
    expect(ref.current.internalValue[0]).toBeUndefined();
    act(() => { ref.current.reset(); });
    expect(ref.current.internalValue[0]).toBe('Astor');
    component.setProps({ value: undefined });
    act(() => { ref.current.reset(); });
    expect(ref.current.internalValue[0]).toBeUndefined();
  });
});
