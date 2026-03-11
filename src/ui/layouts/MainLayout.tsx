import { Outlet } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <AppHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
