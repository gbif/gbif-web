import { useConfig } from '@/config/config';
import { FilterContext } from '@/contexts/filter';
import { useContext } from 'react';
import { useStringParam } from './useParam';

/**
 * Returns the checklistKey to be used in the query.
 * It will check for the following sources in order:
 * 1. checklistKey prop
 * 2. URL parameter
 * 3. Filter context
 * 4. Default checklist key from config
 * 5. Environment variable
 */
export function useChecklistKey() {
  const { filter } = useContext(FilterContext);
  const { defaultChecklistKey } = useConfig();
  const [urlChecklistKey] = useStringParam({
    key: 'checklistKey',
    defaultValue: undefined,
    hideDefault: false,
  });
  return urlChecklistKey ?? filter?.checklistKey ?? defaultChecklistKey;
}
