import { ComponentPropsWithoutRef, ReactNode } from 'react';
declare interface AbstractProps extends ComponentPropsWithoutRef<any> {
    className?: string;
    children?: ReactNode | JSX.Element;
}
declare const Abstract: {
    ({ className, ...rest }: AbstractProps): import("react").JSX.Element;
    displayName: string;
};
export default Abstract;
