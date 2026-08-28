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
      <Button
        onClick={e => {
          e.stopPropagation();
          canvasRef.current?.centerOn(e.currentTarget, 500);
        }}
      >
        Click me!
      </Button>
      { buttons.map((b, i) => (
        <Button
          key={i}
          style={{ position: 'absolute', left: b.x, top: b.y }}
          onClick={e => {
            e.stopPropagation();
            canvasRef.current?.centerOn(e.currentTarget, 500);
          }}
        >
          Clicked!
        </Button>
      )) }
    </InfiniteCanvas>
  );
};

export const WithSidebars = () => {
  const canvasRef = useRef<InfiniteCanvasRef>(null);
  const sidebarWidth = 240;
  const bottomBarHeight = 80;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      <InfiniteCanvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        padding={{
          left: sidebarWidth,
          right: sidebarWidth,
          bottom: bottomBarHeight,
        }}
      >
        <Button
          onClick={e => {
            e.stopPropagation();
            canvasRef.current?.centerOn(e.currentTarget, 500);
          }}
        >
          Click me!
        </Button>
      </InfiniteCanvas>
      <div
        className="absolute top-0 left-0 h-full bg-black/80 z-50"
        style={{ width: sidebarWidth }}
      >
        Left sidebar
      </div>
      <div
        className="absolute top-0 right-0 h-full bg-black/80 z-50"
        style={{ width: sidebarWidth }}
      >
        Right sidebar
      </div>
      <div
        className={
          'absolute bottom-0 left-0 w-full bg-black/80 z-50 ' +
          'flex items-center gap-2 px-4'
        }
        style={{ height: bottomBarHeight }}
      >
        <Button onClick={() => canvasRef.current?.fitIntoView(500)}>
          Fit into View
        </Button>
      </div>
    </div>
  );
};
