import React, { Component, createRef } from 'react';
import { fireEvent, render, act } from '@testing-library/react';
import { omit } from '@poool/junipero-utils';

import Dropdown from './';
import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';
import DropdownItem from '../DropdownItem';

describe('<Dropdown />', () => {
  it('should render', () => {
    const { container, unmount } = render(<Dropdown />);
    expect(container.querySelectorAll('.junipero.dropdown').length).toBe(1);
    unmount();
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const { container, unmount } = render(<Dropdown ref={ref} />);
    expect(ref.current.innerRef.current).toBeDefined();
    expect(container.querySelector('.junipero.dropdown'))
      .toBe(ref.current.innerRef.current);
    expect(ref.current.toggleRef).toBeDefined();
    expect(ref.current.menuRef).toBeDefined();
    expect(ref.current.opened).toBe(false);
    expect(ref.current.toggle).toBeDefined();
    expect(ref.current.open).toBeDefined();
    expect(ref.current.close).toBeDefined();
    expect(ref.current.update).toBeDefined();
    expect(ref.current.forceUpdate).toBeDefined();
    unmount();
  });

  it('should render a full dropdown with toggle, menu & items', () => {
    const ref = createRef();
    const { container, getByText, unmount } = render(
      <Dropdown ref={ref}>
        <DropdownToggle>Open me</DropdownToggle>
        <DropdownMenu>
          <DropdownItem>Menu item</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
    expect(getByText('Open me')).toBeTruthy();
    fireEvent.click(getByText('Open me'));
    expect(ref.current.opened).toBe(true);
    expect(container.querySelectorAll('.junipero.dropdown-menu').length)
      .toBe(1);
    expect(getByText('Menu item')).toBeTruthy();
    unmount();
  });

  it('should be able to detect inner toggle & menu even when wrapped ' +
    'inside other components when using the proper filter* props', () => {
    const ref = createRef();

    class CustomDropdownToggle extends Component {
      static defaultProps = { mdxType: 'DropdownToggle' };

      render () {
        return <DropdownToggle { ...omit(this.props, ['mdxType']) } />;
      }
    }

    class CustomDropdownMenu extends React.Component {
      static defaultProps = { mdxType: 'DropdownMenu' };

      render () {
        return <DropdownMenu { ...omit(this.props, ['mdxType']) } />;
      }
    }

    const { unmount } = render(
      <Dropdown
        filterToggle={c => c.props.mdxType === 'DropdownToggle'}
        filterMenu={c => c.props.mdxType === 'DropdownMenu'}
        ref={ref}
      >
        <CustomDropdownToggle>Open me</CustomDropdownToggle>
        <CustomDropdownMenu>
          <DropdownItem>Menu item</DropdownItem>
        </CustomDropdownMenu>
      </Dropdown>
    );

    expect(ref.current.toggleRef.current).toBeDefined();
    expect(ref.current.menuRef.current).toBeDefined();

    unmount();
  });

  it('should not be able to detect inner toggle & menu when wrapped ' +
    'inside other components when not using the proper filter* props', () => {
    const ref = createRef();

    const CustomDropdownToggle = props => <DropdownToggle { ...props } />;
    const CustomDropdownMenu = props => <DropdownMenu { ...props } />;

    const { unmount } = render(
      <Dropdown ref={ref}>
        <CustomDropdownToggle>Open me</CustomDropdownToggle>
        <CustomDropdownMenu>
          <DropdownItem>Menu item</DropdownItem>
        </CustomDropdownMenu>
      </Dropdown>
    );

    expect(ref.current.toggleRef.current).not.toBeDefined();
    expect(ref.current.menuRef.current).not.toBeDefined();

    unmount();
  });

  it('should auto close menu when disabled prop changes', () => {
    const ref = createRef();
    const { rerender, unmount } = render(<Dropdown ref={ref} opened={true} />);
    expect(ref.current.opened).toBe(true);

    rerender(<Dropdown ref={ref} disabled={true} opened={true} />);
    expect(ref.current.opened).toBe(false);
    unmount();
  });

  it('should auto close menu when clicking outside', () => {
    const ref = createRef();
    const { unmount } = render(
      <Dropdown ref={ref} opened={true}>
        <DropdownMenu />
      </Dropdown>
    );
    expect(ref.current.opened).toBe(true);
    fireEvent.click(document.body);
    expect(ref.current.opened).toBe(false);
    unmount();
  });

  it('should close menu even when it doesn\'t exist', () => {
    const ref = createRef();
    const { unmount } = render(<Dropdown ref={ref} opened={true} />);
    fireEvent.click(document.body);
    expect(ref.current.opened).toBe(false);
    unmount();
  });

  it('should not try to close menu when clicked inside', () => {
    const ref = createRef();
    const { unmount } = render(
      <Dropdown ref={ref} opened={true}>
        <DropdownMenu />
      </Dropdown>
    );
    fireEvent.click(ref.current.menuRef.current);
    expect(ref.current.opened).toBe(true);
    unmount();
  });

  it('should not allow to open menu when disabled', async () => {
    const ref = createRef();
    const { unmount } = render(<Dropdown ref={ref} disabled={true} />);
    await act(async () => { ref.current.open(); });
    expect(ref.current.opened).toBe(false);
    unmount();
  });

  it('should toggle dropdown opened state when using toggle ' +
    'method', async () => {
    const ref = createRef();
    const onToggle = jest.fn();
    const { unmount } = render(<Dropdown onToggle={onToggle} ref={ref} />);
    await act(async () => { ref.current.toggle(); });
    expect(ref.current.opened).toBe(true);
    expect(onToggle)
      .toHaveBeenLastCalledWith(expect.objectContaining({ opened: true }));
    await act(async () => { ref.current.toggle(); });
    expect(ref.current.opened).toBe(false);
    expect(onToggle)
      .toHaveBeenLastCalledWith(expect.objectContaining({ opened: false }));
    unmount();
  });

  it('should toggle dropdown opened state when using open/close ' +
    'methods', async () => {
    const ref = createRef();
    const onToggle = jest.fn();
    const { unmount } = render(<Dropdown onToggle={onToggle} ref={ref} />);
    await act(async () => { ref.current.open(); });
    expect(ref.current.opened).toBe(true);
    expect(onToggle)
      .toHaveBeenLastCalledWith(expect.objectContaining({ opened: true }));
    await act(async () => { ref.current.close(); });
    expect(ref.current.opened).toBe(false);
    expect(onToggle)
      .toHaveBeenLastCalledWith(expect.objectContaining({ opened: false }));
    unmount();
  });

  it('should allow to retrieve toggle & menu inner refs', () => {
    const ref = createRef();
    const toggleRef = createRef();
    const menuRef = createRef();
    const { container, unmount } = render(
      <Dropdown opened={true} ref={ref}>
        <DropdownToggle ref={toggleRef}>Open me</DropdownToggle>
        <DropdownMenu ref={menuRef}>
          <DropdownItem>Menu item</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
    expect(toggleRef.current)
      .toBe(container.querySelector('.junipero.dropdown-toggle'));
    expect(menuRef.current)
      .toBe(container.querySelector('.junipero.dropdown-menu'));
    unmount();
  });

  it('should allow to retrieve toggle & menu inner refs as functions', () => {
    const ref = createRef();
    const toggleRef = createRef();
    const menuRef = createRef();
    const { container, unmount } = render(
      <Dropdown opened={true} ref={ref}>
        <DropdownToggle ref={ref => { toggleRef.current = ref; }}>
          Open me
        </DropdownToggle>
        <DropdownMenu ref={ref => { menuRef.current = ref; }}>
          <DropdownItem>Menu item</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
    expect(toggleRef.current)
      .toBe(container.querySelector('.junipero.dropdown-toggle'));
    expect(menuRef.current)
      .toBe(container.querySelector('.junipero.dropdown-menu'));
    unmount();
  });

  it('should also render arbitrary children', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <Dropdown opened={true} ref={ref}>
        <span className="test" />
      </Dropdown>
    );
    expect(container.querySelectorAll('span.test').length).toBe(1);
    unmount();
  });

  it('should allow to define a custom target to check for a click outside ' +
    'event', async () => {
    const ref = createRef();
    const linkRef = createRef();
    const { unmount: linkUnmount, getByText: getLinkByText } = render(
      <a ref={linkRef} className="link">Do something</a>
    );
    const { container, getByText, unmount } = render(
      <div>
        <button className="button">Click outside</button>
        <Dropdown
          ref={ref}
          clickOutsideTarget={linkRef.current}
        >
          <DropdownToggle>
            Open me
          </DropdownToggle>
          <DropdownMenu />
        </Dropdown>
      </div>
    );

    fireEvent.click(getByText('Open me'));
    expect(ref.current.opened).toBe(true);
    expect(container.querySelectorAll('.junipero.dropdown-menu').length)
      .toBe(1);

    fireEvent.click(getLinkByText('Do something'));
    expect(ref.current.opened).toBe(true);

    fireEvent.click(getByText('Click outside'));
    expect(ref.current.opened).toBe(false);
    unmount();
    linkUnmount();
  });

  it('should not trigger onToggle event when clicking outside toggle and ' +
    'menu is not opened', async () => {
    const ref = createRef();
    const onToggle = jest.fn();
    const { container, unmount } = render(
      <Dropdown
        onToggle={onToggle}
        ref={ref}
      >
        <DropdownToggle>
          Open me
        </DropdownToggle>
        <DropdownMenu />
      </Dropdown>
    );

    fireEvent.click(document.body);
    expect(ref.current.opened).toBe(false);
    expect(container.querySelectorAll('.junipero.dropdown-menu').length)
      .toBe(0);
    expect(onToggle).not.toHaveBeenCalled();
    unmount();
  });
});
