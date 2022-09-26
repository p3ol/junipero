import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';
import Tag from '../Tag';
import Dropdown from '.';

export default { title: 'react/Dropdown' };

export const basic = () => (
  <Dropdown>
    <DropdownToggle><Tag>Open me</Tag></DropdownToggle>
    <DropdownMenu>
      <li>Item 1</li>
    </DropdownMenu>
  </Dropdown>
);

export const hover = () => (
  <Dropdown trigger="hover">
    <DropdownToggle><Tag>Open me</Tag></DropdownToggle>
    <DropdownMenu>
      <li>Item 1</li>
    </DropdownMenu>
  </Dropdown>
);
