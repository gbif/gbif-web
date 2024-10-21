import { createContext, useEffect, useState } from "react";
import {
  AbortLoadingEvent,
  NavigationCompleteEvent,
  StartLoadingEvent,
} from "./events";

export const LoadingContext = createContext<string | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export function LoadingContextProvider({ children }: Props) {
  const [loadingRouteId, setLoadingRouteId] = useState<string>();

  useEffect(() => {
    const unsubscribe = [
      StartLoadingEvent.listen((event) => {
        setLoadingRouteId((id) => id ?? event.routeId);
      }),
      NavigationCompleteEvent.listen(() => {
        setLoadingRouteId(undefined);
      }),
      AbortLoadingEvent.listen(() => {
        setLoadingRouteId(undefined);
      }),
    ];

    return () => unsubscribe.forEach((fn) => fn());
  }, [setLoadingRouteId]);

  return (
    <LoadingContext.Provider value={loadingRouteId}>
      {children}
    </LoadingContext.Provider>
  );
}
