import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { AuthUser } from "../../domain/entities/AuthUser";
import type { Movie } from "../../domain/entities/Movie";
import { container } from "../../infrastructure/container";
import { MovieCard } from "../components/MovieCard";

export function FavoritesPage() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentUser(container.getCurrentUser.execute());

    const unsubscribe = container.observeAuthState.execute((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser?.uid) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const favoriteMovies = await container.getUserFavorites.execute(
        currentUser.uid,
      );
      setFavorites(favoriteMovies);
      setLoading(false);
    };

    fetchFavorites();
  }, [currentUser?.uid]);

  return (
    <section className="fade-up py-6 sm:py-8">
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <h1 className="display-title text-4xl font-bold text-slate-900 sm:text-5xl">
          Favorites
        </h1>

        {!currentUser ? (
          <div className="mt-5 rounded-2xl border border-dashed border-amber-300 bg-amber-50/70 p-5">
            <p className="text-sm text-slate-700">
              Please log in to see your favorite movies.
            </p>
            <Link
              to="/login"
              className="mt-4 inline-flex rounded-full bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Go to login
            </Link>
          </div>
        ) : loading ? (
          <p className="mt-5 text-sm text-slate-600">
            Loading your favorites...
          </p>
        ) : favorites.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-amber-300 bg-amber-50/70 p-5">
            <p className="text-sm text-slate-700">
              You have no favorites yet. Open a movie and mark it as favorite.
            </p>
            <Link
              to="/"
              className="mt-4 inline-flex rounded-full bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Explore catalog
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {favorites.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
