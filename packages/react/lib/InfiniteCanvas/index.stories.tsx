import { useState } from 'react';

import Button from '../Button';
import InfiniteCanvasZoom from '../InfiniteCanvasZoom';
import InfiniteCanvas, {
  type InfiniteCanvasCursorMode,
  type InfiniteCanvasBackgroundPattern,
} from '.';

export default { title: 'react/InfiniteCanvas' };

export const Basic = () => {
  const [pattern, setPattern] = useState<
    InfiniteCanvasBackgroundPattern
  >('cross');
  const [cursorMode, setCursorMode] = useState<
    InfiniteCanvasCursorMode
  >('default');

  return (
    <InfiniteCanvas
      background={{
        pattern,
      }}
      cursorMode={cursorMode}
      className="fixed top-0 left-0 w-screen h-screen"
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
              onClick={() =>
                setCursorMode(
                  cursorMode === 'default' ? 'pan' : 'default',
                )
              }
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
        className="absolute w-full h-screen flex items-center justify-center"
      >
        <Button>Click me!</Button>
      </div>
    </InfiniteCanvas>
  );
};
