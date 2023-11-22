type Props = {
  children: React.ReactNode;
  headerHeight: number;
};

// Children that can have a height greater than the viewport sould have the flex-1 and min-h-0 class when wrapped in this component.
export function InternalScrollHandler({ children, headerHeight }: Props) {
  return (
    <div
      style={{
        marginTop: headerHeight,
        position: 'fixed',
        top: 0,
        height: `calc(100% - ${headerHeight}px)`,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      {children}
    </div>
  );
}
