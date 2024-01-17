import Pagination from './index';

export default { title: 'react/Pagination' };

export const basic = () => {
  const onPageChange = activePage => {
    // eslint-disable-next-line no-console
    console.log(`Content of page ${activePage}`);
  };

  return <Pagination size={8} onPageChange={onPageChange} />;
};