import { UserProvider, useUser } from '@/contexts/UserContext';
import { Outlet } from 'react-router-dom';

// The dark "backside" shell. Deliberately self-contained: it does NOT use the
// public GbifRootLayout (no header/footer/config context), so it is visually
// distinct and free of the public chrome. It mounts its own UserProvider since
// it lives outside the public layout that normally provides one.
//
// Authorisation is enforced server-side: the page route 404s for non-admins
// before this ever renders, and every /api/admin/* call 404s for non-admins
// too. The bits here are presentational only.

function TopBar() {
  const { user, isLoggedIn } = useUser();
  return (
    <header className="g-border-b g-border-zinc-800 g-bg-zinc-950">
      <div className="g-mx-auto g-max-w-7xl g-px-4 g-py-3 g-flex g-items-center g-justify-between">
        <div className="g-flex g-items-baseline g-gap-3">
          <span className="g-text-zinc-100 g-font-semibold g-tracking-tight">
            gbif-web backstage
          </span>
          <span className="g-text-xs g-text-amber-400 g-uppercase g-tracking-wider">
            internal · live controls
          </span>
        </div>
        <div className="g-text-xs g-text-zinc-400">
          {isLoggedIn ? `signed in as ${user?.userName}` : 'not signed in'}
        </div>
      </div>
    </header>
  );
}

export function BackstageLayout() {
  return (
    <UserProvider>
      <div className="g-min-h-screen g-bg-zinc-900 g-text-zinc-200 g-antialiased">
        <TopBar />
        <main className="g-mx-auto g-max-w-7xl g-px-4 g-py-6">
          <Outlet />
        </main>
      </div>
    </UserProvider>
  );
}
