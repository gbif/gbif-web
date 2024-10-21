export type ExtractPaginatedResult<T extends { documents: { results: any[] } } | null | undefined> =
  NonNullable<NonNullable<T>['documents']['results'][number]>;
