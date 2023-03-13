export declare function useEventListener(
  name: string,
  handler: Function,
  options?: { target?: any, enabled?: boolean }): void;

export declare function useInterval(
  cb: Function,
  time: number,
  changes?: Array<any>,
  options?: { enabled?: boolean; layoutEffect?: boolean },
  ): void;

export declare function useTimeout(
  cb: Function,
  time: number,
  changes?: Array<any>,
  options?: { enabled?: boolean; layoutEffect?: boolean },
): void;

export declare function useEffectAfterMount(
  cb: Function,
  changes: Array<any>
): void;

export declare function useLayoutEffectAfterMount(
  cb: Function,
  changes: Array<any>,
): void;
