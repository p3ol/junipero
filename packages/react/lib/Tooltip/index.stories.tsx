import { MouseEvent, useRef, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { slideInDownMenu } from '@junipero/transitions';

import Tooltip, { TooltipRef } from './index';

export default { title: 'react/Tooltip' };

export const basic = () => (
  <Tooltip text="Text" onToggle={action('toggle')}>
    Hover me
  </Tooltip>
);

export const click = () => (
  <Tooltip text="Text" onToggle={action('toggle')} trigger="click">
    Click me
  </Tooltip>
);

export const animated = () => (
  <Tooltip text="Text" animate={slideInDownMenu} onToggle={action('toggle')}>
    Hover me
  </Tooltip>
);

export const animatedButStillInDom = () => (
  <Tooltip
    text="Text"
    animate={slideInDownMenu}
    onToggle={action('toggle')}
    apparition="css"
  >
    Hover me
  </Tooltip>
);

export const manuallyUpdate = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<TooltipRef>();

  const handleMouseMove = (e: MouseEvent) => {
    setPos({ x: e.pageX, y: e.pageY });
    tooltipRef.current.update();
  };

  return (
    <div
      style={{ width: 800, height: 800 }}
      onMouseMove={handleMouseMove}
    >
      <Tooltip
        ref={tooltipRef}
        text="Text"
        opened={true}
      >
        <svg
          style={{
            width: 40,
            height: 40,
            borderRadius: '100%',
            background: 'red',
          }}
          transform={`translate(${pos.x}, ${pos.y})`}
        />
      </Tooltip>
    </div>
  );
};
