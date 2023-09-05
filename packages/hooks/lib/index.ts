import { useRef, useEffect, useLayoutEffect } from 'react';

export const useEventListener = (
  name: string,
  handler: (e: any) => any,
  { target = globalThis, enabled }: {target?: any, enabled?: boolean} = {}
) => {
  const savedHandler = useRef<any>();

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
  cb: () => void,
  time: number,
  changes: Array<any> = [],
  {
    enabled = true,
    layoutEffect = false,
  }: {
    enabled?: boolean,
    layoutEffect?: boolean
  } = {}
) => {
  const returnedCallbackRef = useRef<any>();

  (layoutEffect ? useLayoutEffect : useEffect)(() => {
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
  cb: () => void,
  time: number,
  changes: Array<any> = [],
  {
    enabled = true,
    layoutEffect = false,
  }: {
    enabled?: boolean,
    layoutEffect?: boolean
  } = {}
) => {
  const returnedCallbackRef = useRef<any>();

  (layoutEffect ? useLayoutEffect : useEffect)(() => {
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

const useAfterMount = (
  cb: () => void,
  changes: Array<any> = [],
  {
    layoutEffect = false,
  }: {
    layoutEffect?: boolean
  } = {}
) => {
  const mounted = useRef(false);

  (layoutEffect ? useLayoutEffect : useEffect)(() => {
    if (!mounted.current) {
      mounted.current = true;

      return;
    }

    return cb();
  }, changes);
};

export const useEffectAfterMount = (cb: () => void, changes: Array<any> = []) =>
  useAfterMount(cb, changes);

export const useLayoutEffectAfterMount = (
  cb: () => void,
  changes: Array<any> = []
) => useAfterMount(cb, changes, { layoutEffect: true });
