import { getJazzicon } from './JazzIcon';

export function JazzIcon({
  children,
  diameter,
  seed,
  className,
  ...props
}: { children?: React.ReactNode; seed: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      dangerouslySetInnerHTML={{ __html: getJazzicon(seed, diameter, className) }}
    ></div>
  );
}
