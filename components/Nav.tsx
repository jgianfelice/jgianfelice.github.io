'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/projects', label: 'Projects' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/learning', label: 'Learning' },
  { href: '/logs', label: 'Logs' },
  { href: '/about', label: 'About' },
];

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  return (
    <header className="fixed top-0 inset-x-0 z-50 mix-blend-difference">
      <nav className="container-editorial flex items-center justify-between h-20">
        <Link
          href="/"
          className={`font-serif text-lg tracking-tight text-ink transition-opacity ${
            isHome ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          Justin Gianfelice
        </Link>
        {!isHome && (
          <div className="hidden md:flex items-center gap-8">
            {NAV.map((item) => {
              const active = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm link-underline transition-colors ${
                    active ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
}
