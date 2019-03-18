import React from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

import SelectField from '../src/SelectField';
import DropdownToggle from '../src/DropdownToggle';
import DropdownItem from '../src/DropdownItem';
import TextField from '../src/TextField';

describe('<SelectField />', () => {
  const options = ['One', 'Two', 'Three', 'Four'];

  it('should render', () => {
    const component = mount(<SelectField options={options} />);
    expect(component.find('.junipero-select-field').length).toBe(1);
    component.find(DropdownToggle).simulate('click');
    expect(component.instance().menuRef).toBeDefined();
  });

  it('should have default handlers defined', () => {
    expect(SelectField.defaultProps.onChange).toBeDefined();
    expect(SelectField.defaultProps.onChange()).not.toBeDefined();
    expect(SelectField.defaultProps.parseTitle).toBeDefined();
    expect(SelectField.defaultProps.parseTitle(1)).toBe('1');
    expect(SelectField.defaultProps.parseValue).toBeDefined();
    expect(SelectField.defaultProps.parseValue(1)).toBe(1);
  });

  it('should render a native select field if native prop is provided', () => {
    const component = mount(
      <SelectField
        options={options}
        native={true}
        placeholder="Select one..."
      />
    );
    expect(component.find('select.field').length).toBe(1);
    expect(component.instance().nativeField).toBeDefined();
  });

  it('should initialize if value prop is defined on mount', () => {
    const component = shallow(<SelectField options={options} value="One" />);
    expect(component.instance().getValue()).toBe('One');
  });

  it('should update internal value when value prop changes', () => {
    const component = shallow(
      <SelectField value="One" options={options} />
    );
    expect(component.instance().getValue()).toBe('One');
    component.setProps({ value: 'Two' });
    expect(component.instance().getValue()).toBe('Two');
  });

  it('should update internal value when value prop changes for native ' +
    'field', () => {
    const component = shallow(
      <SelectField
        value="One"
        options={options}
        native={true}
      />
    );
    expect(component.instance().getValue()).toBe('One');
    component.setProps({ value: 'Three' });
    expect(component.instance().getValue()).toBe('Three');
  });

  it('should close menu when disabled prop change', () => {
    const component = mount(<SelectField options={options} />);
    component.find('.field').first().simulate('click', { button: 0 });
    expect(component.state('opened')).toBe(true);
    component.setProps({ disabled: true });
    expect(component.state('opened')).toBe(false);
  });

  it('should not trigger onChange event when disabled', () => {
    const onChange = sinon.spy();
    const component = shallow(
      <SelectField
        onChange={onChange}
        disabled={true}
        value="One"
        options={options}
      />
    );

    component.setProps({ value: 'Two' });
    expect(component.instance().getValue()).toBe('One');
    expect(onChange.called).toBe(false);
  });

  it('should not trigger onChange event when disabled for native field', () => {
    const onChange = sinon.spy();
    const component = shallow(
      <SelectField
        native={true}
        onChange={onChange}
        disabled={true}
        value="One"
        options={options}
      />
    );

    component.setProps({ value: 'Two' });
    expect(component.instance().getValue()).toBe('One');
    expect(onChange.called).toBe(false);
  });

  it('should reset internal value when calling reset method for native', () => {
    const component = mount(<SelectField value="One" options={options} />);
    component.find(DropdownToggle).simulate('click');
    component.find(DropdownItem).at(1).find('a').simulate('click');
    expect(component.instance().getValue()).toBe('Two');
    component.instance().reset();
    expect(component.instance().getValue()).toBe('One');
  });

  it('should reset internal value when calling reset method for native ' +
    'field', () => {
    const component = shallow(
      <SelectField value="One" options={options} native={true} />
    );
    component.find('select.field').simulate('change', { target: {
      value: 1,
    }});
    expect(component.instance().getValue()).toBe('Two');
    component.instance().reset();
    expect(component.instance().getValue()).toBe('One');
  });

  it('should search for items on auto complete field change', () => {
    const autoComplete = sinon.spy((search, cb) => cb('Three'));
    jest.useFakeTimers();

    const component = mount(
      <SelectField autoComplete={autoComplete} value="One" options={options} />
    );
    component.find(DropdownToggle).simulate('click');
    component.find(TextField).find('input.field')
      .simulate('change', { target: {
        value: 'test',
      }});

    jest.runAllTimers();
    expect(autoComplete.calledOnce).toBe(true);
    expect(autoComplete.calledWith(sinon.match('test'))).toBe(true);
  });

  it('shouldn\'t call autoComplete callback when autocomplete value is ' +
    'not set or empty', () => {
    const autoComplete = sinon.spy((search, cb) => cb('Three'));
    jest.useFakeTimers();

    const component = mount(
      <SelectField autoComplete={autoComplete} value="One" options={options} />
    );
    component.find(DropdownToggle).simulate('click');
    component.find(TextField).find('input.field')
      .simulate('change', { target: {
        value: '',
      }});

    jest.runAllTimers();
    expect(autoComplete.called).toBe(false);
  });

  it('should show an error when provided', () => {
    const component = shallow(<SelectField options={options} error="error" />);
    expect(component.find('.error').length).toBe(1);
    expect(component.find('.error').html())
      .toBe('<span class="error">error</span>');
  });
});
