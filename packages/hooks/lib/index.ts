import {
  type EffectCallback,
  type DependencyList,
  useRef,
  useEffect,
  useLayoutEffect,
} from 'react';

export declare interface UseEventListenerOptions {
  target?: EventTarget;
  enabled?: boolean;
}

export const useEventListener = (
  name: string,
  handler: (e: any) => any,
  { target = globalThis, enabled }: UseEventListenerOptions = {}
) => {
  const savedHandler = useRef<typeof handler>(null);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = !!target?.addEventListener;

    if (!isSupported || enabled === false) {
      return () => {};
    }

    const eventListener = (event: Event) => savedHandler.current(event);
    target.addEventListener(name, eventListener, false);

    return () => {
      target.removeEventListener(name, eventListener);
    };
  }, [name, target, enabled]);
};

export declare interface UseIntervalOptions {
  enabled?: boolean;
  layoutEffect?: boolean;
}

export const useInterval = (
  cb: EffectCallback,
  time: number,
  changes: DependencyList = [],
  {
    enabled = true,
    layoutEffect = false,
  }: UseIntervalOptions = {}
) => {
  const returnedCallbackRef = useRef<ReturnType<EffectCallback>>(null);

  (layoutEffect ? useLayoutEffect : useEffect)(() => {
    if (!enabled) {
      return;
    }

    const interval = setInterval(() => {
      returnedCallbackRef.current = cb();
    }, time);

    return () => {
      clearInterval(interval);
      (
        returnedCallbackRef.current as Exclude<ReturnType<EffectCallback>, void>
      )?.();
    };
  }, changes);
};

export declare interface UseTimeoutOptions {
  enabled?: boolean;
  layoutEffect?: boolean;
}

export const useTimeout = (
  cb: EffectCallback,
  time: number,
  changes: DependencyList = [],
  {
    enabled = true,
    layoutEffect = false,
  }: UseTimeoutOptions = {}
) => {
  const returnedCallbackRef = useRef<ReturnType<EffectCallback>>(null);

  (layoutEffect ? useLayoutEffect : useEffect)(() => {
    if (!enabled) {
      return;
    }

    const timeout = setTimeout(() => {
      returnedCallbackRef.current = cb();
    }, time);

    return () => {
      clearTimeout(timeout);
      (
        returnedCallbackRef.current as Exclude<ReturnType<EffectCallback>, void>
      )?.();
    };
  }, changes);
};

interface UseAfterMountOptions {
  layoutEffect?: boolean;
}

const useAfterMount = (
  cb: EffectCallback,
  changes: DependencyList = [],
  {
    layoutEffect = false,
  }: UseAfterMountOptions = {}
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

export const useEffectAfterMount = (
  cb: EffectCallback,
  changes: DependencyList = [],
) => useAfterMount(cb, changes);

export const useLayoutEffectAfterMount = (
  cb: EffectCallback,
  changes: DependencyList = []
) => useAfterMount(cb, changes, { layoutEffect: true });
