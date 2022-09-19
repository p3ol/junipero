import { action } from '@storybook/addon-actions';
import { CSSTransition } from 'react-transition-group';

import Button from '../Button';
import Dropdown from './index';
import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';
import DropdownItem from '../DropdownItem';

export default { title: 'junipero/Dropdown' };

export const basic = () => (
  <Dropdown onToggle={action('toggle')}>
    <DropdownToggle>Click me</DropdownToggle>
    <DropdownMenu>
      <DropdownItem><a>Menu item 1</a></DropdownItem>
      <DropdownItem><a>Menu item 2</a></DropdownItem>
      <DropdownItem><a>Menu item 3</a></DropdownItem>
    </DropdownMenu>
  </Dropdown>
);

export const opened = () => (
  <Dropdown opened={true} onToggle={action('toggle')}>
    <DropdownToggle>Click me</DropdownToggle>
    <DropdownMenu>
      <DropdownItem><a>Menu item 1</a></DropdownItem>
      <DropdownItem><a>Menu item 2</a></DropdownItem>
      <DropdownItem><a>Menu item 3</a></DropdownItem>
    </DropdownMenu>
  </Dropdown>
);

export const withButton = () => (
  <Dropdown onToggle={action('toggle')}>
    <DropdownToggle>
      <Button className="primary">Click me</Button>
    </DropdownToggle>
    <DropdownMenu>
      <DropdownItem><a>Menu item 1</a></DropdownItem>
      <DropdownItem><a>Menu item 2</a></DropdownItem>
      <DropdownItem><a>Menu item 3</a></DropdownItem>
    </DropdownMenu>
  </Dropdown>
);

export const withCssApparition = () => (
  <Dropdown onToggle={action('toggle')}>
    <DropdownToggle>Click me</DropdownToggle>
    <DropdownMenu apparition="css">
      <DropdownItem><a>Menu item 1</a></DropdownItem>
      <DropdownItem><a>Menu item 2</a></DropdownItem>
      <DropdownItem><a>Menu item 3</a></DropdownItem>
    </DropdownMenu>
  </Dropdown>
);

export const animated = () => (
  <Dropdown
    onToggle={action('toggle')}
  >
    <DropdownToggle>Click to animate me</DropdownToggle>
    <DropdownMenu
      animate={(menu, { opened }) => (
        <CSSTransition
          in={opened}
          mountOnEnter={true}
          unmountOnExit={true}
          timeout={300}
          classNames="slide-in-up-dropdown"
          children={menu}
        />
      )}
    >
      <DropdownItem><a>Menu item 1</a></DropdownItem>
      <DropdownItem><a>Menu item 2</a></DropdownItem>
      <DropdownItem><a>Menu item 3</a></DropdownItem>
    </DropdownMenu>
  </Dropdown>
);
