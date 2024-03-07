import React from 'react';

const START_LOADING_EVENT = 'gbif-start-loading';
const DONE_LOADING_EVENT = 'gbif-done-loading';

type ILoadingElementContext = {
  id: string;
  loadingElement: React.ReactNode;
  nestingLevel: number;
};

const LoadingElementContext = React.createContext<ILoadingElementContext[]>([]);

type Props = {
  children: React.ReactNode;
};

export function LoadingElementProvider({ children }: Props) {
  const [loadingElements, setLoadingElements] = React.useState<ILoadingElementContext[]>([]);

  // Event listners are used to communicate between this context and the react router loader functions
  React.useEffect(() => {
    // This useEffect should only run when used in the browser
    if (typeof window === 'undefined') return;

    // Add the loading element to the end of the loadingElements array
    function handleLoadingStart(event: StartLoadingEvent) {
      const { loadingElement, nestingLevel, id } = event.detail;
      setLoadingElements((prev) => [...prev, { loadingElement, nestingLevel, id }]);
    }

    // Only remove the loading element from the loadingElements array if it's the last one
    // This will prevent parent loading elements from being removed when a child route is loading
    function handleLoadingEnd(event: DoneLoadingEvent) {
      const { id } = event.detail;
      setLoadingElements((prev) => {
        const lastLoadingElement = prev[prev.length - 1];
        return lastLoadingElement?.id === id ? [] : prev;
      });
    }

    window.addEventListener(START_LOADING_EVENT, handleLoadingStart as any);
    window.addEventListener(DONE_LOADING_EVENT, handleLoadingEnd as any);

    return () => {
      window.removeEventListener(START_LOADING_EVENT, handleLoadingStart as any);
      window.removeEventListener(DONE_LOADING_EVENT, handleLoadingEnd as any);
    };
  }, [setLoadingElements]);

  return (
    <LoadingElementContext.Provider value={loadingElements}>
      {children}
    </LoadingElementContext.Provider>
  );
}

export function useLoadingElement(nestingLevel: number, id: string): React.ReactNode | undefined {
  const loadingElements = React.useContext(LoadingElementContext);
  const firstLoadingElement = loadingElements[0];
  if (!firstLoadingElement) return;

  // Only return the loading element if it's the first one and at the current nesting level and has the same lang and does not have the same id
  if (
    // This will make sure that loading elements are only showed when navigating between siblings
    firstLoadingElement.nestingLevel === nestingLevel &&
    // This will make sure that a route never shows its own loading element, as it would never have to
    firstLoadingElement.id !== id
  ) {
    return firstLoadingElement.loadingElement;
  }
}

type StartLoadingDetails = {
  id: string;
  loadingElement: React.ReactNode;
  nestingLevel: number;
};

export class StartLoadingEvent extends CustomEvent<StartLoadingDetails> {
  constructor(detail: StartLoadingDetails) {
    super(START_LOADING_EVENT, { detail });
  }
}

type DoneRenderingDetails = {
  id: string;
};

export class DoneLoadingEvent extends CustomEvent<DoneRenderingDetails> {
  constructor(detail: DoneRenderingDetails) {
    super(DONE_LOADING_EVENT, { detail });
  }
}
