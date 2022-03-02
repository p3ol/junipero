import Tag from './index';

export default { title: 'junipero/Tag' };

export const basic = () => (
  <>
    <p><Tag>New</Tag></p>
    <p><Tag className="primary">New</Tag></p>
    <p><Tag className="secondary">New</Tag></p>
    <p><Tag className="ternary">New</Tag></p>
    <p><Tag className="warning">New</Tag></p>
    <p><Tag className="danger">New</Tag></p>
    <p><Tag className="success">New</Tag></p>
  </>
);
