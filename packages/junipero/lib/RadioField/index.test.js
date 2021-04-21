import React, { createRef } from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import { act } from 'react-dom/test-utils';

import RadioField from './';

describe('<RadioField />', () => {

  it('should render', () => {
    const component = mount(
      <RadioField label="Test" />
    );
    expect(component.find('.junipero.radio').length).toBe(1);
  });

  it('should render with a description', () => {
    const component = mount(
      <RadioField label="Test" description="Description" />
    );
    expect(component.find('.junipero.radio.boxed').length).toBe(1);
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const component = mount(<RadioField ref={ref} label="Test" />);
    expect(ref.current.innerRef.current).toBeDefined();
    expect(component.getDOMNode()).toBe(ref.current.innerRef.current);
  });

  it('should correctly fire onChange event', () => {
    const onChange = sinon.spy();
    const component = mount(
      <RadioField
        checked={true}
        onChange={onChange}
        value='radioField'
      />);
    component.find('input').simulate('change', { target: { checked: true } });
    expect(onChange.withArgs(
      sinon.match({ value: 'radioField', checked: true })
    ).called)
      .toBe(true);
  });

  it('should fire onChange event even if no target is present in event', () => {
    const onChange = sinon.spy();

    const component = shallow(
      <RadioField value="radioField" onChange={onChange} />
    );
    component.find('input').simulate('change', { event: {} });
    expect(onChange.called)
      .toBe(true);
  });

  it('should toggle focused state on focus', () => {
    const component = mount(<RadioField />);
    component.find('label').simulate('focus');
    expect(component.find('.junipero.radio.focused').length).toBe(1);
    component.find('label').simulate('blur');
    expect(component.find('.junipero.radio.focused').length).toBe(0);
  });

  it('should toggle checked state on enter hit if focused', () => {
    const map = {};

    document.addEventListener = (event, cb) => { map[event] = cb; };

    const component = mount(<RadioField globalEventsTarget={document} />);
    component.find('label').simulate('focus');
    expect(component.find('.junipero.radio.focused').length).toBe(1);
    expect(map.keypress).toBeDefined();
    act(() => map.keypress({ key: 'Enter' }));
    component.update();
    expect(component.find('.junipero.radio.checked').length).toBe(1);
  });

  it('should toggle checked state on space hit if focused', () => {
    const map = {};

    document.addEventListener = (event, cb) => { map[event] = cb; };

    const component = mount(<RadioField globalEventsTarget={document} />);
    component.find('label').simulate('focus');
    expect(component.find('.junipero.radio.focused').length).toBe(1);
    expect(map.keypress).toBeDefined();
    act(() => map.keypress({ key: ' ' }));
    component.update();
    expect(component.find('.junipero.radio.checked').length).toBe(1);
  });

  it('should not toggle checked state on space hit if checked', () => {
    const map = {};

    document.addEventListener = (event, cb) => { map[event] = cb; };

    const component = mount(
      <RadioField
        globalEventsTarget={document}
        checked
      />
    );
    component.find('label').simulate('focus');
    expect(component.find('.junipero.radio.checked.focused').length).toBe(1);
    expect(map.keypress).toBeDefined();
    act(() => map.keypress({ key: 'Enter' }));
    component.update();
    expect(component.find('.junipero.radio.checked.focused').length).toBe(1);
  });

  it('should not have a tabIndex if disabled', () => {
    const component = mount(
      <RadioField
        disabled
      />
    );
    expect(component.find('.junipero.radio.disabled').length).toBe(1);
    expect(component.find('label').props().tabIndex).toBe(null);
  });

});
