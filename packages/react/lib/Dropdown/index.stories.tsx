import { slideInDownMenu } from '@junipero/transitions';
import { action } from 'storybook/actions';

import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';
import DropdownGroup from '../DropdownGroup';
import Tag from '../Tag';
import Dropdown from '.';
import DropdownItem from '../DropdownItem';

export default { title: 'react/Dropdown' };

export const Basic = () => (
  <Dropdown>
    <DropdownToggle><Tag tabIndex={0}>Open me</Tag></DropdownToggle>
    <DropdownMenu>
      <DropdownItem><a onClick={action('item1')}>Item 1</a></DropdownItem>
      <DropdownItem><a onClick={action('item2')}>Item 2</a></DropdownItem>
    </DropdownMenu>
  </Dropdown>
);

export const WithAccessibleIds = () => (
  <Dropdown id="my-dropdown">
    <DropdownToggle><Tag>Open me</Tag></DropdownToggle>
    <DropdownMenu id="my-dropdown-menu">
      <DropdownItem><a onClick={action('item1')}>Item 1</a></DropdownItem>
      <DropdownItem><a onClick={action('item2')}>Item 2</a></DropdownItem>
    </DropdownMenu>
  </Dropdown>
);

export const Hover = () => (
  <Dropdown trigger="hover">
    <DropdownToggle><Tag>Open me</Tag></DropdownToggle>
    <DropdownMenu>
      <DropdownItem><a>Item 1</a></DropdownItem>
    </DropdownMenu>
  </Dropdown>
);

export const WithGroups = () => (
  <Dropdown>
    <DropdownToggle><Tag>Open me</Tag></DropdownToggle>
    <DropdownMenu>
      <DropdownGroup title="Test group">
        <DropdownItem><a>Item 1</a></DropdownItem>
      </DropdownGroup>
      <DropdownGroup title="Another group">
        <DropdownItem><a>Item 2</a></DropdownItem>
      </DropdownGroup>
    </DropdownMenu>
  </Dropdown>
);

export const Animated = () => (
  <Dropdown>
    <DropdownToggle><Tag>Open me</Tag></DropdownToggle>
    <DropdownMenu animate={slideInDownMenu}>
      <DropdownItem><a>Item 1</a></DropdownItem>
    </DropdownMenu>
  </Dropdown>
);

export const AnimatedButStillInDom = () => (
  <Dropdown>
    <DropdownToggle><Tag>Open me</Tag></DropdownToggle>
    <DropdownMenu animate={slideInDownMenu} apparition="css">
      <DropdownItem><a>Item 1</a></DropdownItem>
    </DropdownMenu>
  </Dropdown>
);
