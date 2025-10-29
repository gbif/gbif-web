import { useCallback, useEffect, useMemo, useState } from 'react';

export type VisibleColumns = Set<string>;
export type ToggleColumnVisibility = (id: string) => void;
export type ResetColumnVisibility = () => void;

type Result = {
  visibleColumns: VisibleColumns;
  toggleColumnVisibility: ToggleColumnVisibility;
  resetColumnVisibility: ResetColumnVisibility;
};

type Options = {
  availableTableColumns: string[];
  defaultEnabledTableColumns: string[];
  selectedColumnsLocalStoreKey: string;
};

export function useColumnVisibility({
  selectedColumnsLocalStoreKey,
  defaultEnabledTableColumns,
  availableTableColumns,
}: Options): Result {
  const availableTableColumnsSet = useMemo(
    () => new Set(availableTableColumns),
    [availableTableColumns]
  );

  const initialVisibilityState: VisibleColumns = useMemo(
    () => new Set(defaultEnabledTableColumns.filter((id) => availableTableColumnsSet.has(id))),
    [defaultEnabledTableColumns, availableTableColumnsSet]
  );

  // Could not get the use-local-storage hook to work with the Set and default value
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumns>(
    parser(localStorage.getItem(selectedColumnsLocalStoreKey), availableTableColumnsSet) ??
      initialVisibilityState
  );

  useEffect(() => {
    localStorage.setItem(selectedColumnsLocalStoreKey, serializer(visibleColumns));
  }, [visibleColumns, selectedColumnsLocalStoreKey]);

  const toggleColumnVisibility: ToggleColumnVisibility = useCallback(
    (id: string) => {
      setVisibleColumns((old) => {
        const copy = new Set(old);
        if (copy.has(id)) copy.delete(id);
        else if (availableTableColumnsSet.has(id)) copy.add(id);
        return copy;
      });
    },
    [setVisibleColumns, availableTableColumnsSet]
  );

  const resetColumnVisibility: ResetColumnVisibility = useCallback(() => {
    setVisibleColumns(initialVisibilityState);
  }, [setVisibleColumns, initialVisibilityState]);

  return {
    visibleColumns,
    toggleColumnVisibility,
    resetColumnVisibility,
  };
}

function parser(
  value: string | null,
  availableTableColumnsSet: Set<string>
): VisibleColumns | undefined {
  if (!value) return;
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return;
    // Filter out invalid column IDs that don't exist in availableTableColumns
    const validColumns = parsed.filter(
      (id) => typeof id === 'string' && availableTableColumnsSet.has(id)
    );
    // Return undefined if no valid columns remain, triggering fallback to defaults
    if (validColumns.length === 0) return;
    return new Set(validColumns);
  } catch {
    // If JSON parsing fails, return undefined to fall back to defaults
    return;
  }
}

function serializer(visibleColumns: VisibleColumns): string {
  return JSON.stringify(Array.from(visibleColumns));
}
