import { MutableRefObject, ComponentPropsWithRef, ReactNode } from 'react';
import { UseDismissProps, UseClickProps, UseHoverProps, Placement } from '@floating-ui/react';
import { ForwardedProps } from '../utils';
export declare type TooltipRef = {
    opened: boolean;
    open(): void;
    close(): void;
    toggle(): void;
    update(): void;
    innerRef: MutableRefObject<any>;
    handleRef: MutableRefObject<any>;
    isJunipero: boolean;
};
export declare interface TooltipProps extends ComponentPropsWithRef<any> {
    apparition?: string;
    children?: ReactNode | JSX.Element;
    className?: string;
    clickOptions?: UseClickProps;
    container?: Element | DocumentFragment;
    disabled?: boolean;
    dismissOptions?: UseDismissProps;
    floatingOptions?: any;
    hoverOptions?: UseHoverProps;
    opened?: boolean;
    text?: string | ReactNode | JSX.Element;
    placement?: Placement;
    trigger?: string;
    animate?(tooltipInner: ReactNode | JSX.Element, opts?: {
        opened?: boolean;
        onExited?: () => void;
    }): JSX.Element | ReactNode;
    onToggle?(props: {
        opened: boolean;
    }): void;
    ref?: MutableRefObject<TooltipRef | undefined>;
}
declare const Tooltip: ForwardedProps<TooltipProps, TooltipRef>;
export default Tooltip;
