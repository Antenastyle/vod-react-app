import type { Movie } from "../../domain/entities/Movie";
import { Link } from "react-router-dom";

interface Props {
  movie: Movie;
}

export function MovieCard({ movie }: Props) {
  return (
    <Link to={`/movie/${movie.id}`} className="group block">
      <article className="glass-card overflow-hidden rounded-2xl border border-white/60 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
          <p className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-amber-100">
            {movie.releaseYear}
          </p>
        </div>

        <div className="space-y-2 p-3">
          <h2 className="truncate text-sm font-semibold text-slate-900">
            {movie.title}
          </h2>

          <p className="truncate text-xs text-slate-600">
            {movie.categories.length > 0
              ? movie.categories.slice(0, 2).join(" • ")
              : "No category"}
          </p>
        </div>
      </article>
    </Link>
  );
}
