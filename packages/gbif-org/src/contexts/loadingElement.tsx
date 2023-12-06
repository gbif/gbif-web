import React from 'react';

const START_LOADING_EVENT = 'gbif-start-loading';
const DONE_RENDERING_EVENT = 'gbif-done-rendering';

type ILoadingElementContext = {
  id: string;
  lang: string;
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
      const { loadingElement, nestingLevel, id, lang } = event.detail;
      setLoadingElements((prev) => [...prev, { loadingElement, nestingLevel, id, lang }]);
    }

    // Only remove the loading element from the loadingElements array if it's the last one
    // This will prevent parent loading elements from being removed when a child route is loading
    function handleLoadingEnd(event: DoneRenderingEvent) {
      const { id } = event.detail;
      setLoadingElements((prev) => {
        const lastLoadingElement = prev[prev.length - 1];
        return lastLoadingElement?.id === id ? [] : prev;
      });
    }

    window.addEventListener(START_LOADING_EVENT, handleLoadingStart as any);
    window.addEventListener(DONE_RENDERING_EVENT, handleLoadingEnd as any);

    return () => {
      window.removeEventListener(START_LOADING_EVENT, handleLoadingStart as any);
      window.removeEventListener(DONE_RENDERING_EVENT, handleLoadingEnd as any);
    };
  }, [setLoadingElements]);

  return (
    <LoadingElementContext.Provider value={loadingElements}>
      {children}
    </LoadingElementContext.Provider>
  );
}

export function useLoadingElement(
  nestingLevel: number,
  lang: string,
  id: string
): React.ReactNode | undefined {
  const loadingElements = React.useContext(LoadingElementContext);
  console.log(loadingElements);
  const firstLoadingElement = loadingElements[0];
  if (!firstLoadingElement) return;

  // Only return the loading element if it's the first one and at the current nesting level and has the same lang and does not have the same id
  if (
    // This will make sure that loading elements are only showed when navigating between siblings
    firstLoadingElement.nestingLevel === nestingLevel &&
    firstLoadingElement.lang === lang &&
    // This will make sure that a route never shows its own loading element, as it would never have to
    firstLoadingElement.id !== id
  ) {
    return firstLoadingElement.loadingElement;
  }
}

type StartLoadingDetail = {
  id: string;
  lang: string;
  loadingElement: React.ReactNode;
  nestingLevel: number;
};

export class StartLoadingEvent extends CustomEvent<StartLoadingDetail> {
  constructor(detail: StartLoadingDetail) {
    super(START_LOADING_EVENT, { detail });
  }
}

type DoneRenderingDetail = {
  id: string;
};

export class DoneRenderingEvent extends CustomEvent<DoneRenderingDetail> {
  constructor(detail: DoneRenderingDetail) {
    super(DONE_RENDERING_EVENT, { detail });
  }
}
