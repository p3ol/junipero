import React from 'react';

import Button from './index';

export default { title: 'junipero-native/Button' };

export const basic = () => (
  <Button>Clique ici</Button>
);

export const customStyles = () => (
  <Button customStyle={{ backgroundColor: 'green' }}> Clique ici</Button>
);

export const disabled = () => (
  <Button disabled > Clique ici</Button>
);
