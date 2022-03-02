import { Component, createRef } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { omit } from '@poool/junipero-utils';

import Tabs from './';
import Tab from '../Tab';

describe('<Tabs />', () => {
  it('should render', () => {
    const { container, unmount } = render(
      <Tabs />
    );
    expect(container.querySelectorAll('.junipero.tabs').length).toBe(1);
    unmount();
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <Tabs ref={ref}>
        <Tab title="One">One</Tab>
      </Tabs>
    );
    expect(ref.current.innerRef).toBeDefined();
    expect(container.querySelector('.junipero.tabs'))
      .toBe(ref.current.innerRef.current);
    unmount();
  });

  it('should fire onChange event when changing tab', () => {
    const onChange = jest.fn();
    const { container, unmount } = render(
      <Tabs onChange={onChange}>
        <Tab>One</Tab>
        <Tab>Two</Tab>
      </Tabs>
    );
    fireEvent.click(container.querySelectorAll('li.title a')[1]);
    expect(onChange).toHaveBeenCalledWith(1);
    unmount();
  });

  it('should change internal active tab when changing prop', () => {
    const ref = createRef();
    const { rerender, unmount } = render(
      <Tabs ref={ref}><Tab>test</Tab></Tabs>
    );
    expect(ref.current.activeTab).toBe(0);
    rerender(
      <Tabs active={1} ref={ref}><Tab>test</Tab></Tabs>
    );
    expect(ref.current.activeTab).toBe(1);
    unmount();
  });

  it('should change active tab when clicking on another tab title', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <Tabs ref={ref}>
        <Tab>tab1</Tab>
        <Tab>tab2</Tab>
      </Tabs>
    );
    expect(ref.current.activeTab).toBe(0);
    fireEvent.click(container.querySelectorAll('li.title a')[1]);
    expect(ref.current.activeTab).toBe(1);
    unmount();
  });

  it('shouldn\'t change active tab if tab is disabled', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <Tabs ref={ref}>
        <Tab>tab1</Tab>
        <Tab disabled={true}>tab2</Tab>
      </Tabs>
    );
    expect(ref.current.activeTab).toBe(0);
    fireEvent.click(container.querySelectorAll('li.title a')[1]);
    expect(ref.current.activeTab).toBe(0);
    unmount();
  });

  it('should be able to display tabs even when wrapped inside another ' +
    'component when using the filterTab prop', () => {
    class Wrapper extends Component {
      static defaultProps = { mdxType: 'Tab' };

      render () {
        return <Tab { ...omit(this.props, ['mdxType']) } />;
      }
    }

    const { getByText, unmount } = render(
      <Tabs filterTab={c => c.props.mdxType === 'Tab'}>
        <Wrapper title="Tab 1">tab1</Wrapper>
        <Wrapper title="Tab 2">tab2</Wrapper>
      </Tabs>
    );

    expect(getByText('Tab 1')).toBeTruthy();
    expect(getByText('Tab 2')).toBeTruthy();
    unmount();
  });

  it('should not be able to display tabs when wrapped inside another ' +
    'component if no filterTab prop is passed', () => {
    const Wrapper = props => <Tab { ...props } />;

    const { queryByText, unmount } = render(
      <Tabs>
        <Wrapper title="Tab 1">tab1</Wrapper>
        <Wrapper title="Tab 2">tab2</Wrapper>
      </Tabs>
    );

    expect(queryByText('Tab 1')).toBeFalsy();
    unmount();
  });
});
