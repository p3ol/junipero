import { fireEvent, render, renderHook } from '@testing-library/react';
import { act } from 'react-test-renderer';

import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';
import DropdownGroup from '../DropdownGroup';
import DropdownItem from '../DropdownItem';
import Dropdown from './index';
import { useDropdown } from '../hooks';

describe('<Dropdown />', () => {
  it('should render', () => {
    const { getByText, container, unmount } = render(
      <Dropdown>
        <DropdownToggle><span>Click me</span></DropdownToggle>
        <DropdownMenu>
          <DropdownItem>Item 1</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
    expect(container).toMatchSnapshot();

    fireEvent.click(getByText('Click me'));

    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should auto close when disabled prop changes', () => {
    const { container, unmount, rerender, getByText } = render(
      <Dropdown opened={true}>
        <DropdownToggle><span>Click me</span></DropdownToggle>
        <DropdownMenu>
          <DropdownItem>Item 1</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );

    expect(container).toMatchSnapshot();

    rerender(
      <Dropdown disabled>
        <DropdownToggle><span>Click me</span></DropdownToggle>
        <DropdownMenu>
          <DropdownItem>Item 1</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );

    fireEvent.click(getByText('Click me'));

    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should allow to render menu inside another element', () => {
    const { container, unmount } = render(
      <>
        <div id="menu-container" />
        <Dropdown container="#menu-container" opened={true}>
          <DropdownToggle><span>Click me</span></DropdownToggle>
          <DropdownMenu>
            <DropdownItem>Item 1</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </>
    );

    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should allow to use groups', () => {
    const { container, unmount } = render(
      <Dropdown opened={true}>
        <DropdownToggle><span>Click me</span></DropdownToggle>
        <DropdownMenu>
          <DropdownGroup title="Group 1">
            <DropdownItem>Item 1</DropdownItem>
            <DropdownItem>Item 2</DropdownItem>
          </DropdownGroup>
          <DropdownGroup title="Group 2">
            <DropdownItem>Item 3</DropdownItem>
            <DropdownItem>Item 4</DropdownItem>
          </DropdownGroup>
        </DropdownMenu>
      </Dropdown>
    );

    expect(container).toMatchSnapshot();

    unmount();
  });
});

describe('useDropdwon()', () => {
  it('should render hook', () => {
    const { result } = renderHook(() => useDropdown(), { wrapper: Dropdown });
    expect(
      Object.keys(result.current)
    ).toEqual(expect.arrayContaining(
      [
        'opened',
        'x',
        'y',
        'reference',
        'floating',
        'strategy',
        'toggle',
        'open',
        'close',
        'getReferenceProps',
        'getFloatingProps',
      ]
    ));
  });
  it('should set hook with props', () => {
    const container = <div />;

    const wrapper = ({ children }) => {

      return (
        <Dropdown
          container={container}
          opened={true}
        >
          {children}
        </Dropdown>
      );
    };

    const { result } = renderHook(() => useDropdown(), { wrapper });
    expect(result.current.container).toEqual(container);
    expect(result.current.opened).toBeTruthy();
  });

  it('should open and close dropdown', () => {
    const toggleMock = jest.fn();

    const wrapper = ({ children }) => {

      return (
        <Dropdown
          onToggle={toggleMock}
        >
          {children}
        </Dropdown>
      );
    };

    const { result } = renderHook(() => useDropdown(), { wrapper });
    expect(result.current.opened).toBeFalsy();

    act(() => result.current.open());
    expect(result.current.opened).toBeTruthy();
    expect(toggleMock).toHaveBeenCalledWith({ opened: true });

    act(() => result.current.close());
    expect(result.current.opened).toBeFalsy();
    expect(toggleMock).toHaveBeenCalledWith({ opened: false });

    act(() => result.current.toggle());
    expect(result.current.opened).toBeTruthy();
    expect(toggleMock).toHaveBeenCalledWith({ opened: true });

    act(() => result.current.toggle());
    expect(result.current.opened).toBeFalsy();
    expect(toggleMock).toHaveBeenCalledWith({ opened: false });
  });

  it('should not open and close dropdown if disabled', () => {
    const toggleMock = jest.fn();

    const wrapper = ({ children }) => {

      return (
        <Dropdown
          onToggle={toggleMock}
          disabled={true}
        >
          {children}
        </Dropdown>
      );
    };

    const { result } = renderHook(() => useDropdown(), { wrapper });
    expect(result.current.opened).toBeFalsy();

    act(() => result.current.open());
    expect(result.current.opened).toBeFalsy();
    expect(toggleMock).not.toHaveBeenCalled();
  });
});
