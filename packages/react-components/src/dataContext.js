/**
 * This store is only intended as an init store for server rendering. 
 * The default is empty and hence components can use it if it is not empty 
 * to bootstrap content provided by the server.
 */
import React, { useState } from 'react';

// A context to share state for the full app/component
export const CollateContext = React.createContext({
  requests: [],
  resolved: false,
  current: 0,
  enabled: false
});

export const DataContext = React.createContext({});

export function createServerContext() {
  let resolvedData = {};
  let collatorState = {
    requests: [],
    resolved: false,
    current: 0,
    enabled: true
  };

  function ServerDataContext({ initialState = {}, ...props }) {
    resolvedData = initialState;
    return (
      <CollateContext.Provider value={collatorState}>
        <DataContext.Provider value={resolvedData}>
          {props.children}
        </DataContext.Provider>
      </CollateContext.Provider>
    );
  }

  const resolveData = async (timeout) => {
    if (timeout) {
      const timeOutPr = wait(timeout);

      await Promise.all(
        collatorState.requests.map((effect) => {
          return Promise
            .race([effect.promise, timeOutPr])
            .catch(() => {
              if (typeof effect?.cancel === 'function') {
                return effect.cancel();
              }
            });
        })
      );
    } else {
      const effects = collatorState.requests.map((item) => item.promise);
      await Promise.all(effects);
    }

    collatorState.resolved = true;
    collatorState.current = 0;
    collatorState.enabled = false;
    return {
      data: resolvedData
    };
  }

  return {
    ServerDataContext,
    resolveData,
  };
}

export const BrowserDataContext = ({ initialData, ...props }) => {
  const [initial] = useState(initialData || {});

  let collatorState = {
    requests: [],
    resolved: true,
    current: 0,
    enabled: false
  };

  return (
    <CollateContext.Provider value={collatorState}>
      <DataContext.Provider value={initial}>
        {props.children}
      </DataContext.Provider>
    </CollateContext.Provider>
  );
}

const wait = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject({ error: "timeout" });
    }, time);
  });
};