import { useState } from 'react';

import BreadCrumb from './index';
import BreadCrumbItem from '../BreadCrumbItem';

export default { title: 'react/BreadCrumb' };

export const Basic = () => (
  <BreadCrumb>
    <BreadCrumbItem>One</BreadCrumbItem>
    <BreadCrumbItem>Two</BreadCrumbItem>
    <BreadCrumbItem>Three</BreadCrumbItem>
  </BreadCrumb>
);

export const Collapsed = () => (
  <BreadCrumb maxItems={2}>
    <BreadCrumbItem>One</BreadCrumbItem>
    <BreadCrumbItem>Two</BreadCrumbItem>
    <BreadCrumbItem>Three</BreadCrumbItem>
  </BreadCrumb>
);

export const WithLinks = () => (
  <BreadCrumb>
    <BreadCrumbItem tag="a" href="#">One</BreadCrumbItem>
    <BreadCrumbItem tag="a" href="#">Two</BreadCrumbItem>
    <BreadCrumbItem>Three</BreadCrumbItem>
  </BreadCrumb>
);

export const WithConditionalItems = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <>
      <p><button onClick={() => setEnabled(v => !v)}>Toggle</button></p>
      <BreadCrumb maxItems={3}>
        <BreadCrumbItem>One</BreadCrumbItem>
        <BreadCrumbItem>Two</BreadCrumbItem>
        { enabled && (
          <>
            <BreadCrumbItem>Three</BreadCrumbItem>
            <BreadCrumbItem>Four</BreadCrumbItem>
          </>
        ) }
      </BreadCrumb>
    </>
  );
};

export const WithItemsProp = () => (
  <BreadCrumb items={['One', 'Two', 'Three']} />
);

export const WithItemsPropCollapsed = () => (
  <BreadCrumb items={['One', 'Two', 'Three']} maxItems={2} />
);
