import React, { createRef } from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { act } from 'react-dom/test-utils';

import DateField from './';

describe('<DateField />', () => {

  it('should render', () => {
    const ref = createRef();
    const component = mount(<DateField ref={ref} />);
    component.find('.base').simulate('focus');
    act(() => { ref.current.reset(); });
    component.find('.base').simulate('blur');
    expect(component.find('.junipero.date-picker').length).toBe(1);
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const component = mount(<DateField ref={ref} />);
    expect(ref.current.innerRef).toBeDefined();
    expect(component.getDOMNode()).toBe(ref.current.innerRef.current);
    expect(ref.current.fieldRef).toBeDefined();
    expect(ref.current.dropdownRef).toBeDefined();
    expect(ref.current.opened).toBe(false);
    expect(ref.current.reset).toBeDefined();
    expect(ref.current.focus).toBeDefined();
    expect(ref.current.blur).toBeDefined();
    expect(ref.current.displayed).toBeDefined();
    expect(ref.current.selected).toBeDefined();
    expect(ref.current.valid).toBe(false);
  });

  it('should initialize if value prop is defined on mount', () => {
    const ref = createRef();
    mount(
      <DateField
        ref={ref}
        required
        value={new Date('December 17, 1995 03:24:00')}
      />
    );

    const value = ref.current.internalValue;
    expect(value).toBeDefined();
    expect(value.getFullYear()).toBe(1995);
    expect(value.getMonth()).toBe(11);
    expect(value.getDate()).toBe(17);
  });

  it('should update internal value when value prop changes', () => {
    const ref = createRef();
    const component = mount(<DateField ref={ref} />);
    expect(ref.current.internalValue).toBeFalsy();
    component.setProps({ value: new Date('December 17, 1995 03:24:00') });

    const value = ref.current.internalValue;
    expect(value).toBeDefined();
    expect(value.getFullYear()).toBe(1995);
    expect(value.getMonth()).toBe(11);
    expect(value.getDate()).toBe(17);
  });

  it('should open calendar when clicking field', () => {
    const ref = createRef();
    const component = mount(<DateField ref={ref} />);
    component.find('.base').simulate('focus');
    expect(ref.current.opened).toBe(true);
  });

  it('shouldn\'t open calendar if field is disabled', () => {
    const ref = createRef();
    const component = mount(<DateField ref={ref} disabled={true} />);
    component.find('.base').simulate('focus');
    expect(ref.current.opened).toBe(false);
  });

  it('should display previous month on previous arrow click', () => {
    const ref = createRef();
    const component = mount(
      <DateField ref={ref} value={new Date('December 17, 1995 03:24:00')} />
    );
    component.find('.base').simulate('focus');
    component.find('a.arrow-wrapper.left').simulate('click', { button: 0 });

    const value = ref.current.displayed;
    expect(value).toBeDefined();
    expect(value.getFullYear()).toBe(1995);
    expect(value.getMonth()).toBe(10);
    expect(value.getDate()).toBe(17);
  });

  it('should jump to previous year on previous arrow click if current ' +
    'month is 0 (january)', () => {
    const ref = createRef();
    const component = mount(
      <DateField ref={ref} value={new Date('January 17, 1995 03:24:00')} />
    );
    component.find('.base').simulate('focus');
    component.find('a.arrow-wrapper.left').simulate('click', { button: 0 });

    const value = ref.current.displayed;
    expect(value).toBeDefined();
    expect(value.getFullYear()).toBe(1994);
    expect(value.getMonth()).toBe(11);
    expect(value.getDate()).toBe(17);
  });

  it('should display next month on next arrow click', () => {
    const ref = createRef();
    const component = mount(
      <DateField ref={ref} value={new Date('November 17, 1995 03:24:00')} />
    );
    component.find('.base').simulate('focus');
    component.find('a.arrow-wrapper.right').simulate('click', { button: 0 });

    const value = ref.current.displayed;
    expect(value).toBeDefined();
    expect(value.getFullYear()).toBe(1995);
    expect(value.getMonth()).toBe(11);
    expect(value.getDate()).toBe(17);
  });

  it('should jump to next year on next arrow click if current ' +
    'month is 11 (december)', () => {
    const ref = createRef();
    const component = mount(
      <DateField ref={ref} value={new Date('December 17, 1995 03:24:00')} />
    );
    component.find('.base').simulate('focus');
    component.find('a.arrow-wrapper.right').simulate('click', { button: 0 });

    const value = ref.current.displayed;
    expect(value).toBeDefined();
    expect(value.getFullYear()).toBe(1996);
    expect(value.getMonth()).toBe(0);
    expect(value.getDate()).toBe(17);
  });

  it('should show a placeholder when provided', () => {
    const component = mount(<DateField placeholder="placeholder" />);
    expect(component.find('.placeholder').length).toBe(1);
    expect(component.find('.placeholder').html())
      .toBe('<span class="placeholder">placeholder</span>');
  });

  it('should show a label when provided and field is dirty', () => {
    const component = mount(
      <DateField label="label" autoFocus={true} placeholder="placeholder" />
    );
    expect(component.find('.placeholder').length).toBe(1);
    expect(component.find('.placeholder').html())
      .toBe('<span class="placeholder">placeholder</span>');
    component.find('.day').first().simulate('click');
    expect(component.find('.placeholder').length).toBe(0);
    expect(component.find('.label').length).toBe(1);
    expect(component.find('.label').html())
      .toBe('<span class="label">label</span>');
  });

  it('should fire onToggle event when opened/closed', () => {
    const ref = createRef();
    const onToggle = sinon.spy();
    mount(<DateField ref={ref} onToggle={onToggle} />);

    act(() => { ref.current.focus(); });
    expect(ref.current.opened).toBe(true);
    expect(onToggle.calledWith(sinon.match({ opened: true }))).toBe(true);
    act(() => { ref.current.blur(); });
    expect(ref.current.opened).toBe(false);
    expect(onToggle.calledWith(sinon.match({ opened: false }))).toBe(true);
  });

  it('should have a 3 days limited datepicker', () => {
    const previousDay = new Date('December 15, 2019');
    const day = new Date('December 16, 2019');
    const nextDay = new Date('December 17, 2019');
    const component = mount(
      <DateField min={previousDay} value={day} max={nextDay} />
    );
    component.find('.base').simulate('focus');
    expect(component.find('.day').not('.disabled').length).toBe(3);
  });

  it('should not pick a disabled date', () => {
    const ref = createRef();
    const day = new Date(2019, 11, 16);
    const nextDay = new Date(2019, 11, 17);
    const component = mount(
      <DateField autoFocus={true} ref={ref} min={day} value={nextDay} />
    );

    component.find('.day.disabled').first().simulate('click', { button: 0 });

    const value = ref.current.displayed;
    expect(value.getFullYear()).toBe(2019);
    expect(value.getMonth()).toBe(11);
    expect(value.getDate()).toBe(17);
  });

  it('should be able to reset date to original value', () => {
    const ref = createRef();
    const day = new Date(2019, 11, 16);
    const component = mount(
      <DateField autoFocus={true} ref={ref} value={day} />
    );

    component.find('.day').first().simulate('click', { button: 0 });
    let value = new Date(ref.current.internalValue.toUTCString());
    expect(value.getFullYear()).toBe(2019);
    expect(value.getMonth()).toBe(10);
    expect(value.getDate()).toBe(25);
    act(() => { ref.current.reset(); });
    value = ref.current.internalValue;
    expect(value.getFullYear()).toBe(2019);
    expect(value.getMonth()).toBe(11);
    expect(value.getDate()).toBe(16);
  });
});
