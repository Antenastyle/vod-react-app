import type { Movie } from "../../domain/entities/Movie";
import type { MovieRepository } from "../../domain/repositories/MovieRepository";

export class AddMovieToFavorites {
  private movieRepository: MovieRepository;

  constructor(movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  async execute(userId: string, movie: Movie): Promise<void> {
    await this.movieRepository.addToFavorites(userId, movie);
  }
}
