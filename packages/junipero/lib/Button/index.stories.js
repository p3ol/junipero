import React from 'react';

import Button from './index';

export default { title: 'junipero/Button' };

export const basic = () => (
  <>
    <p><Button>Default</Button></p>
    <p><Button disabled>Disabled</Button></p>
    <p><Button className="outline">Outline</Button></p>
    <p><Button className="outline" disabled>Outline disabled</Button></p>
    <p><Button><i className="material-icons">add_box</i> With icon</Button></p>
    <p><Button className="small">Small</Button></p>
    <p><Button className="big">Big</Button></p>
  </>
);

export const primary = () => (
  <>
    <p><Button className="primary">Default</Button></p>
    <p><Button disabled className="primary">Disabled</Button></p>
    <p><Button className="primary outline">Outline</Button></p>
    <p>
      <Button className="primary outline" disabled>Outline disabled</Button>
    </p>
    <p>
      <Button className="primary">
        <i className="material-icons">add_box</i> With icon
      </Button>
    </p>
    <p><Button className="primary small">Small</Button></p>
    <p><Button className="primary big">Big</Button></p>
  </>
);

export const secondary = () => (
  <>
    <p><Button className="secondary">Default</Button></p>
    <p><Button disabled className="secondary">Disabled</Button></p>
    <p><Button className="secondary outline">Outline</Button></p>
    <p>
      <Button className="secondary outline" disabled>Outline disabled</Button>
    </p>
    <p>
      <Button className="secondary">
        <i className="material-icons">add_box</i> With icon
      </Button>
    </p>
    <p><Button className="secondary small">Small</Button></p>
    <p><Button className="secondary big">Big</Button></p>
  </>
);

export const warning = () => (
  <>
    <p><Button className="warning">Default</Button></p>
    <p><Button disabled className="warning">Disabled</Button></p>
    <p><Button className="warning outline">Outline</Button></p>
    <p>
      <Button className="warning outline" disabled>Outline disabled</Button>
    </p>
    <p>
      <Button className="warning">
        <i className="material-icons">add_box</i> With icon
      </Button>
    </p>
    <p><Button className="warning small">Small</Button></p>
    <p><Button className="warning big">Big</Button></p>
  </>
);

export const danger = () => (
  <>
    <p><Button className="danger">Default</Button></p>
    <p><Button disabled className="danger">Disabled</Button></p>
    <p><Button className="danger outline">Outline</Button></p>
    <p>
      <Button className="danger outline" disabled>Outline disabled</Button>
    </p>
    <p>
      <Button className="danger">
        <i className="material-icons">add_box</i> With icon
      </Button>
    </p>
    <p><Button className="danger small">Small</Button></p>
    <p><Button className="danger big">Big</Button></p>
  </>
);

export const success = () => (
  <>
    <p><Button className="success">Default</Button></p>
    <p><Button disabled className="success">Disabled</Button></p>
    <p><Button className="success outline">Outline</Button></p>
    <p>
      <Button className="success outline" disabled>Outline disabled</Button>
    </p>
    <p>
      <Button className="success">
        <i className="material-icons">add_box</i> With icon
      </Button>
    </p>
    <p><Button className="success small">Small</Button></p>
    <p><Button className="success big">Big</Button></p>
  </>
);
