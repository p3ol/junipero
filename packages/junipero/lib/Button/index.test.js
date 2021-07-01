import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Button from './';

describe('<Button />', () => {

  it('should render', () => {
    const component = shallow(<Button>Click me</Button>);
    component.find('button').simulate('click');
    expect(component.find('.junipero.button').length).toBe(1);
  });

  it('should fire onClick event when handler is passed with props', () => {
    const onClick = sinon.spy();
    const component = shallow(<Button onClick={onClick}>Click me</Button>);
    component.find('button').simulate('click');
    expect(onClick.called).toBe(true);
  });

  it('should not fire onClick event when button is disabled', () => {
    const onClick = sinon.spy();
    const component = shallow(
      <Button disabled onClick={onClick}>Click me</Button>);
    component.find('button').simulate('click');
    expect(onClick.called).toBe(false);
  });

});
