import { useEffect, useState, useRef } from "react";
import type { Movie } from "../../domain/entities/Movie";
import { container } from "../../infrastructure/container";
import { MovieCard } from "../components/MovieCard";

export function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastTmdbId, setLastTmdbId] = useState<number | undefined>();
  const [hasMore, setHasMore] = useState(true);

  const initialLoad = useRef(false);

  const LIMIT = 32;

  const loadMovies = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const newMovies = await container.getMovies.execute(LIMIT, lastTmdbId);

    setMovies((prev) => [...prev, ...newMovies]);

    if (newMovies.length < LIMIT) {
      setHasMore(false);
    } else {
      setLastTmdbId(newMovies[newMovies.length - 1].tmdbId);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (initialLoad.current) return;

    initialLoad.current = true;
    loadMovies();
  }, []);

  return (
    <div className="max-w-8xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Movie Catalog</h1>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {hasMore && (
        <button
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={loadMovies}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}
