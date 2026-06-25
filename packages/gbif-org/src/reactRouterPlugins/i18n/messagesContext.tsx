import { createContext, useContext } from 'react';

// Provides the per-locale translation messages to IntlProvider WITHOUT routing them through
// react-router loaderData (which would serialize the whole ~438 KB dictionary into every SSR
// response). The server entry loads the messages and provides them for renderToString; the client
// entry fetches the same versioned file before hydration and provides them here. Because both sides
// supply identical messages, the IntlProvider render matches and hydration does not mismatch.
const MessagesContext = createContext<Record<string, string>>({});

export function MessagesProvider({
  messages,
  children,
}: {
  messages: Record<string, string> | null | undefined;
  children: React.ReactNode;
}) {
  return <MessagesContext.Provider value={messages ?? {}}>{children}</MessagesContext.Provider>;
}

export function useMessages(): Record<string, string> {
  return useContext(MessagesContext);
}
