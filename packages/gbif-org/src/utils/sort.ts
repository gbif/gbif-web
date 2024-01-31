// Utility to sort from old to new
export function sortByOldToNew<T>(selector: (item: T) => number | string | Date) {
  return (a: T, b: T) => {
    const valueA = selector(a);
    const valueB = selector(b);

    if (valueA < valueB) {
      return -1;
    }
    if (valueA > valueB) {
      return 1;
    }
    return 0;
  };
}

// Utility to sort from new to old
export function sortByNewToOld<T>(selector: (item: T) => number | string | Date) {
  return (a: T, b: T) => {
    const valueA = selector(a);
    const valueB = selector(b);

    if (valueA > valueB) {
      return -1;
    }
    if (valueA < valueB) {
      return 1;
    }
    return 0;
  };
}
