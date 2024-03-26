export enum FilterType {
  MultiOptionsFilter,
  MultiOptionsFilterWithSearch,
}

export type MultiOptionsFilter = {
  id: string;
  name: string;
  type: FilterType.MultiOptionsFilter;
  options: Option[];
  selectedValues: string[];
};

export type MultiOptionsFilterWithSearch = {
  id: string;
  name: string;
  type: FilterType.MultiOptionsFilter;
  options: Option[];
  selectedValues: string[];
};

export type TableFilter = MultiOptionsFilter;

export type Option = { label: string; value: string };
