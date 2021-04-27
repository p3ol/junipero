import React, { createRef } from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { act } from 'react-dom/test-utils';

import RadioField from './';

describe('<RadioField />', () => {
  const basicOptions = [
    { title: 'Apple', value: 'Apple' },
    { title: 'Pear', value: 'Pear' },
    { title: 'Orange', value: 'Orange' },
  ];

  const withDescriptions = [
    { title: 'Apple', value: 'Apple', description: 'This is a description' },
    { title: 'Pear', value: 'Pear', description: 'This is a description' },
    { title: 'Orange', value: 'Orange', description: 'This is a description' },
  ];

  it('should render', () => {
    const component = mount(
      <RadioField options={basicOptions} />
    );
    expect(component.find('.junipero.radio label').length).toBe(3);
  });

  it('should render no options without error', () => {
    const component = mount(
      <RadioField />
    );
    expect(component.find('.junipero.radio label').length).toBe(0);
  });

  it('should render with descriptions', () => {
    const component = mount(
      <RadioField options={withDescriptions} />
    );
    expect(component.find('.junipero.radio .boxed').length).toBe(3);
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const component = mount(<RadioField ref={ref} options={basicOptions} />);
    expect(ref.current.innersRef.current.length).toBe(3);
    expect(ref.current.inputsRef.current.length).toBe(3);
    expect(component.getDOMNode().querySelectorAll('input')[0]).toBe(
      ref.current.inputsRef.current[0]
    );
  });

  it('should correctly fire onChange event', () => {
    const onChange = sinon.spy();
    const component = mount(
      <RadioField
        onChange={onChange}
        options={basicOptions}
      />);
    component.find('input').at(1).simulate(
      'change', { target: { name: 'Pear', value: 'Pear' } }
    );
    expect(onChange.withArgs(
      sinon.match({ value: 'Pear' })
    ).called)
      .toBe(true);
  });

  it('should not throw error if no onChange', () => {
    let error = null;

    try {
      const component = mount(
        <RadioField
          options={basicOptions}
        />);
      component.find('input').at(1).simulate(
        'change', { target: { name: 'Pear', value: 'Pear' } }
      );
    } catch (e) {
      error = e;
    }

    expect(error).toBeNull();
  });

  it('should not fire onChange event if all disabled', () => {
    const onChange = sinon.spy();
    const component = mount(
      <RadioField
        disabled
        onChange={onChange}
        options={basicOptions}
      />);
    component.find('input').at(1).simulate(
      'change', { target: { name: 'Pear', value: 'Pear' } }
    );
    expect(onChange.withArgs(
      sinon.match({ value: 'Pear' })
    ).called)
      .toBe(false);
  });

  it('should not fire onChange if element is disabled', () => {
    const options_ = [...basicOptions];
    options_[0].disabled = true;
    const onChange = sinon.spy();
    const component = mount(
      <RadioField
        onChange={onChange}
        options={basicOptions}
      />);
    component.find('input').at(0).simulate(
      'change', { target: { name: 'Apple', value: 'Apple' } }
    );
    expect(onChange.withArgs(
      sinon.match({ value: 'Apple' })
    ).called)
      .toBe(false);
  });

  it('should fire onChange on focused element on enter hit', () => {
    const onChange = sinon.spy();
    const map = {};

    document.addEventListener = (event, cb) => { map[event] = cb; };

    const component = mount(
      <RadioField
        globalEventsTarget={document}
        options={basicOptions}
        onChange={onChange}
      />
    );

    component.find('label').at(0).simulate('focus');
    expect(component.find('.junipero.radio .focused').length).toBe(1);
    expect(map.keypress).toBeDefined();
    act(() => map.keypress({ key: 'Enter' }));
    component.update();
    expect(onChange.withArgs(
      sinon.match({ value: 'Apple' })
    ).called).toBe(true);
  });

  it('should fire onChange on focused element on space hit', () => {
    const onChange = sinon.spy();
    const map = {};

    document.addEventListener = (event, cb) => { map[event] = cb; };

    const component = mount(
      <RadioField
        globalEventsTarget={document}
        options={basicOptions}
        onChange={onChange}
      />
    );
    component.find('label').at(1).simulate('focus');
    expect(component.find('.junipero.radio .focused').length).toBe(1);
    expect(map.keypress).toBeDefined();
    act(() => map.keypress({ key: ' ' }));
    component.update();
    expect(onChange.withArgs(
      sinon.match({ value: 'Pear' })
    ).called).toBe(true);
  });

  it('should toggle focused state on focus', () => {
    const component = mount(<RadioField options={basicOptions} />);
    component.find('label').at(0).simulate('focus');
    expect(component.find('.junipero.radio .focused').length).toBe(1);
    component.find('label').at(0).simulate('blur');
    expect(component.find('.junipero.radio .focused').length).toBe(0);
  });

  it('should not uncheck on enter hit if checked', () => {
    const map = {};
    const onChange = sinon.spy();

    document.addEventListener = (event, cb) => { map[event] = cb; };

    const component = mount(
      <RadioField
        globalEventsTarget={document}
        options={basicOptions}
        onChange={onChange}
        value='Apple'
      />);
    component.find('label').at(0).simulate('focus');
    expect(component.find('.junipero.radio .checked').length).toBe(1);
    expect(map.keypress).toBeDefined();
    act(() => map.keypress({ key: 'Enter' }));
    component.update();
    expect(component.find('.junipero.radio .checked').length).toBe(1);
  });
});
