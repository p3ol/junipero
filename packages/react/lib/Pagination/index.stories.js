import { action } from '@storybook/addon-actions';

import Pagination from './index';

export default { title: 'react/Pagination' };

export const basic = () => {
  return <Pagination size={7} onPageChange={action('Page changed')} />;
};

export const basicWithMoreThanSevenPages = () => {
  return <Pagination size={10} onPageChange={action('Page changed')} />;
};

export const withInitialPage = () => {
  return (
    <Pagination
      size={7}
      onPageChange={action('Page changed')}
      initialPage={3}
    />
  );
};

export const withWrapFrom = () => {
  return (
    <Pagination
      size={9}
      shouldWrapFrom={10}
      onPageChange={action('Page changed')}
    />
  );
};

export const withoutWrap = () => {
  return (
    <Pagination
      size={10}
      shouldWrap={false}
      onPageChange={action('Page changed')}
    />
  );
};
