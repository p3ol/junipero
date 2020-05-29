import { useRef, useEffect } from 'react';

export const useEventListener = (name, handler, target = global) => {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = target && target.addEventListener;
    if (!isSupported) {
      return () => {};
    }

    const eventListener = event => savedHandler.current(event);
    target.addEventListener(name, eventListener, false);

    return () => {
      target.removeEventListener(name, eventListener);
    };
  }, [name, target]);
};
