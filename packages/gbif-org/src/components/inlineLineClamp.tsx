type Props = {
  children: React.ReactNode;
  className?: string;
  maxLines?: number;
};

export function InlineLineClamp({ children, className, maxLines = 3 }: Props) {
  return (
    <span
      className={className}
      style={{
        overflow: 'hidden',
        display: '-webkit-inline-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: maxLines,
      }}
    >
      {children}
    </span>
  );
}
