import Button from '.';
import Spinner from '../Spinner';

export default { title: 'react/Button' };

export const basic = () => (
  <div style={{ display: 'flex', gap: '10px' }}>
    <Button>Click me</Button>
    <Button className="subtle">Click me</Button>
    <Button className="primary">Click me</Button>
    <Button className="success">Click me</Button>
    <Button className="warning">Click me</Button>
    <Button className="danger">Click me</Button>
  </div>
);

export const disabled = () => (
  <div style={{ display: 'flex', gap: '10px' }}>
    <Button disabled>Click me</Button>
    <Button disabled className="subtle">Click me</Button>
    <Button disabled className="primary">Click me</Button>
    <Button disabled className="success">Click me</Button>
    <Button disabled className="warning">Click me</Button>
    <Button disabled className="danger">Click me</Button>
  </div>
);

export const loading = () => (
  <div style={{ display: 'flex', gap: '10px' }}>
    <Button disabled><span>Click me</span><Spinner className="small" /></Button>
    <Button disabled className="subtle">
      <span>Click me</span>
      <Spinner className="small" />
    </Button>
    <Button disabled className="primary">
      <span>Click me</span>
      <Spinner className="primary small" />
    </Button>
    <Button disabled className="success">
      <span>Click me</span>
      <Spinner className="small" />
    </Button>
    <Button disabled className="warning">
      <span>Click me</span>
      <Spinner className="small" />
    </Button>
    <Button disabled className="danger">
      <span>Click me</span>
      <Spinner className="small" />
    </Button>
  </div>
);
