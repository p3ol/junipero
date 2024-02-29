import Spinner from './index';

export default { title: 'react/Spinner' };

export const basic = () => (
  <>
    <Spinner />
    <Spinner className="primary" />
    <Spinner className="warning" />
    <Spinner className="danger" />
    <Spinner className="success" />
  </>
);

export const small = () => (
  <>
    <Spinner className="small" />
    <Spinner className="primary small" />
    <Spinner className="warning small" />
    <Spinner className="danger small" />
    <Spinner className="success small" />
  </>
);
