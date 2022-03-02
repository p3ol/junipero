import BreadCrumb from './index';
import BreadCrumbItem from '../BreadCrumbItem';

export default { title: 'junipero/BreadCrumb' };

export const basic = () => (
  <BreadCrumb>
    <BreadCrumbItem>One</BreadCrumbItem>
    <BreadCrumbItem>Two</BreadCrumbItem>
    <BreadCrumbItem>Three</BreadCrumbItem>
  </BreadCrumb>
);

export const withItemsProp = () => (
  <BreadCrumb items={['One', 'Two', 'Three']} />
);

export const withLinks = () => (
  <BreadCrumb
    items={[
      <a key={0} href="#">One</a>,
      <a key={1} href="#">Two</a>,
      'Three',
    ]}
  />
);
