import React, { createRef } from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import { act } from 'react-dom/test-utils';

import CheckboxField from './';

describe('<CheckboxField />', () => {

  it('should render', () => {
    const component = shallow(<CheckboxField>Check this</CheckboxField>);
    component.find('input').simulate('change', { target: { checked: true } });
    expect(component.find('.junipero.checkbox').length).toBe(1);
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const component = mount(
      <CheckboxField ref={ref}>Check this</CheckboxField>);
    expect(ref.current.innerRef).toBeDefined();
    expect(component.getDOMNode()).toBe(ref.current.innerRef.current);
  });

  it('should correctly fire onChange event', () => {
    const onChange = sinon.spy();
    const component = mount(<CheckboxField onChange={onChange} />);
    component.find('input').simulate('change', { target: { checked: true } });
    expect(onChange.withArgs(sinon.match({ checked: true })).called)
      .toBe(true);
  });

  it('should correctly fire onChange event', () => {
    const onChange = sinon.spy();
    const component = shallow(<CheckboxField onChange={onChange} />);
    component.find('input').simulate('change', { target: { checked: true } });
    expect(onChange.withArgs(sinon.match({ checked: true })).called)
      .toBe(true);
  });

  it('should fire onChange event even if no target is present in event', () => {
    const onChange = sinon.spy();
    const component = shallow(<CheckboxField onChange={onChange} />);
    component.find('input').simulate('change', { event: {} });
    expect(onChange.withArgs(sinon.match({ checked: false })).called)
      .toBe(true);
  });

  it('should toggle checkbox active state on click', () => {
    const map = {};

    document.addEventListener = (event, cb) => { map[event] = cb; };

    const component = mount(<CheckboxField globalEventsTarget={document} />);
    component.find('label').simulate('mousedown');
    expect(component.find('.junipero.checkbox.active').length).toBe(1);
    expect(map.mouseup).toBeDefined();
    act(() => map.mouseup());
    component.update();
    expect(component.find('.junipero.checkbox.active').length).toBe(0);
  });

  it('should toggle checkbox focused state on focus', () => {
    const component = mount(<CheckboxField />);
    component.find('label').simulate('focus');
    expect(component.find('.junipero.checkbox.focused').length).toBe(1);
    component.find('label').simulate('blur');
    expect(component.find('.junipero.checkbox.focused').length).toBe(0);
  });

  it('should toggle checkbox checked state on enter or space hit ' +
    'when focused', () => {
    const map = {};

    document.addEventListener = (event, cb) => { map[event] = cb; };

    const component = mount(<CheckboxField globalEventsTarget={document} />);
    component.find('label').simulate('focus');
    expect(component.find('.junipero.checkbox.focused').length).toBe(1);
    expect(map.keypress).toBeDefined();
    act(() => map.keypress({ key: 'Enter' }));
    component.update();
    expect(component.find('.junipero.checkbox.checked').length).toBe(1);
    act(() => map.keypress({ key: ' ' }));
    component.update();
    expect(component.find('.junipero.checkbox.checked').length).toBe(0);
    component.find('label').simulate('blur');
  });

  it('should not toggle checkbox checked state on enter or space hit ' +
    'and checkbox is not focused', () => {
    const map = {};

    document.addEventListener = (event, cb) => { map[event] = cb; };

    const component = mount(<CheckboxField globalEventsTarget={document} />);
    expect(component.find('.junipero.checkbox.focused').length).toBe(0);
    expect(map.keypress).toBeDefined();
    act(() => map.keypress({ key: 'Enter' }));
    component.update();
    expect(component.find('.junipero.checkbox.checked').length).toBe(0);
    act(() => map.keypress({ key: ' ' }));
    component.update();
    expect(component.find('.junipero.checkbox.checked').length).toBe(0);
  });

});
