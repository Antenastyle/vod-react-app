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
    <div className="max-w-8xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Movie Catalog</h1>

      <div className="mb-6 flex items-center gap-3">
        <label htmlFor="category-filter" className="text-sm font-medium">
          Category
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <div ref={sentinelRef} className="h-10 flex justify-center items-center">
        {loading && <p>Loading more movies...</p>}
      </div>
    </div>
  );
}
