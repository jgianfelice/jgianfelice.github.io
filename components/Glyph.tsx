// Minimal line-art motifs — 1px cool-blue strokes on the crystal palette.
// One per learning topic. Kept deliberately geometric and quiet so they read
// as instrument marks, not icons.

const paths: Record<string, React.ReactNode> = {
  // Angle brackets — code / tooling.
  code: (
    <>
      <path d="M9 8l-4 4 4 4" />
      <path d="M15 8l4 4-4 4" />
    </>
  ),
  // Axis with a rising signal — markets.
  chart: (
    <>
      <path d="M5 4v15h15" />
      <path d="M7 15l3-4 3 2 4-6" />
    </>
  ),
  // Catalog grid — coursework.
  grid: (
    <>
      <rect x="5" y="5" width="6" height="6" rx="0.5" />
      <rect x="13" y="5" width="6" height="6" rx="0.5" />
      <rect x="5" y="13" width="6" height="6" rx="0.5" />
      <rect x="13" y="13" width="6" height="6" rx="0.5" />
    </>
  ),
  // Connected nodes — operating principles / systems.
  nodes: (
    <>
      <circle cx="6" cy="7" r="1.8" />
      <circle cx="18" cy="8" r="1.8" />
      <circle cx="12" cy="17" r="1.8" />
      <path d="M7.6 7.8l8.8 .4M7.2 8.4l4 7M16.6 9.4l-4 6.2" />
    </>
  ),
  // Nib — writing.
  pen: (
    <>
      <path d="M6 18l2-6 8-8 4 4-8 8-6 2z" />
      <path d="M8 12l4 4" />
    </>
  ),
  // Open book — reading.
  book: (
    <>
      <path d="M12 6c-2-1.3-4.5-1.5-7-1v12c2.5-.5 5-.3 7 1 2-1.3 4.5-1.5 7-1V5c-2.5-.5-5-.3-7 1z" />
      <path d="M12 6v12" />
    </>
  ),
};

export default function Glyph({
  name,
  className = 'h-6 w-6',
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name] ?? paths.grid}
    </svg>
  );
}
