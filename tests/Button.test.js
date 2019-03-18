import React from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

import Button from '../src/Button';

describe('<Button />', () => {

  it('should render', () => {
    const component = mount(<Button />);
    expect(component.find('.junipero-button').length).toBe(1);
    expect(component.instance().innerRef).toBeTruthy();
  });

  it('should have a default onClick handler', () => {
    expect(Button.defaultProps.onClick).toBeDefined();
    expect(Button.defaultProps.onClick()).not.toBeDefined();
  });

  it('should fire provided onClick handler', () => {
    const onClick = sinon.spy();
    const component = shallow(<Button onClick={onClick} />);
    component.find('a').simulate('click');
    expect(onClick.called).toBe(true);
  });

  it('shouln\'t fire onClick handler when button is disabled', () => {
    const onClick = sinon.spy();
    const component = shallow(<Button disabled={true} onClick={onClick} />);
    component.find('a').simulate('click');
    expect(onClick.called).toBe(false);
  });

  it('should replace <a /> tag with a <button /> tag', () => {
    const component = shallow(<Button tag="button" />);
    expect(component.find('button').length).toBe(1);
  });

  it('should have a submit type if tag is button and submit is true', () => {
    const component = shallow(<Button submit={true} tag="button" />);
    expect(component.find('button').prop('type')).toBe('submit');
  });

});
