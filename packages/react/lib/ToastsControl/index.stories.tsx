import { SlideMenuType, slideInDownMenu } from '@junipero/transitions';

import { useToasts } from '../hooks';
import Toasts from '../Toasts';
import Button from '../Button';
import ToastsControl from '.';

export default { title: 'react/ToastsControl' };

const Comp = () => {
  const { add } = useToasts();

  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <Button
          onClick={() => add({
            duration: 5000,
            content: 'Content',
          })}
        >
          Add
        </Button>
      </div>
      <Toasts
        animateToast={slideInDownMenu as SlideMenuType}
        style={{ position: 'fixed', bottom: 0, right: 0 }}
      />
    </>
  );
};

export const basic = () => (
  <ToastsControl>
    <Comp />
  </ToastsControl>
);
