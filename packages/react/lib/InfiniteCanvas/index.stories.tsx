import { useRef, useState } from 'react';

import Button from '../Button';
import InfiniteCanvasZoom from '../InfiniteCanvasZoom';
import InfiniteCanvas, {
  type InfiniteCanvasCursorMode,
  type InfiniteCanvasBackgroundPattern,
  type InfiniteCanvasRef,
} from '.';

export default { title: 'react/InfiniteCanvas' };

export const Basic = () => {
  const canvasRef = useRef<InfiniteCanvasRef>(null);
  const [pattern, setPattern] = useState<
    InfiniteCanvasBackgroundPattern
  >('cross');
  const [cursorMode, setCursorMode] = useState<
    InfiniteCanvasCursorMode
  >('default');

  const [buttons, setButtons] = useState([]);

  return (
    <InfiniteCanvas
      ref={canvasRef}
      background={{
        pattern,
      }}
      cursorMode={cursorMode}
      className="fixed top-0 left-0 w-screen h-screen"
      onClick={() => {
        if (cursorMode !== 'add') {
          return;
        }

        setButtons(b => [
          ...b,
          canvasRef.current?.getCursorPosition(),
        ]);
      }}
      overlay={(
        <>
          <div className="absolute top-2 left-4 z-50 flex items-center gap-2">
            <Button
              onClick={() =>
                setPattern(
                  pattern === 'cross' ? 'dot' : 'cross',
                )
              }
            >
              Toggle Background Pattern ({pattern})
            </Button>
            <Button
              onClick={e => {
                e.stopPropagation();
                setCursorMode(
                  cursorMode === 'default'
                    ? 'pan' : cursorMode === 'pan' ? 'add' : 'default',
                );
              }}
            >
              Toggle Cursor Mode ({cursorMode})
            </Button>
          </div>
          <div
            className="flex items-center gap-2 absolute bottom-8 right-8 z-50"
          >
            <InfiniteCanvasZoom />
          </div>
        </>
      )}
    >
      <div
        className="w-full h-screen flex items-center justify-center"
      >
        <Button>Click me!</Button>
        { buttons.map((b, i) => (
          <Button key={i} style={{ position: 'absolute', left: b.x, top: b.y }}>
            Clicked!
          </Button>
        )) }
      </div>
    </InfiniteCanvas>
  );
};
