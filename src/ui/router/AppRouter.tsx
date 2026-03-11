import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { MoviePage } from "../pages/MoviePage";
import { FavoritesPage } from "../pages/FavoritesPage";
import { LoginPage } from "../pages/LoginPage";
import { ContactPage } from "../pages/ContactPage";
import { LegalPage } from "../pages/LegalPage";
import { MainLayout } from "../layouts/MainLayout";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/legal" element={<LegalPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
