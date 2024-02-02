import {
  AlertsContextType,
  DropdownContextType,
  FieldContextType,
  ListContextType,
  ModalContextType,
  ToastsContextType,
} from './contexts';

export declare const useFieldControl: () => FieldContextType;
export declare const useDropdown: () => DropdownContextType;
export declare const useAlerts: () => AlertsContextType;
export declare const useList: () => ListContextType;
export declare const useToasts: () => ToastsContextType;
export declare const useModal: () => ModalContextType;
