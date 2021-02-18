import React from 'react';

import Card from './index';
import Button from '../Button';
import TextField from '../TextField';

export default { title: 'junipero/Card' };

const Form = () => (
  <React.Fragment>
    <div className="card-title">Card title</div>
    <div className="card-body">This form centralises everything you need to
    configure your app the easiest way possible. It has beautiful text fields,
    some hand crafted card header & footer, and a nice box shadow that will
    melt your 2001 ATI graphics card.</div>
    <div className="card-form">
      <TextField label="Label" value="Thomas Bangalter" />
      <TextField label="Label" type="password" value="securePassword" />
      <Button className="primary">Update</Button>
    </div>
  </React.Fragment>
);

const CardBody = () => (
  <React.Fragment>
    <div className="card-title">Card title</div>
    <div className="card-body">This is a basic card. You can use it to display
    any type of text, picture and/or icon. It is supposed to have 30px/40px
    paddings and regular paragraph texts.</div>
  </React.Fragment>
);

const CardBodyWithIcon = () => (
  <React.Fragment>
    <img className="card-icon" src="https://cutt.ly/6k12q0g"/>
    <div className="card-title">Card title</div>
    <div className="card-body">This is a basic card. You can use it to display
    any type of text, picture and/or icon. It is supposed to have 30px/40px
    paddings and regular paragraph texts.</div>
  </React.Fragment>
);

export const basic = () => (
  <Card><CardBody /></Card>
);

export const withIcon = () => (
  <Card><CardBodyWithIcon /></Card>
);

export const withForm = () => (
  <Card><Form /></Card>
);
