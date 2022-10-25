import { UseFloatingReturn } from "@floating-ui/react-dom-interactions";
import { AlertObject } from "./Alert";

declare interface AlertsContext {
  alerts: Array<AlertObject>;
  add: (alert: AlertObject) => void;
  dismiss: (index: number) => void;
}

declare type DropdownContext = Pick<
  UseFloatingReturn,
  "x",
  "y",
  "container",
  "reference",
  "strategy"
> & {
  opened: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  getReferenceProps: (
    userProps?: React.HTMLProps<Element> | undefined
  ) => Record<string, unknown>;
  getFloatingProps: (
    userProps?: React.HTMLProps<HTMLElement> | undefined
  ) => Record<string, unknown>;
};

declare interface FieldControlContext {
  valid: Boolean;
  dirty: Boolean;
  focused: Boolean;
  update: (props: {
    valid?: Boolean;
    dirty?: Boolean;
    focused?: Boolean;
  }) => void;
}

declare function useAlerts(): AlertsContext;

declare function useDropdown(): DropdownContext;

declare function useFieldControl(): FieldControlContext;

export { useAlerts, useDropdown, useFieldControl };
