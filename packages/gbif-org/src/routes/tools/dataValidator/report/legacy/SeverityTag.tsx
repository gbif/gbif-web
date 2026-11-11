import { cn } from '@/utils/shadcn';
import { ReactNode } from 'react';

const colors: Record<string, string> = {
  INFO: 'g-bg-blue-100 g-text-blue-800',
  WARNING: 'g-bg-yellow-100 g-text-yellow-800',
  ERROR: 'g-bg-red-100 g-text-red-800',
  OK: 'g-bg-green-100 g-text-green-800',
};

export function SeverityTag({
  severity,
  children,
  className,
}: {
  severity: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'g-inline-flex g-items-center g-gap-1 g-text-xs g-font-medium g-px-2.5 g-py-0.5 g-rounded',
        colors[severity] ?? 'g-bg-gray-100 g-text-gray-800',
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusDot({ severity }: { severity: 'ERROR' | 'WARNING' | 'OK' | 'NEUTRAL' }) {
  return (
    <span
      aria-hidden
      className={cn('g-inline-block g-h-2 g-w-2 g-rounded-full g-flex-none', {
        'g-bg-red-500': severity === 'ERROR',
        'g-bg-yellow-500': severity === 'WARNING',
        'g-bg-green-500': severity === 'OK',
        'g-bg-slate-300': severity === 'NEUTRAL',
      })}
    />
  );
}
