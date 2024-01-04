export function debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number) {
  let timeout: number | null = null;

  return function (...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      window.clearTimeout(timeout);
    }

    timeout = window.setTimeout(later, wait);
  };
}
