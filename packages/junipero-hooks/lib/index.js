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

export const useInterval = (cb, time, changes = []) => {
  const returnedCallbackRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      returnedCallbackRef.current = cb();
    }, time);

    return () => {
      clearInterval(interval);
      returnedCallbackRef.current?.();
    };
  }, changes);
};

export const useTimeout = (cb, time, changes = []) => {
  const returnedCallbackRef = useRef();

  useEffect(() => {
    const timeout = setTimeout(() => {
      returnedCallbackRef.current = cb();
    }, time);

    return () => {
      clearTimeout(timeout);
      returnedCallbackRef.current?.();
    };
  }, changes);
};
