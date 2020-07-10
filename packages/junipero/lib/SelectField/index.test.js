import React, { createRef } from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { act } from 'react-dom/test-utils';

import SelectField from './';

describe('<SelectField />', () => {
  const options = ['One', 'Two', 'Three', 'Four'];

  it('should render', () => {
    const ref = createRef();
    const component = mount(<SelectField ref={ref} />);
    component.find('.base').simulate('focus');
    act(() => { ref.current.reset(); });
    component.find('.base').simulate('blur');
    expect(component.find('.junipero.select').length).toBe(1);
  });

  it('should initialize if value prop is defined on mount', () => {
    const ref = createRef();
    mount(<SelectField ref={ref} required value="One" />);
    expect(ref.current.internalValue).toBe('One');
  });

  it('should update internal value when value prop changes', () => {
    const ref = createRef();
    const component = mount(
      <SelectField ref={ref} value="One" options={options} />
    );
    expect(ref.current.internalValue).toBe('One');
    component.setProps({ value: 'Two' });
    expect(ref.current.internalValue).toBe('Two');
  });

  it('should close menu when disabled prop changes', () => {
    const ref = createRef();
    const component = mount(<SelectField ref={ref} options={options} />);
    component.find('.base').simulate('focus');
    expect(ref.current.opened).toBe(true);
    component.setProps({ disabled: true });
    expect(ref.current.opened).toBe(false);
  });

  it('should reset internal value when calling reset method for native', () => {
    const ref = createRef();
    const component = mount(
      <SelectField ref={ref} value="One" options={options} />
    );
    component.find('.base').simulate('focus');
    component.find('.dropdown-item').at(1).find('a').simulate('click');
    expect(ref.current.internalValue).toBe('Two');
    act(() => { ref.current.reset(); });
    expect(ref.current.internalValue).toBe('One');
  });

  it('should search for items on search field change', async () => {
    const search = sinon.spy(() => ['Three']);
    jest.useFakeTimers();

    const component = mount(
      <SelectField autoFocus search={search} value="One" options={options} />
    );
    component.find('.search input').simulate('change', {
      target: { value: 'test' },
    });

    await act(async () => { jest.runAllTimers(); });
    expect(search.calledOnce).toBe(true);
    expect(search.calledWith(sinon.match('test'))).toBe(true);
  });

  it('should show an empty text when no search result is found', async () => {
    const search = sinon.spy(() => []);
    jest.useFakeTimers();

    const ref = createRef();
    const component = mount(
      <SelectField
        autoFocus
        search={search}
        ref={ref}
        value="One"
        options={options}
      />
    );
    component.find('.search input').simulate('change', {
      target: { value: 'test' },
    });

    await act(async () => { jest.runAllTimers(); });
    expect(search.calledOnce).toBe(true);
    expect(search.calledWith(sinon.match('test'))).toBe(true);
    component.update();
    expect(component.find('.no-results').html())
      .toBe('<div class="no-results">No result found :(</div>');
  });

  it('shouldn\'t call search callback when search value is not set or ' +
    'empty', async () => {
    const search = sinon.spy(() => ['Three']);
    jest.useFakeTimers();

    const component = mount(
      <SelectField autoFocus search={search} value="One" options={options} />
    );
    component.find('.search input').simulate('change', {
      target: { value: '' },
    });

    await act(async () => { jest.runAllTimers(); });
    expect(search.called).toBe(false);
  });

  it('should fire onToggle event when opened/closed', () => {
    const onToggle = sinon.spy();
    const ref = createRef();
    mount(
      <SelectField ref={ref} options={options} onToggle={onToggle} />
    );
    act(() => { ref.current.focus(); });
    expect(ref.current.opened).toBe(true);
    expect(onToggle.calledWith(sinon.match({ opened: true }))).toBe(true);
    act(() => { ref.current.blur(); });
    expect(ref.current.opened).toBe(false);
    expect(onToggle.calledWith(sinon.match({ opened: false }))).toBe(true);
  });

  it('should set a custom text if options aren\'t provided or empty', () => {
    const component = mount(
      <SelectField autoFocus noItems="There is no data here." />
    );
    expect(component.find('.dropdown-menu').find('div.no-items').html())
      .toBe('<div class="no-items">There is no data here.</div>');
  });

  it('should accept a value not included in provided options and' +
    ' set it as first index', () => {
    const ref = createRef();
    const component = mount(
      <SelectField autoFocus ref={ref} options={options} value="Five" />
    );
    expect(ref.current.internalValue).toBe('Five');
    component.find('.dropdown-item').at(0).find('a').simulate('click');
    expect(ref.current.internalValue).toBe('One');
  });

  it('should update internal value when options change', () => {
    const ref = createRef();
    const component = mount(
      <SelectField
        ref={ref}
        options={[]}
        value={5}
        parseValue={o => o.value || o}
      />
    );

    expect(ref.current.internalValue).toBe(5);

    component.setProps({
      value: 4,
      options: [
        { title: 'Four', value: 4 },
        { title: 'Five', value: 5 },
        { title: 'Six', value: 6 },
      ],
    });

    expect(ref.current.internalValue?.value).toBe(4);
  });

  it('should allow to select items using keyboard arrows', () => {
    const map = {};
    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };

    const ref = createRef();
    const component = mount(
      <SelectField
        autoFocus
        globalEventsTarget={document}
        ref={ref}
        options={options}
      />
    );

    expect(document.activeElement)
      .toBe(component.find('.dropdown-toggle .base').getDOMNode());
    act(() => { map.keydown({ key: 'ArrowDown' }); });
    expect(document.activeElement)
      .toBe(component.find('.dropdown-item').at(0).getDOMNode());
    act(() => { map.keydown({ key: 'ArrowDown' }); });
    act(() => { map.keydown({ key: 'ArrowDown' }); });
    act(() => { map.keydown({ key: 'ArrowDown' }); });
    expect(document.activeElement)
      .toBe(component.find('.dropdown-item').at(3).getDOMNode());
    act(() => { map.keydown({ key: 'ArrowDown' }); });
    expect(document.activeElement)
      .toBe(component.find('.dropdown-item').at(0).getDOMNode());
    act(() => { map.keydown({ key: 'ArrowUp' }); });
    expect(document.activeElement)
      .toBe(component.find('.dropdown-item').at(3).getDOMNode());
    act(() => { map.keydown({ key: 'ArrowUp' }); });
    act(() => { map.keydown({ key: 'ArrowUp' }); });
    act(() => { map.keydown({ key: 'ArrowUp' }); });
    expect(document.activeElement)
      .toBe(component.find('.dropdown-item').at(0).getDOMNode());
    act(() => { map.keydown({ key: 'ArrowUp' }); });
    expect(document.activeElement)
      .toBe(component.find('.dropdown-item').at(3).getDOMNode());
    component.find('.dropdown-item').at(3)
      .simulate('keypress', { key: 'Enter' });
    expect(ref.current.internalValue).toBe('Four');
  });

  it('should not trigger keyboard actions when menu is not opened', () => {
    const map = {};
    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };
    document.activeElement?.blur();

    const ref = createRef();
    mount(
      <SelectField
        globalEventsTarget={document}
        ref={ref}
      />
    );
    expect(document.activeElement).toBe(document.body);
    act(() => { map.keydown({ key: 'ArrowUp' }); });
    expect(document.activeElement).toBe(document.body);
  });

  it('should not try to select an item if no options are specified', () => {
    const map = {};
    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };
    document.activeElement?.blur();

    const ref = createRef();
    const component = mount(
      <SelectField
        autoFocus
        globalEventsTarget={document}
        ref={ref}
      />
    );

    expect(document.activeElement)
      .toBe(component.find('.dropdown-toggle .base').getDOMNode());
    act(() => { map.keydown({ key: 'ArrowUp' }); });
    expect(document.activeElement)
      .toBe(component.find('.dropdown-toggle .base').getDOMNode());
  });

});
