import React from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

import DateField from '../src/DateField';

describe('<DateField />', () => {

  it('should render', () => {
    const component = mount(<DateField />);
    expect(component.find('.junipero-date-field').length).toBe(1);
  });

  it('should have default handlers defined', () => {
    expect(DateField.defaultProps.onChange).toBeDefined();
    expect(DateField.defaultProps.onChange()).not.toBeDefined();
    expect(DateField.defaultProps.parseTitle).toBeDefined();
    expect(DateField.defaultProps
      .parseTitle(new Date('December 17, 1995 03:24:00')))
      .toBe('Sunday, December 17, 1995');
    expect(DateField.defaultProps.parseValue).toBeDefined();
    expect(DateField.defaultProps.parseValue()).not.toBeDefined();
    expect(DateField.defaultProps.validate).toBeDefined();
    expect(DateField.defaultProps.validate(null)).toBe(false);
  });

  it('should initialize if value prop is defined on mount', () => {
    const component = shallow(
      <DateField value={new Date('December 17, 1995 03:24:00')} />
    );

    const value = component.state('value');
    expect(value).toBeDefined();
    expect(value.getFullYear()).toBe(1995);
    expect(value.getMonth()).toBe(11);
    expect(value.getDate()).toBe(17);
  });

  it('should update internal value when value prop changes', () => {
    const component = shallow(<DateField />);
    expect(component.state('value')).toBeFalsy();
    component.setProps({ value: new Date('December 17, 1995 03:24:00') });

    const value = component.state('value');
    expect(value).toBeDefined();
    expect(value.getFullYear()).toBe(1995);
    expect(value.getMonth()).toBe(11);
    expect(value.getDate()).toBe(17);
  });

  it('should open calendar when clicking field', () => {
    const component = mount(<DateField />);
    component.find('.field').first().simulate('click', { button: 0 });
    expect(component.state('opened')).toBe(true);
  });

  it('shouldn\'t open calendar if field is disabled', () => {
    const component = mount(<DateField disabled={true} />);
    component.find('.field').first().simulate('click', { button: 0 });
    expect(component.state('opened')).toBe(false);
  });

  it('should display previous month on previous arrow click', () => {
    const component = mount(
      <DateField value={new Date('December 17, 1995 03:24:00')} />
    );
    component.find('.field').first().simulate('click', { button: 0 });
    component.find('a.arrow-wrapper.left').first()
      .simulate('click', { button: 0 });

    const value = component.state('displayed');
    expect(value).toBeDefined();
    expect(value.getFullYear()).toBe(1995);
    expect(value.getMonth()).toBe(10);
    expect(value.getDate()).toBe(1);
  });

  it('should jump to previous year on previous arrow click if current ' +
    'month is 0 (january)', () => {
    const component = mount(
      <DateField value={new Date('January 17, 1995 03:24:00')} />
    );
    component.find('.field').first().simulate('click', { button: 0 });
    component.find('a.arrow-wrapper.left').first()
      .simulate('click', { button: 0 });

    const value = component.state('displayed');
    expect(value).toBeDefined();
    expect(value.getFullYear()).toBe(1994);
    expect(value.getMonth()).toBe(11);
    expect(value.getDate()).toBe(1);
  });

  it('should display next month on next arrow click', () => {
    const component = mount(
      <DateField value={new Date('November 17, 1995 03:24:00')} />
    );
    component.find('.field').first().simulate('click', { button: 0 });
    component.find('a.arrow-wrapper.right').first()
      .simulate('click', { button: 0 });

    const value = component.state('displayed');
    expect(value).toBeDefined();
    expect(value.getFullYear()).toBe(1995);
    expect(value.getMonth()).toBe(11);
    expect(value.getDate()).toBe(1);
  });

  it('should jump to next year on next arrow click if current ' +
    'month is 11 (december)', () => {
    const component = mount(
      <DateField value={new Date('December 17, 1995 03:24:00')} />
    );
    component.find('.field').first().simulate('click', { button: 0 });
    component.find('a.arrow-wrapper.right').first()
      .simulate('click', { button: 0 });

    const value = component.state('displayed');
    expect(value).toBeDefined();
    expect(value.getFullYear()).toBe(1996);
    expect(value.getMonth()).toBe(0);
    expect(value.getDate()).toBe(1);
  });

  it('should show a native date field when using native prop', () => {
    const onChange = sinon.spy();
    const component = mount(
      <DateField
        onChange={onChange}
        native={true}
        value={new Date('December 17, 1995 03:24:00')}
      />
    );

    const field = component.find('input[type="date"]');
    expect(field.length).toBe(1);
    field.simulate('change', { target: { value: '2019-03-13' } });
    expect(onChange.called).toBe(true);
    const value = component.state('value');
    expect(value.getFullYear()).toBe(2019);
    expect(value.getMonth()).toBe(2);
    expect(value.getDate()).toBe(13);
  });

  it('should show a label when provided', () => {
    const component = shallow(<DateField label="label" />);
    expect(component.find('label').length).toBe(1);
    expect(component.find('label').html()).toBe('<label>label</label>');
  });

  it('should show an error when provided', () => {
    const component = shallow(<DateField error="error" />);
    expect(component.find('.error').length).toBe(1);
    expect(component.find('.error').html())
      .toBe('<span class="error">error</span>');
  });

  it('should fire onToggle event when opened/closed', () => {
    const onToggle = sinon.spy();
    const component = mount(<DateField onToggle={onToggle} />);

    component.instance().open();
    expect(component.state('opened')).toBe(true);
    expect(onToggle.calledWith(true)).toBe(true);
    component.instance().close();
    expect(component.state('opened')).toBe(false);
    expect(onToggle.calledWith(false)).toBe(true);
  });

  it('should have a 3 days limited datepicker', () => {
    const previousDay = new Date('December 15, 2019 03:57:00');
    const day = new Date('December 16, 2019 05:38:00');
    const nextDay = new Date('December 17, 2019 08:24:00');
    const component = mount(
      <DateField
        minDate={previousDay}
        value={day}
        maxDate={nextDay}
      />
    );
    component.find('.field').first().simulate('click', { button: 0 });
    expect(component.find('.day').not('.disabled').length).toBe(3);
  });

  it('should not pick a disabled date', () => {
    const day = new Date('December 16, 2019 00:00:00');
    const nextDay = new Date('December 17, 2019 00:00:00');
    const component = mount(
      <DateField
        minDate={day}
        value={nextDay}
      />
    );

    component.find('.field').first().simulate('click', { button: 0 });
    component.find('.day.disabled').first().simulate('click', { button: 0 });

    const value = component.state('displayed');
    expect(value.getFullYear()).toBe(2019);
    expect(value.getMonth()).toBe(11);
    expect(value.getDate()).toBe(17);
  });

  it('should add formated "min" and "max" prop to native date input', () => {
    const day = new Date('December 16, 2019');
    const nextDay = new Date('December 17, 2019');
    const component = mount(
      <DateField
        minDate={day}
        maxDate={nextDay}
        value={nextDay}
        native={true}
      />
    );

    const field = component.find('input[type="date"]');
    expect(field.prop('min')).toBe('2019-12-16');
    expect(field.prop('max')).toBe('2019-12-17');
  });

});
