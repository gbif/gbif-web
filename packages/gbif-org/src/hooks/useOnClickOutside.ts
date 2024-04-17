import { useEffect } from 'react';

export function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(
    function () {
      function listener(event: MouseEvent | TouchEvent): void {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target as Node)) {
          return;
        }

        handler(event);
      }

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);

      return function (): void {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    [ref, handler]
  ); // Reload only if ref or handler changes
}
