import { memo } from 'react';

type Props<T> = {
  render(item: T): React.ReactNode;
  item: T;
};

export const MemorizedValue = memo(function Value<T>({ render, item }: Props<T>) {
  return render(item);
});
