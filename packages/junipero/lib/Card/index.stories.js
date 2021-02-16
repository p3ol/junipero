import React from 'react';

import Card from './index';
import Button from '../Button';
import TextField from '../TextField';

export default { title: 'junipero/Card' };

const text = 'This is a basic card. You can use it to display any type of' +
  'text, picture and/or icon. It is supposed to have 30px/40px paddings and' +
  'regular paragraph texts.';

const Form = () => {
  return (
    <React.Fragment>
      <TextField
        label="Label"
        value="Thomas Bangalter"
      />
      <Button className="primary">Update</Button>
    </React.Fragment>
  );
};

export const basic = () => (
  <>
    <Card title="Card Title" text={text}/>
  </>
);

export const withIcon = () => (
  <>
    <Card icon="https://cutt.ly/6k12q0g" title="Card Title" text={text}/>
  </>
);

export const withIllustration = () => (
  <>
    <Card
      illustration="https://cutt.ly/Pk19ejU"
      title="Card Title"
      text={text}
    />
  </>
);

export const withForm = () => (
  <>
    <Card
      title="Card Title"
    >
      <Form />
    </Card>
  </>
);
