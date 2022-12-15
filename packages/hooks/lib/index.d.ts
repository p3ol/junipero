export declare function useEventListener(
  name: string,
  handler: Function,
  options: { target?: any, enabled?: Boolean }): void;

export declare function useInterval(
  cb: Function,
  time: Number,
  changes?: Array<any>,
  options: { enabled?: boolean, layoutEffect?: boolean }
  ): void;

export declare function useTimeout(
  cb: Function,
  time: Number,
  changes?: Array<any>,
  options: { enabled?: boolean, layoutEffect?: boolean }
): void;

export declare function UseEffectAfterMount(
  cb: Function,
  changes: Array<any>
): void;

export declare function useLayoutEffectAfterMount(
  cb: Function,
  changes: Array<any>,
  options: { layoutEffect?: Boolean }
): void;
