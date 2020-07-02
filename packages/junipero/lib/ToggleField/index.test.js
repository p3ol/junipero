import React, { createRef } from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import { act } from 'react-dom/test-utils';

import ToggleField from './';

describe('<ToggleField />', () => {

  it('should render', () => {
    const component = shallow(<ToggleField checkedLabel="Check this" />);
    component.find('input').simulate('change', { target: { checked: true } });
    expect(component.find('.junipero.toggle').length).toBe(1);
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const component = mount(
      <ToggleField ref={ref} uncheckedLabel="Check this" />
    );
    expect(ref.current.innerRef).toBeDefined();
    expect(component.getDOMNode()).toBe(ref.current.innerRef.current);
  });

  it('should correctly fire onChange event', () => {
    const onChange = sinon.spy();
    const component = mount(<ToggleField checked={true} onChange={onChange} />);
    component.find('input').simulate('change', { target: { checked: true } });
    expect(onChange.withArgs(sinon.match({ checked: true })).called)
      .toBe(true);
  });

  it('should fire onChange event even if no target is present in event', () => {
    const onChange = sinon.spy();
    const component = shallow(<ToggleField onChange={onChange} />);
    component.find('input').simulate('change', { event: {} });
    expect(onChange.withArgs(sinon.match({ checked: false })).called)
      .toBe(true);
  });

  it('should toggle focused state on focus', () => {
    const component = mount(<ToggleField />);
    component.find('label').simulate('focus');
    expect(component.find('.junipero.toggle.focused').length).toBe(1);
    component.find('label').simulate('blur');
    expect(component.find('.junipero.toggle.focused').length).toBe(0);
  });

  it('should toggle checked state on enter or space hit when focused', () => {
    const map = {};
    document.addEventListener = (event, cb) => { map[event] = cb; };

    const component = mount(<ToggleField globalEventsTarget={document} />);
    component.find('label').simulate('focus');
    expect(component.find('.junipero.toggle.focused').length).toBe(1);
    expect(map.keypress).toBeDefined();
    act(() => map.keypress({ key: 'Enter' }));
    component.update();
    expect(component.find('.junipero.toggle.checked').length).toBe(1);
    act(() => map.keypress({ key: ' ' }));
    component.update();
    expect(component.find('.junipero.toggle.checked').length).toBe(0);
    component.find('label').simulate('blur');
  });

  it('should not toggle toggle checked state on enter or space hit ' +
    'and toggle is not focused', () => {
    const map = {};
    document.addEventListener = (event, cb) => { map[event] = cb; };

    const component = mount(<ToggleField globalEventsTarget={document} />);
    expect(component.find('.junipero.toggle.focused').length).toBe(0);
    expect(map.keypress).toBeDefined();
    act(() => map.keypress({ key: 'Enter' }));
    component.update();
    expect(component.find('.junipero.toggle.checked').length).toBe(0);
    act(() => map.keypress({ key: ' ' }));
    component.update();
    expect(component.find('.junipero.toggle.checked').length).toBe(0);
  });

});
