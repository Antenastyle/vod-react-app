import type { Movie } from "../../domain/entities/Movie";
import type { MovieRepository } from "../../domain/repositories/MovieRepository";

export class SearchMoviesByTitle {
  private movieRepository: MovieRepository;

  constructor(movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  async execute(title: string, limit?: number): Promise<Movie[]> {
    return this.movieRepository.searchByTitle(title, limit);
  }
}
