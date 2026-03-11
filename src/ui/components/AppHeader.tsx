import { Link, NavLink } from "react-router-dom";

export function AppHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-8xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          VOD React App
        </Link>

        <nav className="flex items-center gap-5 text-sm font-medium text-gray-700">
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "text-black" : "hover:text-black transition-colors"
            }
          >
            Contact
          </NavLink>
          <NavLink
            to="/legal"
            className={({ isActive }) =>
              isActive ? "text-black" : "hover:text-black transition-colors"
            }
          >
            Legal
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
