import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Movie } from "../../domain/entities/Movie";
import { container } from "../../infrastructure/container";

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

              <div className="rounded-2xl bg-amber-100/70 px-4 py-3 text-right shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                  Rating
                </p>
                <p className="text-xl font-bold text-amber-700">
                  ⭐ {movie.averageRating.toFixed(1)}
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

            <div className="grid gap-3 sm:grid-cols-3">
              <article className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-100">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Release Year
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900">{movie.releaseYear}</p>
              </article>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/"
                className="inline-flex rounded-full bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Back to catalog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}