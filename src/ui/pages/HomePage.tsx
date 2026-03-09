import { useEffect, useState } from "react"
import type { Movie } from "../../domain/entities/Movie"
import { container } from "../../infrastructure/container"
import { MovieCard } from "../components/MovieCard"

export function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMovies() {
      const data = await container.getMovies.execute()
      setMovies(data)
      setLoading(false)
    }

    loadMovies()
  }, [])

  if (loading) {
    return <div className="p-10">Loading movies...</div>
  }

  return (
    <div className="max-w-8xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Movie Catalog</h1>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
}