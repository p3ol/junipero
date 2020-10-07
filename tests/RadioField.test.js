import React from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

import RadioField from '../src/RadioField';

const items = ['One', 'Two'];

const itemsAsObjects = [{
  title: 'One',
  value: 'one',
}, {
  title: 'Two',
  value: 'two',
}];

describe('<RadioField />', () => {

  it('should render', () => {
    const component = shallow(<RadioField />);
    expect(component.find('.junipero-radio-field').length).toBe(1);
  });

  it('should have default handlers defined', () => {
    expect(RadioField.defaultProps.onChange).toBeDefined();
    expect(RadioField.defaultProps.onChange()).not.toBeDefined();
    expect(RadioField.defaultProps.parseTitle).toBeDefined();
    expect(RadioField.defaultProps.parseTitle(1)).toBe('1');
    expect(RadioField.defaultProps.parseValue).toBeDefined();
    expect(RadioField.defaultProps.parseValue(1)).toBe(1);
  });

  it('should fire onChange event handler when clicking an item', () => {
    const onChange = sinon.spy();
    const onChangeWaitedArgs = { title: 'One', value: 'One' };
    const component = shallow(
      <RadioField
        onChange={onChange}
        value="test"
        items={items}
      />
    );
    component.find('.radio-wrapper').at(0).simulate('click', { button: 0 });
    expect(onChange.calledOnce).toBe(true);
    expect(onChange.calledWith(onChangeWaitedArgs)).toBe(true);
  });

  it('should handle objects as options', () => {
    const onChange = sinon.spy();
    const onChangeWaitedArgs = { title: 'Two', value: 'two' };
    const component = shallow(
      <RadioField
        onChange={onChange}
        value="test"
        items={itemsAsObjects}
        parseTitle={opt => opt.title}
        parseValue={opt => opt.value}
      />
    );
    component.find('.radio-wrapper').at(1).simulate('click', { button: 0 });
    expect(onChange.calledOnce).toBe(true);
    expect(onChange.calledWith(onChangeWaitedArgs)).toBe(true);
  });

  it('shouldn\'t fire onChange event if disabled', () => {
    const onChange = sinon.spy();
    const component = shallow(
      <RadioField
        onChange={onChange}
        value="test"
        items={items}
        disabled={true}
      />
    );
    component.find('.radio-wrapper').at(0).simulate('click', { button: 0 });
    expect(onChange.called).toBe(false);
  });

  it('should set an id and a name correctly to avoid issues on multiple ' +
    'radiofields', () => {
    const component = shallow(
      <RadioField
        id="test"
        name="test"
        value="test"
        items={items}
      />
    );
    expect(component.find('input').at(0).prop('id')).toBe('test');
    expect(component.find('input').at(0).prop('name')).toBe('test');
  });

});
