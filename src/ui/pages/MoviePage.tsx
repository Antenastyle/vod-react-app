import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Movie } from "../../domain/entities/Movie";
import { container } from "../../infrastructure/container";
import { MovieRatingSection } from "../components/MovieRatingSection";

function getStarFillPercentage(value: number, star: number) {
  return Math.max(0, Math.min(100, (value - (star - 1)) * 100));
}

function renderCompactStars(value: number) {
  return Array.from({ length: 5 }, (_, index) => {
    const star = index + 1;
    const fillPercentage = getStarFillPercentage(value, star);

    return (
      <span key={star} className="relative inline-block h-4 w-4">
        <svg
          viewBox="0 0 24 24"
          className="absolute inset-0 h-full w-full text-slate-300"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M12 2.5l2.93 5.94 6.56.95-4.74 4.62 1.12 6.53L12 17.46l-5.87 3.08 1.12-6.53L2.5 9.39l6.56-.95L12 2.5z"
          />
        </svg>
        <span
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` }}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-full w-full text-amber-500"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M12 2.5l2.93 5.94 6.56.95-4.74 4.62 1.12 6.53L12 17.46l-5.87 3.08 1.12-6.53L2.5 9.39l6.56-.95L12 2.5z"
            />
          </svg>
        </span>
      </span>
    );
  });
}

function formatReleaseDate(movie: Movie) {
  const rawDate = movie.releaseDate;

  if (rawDate) {
    const parsedDate = new Date(rawDate);

    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  }

  if (movie.releaseYear > 0) {
    return new Date(movie.releaseYear, 0, 1).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  return "Unknown";
}

export function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const foundMovie = await container.getMovieById.execute(id);
      setMovie(foundMovie);
      setLoading(false);
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <section className="py-10">
        <div className="glass-card rounded-3xl p-8 text-center text-slate-600">
          Loading movie details...
        </div>
      </section>
    );
  }

  if (!movie) {
    return (
      <section className="py-10">
        <div className="glass-card rounded-3xl p-8 text-center">
          <h1 className="display-title text-3xl font-bold text-slate-900">
            Movie not found
          </h1>
          <p className="mt-3 text-slate-600">
            The movie you are looking for does not exist or was removed.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Back to catalog
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="fade-up py-6 sm:py-8">
      <div className="glass-card relative overflow-hidden rounded-3xl border border-white/60">
        <div className="relative grid md:grid-cols-[340px_1fr]">
          <div className="p-5 sm:p-6">
            <div className="overflow-hidden rounded-2xl border border-white/60 bg-slate-900 shadow-xl">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                  Featured movie
                </p>
                <h1 className="display-title mt-2 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                  {movie.title}
                </h1>
              </div>

              <div className="min-w-[190px] rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-3 text-right shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Community rating
                </p>
                <div className="mt-1 flex items-end justify-end gap-1.5">
                  <span className="text-2xl font-bold text-amber-700">
                    {movie.averageRating.toFixed(1)}
                  </span>
                  <span className="pb-1 text-xs font-semibold text-slate-500">
                    / 5
                  </span>
                </div>
                <div className="mt-1 flex justify-end gap-0.5">
                  {renderCompactStars(movie.averageRating)}
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  {movie.ratingsCount ?? 0}{" "}
                  {movie.ratingsCount === 1 ? "vote" : "votes"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {movie.categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-teal-200 bg-teal-100/80 px-3.5 py-1.5 text-xs font-semibold text-teal-900"
                >
                  {category}
                </span>
              ))}
            </div>

            <p className="max-w-3xl text-sm leading-7 text-slate-700 sm:text-base">
              {movie.description}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <article className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-100">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Release Date
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {formatReleaseDate(movie)}
                </p>
              </article>

              <MovieRatingSection
                movieId={movie.id}
                onRatingSaved={(summary) => {
                  setMovie((previousMovie) =>
                    previousMovie
                      ? {
                          ...previousMovie,
                          averageRating: summary.averageRating,
                          ratingsCount: summary.ratingsCount,
                        }
                      : previousMovie,
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
