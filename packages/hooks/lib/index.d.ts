export declare function useEventListener(
  name: string,
  handler: Function,
  options: { target?: any, enabled?: Boolean }): void;

export declare function useInterval(
  cb: Function,
  time: Number,
  options: { enabled?: boolean, layoutEffect?: boolean },
  changes?: Array<any>,
  ): void;

export declare function useTimeout(
  cb: Function,
  time: Number,
  options: { enabled?: boolean, layoutEffect?: boolean },
  changes?: Array<any>,
): void;

export declare function useEffectAfterMount(
  cb: Function,
  changes: Array<any>
): void;

export declare function useLayoutEffectAfterMount(
  cb: Function,
  changes: Array<any>,
): void;
