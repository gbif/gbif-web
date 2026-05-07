import { createContext, useContext } from 'react';

// create context to pass data to children
type IChecklistKeyContext = {
  datasetKey?: string;
};

export const ChecklistKeyContext = createContext<IChecklistKeyContext | undefined>(undefined);

export function useChecklistKeyContext(): IChecklistKeyContext {
  const ctx = useContext(ChecklistKeyContext);
  if (!ctx) return {};
  return ctx;
}
