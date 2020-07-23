import React from 'react';
import { Text } from 'react-native';
import Button from './index';

export default { title: 'junipero-native/Button' };

export const basic = () => (
  <React.Fragment>
    <p><Button theme='basic'>Default</Button></p>
    <p><Button disabled theme='basic'>Disabled</Button></p>
    <p><Button outline theme='basic'>Outline</Button></p>
    <p><Button theme='basic'><Text icon='visibility'/>With icon</Button></p>
    <p><Button size='big' theme='basic'>Big</Button></p>
    <p><Button size='small' theme='basic'>Small</Button></p>
  </React.Fragment>
);

export const primary = () => (
  <React.Fragment>
    <p><Button theme='primary'>Default</Button></p>
    <p><Button disabled theme='primary'>Disabled</Button></p>
    <p><Button outline theme='primary'>Outline</Button></p>
    <p><Button theme='primary'><Text icon='visibility'/>With icon</Button></p>
    <p><Button size='big' theme='primary'>Big</Button></p>
    <p><Button size='small' theme='primary'>Small</Button></p>
  </React.Fragment>
);

export const secondary = () => (
  <React.Fragment>
    <p><Button theme='secondary'>Default</Button></p>
    <p><Button disabled theme='secondary'>Disabled</Button></p>
    <p><Button outline theme='secondary'>Outline</Button></p>
    <p><Button theme='secondary'><Text icon='visibility'/>With icon</Button></p>
    <p><Button size='big' theme='secondary'>Big</Button></p>
    <p><Button size='small' theme='secondary'>Small</Button></p>
  </React.Fragment>
);

export const warning = () => (
  <React.Fragment>
    <p><Button theme='warning'>Default</Button></p>
    <p><Button disabled theme='warning'>Disabled</Button></p>
    <p><Button outline theme='warning'>Outline</Button></p>
    <p><Button theme='warning'><Text icon='visibility'/>With icon</Button></p>
    <p><Button size='big' theme='warning'>Big</Button></p>
    <p><Button size='small' theme='warning'>Small</Button></p>
  </React.Fragment>
);

export const danger = () => (
  <React.Fragment>
    <p><Button theme='danger'>Dafault</Button></p>
    <p><Button disabled theme='danger'>Disabled</Button></p>
    <p><Button outline theme='danger'>Outline</Button></p>
    <p><Button theme='danger'><Text icon='visibility'/>With icon</Button></p>
    <p><Button size='big' theme='danger'>Big</Button></p>
    <p><Button size='small' theme='danger'>Small</Button></p>
  </React.Fragment>
);

export const success = () => (
  <React.Fragment>
    <p><Button theme='success'>Default</Button></p>
    <p><Button disabled theme='success'>Disabled</Button></p>
    <p><Button outline theme='success'>Outline</Button></p>
    <p><Button theme='success'><Text icon='visibility'/>With icon</Button></p>
    <p><Button size='big' theme='success'>Big</Button></p>
    <p><Button size='small' theme='success'>Small</Button></p>
  </React.Fragment>
);

export const custom = () => (
  <React.Fragment>
    <p><Button customStyle={customStyles}>
      Default
    </Button></p>
    <p><Button disabled customStyle={customStyles}>
      Disabled
    </Button></p>
    <p><Button outline customStyle={customStyles}>
      Outline
    </Button></p>
    <p><Button customStyle={customStyles}>
      With icon
    </Button></p>
    <p><Button size='big' customStyle={customStyles}>
      Big
    </Button></p>
    <p><Button size='small' customStyle={customStyles}>
      Small
    </Button></p>
  </React.Fragment>
);

const customStyles = {
  button: { backgroundColor: 'purple' },
};
