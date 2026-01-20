export default function ContentWrapper({
  children,
  maxWidth = '1200px',
  padding = '1.5rem 1rem',
  backgroundColor = 'var(--bg-main)',
  minHeight = '100vh',
  className = '',
  style = {}
}) {
  return (
    <div
      className={className}
      style={{
        maxWidth,
        margin: '0 auto',
        padding,
        backgroundColor,
        minHeight,
        ...style
      }}
    >
      {children}
    </div>
  );
}
