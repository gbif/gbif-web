import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { unstable_useBlocker as useBlocker } from 'react-router-dom';

/**
 * Warns the user before in-app navigation away from a tool when work would
 * be lost (e.g. clicking the About tab). Pair with a `beforeunload` handler
 * in the calling state hook to also cover tab close / hard refresh.
 */
export function useToolUnsavedGuard(hasUnsavedWork: boolean) {
  const { formatMessage } = useIntl();

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedWork && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state !== 'blocked') return;
    const message = formatMessage({
      id: 'tools.unsavedWarning',
      defaultMessage: 'Leaving this page will discard your results. Continue?',
    });
    if (window.confirm(message)) {
      blocker.proceed();
    } else {
      blocker.reset();
    }
  }, [blocker, formatMessage]);
}
