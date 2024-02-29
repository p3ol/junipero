import { useRef } from 'react';

import Badge, { BadgeRef } from './index';

export default { title: 'react/Badge' };

export const basic = () => {
  const ref = useRef<BadgeRef>();
  const isJunipero: boolean = ref.current?.isJunipero ?? false;

  return (
    <>
      <Badge ref={ref}>10</Badge>
      <Badge className="primary">1</Badge>
      <Badge className="danger">1</Badge>
      <Badge className="warning">1</Badge>
      <Badge className="success">1</Badge>
    </>
  );
};

export const smaller = () => (
  <>
    <Badge className="info">1</Badge>
    <Badge className="info primary">1</Badge>
    <Badge className="info danger">1</Badge>
    <Badge className="info warning">1</Badge>
    <Badge className="info success">1</Badge>
  </>
);
