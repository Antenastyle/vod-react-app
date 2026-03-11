import { Outlet } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";

export function MainLayout() {
  return (
    <div className="relative min-h-screen text-gray-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-16 top-24 h-48 w-48 rounded-full bg-teal-200/45 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-amber-200/45 blur-3xl" />
      </div>

      <AppHeader />
      <main className="relative z-10">
        <div className="mx-auto w-full max-w-[1520px] px-4 pb-10 pt-6 sm:px-6 lg:px-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
