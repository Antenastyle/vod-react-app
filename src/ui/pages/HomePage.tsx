import { useEffect, useMemo, useRef, useState } from "react";
import type { Movie } from "../../domain/entities/Movie";
import { container } from "../../infrastructure/container";
import { MovieCard } from "../components/MovieCard";

export function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchedMovies, setSearchedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [lastTmdbId, setLastTmdbId] = useState<number | undefined>();
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All categories");
  const [searchTerm, setSearchTerm] = useState("");

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const LIMIT = 32;
  const normalizedSearch = searchTerm.trim();
  const isSearchMode = normalizedSearch.length > 0;

  const sourceMovies = isSearchMode ? searchedMovies : movies;

  const categoryOptions = useMemo(() => {
    const uniqueCategories = new Set<string>();

    sourceMovies.forEach((movie) => {
      movie.categories.forEach((category) => {
        if (category) uniqueCategories.add(category);
      });
    });

    return ["All categories", ...Array.from(uniqueCategories).sort()];
  }, [sourceMovies]);

  const filteredMovies = useMemo(() => {
    const lowerSearch = normalizedSearch.toLowerCase();

    return sourceMovies.filter((movie) => {
      const matchesCategory =
        selectedCategory === "All categories" ||
        movie.categories.includes(selectedCategory);

      const matchesSearch =
        lowerSearch.length === 0 ||
        movie.title.toLowerCase().includes(lowerSearch);

      return matchesCategory && matchesSearch;
    });
  }, [sourceMovies, selectedCategory, normalizedSearch]);

  const loadMovies = async () => {
    if (loading || !hasMore || isSearchMode) return;

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
    const searchByTitle = async () => {
      if (!isSearchMode) {
        setSearchedMovies([]);
        return;
      }

      setSearchLoading(true);

      try {
        const searchResults = await container.searchMoviesByTitle.execute(
          normalizedSearch,
          80,
        );
        setSearchedMovies(searchResults);
      } finally {
        setSearchLoading(false);
      }
    };

    searchByTitle();
  }, [isSearchMode, normalizedSearch]);

  useEffect(() => {
    if (!sentinelRef.current || isSearchMode) return;

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMovies();
      }
    });

    observerRef.current.observe(sentinelRef.current);

    return () => observerRef.current?.disconnect();
  }, [lastTmdbId, hasMore, isSearchMode]);

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

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="movie-search"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-600"
          >
            Search by title
          </label>
          <input
            id="movie-search"
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search movies..."
            className="w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-teal-700"
          />
        </div>

        <div>
          <label
            htmlFor="category-filter"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-600"
          >
            Filter by category
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-teal-700"
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {searchLoading ? (
        <p className="mt-6 text-sm text-slate-600">Searching movies...</p>
      ) : null}

      {filteredMovies.length === 0 && !searchLoading ? (
        <p className="mt-6 text-sm text-slate-600">
          No movies found with the current filters.
        </p>
      ) : null}

      <div
        ref={sentinelRef}
        className={`h-14 items-center justify-center ${
          isSearchMode ? "hidden" : "flex"
        }`}
      >
        {loading && (
          <p className="rounded-full bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm">
            Loading more movies...
          </p>
        )}
      </div>
    </section>
  );
}
