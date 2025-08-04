import {
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  useCallback,
  useId,
  useReducer,
} from 'react';
import { exists, mockState } from '@junipero/core';

import {
  type AccessibilityContextType,
  AccessibilityContext,
} from './contexts';

export interface AccessibilityStoreProps extends ComponentPropsWithoutRef<any> {
  onA11ySubmit?: (elementId: string) => void;
}

declare interface AccessibilityState {
  elements: string[];
  currentlyFocusedElement: string;
  toggleId: string;
}

const AccessibilityStore = ({
  onA11ySubmit,
  children,
}: AccessibilityStoreProps) => {
  const toggleId = useId();
  const [state, dispatch] = useReducer(mockState<AccessibilityState>, {
    elements: [],
    currentlyFocusedElement: null,
    toggleId,
  });

  const setCurrentlyFocusedElement = useCallback((elementId: string) => {
    dispatch({ currentlyFocusedElement: elementId });
  }, []);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      let nextIndex;
      const { elements, currentlyFocusedElement } = state;

      if (elements.length === 0) {
        return;
      }

      const currentlyFocusedIndex = elements.indexOf(currentlyFocusedElement);

      if (currentlyFocusedIndex !== -1) {
        if (e.key === 'ArrowDown') {
          nextIndex = currentlyFocusedIndex > 0
            ? currentlyFocusedIndex - 1
            : currentlyFocusedIndex;
        } else if (e.key === 'ArrowUp') {
          nextIndex = currentlyFocusedIndex < elements.length - 1
            ? currentlyFocusedIndex + 1
            : currentlyFocusedIndex;
        }
      } else {
        nextIndex = e.key === 'ArrowDown' ? elements.length - 1 : 0;
      }

      dispatch({ currentlyFocusedElement: elements[nextIndex] });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const { currentlyFocusedElement } = state;

      if (
        exists(state.currentlyFocusedElement) &&
        currentlyFocusedElement !== null &&
        onA11ySubmit
      ) {
        onA11ySubmit(currentlyFocusedElement);
      }
    }
  }, [onA11ySubmit, state]);

  const registerElement = useCallback((id: string | string[]) => {
    if (Array.isArray(id)) {
      dispatch({ elements: id });
    } else if (!state.elements.includes(id)) {
      dispatch({ elements: [...state.elements, id] });
    }
  }, [state.elements]);

  const getContext = useCallback<() => AccessibilityContextType>(() => ({
    currentlyFocusedElement: state.currentlyFocusedElement,
    toggleId: state.toggleId,
    setCurrentlyFocusedElement,
    elements: state.elements,
    registerElement,
    onKeyDown,
  }), [
    state.toggleId,
    state.currentlyFocusedElement,
    state.elements,
    onKeyDown,
    registerElement,
    setCurrentlyFocusedElement,
  ]);

  return (
    <AccessibilityContext.Provider value={getContext()}>
      { children }
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityStore;
