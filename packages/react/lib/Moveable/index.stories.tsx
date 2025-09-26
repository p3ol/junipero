import { useState } from 'react';

import { useInfiniteCanvas } from '../hooks';
import Button from '../Button';
import InfiniteCanvas from '../InfiniteCanvas';
import Moveable, { type MoveableProps } from '.';

export default { title: 'react/Moveable' };

export const Basic = () => (
  <Moveable>
    <Button>Click me!</Button>
  </Moveable>
);

export const WithPositionStrategy = () => (
  <Moveable strategy="position">
    <Button>Click me!</Button>
  </Moveable>
);

const ZoomedMoveable = (props: MoveableProps) => {
  const { zoom } = useInfiniteCanvas();

  return (
    <Moveable { ...props } transformScale={zoom} />
  );
};

export const InsideInfiniteCanvas = () => (
  <InfiniteCanvas
    className="fixed top-0 left-0 w-screen h-screen"
  >
    <ZoomedMoveable>
      <Button>Click me!</Button>
    </ZoomedMoveable>
  </InfiniteCanvas>
);

export const Controlled = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [disabled, setDisabled] = useState(false);

  return (
    <div>
      <Button
        onClick={() => setPosition({ x: position.x + 10, y: position.y + 10 })}
      >
        Move elsewhere
      </Button>
      <Button
        onClick={() => setDisabled(!disabled)}
        className="ml-2"
      >
        {disabled ? 'Enable' : 'Disable'}
      </Button>
      <Moveable
        x={position.x}
        y={position.y}
        disabled={disabled}
        onMoveEnd={state => setPosition({ x: state.deltaX, y: state.deltaY })}
      >
        <Button>Click me!</Button>
      </Moveable>
    </div>
  );
};
