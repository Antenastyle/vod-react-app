import type { Movie } from "../../domain/entities/Movie";
import type { MovieRepository } from "../../domain/repositories/MovieRepository";

export class GetMovieById {
  private movieRepository: MovieRepository;

  constructor(movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  async execute(id: string): Promise<Movie | null> {
    return this.movieRepository.getById(id);
  }
}
