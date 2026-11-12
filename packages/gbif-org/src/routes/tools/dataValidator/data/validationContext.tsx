import { useConfig } from '@/config/config';
import { UserError, useUser } from '@/contexts/UserContext';
import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { initialPollState, PollEvent, PollState, transition } from './pollingMachine';
import type { Validation } from './types';
import { isValidationKey, ValidatorHttpError } from './validatorApi';
import { fetchValidation } from './validatorGraphql';

type ValidationContextValue = {
  validationKey?: string;
  state: PollState;
  validation?: Validation;
  loginRequired: boolean;
  isUserLoading: boolean;
};

const ValidationContext = createContext<ValidationContextValue>({
  state: initialPollState,
  loginRequired: false,
  isUserLoading: false,
});

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError';
}

// Runs one polling chain per key: it restarts only when the key or the login state changes.
export function ValidationProvider({
  validationKey,
  children,
}: {
  validationKey?: string;
  children: ReactNode;
}) {
  const { isLoggedIn, isLoading: isUserLoading, getGraphqlToken } = useUser();
  const { graphqlEndpoint } = useConfig();
  const [state, setState] = useState<PollState>(initialPollState);
  const getGraphqlTokenRef = useRef(getGraphqlToken);
  getGraphqlTokenRef.current = getGraphqlToken;

  useEffect(() => {
    if (!validationKey) {
      setState(initialPollState);
      return;
    }
    let current: PollState = initialPollState;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;
    let onVisible: (() => void) | undefined;

    const dispatch = (event: PollEvent) => {
      if (cancelled) return;
      const step = transition(current, event);
      current = step.state;
      setState(step.state);
      const { effect } = step;
      if (effect.type === 'fetch') {
        timer = setTimeout(() => {
          if (cancelled) return;
          if (document.visibilityState !== 'hidden') {
            poll(effect.refreshToken);
            return;
          }
          const resume = () => {
            if (document.visibilityState === 'hidden') return;
            document.removeEventListener('visibilitychange', resume);
            onVisible = undefined;
            if (!cancelled) poll(effect.refreshToken);
          };
          onVisible = resume;
          document.addEventListener('visibilitychange', resume);
        }, effect.delayMs);
      }
    };

    const poll = async (refreshToken?: boolean) => {
      controller = new AbortController();
      try {
        const token = await getGraphqlTokenRef.current({ forceRefresh: refreshToken });
        const validation = await fetchValidation({
          graphqlEndpoint,
          token,
          key: validationKey,
          signal: controller.signal,
        });
        dispatch({ type: 'RESPONSE', validation });
      } catch (error) {
        if (cancelled || isAbortError(error)) return;
        if (error instanceof ValidatorHttpError) {
          dispatch({ type: 'HTTP_ERROR', status: error.status });
        } else if (error instanceof UserError && error.type === 'UNKNOWN_USER') {
          dispatch({ type: 'HTTP_ERROR', status: 401 });
        } else {
          dispatch({ type: 'NETWORK_ERROR' });
        }
      }
    };

    const validKey = isValidationKey(validationKey);
    if (!validKey || isLoggedIn) {
      dispatch({ type: 'START', validKey });
    } else {
      setState(initialPollState);
    }

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (onVisible) document.removeEventListener('visibilitychange', onVisible);
      controller?.abort();
    };
  }, [validationKey, isLoggedIn, graphqlEndpoint]);

  const value = useMemo<ValidationContextValue>(
    () => ({
      validationKey,
      state,
      validation: 'validation' in state ? state.validation : undefined,
      loginRequired:
        !!validationKey && isValidationKey(validationKey) && !isLoggedIn && !isUserLoading,
      isUserLoading,
    }),
    [validationKey, state, isLoggedIn, isUserLoading]
  );

  return <ValidationContext.Provider value={value}>{children}</ValidationContext.Provider>;
}

export function useValidation() {
  return useContext(ValidationContext);
}
