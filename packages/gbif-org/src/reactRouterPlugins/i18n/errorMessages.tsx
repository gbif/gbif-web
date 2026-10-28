import { Config, LanguageOption } from '@/config/config';
import { useEffect, useState } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { getMessagesForLocale } from './loadMessages';
import { MessagesProvider, useMessages } from './messagesContext';

// When no route matched, this route's loader never ran, so a hosted portal (which gets messages
// only from that loader) has none. gbif.org always has them from MessagesProvider.
export function ErrorMessages({
  config,
  locale,
  routeId,
  children,
}: {
  config: Config;
  locale: LanguageOption;
  routeId: string;
  children: React.ReactNode;
}) {
  const contextMessages = useMessages();
  const loaderData = useRouteLoaderData(routeId) as { messages?: Record<string, string> } | null;
  const hasMessages = !!loaderData?.messages || Object.keys(contextMessages).length > 0;
  const [messages, setMessages] = useState<Record<string, string>>();

  useEffect(() => {
    if (hasMessages) return;
    // Without messages the error page still renders, with each message's default text.
    getMessagesForLocale(config, locale)
      .then(setMessages)
      .catch(() => setMessages({}));
  }, [hasMessages, config, locale]);

  if (hasMessages) return children;
  if (!messages) return null;
  return <MessagesProvider messages={messages}>{children}</MessagesProvider>;
}
