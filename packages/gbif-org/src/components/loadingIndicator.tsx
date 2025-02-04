import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import { useNavigation } from 'react-router-dom';

export function LoadingIndicator() {
  const { state } = useNavigation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (state === 'loading' || state === 'submitting') {
      setProgress(1);

      const timeout = setTimeout(() => {
        setProgress(70);
      }, 10);

      return () => clearTimeout(timeout);
    }
  }, [state, setProgress]);

  useEffect(() => {
    if (state === 'idle') {
      setProgress(100);

      const timeout = setTimeout(() => {
        setProgress(0);
      }, 200);

      return () => clearTimeout(timeout);
    }
  }, [state]);

  if (progress === 0) return null;

  return (
    <Progress
      className="g-fixed g-w-screen g-rounded-none"
      style={{ height: 2 }}
      value={progress}
    />
  );
}
