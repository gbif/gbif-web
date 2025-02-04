export type ExtractPaginatedResult<T extends { documents: { results: any[] } } | null | undefined> =
  NonNullable<NonNullable<T>['documents']['results'][number]>;

export type Setter<T> = React.Dispatch<React.SetStateAction<T | undefined>>;
