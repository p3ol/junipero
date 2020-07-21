import React from 'react';

import Button from './index';

export default { title: 'junipero-native/Button' };

export const basic = () => (
  <Button>Click here</Button>
);

export const customStyles = () => (
  <Button customStyle={{ button: { backgroundColor: 'green' } }}>
    Click here
  </Button>
);

export const disabled = () => (
  <Button disabled >Click here</Button>
);
