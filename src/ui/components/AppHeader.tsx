import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import type { AuthUser } from "../../domain/entities/AuthUser";
import { container } from "../../infrastructure/container";

export function AppHeader() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setCurrentUser(container.getCurrentUser.execute());

    const unsubscribe = container.observeAuthState.execute((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-3 py-1.5 text-sm font-medium transition ${
      isActive
        ? "bg-teal-800 text-white"
        : "text-slate-700 hover:bg-white/75 hover:text-slate-900"
    }`;

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await container.logoutUser.execute();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-amber-100 bg-[#f8f3e8]/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1520px] items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        <Link to="/" className="group inline-flex items-center gap-3">
          <img
            src="/favicon.svg"
            alt="VOD React App"
            className="h-9 w-9 rounded-xl shadow-sm"
          />
          <div>
            <p className="display-title text-xl font-bold leading-none text-slate-900 sm:text-2xl">
              VOD React App
            </p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 group-hover:text-slate-700">
              Curated Catalog
            </p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-2">
          <NavLink to="/" className={getNavClassName} end>
            Home
          </NavLink>
          <NavLink to="/favorites" className={getNavClassName}>
            Favorites
          </NavLink>
          <NavLink to="/contact" className={getNavClassName}>
            Contact
          </NavLink>
          <NavLink to="/legal" className={getNavClassName}>
            Legal
          </NavLink>
          {!currentUser ? (
            <NavLink to="/login" className={getNavClassName}>
              Login
            </NavLink>
          ) : (
            <>
              <span className="rounded-full bg-white/75 px-3 py-1.5 text-sm font-medium text-slate-700">
                {currentUser.email ?? "User"}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-white/75 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
