import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';

import Alert from './';

describe('<Alert />', () => {

  it('should render Alert box', () => {
    const component = mount(<Alert icon="🐱" />);
    expect(component.find('.junipero.alert').length).toBe(1);
  });

  it('should be able to trigger onClose', () => {
    const onClose = sinon.spy();
    const component = mount(<Alert onClose={onClose} />);
    component.find('.close').simulate('click');
    expect(onClose.called).toBe(true);
  });

  it('should be able to trigger onClick', () => {
    const onClick = sinon.spy();
    const component = mount(<Alert onClick={onClick} />);
    component.simulate('click');
    expect(onClick.called).toBe(true);
  });

});
