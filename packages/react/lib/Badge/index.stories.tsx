import Badge from './index';

export default { title: 'react/Badge' };

export const Basic = () => (
  <>
    <Badge>10</Badge>
    <Badge className="primary">1</Badge>
    <Badge className="danger">1</Badge>
    <Badge className="warning">1</Badge>
    <Badge className="success">1</Badge>
  </>
);

export const Smaller = () => (
  <>
    <Badge className="info">1</Badge>
    <Badge className="info primary">1</Badge>
    <Badge className="info danger">1</Badge>
    <Badge className="info warning">1</Badge>
    <Badge className="info success">1</Badge>
  </>
);
