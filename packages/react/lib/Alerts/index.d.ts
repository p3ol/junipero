import { ReactNode, MutableRefObject } from 'react';

import { AlertObject } from '../Alert';

export declare type AlertsRef = {
  alerts: Array<AlertObject>;
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

declare interface AlertsProps extends React.ComponentPropsWithRef<any> {
  animationTimeout?: number;
  className?: string;
  icons?: object;
  animateAlert?(
    alert: ReactNode | JSX.Element,
    opts: { enabled: boolean, index: number }
  ): ReactNode | JSX.Element;
  ref?: MutableRefObject<AlertsRef | undefined>;
}

declare function Alerts(props: AlertsProps): ReactNode | JSX.Element;

export default Alerts;
