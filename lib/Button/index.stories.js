import React from 'react';

import Button from './index';

export default { title: 'Button' };

export const basic = () => (
  <Button>Click me</Button>
);

export const primary = () => (
  <Button className="primary">Click me</Button>
);

export const secondary = () => (
  <Button className="secondary">Click me</Button>
);

export const warning = () => (
  <Button className="warning">Click me</Button>
);

export const danger = () => (
  <Button className="danger">Click me</Button>
);

export const success = () => (
  <Button className="success">Click me</Button>
);
