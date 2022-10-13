import BreadCrumb from './index';
import BreadCrumbItem from '../BreadCrumbItem';

export default { title: 'react/BreadCrumb' };

export const basic = () => (
  <BreadCrumb>
    <BreadCrumbItem>One</BreadCrumbItem>
    <BreadCrumbItem>Two</BreadCrumbItem>
    <BreadCrumbItem>Three</BreadCrumbItem>
  </BreadCrumb>
);

export const collapsed = () => (
  <BreadCrumb maxItems={2}>
    <BreadCrumbItem>One</BreadCrumbItem>
    <BreadCrumbItem>Two</BreadCrumbItem>
    <BreadCrumbItem>Three</BreadCrumbItem>
  </BreadCrumb>
);

export const withLinks = () => (
  <BreadCrumb>
    <BreadCrumbItem tag="a" href="#">One</BreadCrumbItem>
    <BreadCrumbItem tag="a" href="#">Two</BreadCrumbItem>
    <BreadCrumbItem>Three</BreadCrumbItem>
  </BreadCrumb>
);
