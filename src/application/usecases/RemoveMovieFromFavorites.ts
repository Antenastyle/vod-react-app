import type { MovieRepository } from "../../domain/repositories/MovieRepository";

export class RemoveMovieFromFavorites {
  private movieRepository: MovieRepository;

  constructor(movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  async execute(userId: string, movieId: string): Promise<void> {
    await this.movieRepository.removeFromFavorites(userId, movieId);
  }
}
