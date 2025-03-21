export type ExtractPaginatedResult<T extends { documents: { results: any[] } } | null | undefined> =
  NonNullable<NonNullable<T>['documents']['results'][number]>;

export type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

export type MaybeArray<T> = T | T[];

export type BoundingBox = {
  top: number;
  left: number;
  bottom: number;
  right: number;
};
