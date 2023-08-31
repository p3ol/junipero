import { ComponentPropsWithoutRef } from 'react';
export declare interface SpinnerProps extends ComponentPropsWithoutRef<any> {
    className?: string;
}
declare const Spinner: {
    ({ className, ...rest }: SpinnerProps): import("react").JSX.Element;
    displayName: string;
};
export default Spinner;
