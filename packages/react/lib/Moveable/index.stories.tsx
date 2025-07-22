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
