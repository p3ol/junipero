import React from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

import TagsField from '../src/TagsField';

describe('<TagsField />', () => {

  it('should render', () => {
    const component = mount(<TagsField />);
    expect(component.find('.junipero-tags-field').length).toBe(1);
    expect(component.instance().textInput).toBeDefined();
  });

  it('should have default handlers defined', () => {
    expect(TagsField.defaultProps.animateTag).toBeDefined();
    expect(TagsField.defaultProps.animateTag()).not.toBeDefined();
    expect(TagsField.defaultProps.onBlur).toBeDefined();
    expect(TagsField.defaultProps.onBlur()).not.toBeDefined();
    expect(TagsField.defaultProps.onChange).toBeDefined();
    expect(TagsField.defaultProps.onChange()).not.toBeDefined();
    expect(TagsField.defaultProps.onFocus).toBeDefined();
    expect(TagsField.defaultProps.onFocus()).not.toBeDefined();
    expect(TagsField.defaultProps.parseTitle).toBeDefined();
    expect(TagsField.defaultProps.parseTitle()).not.toBeDefined();
    expect(TagsField.defaultProps.parseValue).toBeDefined();
    expect(TagsField.defaultProps.parseValue()).not.toBeDefined();
  });

  it('should update internal value on value prop change', () => {
    const component = shallow(<TagsField value={[]} />);
    expect(component.state('value')).toBeDefined();
    expect(component.state('value').length).toBe(0);
    component.setProps({ value: ['test'] });
    expect(component.state('value').length).toBe(1);
    component.setProps({ value: null });
    expect(component.state('value').length).toBe(0);
  });

  it('should focus on input when clicked on', () => {
    const component = mount(<TagsField value={[]} />);
    component.find('.junipero-tags-field').simulate('click');
    expect(component.find('input').is(':focus')).toBe(true);
  });

  it('should not focus on input when clicked on if field is disabled', () => {
    const component = mount(<TagsField disabled={true} value={[]} />);
    component.find('.junipero-tags-field').simulate('click');
    expect(component.find('input').is(':focus')).toBe(false);
  });

  it('should set field as focused when focusing input', () => {
    const component = mount(<TagsField value={[]} />);
    component.find('.junipero-tags-field input').simulate('focus');
    expect(component.state('focused')).toBe(true);
  });

  it('should not set field as focused when focusing input if field ' +
    'is disabled', () => {
    const component = mount(<TagsField disabled={true} value={[]} />);
    component.find('.junipero-tags-field input').simulate('focus');
    expect(component.state('focused')).toBe(false);
  });

  it('should not set field as focused when focusing input if event ' +
    'is prevented', () => {
    const onFocus = sinon.spy(e => e.defaultPrevented = true);
    const component = mount(<TagsField onFocus={onFocus} value={[]} />);
    component.find('.junipero-tags-field input').simulate('focus');
    expect(onFocus.called).toBe(true);
    expect(component.state('focused')).toBe(false);
  });

  it('should set field as unfocused when bluring input', () => {
    const component = mount(<TagsField value={[]} />);
    component.find('.junipero-tags-field input').simulate('focus');
    expect(component.state('focused')).toBe(true);
    component.find('.junipero-tags-field input').simulate('blur');
    expect(component.state('focused')).toBe(false);
  });

  it('should not set field as unfocused when bluring input if field ' +
    'is disabled', () => {
    const component = mount(<TagsField value={[]} />);
    component.find('.junipero-tags-field input').simulate('focus');
    expect(component.state('focused')).toBe(true);
    component.setProps({ disabled: true });
    component.find('.junipero-tags-field input').simulate('blur');
    expect(component.state('focused')).toBe(true);
  });

  it('should not set field as unfocused when bluring input if event ' +
    'is prevented', () => {
    const onBlur = sinon.spy(e => e.defaultPrevented = true);
    const component = mount(<TagsField onBlur={onBlur} value={[]} />);
    component.find('.junipero-tags-field input').simulate('focus');
    expect(component.state('focused')).toBe(true);
    component.find('.junipero-tags-field input').simulate('blur');
    expect(onBlur.called).toBe(true);
    expect(component.state('focused')).toBe(true);
  });

  it('should update internal input value on input change event', () => {
    const component = mount(<TagsField value={[]} />);
    component.find('input').simulate('change', { target: { value: 'test' } });
    expect(component.state('input')).toBe('test');
  });

  it('shouldn\'t update internal input value on input change event if ' +
    'field is disabled', () => {
    const component = mount(<TagsField disabled={true} value={[]} />);
    component.find('input').simulate('change', { target: { value: 'test' } });
    expect(component.state('input')).toBe('');
  });

  it('should select last tag when hitting backspace and input is empty', () => {
    const component = mount(<TagsField value={['One', 'Two']} />);
    component.find('input').simulate('keydown', { keyCode: 8 });
    expect(component.state('selected')).toBe(1);
  });

  it('should unselect last tag when hitting esc key', () => {
    const component = mount(<TagsField value={['One', 'Two']} />);
    component.find('input').simulate('keydown', { keyCode: 8 });
    expect(component.state('selected')).toBe(1);
    component.find('input').simulate('keydown', { keyCode: 27 });
    expect(component.state('selected')).toBe(-1);
  });

  it('should remove a previously added tag when hitting backspace and ' +
    'input is empty', () => {
    const component = mount(<TagsField value={['One', 'Two']} />);
    expect(component.state('value').length).toBe(2);
    component.find('input').simulate('keydown', { keyCode: 8 });
    expect(component.state('selected')).toBe(1);
    component.find('input').simulate('keydown', { keyCode: 8 });
    expect(component.state('value').length).toBe(1);
  });

  it('shouldn\'t select, unselect or remove selected tag if field is ' +
    'disabled', () => {
    const component = mount(<TagsField disabled={true} value={['One']} />);
    component.find('input').simulate('keydown', { keyCode: 8 });
    expect(component.state('selected')).toBe(-1);
    component.setProps({ disabled: false });
    component.find('input').simulate('keydown', { keyCode: 8 });
    expect(component.state('selected')).toBe(0);
    component.setProps({ disabled: true });
    component.find('input').simulate('keydown', { keyCode: 27 });
    expect(component.state('selected')).toBe(0);
    component.find('input').simulate('keydown', { keyCode: 8 });
    expect(component.state('value').length).toBe(1);
  });

  it('should add a new tag when hitting enter and input is not empty', () => {
    const component = mount(<TagsField value={['One']} />);
    component.find('input').simulate('change', { target: { value: 'Two' } });
    component.find('input').simulate('keypress', { keyCode: 13 });
    component.find('input').simulate('change', { target: { value: '' } });
    component.find('input').simulate('keypress', { keyCode: 13 });
    expect(component.state('value').length).toBe(2);
    expect(component.state('value')[1]).toBe('Two');
  });

  it('should not add a new tag when hitting any key except enter inside ' +
    'input', () => {
    const component = mount(<TagsField value={['One']} />);
    component.find('input').simulate('change', { target: { value: 'Two' } });
    component.find('input').simulate('keypress', { keyCode: 37 }); // left arrow
    expect(component.state('value').length).toBe(1);
    expect(component.state('value').pop()).toBe('One');
  });

  it('should not add a new tag when hitting enter inside input if field is ' +
    'disabled', () => {
    const component = mount(<TagsField value={['One']} />);
    component.find('input').simulate('change', { target: { value: 'Two' } });
    component.setProps({ disabled: true });
    component.find('input').simulate('keypress', { keyCode: 13 });
    expect(component.state('value').length).toBe(1);
    expect(component.state('value').pop()).toBe('One');
  });

  it('should reset field to prop value when calling reset', () => {
    const component = mount(<TagsField value={['One']} />);
    component.find('input').simulate('change', { target: { value: 'Two' } });
    component.find('input').simulate('keypress', { keyCode: 13 });
    expect(component.state('value').length).toBe(2);
    component.find('input').simulate('keydown', { keyCode: 8 });
    expect(component.state('selected')).toBe(1);
    component.find('input').simulate('change', { target: { value: 'Three' } });
    expect(component.state('input')).toBe('Three');

    component.instance().reset();
    expect(component.state('value').length).toBe(1);
    expect(component.state('value').pop()).toBe('One');
    expect(component.state('selected')).toBe(-1);
    expect(component.state('input')).toBe('');
  });

});
