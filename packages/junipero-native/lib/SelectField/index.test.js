import React, { createRef } from 'react';
import { render, wait, fireEvent } from '@testing-library/react-native';

import SelectField from './';

describe('<SelectField />', () => {

  it('should render', async () => {
    const ref = createRef();
    const { getByTestId } = render(
      <SelectField
        ref={ref}
        placeholder="Choose one item"
      />
    );
    await wait(() => getByTestId('SelectField/Main'));
    expect(getByTestId('SelectField/Main')).toBeTruthy();
    fireEvent.press(getByTestId('SelectField/Field'));
    expect(ref.current.active).toBe(true);
  });
  it('should be able to select a value', async () => {
    const ref = createRef();
    const { getByTestId } = render(
      <SelectField
        ref={ref}
        options={['One', 'Two']}
        placeholder="Choose one item"
      />
    );
    await wait(() => getByTestId('SelectField/Main'));
    fireEvent.press(getByTestId('SelectField/Field'));
    expect(ref.current.active).toBe(true);
    fireEvent.press(getByTestId('One'));
    expect(ref.current.selectedOption).toBe('One');
  });

  it('should display message if there is no options', async () => {
    const ref = createRef();
    const { getByTestId } = render(
      <SelectField
        ref={ref}
        placeholder="Choose one item"
      />
    );
    await wait(() => getByTestId('SelectField/Main'));
    fireEvent.press(getByTestId('SelectField/Field'));
    expect(ref.current.active).toBe(true);
    expect(getByTestId('SelectField/NoResults')).toBeTruthy();
  });

  it('should do nothing if the field is disabled', async () => {
    const ref = createRef();
    const { getByTestId } = render(
      <SelectField
        ref={ref}
        disabled
        placeholder="Choose one item"
      />
    );
    await wait(() => getByTestId('SelectField/Main'));
    fireEvent.press(getByTestId('SelectField/Field'));
    expect(ref.current.active).toBe(false);
  });

  it('should be able to select a value with objectOptions', async () => {
    const options = [
      { title: 'One' },
      { title: 'Two' },
    ];
    let selectedvalue;
    const ref = createRef();
    const { getByTestId } = render(
      <SelectField
        ref={ref}
        placeholder="Choose one item"
        onChange={value => { selectedvalue = value; }}
        options={options}
        parseTitle={o => o.title}
        parseValue={o => o.value}
      />
    );
    await wait(() => getByTestId('SelectField/Main'));
    fireEvent.press(getByTestId('SelectField/Field'));
    expect(ref.current.active).toBe(true);
    fireEvent.press(getByTestId('One'));
    expect(selectedvalue).toBe('One');
  });

  it('should return the value of the selected option', async () => {
    const options = [
      { title: 'One', value: 1 },
      { title: 'Two', value: 2 },
    ];
    let selectedvalue;
    const ref = createRef();
    const { getByTestId } = render(
      <SelectField
        ref={ref}
        placeholder="Choose one item"
        onChange={value => { selectedvalue = value; }}
        options={options}
        parseTitle={o => o.title}
        parseValue={o => o.value}
      />
    );
    await wait(() => getByTestId('SelectField/Main'));
    fireEvent.press(getByTestId('SelectField/Field'));
    expect(ref.current.active).toBe(true);
    fireEvent.press(getByTestId('One'));
    expect(selectedvalue).toBe(1);
  });

  it('should return the result of the research', async () => {
    const search = ['Three', 'Four'];
    const ref = createRef();
    const { getByTestId } = render(
      <SelectField
        ref={ref}
        placeholder="Choose one item"
        options={['One', 'Two']}
        search={val => search.filter(o => (new RegExp(val, 'ig')).test(o))}
      />
    );
    await wait(() => getByTestId('SelectField/Main'));
    fireEvent.press(getByTestId('SelectField/Field'));
    expect(ref.current.active).toBe(true);
    fireEvent.changeText(getByTestId('SelectField/SearchField'), 'Four');
    expect(ref.current.searching).toBe(true);
    expect(ref.current.searchValue).toBe('Four');
    await wait(() => expect(ref.current.searching).toBe(false));
    fireEvent.press(getByTestId('Four'));
    expect(ref.current.selectedOption).toBe('Four');
  });
});
