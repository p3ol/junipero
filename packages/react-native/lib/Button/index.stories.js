import { Text } from 'react-native';

import Button from './index';

export default { title: 'junipero-native/Button' };

const fontStyles = { fontFamily: 'Material Icons' };

export const basic = () => (
  <>
    <p><Button theme="basic">Default</Button></p>
    <p><Button disabled theme="basic">Disabled</Button></p>
    <p><Button outline theme="basic">Outline</Button></p>
    <p>
      <Button theme="basic">
        <Text style={fontStyles}>check</Text>
        <Text>With icon</Text>
      </Button>
    </p>
    <p><Button size="big" theme="basic">Big</Button></p>
    <p><Button size="small" theme="basic">Small</Button></p>
  </>
);

export const primary = () => (
  <>
    <p><Button theme="primary">Default</Button></p>
    <p><Button disabled theme="primary">Disabled</Button></p>
    <p><Button outline theme="primary">Outline</Button></p>
    <p>
      <Button theme="primary">
        <Text style={fontStyles}>check</Text>
        <Text>With icon</Text>
      </Button>
    </p>
    <p><Button size="big" theme="primary">Big</Button></p>
    <p><Button size="small" theme="primary">Small</Button></p>
  </>
);

export const secondary = () => (
  <>
    <p><Button theme="secondary">Default</Button></p>
    <p><Button disabled theme="secondary">Disabled</Button></p>
    <p><Button outline theme="secondary">Outline</Button></p>
    <p>
      <Button theme="secondary">
        <Text style={fontStyles}>check</Text>
        <Text>With icon</Text>
      </Button>
    </p>
    <p><Button size="big" theme="secondary">Big</Button></p>
    <p><Button size="small" theme="secondary">Small</Button></p>
  </>
);

export const warning = () => (
  <>
    <p><Button theme="warning">Default</Button></p>
    <p><Button disabled theme="warning">Disabled</Button></p>
    <p><Button outline theme="warning">Outline</Button></p>
    <p>
      <Button theme="warning">
        <Text style={fontStyles}>check</Text>
        <Text>With icon</Text>
      </Button>
    </p>
    <p><Button size="big" theme="warning">Big</Button></p>
    <p><Button size="small" theme="warning">Small</Button></p>
  </>
);

export const danger = () => (
  <>
    <p><Button theme="danger">Dafault</Button></p>
    <p><Button disabled theme="danger">Disabled</Button></p>
    <p><Button outline theme="danger">Outline</Button></p>
    <p>
      <Button theme="danger">
        <Text style={fontStyles}>check</Text>
        <Text>With icon</Text>
      </Button>
    </p>
    <p><Button size="big" theme="danger">Big</Button></p>
    <p><Button size="small" theme="danger">Small</Button></p>
  </>
);

export const success = () => (
  <>
    <p><Button theme="success">Default</Button></p>
    <p><Button disabled theme="success">Disabled</Button></p>
    <p><Button outline theme="success">Outline</Button></p>
    <p>
      <Button theme="success">
        <Text style={fontStyles}>check</Text>
        <Text>With icon</Text>
      </Button>
    </p>
    <p><Button size="big" theme="success">Big</Button></p>
    <p><Button size="small" theme="success">Small</Button></p>
  </>
);
