import { type ComponentPropsWithoutRef, useCallback, useReducer } from 'react';
import { mockState } from '@junipero/core';

import {
  type AccessibilityContextType,
  AccessibilityContext,
} from './contexts';

export interface AccessibilityStoreProps extends ComponentPropsWithoutRef<any> {
}

declare interface AccessibilityState {
  elements: Array<string>;
  currentlyFocusedElement: string;
}

const AccessibilityStore = ({
  children,
}: AccessibilityStoreProps) => {

  const [state, dispatch] = useReducer(mockState<AccessibilityState>, {
    elements: [],
    currentlyFocusedElement: null,
  });

  const setCurrentlyFocusedElement = useCallback((elementId: string) => {
    dispatch({ currentlyFocusedElement: elementId });
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const { elements, currentlyFocusedElement } = state;
      if (!elements.length) return;

      const currentIndex = currentlyFocusedElement
        ? elements.indexOf(currentlyFocusedElement)
        : -1;

      let nextIndex;

      if (e.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % elements.length;
      } else {
        nextIndex = (currentIndex - 1 + elements.length) % elements.length;
      }

      const nextElement = elements[nextIndex];
      dispatch({ currentlyFocusedElement: nextElement });
    }
  };

  const registerElement = (id: string) => {
    if (!state.elements.includes(id)) {
      state.elements.push(id);
      dispatch({ elements: state.elements });
    }
  };

  const getContext = useCallback<() => AccessibilityContextType>(() => ({
    currentlyFocusedElement: state.currentlyFocusedElement,
    setCurrentlyFocusedElement,
    registerElement,
    onKeyDown,
  }), [
    state.currentlyFocusedElement,
    onKeyDown,
  ]);

  return (
    <AccessibilityContext.Provider value={getContext()}>
      { children }
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityStore;
