import Badge from './index';

export default { title: 'junipero/Badge' };

export const basic = () => (
  <>
    <p><Badge>1</Badge></p>
    <p><Badge className="primary">12</Badge></p>
    <p><Badge className="secondary">1</Badge></p>
    <p><Badge className="ternary">1</Badge></p>
    <p><Badge className="warning">1</Badge></p>
    <p><Badge className="danger">1</Badge></p>
    <p><Badge className="success">1</Badge></p>
  </>
);
