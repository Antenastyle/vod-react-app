import type { Movie } from "../../domain/entities/Movie"
import { Link } from "react-router-dom"

interface Props {
  movie: Movie
}

export function MovieCard({ movie }: Props) {
  return (
    <Link to={`/movie/${movie.id}`}>
      <div className="bg-white shadow-md rounded-lg overflow-hidden hover:scale-105 transition">

        <div className="aspect-[2/3] w-full overflow-hidden">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-2">
          <h2 className="text-sm font-semibold truncate">{movie.title}</h2>

          <p className="text-xs text-gray-500">
            {movie.categories.length > 0 ? movie.categories.slice(0, 2).join(", ") : "No Category"}
          </p>

          <p className="text-xs text-gray-500">
            {movie.releaseYear}
          </p>

          <p className="text-yellow-500 text-xs font-bold">
            ⭐ {movie.averageRating.toFixed(1)}
          </p>
        </div>

      </div>
    </Link>
  )
}