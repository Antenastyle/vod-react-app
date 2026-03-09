import type { Movie } from "../../domain/entities/Movie";
import type { MovieRepository } from "../../domain/repositories/MovieRepository";

export class GetMovies {
  private movieRepository: MovieRepository;

  constructor(movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  async execute(): Promise<Movie[]> {
    return this.movieRepository.getAll();
  }
}
