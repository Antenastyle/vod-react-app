import { useEffect, useMemo, useRef, useState } from "react";
import type { Movie } from "../../domain/entities/Movie";
import { container } from "../../infrastructure/container";
import { MovieCard } from "../components/MovieCard";

export function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastTmdbId, setLastTmdbId] = useState<number | undefined>();
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All categories");

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const LIMIT = 32;

  const categoryOptions = useMemo(() => {
    const uniqueCategories = new Set<string>();

    movies.forEach((movie) => {
      movie.categories.forEach((category) => {
        if (category) uniqueCategories.add(category);
      });
    });

    return ["All categories", ...Array.from(uniqueCategories).sort()];
  }, [movies]);

  const filteredMovies = useMemo(() => {
    if (selectedCategory === "All categories") return movies;

    return movies.filter((movie) =>
      movie.categories.includes(selectedCategory)
    );
  }, [movies, selectedCategory]);

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
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMovies();
      }
    });

    observerRef.current.observe(sentinelRef.current);

    return () => observerRef.current?.disconnect();
  }, [lastTmdbId, hasMore]);

  return (
    <section className="fade-up py-6 sm:py-8">
      <div className="glass-card mb-7 rounded-3xl p-6 sm:p-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
          Discover your next watch
        </p>
        <h1 className="display-title mb-4 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
          Movie Catalog
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          Browse the full collection and narrow the list with categories to find
          the perfect film for tonight.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label
          htmlFor="category-filter"
          className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600"
        >
          Filter by category
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          className="w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-teal-700 sm:max-w-xs"
        >
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <div ref={sentinelRef} className="h-14 flex items-center justify-center">
        {loading && (
          <p className="rounded-full bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm">
            Loading more movies...
          </p>
        )}
      </div>
    </section>
  );
}
