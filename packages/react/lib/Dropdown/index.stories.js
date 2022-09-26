import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';
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
