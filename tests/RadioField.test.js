import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import RadioField from '../src/RadioField';

const options = ['One', 'Two'];

const objectsAsOptions = [{
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

  it('should set disabled class if provided in props', () => {
    const component = shallow(<RadioField disabled={true} />);
    expect(component.find('.junipero-radio-field').hasClass('disabled'))
      .toBe(true);
  });

  it('should add custom className if provided in props', () => {
    const component = shallow(<RadioField className="test" />);
    expect(component.find('.junipero-radio-field').hasClass('test'))
      .toBe(true);
  });

  it('should have default handlers defined', () => {
    expect(RadioField.defaultProps.onChange).toBeDefined();
    expect(RadioField.defaultProps.onChange()).not.toBeDefined();
    expect(RadioField.defaultProps.parseTitle).toBeDefined();
    expect(RadioField.defaultProps.parseTitle(1)).toBe('1');
    expect(RadioField.defaultProps.parseValue).toBeDefined();
    expect(RadioField.defaultProps.parseValue(1)).toBe(1);
  });

  it('should check the first radio input if provided value doesnt fit with' +
    'provided options', () => {
    const component = shallow(
      <RadioField
        value="test"
        options={options}
      />
    );
    expect(component.find('input').at(0).prop('checked')).toBe(true);
  });

  it('should fire onChange when component is mounted, to set first option ' +
    'as already selected', () => {
    const onChange = sinon.spy();
    const onChangeWaitedArgs = { title: 'One', value: 'One' };
    shallow(
      <RadioField
        onChange={onChange}
        value="One"
        options={options}
      />
    );
    expect(onChange.calledOnce).toBe(true);
    expect(onChange.calledWith(onChangeWaitedArgs)).toBe(true);
  });

  it('should fire onChange event handler when clicking an item', () => {
    const onChange = sinon.spy();
    const onChangeWaitedArgs = { title: 'One', value: 'One' };
    const component = shallow(
      <RadioField
        onChange={onChange}
        value="One"
        options={options}
      />
    );
    component.find('.radio-wrapper').at(0).simulate('click', { button: 0 });
    expect(onChange.called).toBe(true);
    expect(onChange.calledWith(onChangeWaitedArgs)).toBe(true);
  });

  it('should set "checked" attribute to the checked radio input and ' +
    '"checked" class to the list element', () => {
    const onChange = sinon.spy();
    const component = shallow(
      <RadioField
        onChange={onChange}
        value="One"
        options={options}
      />
    );
    component.find('.radio-wrapper').at(1).simulate('click', { button: 0 });
    expect(component.find('input').at(1).prop('checked')).toBe(true);
    expect(component.find('li').at(1).hasClass('checked')).toBe(true);
  });

  it('should handle objects as options', () => {
    const onChange = sinon.spy();
    const onChangeWaitedArgs = { title: 'Two', value: 'two' };
    const component = shallow(
      <RadioField
        onChange={onChange}
        value="one"
        options={objectsAsOptions}
        parseTitle={opt => opt.title}
        parseValue={opt => opt.value}
      />
    );
    component.find('.radio-wrapper').at(1).simulate('click', { button: 0 });
    expect(onChange.calledTwice).toBe(true);
    expect(onChange.calledWith(onChangeWaitedArgs)).toBe(true);
  });

  it('shouldn\'t fire onChange event if disabled', () => {
    const onChange = sinon.spy();
    const onChangeArgs = { title: 'Two', value: 'two' };
    const component = shallow(
      <RadioField
        onChange={onChange}
        value="one"
        options={options}
        disabled={true}
      />
    );
    component.find('.radio-wrapper').at(0).simulate('click', { button: 0 });
    expect(onChange.calledWith(onChangeArgs)).toBe(false);
  });

  it('should set an id and a name correctly to avoid issues on multiple ' +
    'radiofields', () => {
    const component = shallow(
      <RadioField
        id="test"
        name="test"
        value="one"
        options={options}
      />
    );
    expect(component.find('input').at(0).prop('id')).toBe('test');
    expect(component.find('input').at(0).prop('name')).toBe('test');
  });

});
