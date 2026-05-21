import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  size?: number;
};

export default function SunburstSkeleton({ size = 220 }: Props) {
  const innerSize = `${(60 / 140) * 100}%`;

  return (
    <div className="g-relative" style={{ width: size, height: size }}>
      <Skeleton className="g-absolute g-inset-0 g-rounded-full" />
      <div
        className="g-absolute g-rounded-full g-bg-card"
        style={{
          width: innerSize,
          height: innerSize,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
}
