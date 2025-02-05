import { SearchMetadata } from '@/contexts/search';
import { unique } from '@/utils/unique';
import { useMemo } from 'react';
import { ColumnDef } from '..';

export type FallbackTableOptions = {
  defaultEnabledTableColumns: NonNullable<SearchMetadata['defaultEnabledTableColumns']>;
  prefixColumns?: string[];
};

type Options = {
  searchMetadata?: SearchMetadata;
  fallbackOptions: FallbackTableOptions;
  columns: ColumnDef<unknown>[];
};

type Result = {
  availableTableColumns: string[];
  defaultEnabledTableColumns: string[];
};

export function useAvailableAndDefaultEnabledColumns({
  searchMetadata,
  fallbackOptions,
  columns,
}: Options): Result {
  return useMemo(() => {
    const allTableColumns = columns.map((c) => c.id).filter((id) => typeof id === 'string');
    const allTableColumnsSet = new Set(allTableColumns);

    const result: Result = (() => {
      if (searchMetadata?.availableTableColumns && searchMetadata?.defaultEnabledTableColumns) {
        return {
          availableTableColumns: searchMetadata.availableTableColumns,
          defaultEnabledTableColumns: searchMetadata.defaultEnabledTableColumns,
        };
      }

      if (searchMetadata?.availableTableColumns) {
        return {
          availableTableColumns: searchMetadata.availableTableColumns,
          defaultEnabledTableColumns: searchMetadata.availableTableColumns,
        };
      }

      if (searchMetadata?.defaultEnabledTableColumns) {
        return {
          defaultEnabledTableColumns: searchMetadata.defaultEnabledTableColumns,
          // Adding the defaultEnabledTableColumns here will make sure the defaultEnabledTableColumns comes first in the table and dropdown
          availableTableColumns: [...searchMetadata.defaultEnabledTableColumns, ...allTableColumns],
        };
      }

      return {
        defaultEnabledTableColumns: fallbackOptions.defaultEnabledTableColumns,
        availableTableColumns: allTableColumns,
      };
    })();

    return {
      availableTableColumns: unique([
        ...(fallbackOptions.prefixColumns ?? []),
        ...result.availableTableColumns,
      ]).filter((id) => {
        if (allTableColumnsSet.has(id)) return true;
        console.warn(`${id}, specified in availableTableColumns, is not a valid table column`);
        return false;
      }),
      defaultEnabledTableColumns: unique([
        ...(fallbackOptions.prefixColumns ?? []),
        ...result.defaultEnabledTableColumns,
      ]).filter((id) => {
        if (allTableColumnsSet.has(id)) return true;
        console.warn(`${id}, specified in defaultEnabledTableColumns, is not a valid table column`);
        return false;
      }),
    };
  }, [searchMetadata, fallbackOptions, columns]);
}
