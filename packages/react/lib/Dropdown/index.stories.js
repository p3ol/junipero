import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';
import DropdownGroup from '../DropdownGroup';
import Tag from '../Tag';
import Dropdown from '.';
import DropdownItem from '../DropdownItem';

export default { title: 'react/Dropdown' };

export const basic = () => (
  <Dropdown>
    <DropdownToggle><Tag>Open me</Tag></DropdownToggle>
    <DropdownMenu>
      <DropdownItem><a>Item 1</a></DropdownItem>
    </DropdownMenu>
  </Dropdown>
);

export const hover = () => (
  <Dropdown trigger="hover">
    <DropdownToggle><Tag>Open me</Tag></DropdownToggle>
    <DropdownMenu>
      <DropdownItem><a>Item 1</a></DropdownItem>
    </DropdownMenu>
  </Dropdown>
);

export const withGroups = () => (
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
