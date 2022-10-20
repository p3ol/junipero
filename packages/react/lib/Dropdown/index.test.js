import { fireEvent, render } from '@testing-library/react';

import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';
import DropdownGroup from '../DropdownGroup';
import DropdownItem from '../DropdownItem';
import Dropdown from './index';

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
