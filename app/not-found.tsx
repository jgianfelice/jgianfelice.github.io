import Link from 'next/link';
import Nav from '@/components/Nav';

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="font-mono text-xs uppercase tracking-label text-accent">
          Error 404
        </div>
        <h1 className="mt-4 font-mono text-5xl tracking-tight text-ink md:text-7xl">
          Off the chart
        </h1>
        <p className="mt-5 max-w-md leading-relaxed text-muted">
          This route isn&rsquo;t part of the record. Everything real lives on the
          index.
        </p>
        <Link
          href="/"
          className="mt-8 font-mono text-xs uppercase tracking-label text-muted transition-colors hover:text-accent"
        >
          ← Back to the index
        </Link>
      </main>
    </>
  );
}
