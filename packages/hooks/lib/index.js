import { useRef, useEffect } from 'react';

export const useEventListener = (
  name,
  handler,
  { target = globalThis, enabled } = {}
) => {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = target && target.addEventListener;

    if (!isSupported || enabled === false) {
      return () => {};
    }

    const eventListener = event => savedHandler.current(event);
    target.addEventListener(name, eventListener, false);

    return () => {
      target.removeEventListener(name, eventListener);
    };
  }, [name, target, enabled]);
};

export const useInterval = (
  cb, time, changes = [], { enabled = true } = {}
) => {
  const returnedCallbackRef = useRef();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const interval = setInterval(() => {
      returnedCallbackRef.current = cb();
    }, time);

    return () => {
      clearInterval(interval);
      returnedCallbackRef.current?.();
    };
  }, changes);
};

export const useTimeout = (
  cb, time, changes = [], { enabled = true } = {}
) => {
  const returnedCallbackRef = useRef();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const timeout = setTimeout(() => {
      returnedCallbackRef.current = cb();
    }, time);

    return () => {
      clearTimeout(timeout);
      returnedCallbackRef.current?.();
    };
  }, changes);
};
