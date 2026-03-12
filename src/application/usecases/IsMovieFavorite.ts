import type { MovieRepository } from "../../domain/repositories/MovieRepository";

export class IsMovieFavorite {
  private movieRepository: MovieRepository;

  constructor(movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  async execute(movieId: string, userId: string): Promise<boolean> {
    return this.movieRepository.isFavorite(movieId, userId);
  }
}
