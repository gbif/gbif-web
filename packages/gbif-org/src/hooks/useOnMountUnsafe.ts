import { useEffect, useRef } from 'react';

// useEffects will run twice in dev mode when using React.StrictMode
// This hook will make sure an effect is only run once, but will also prevent React.StrictMode from detecting problems with the effect
export function useOnMountUnsafe(effect: Function) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      effect();
    }
  }, []);
}
