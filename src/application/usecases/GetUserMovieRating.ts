import type { MovieRepository } from "../../domain/repositories/MovieRepository";

export class GetUserMovieRating {
  private movieRepository: MovieRepository;

  constructor(movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  async execute(movieId: string, userId: string): Promise<number | null> {
    return this.movieRepository.getUserRating(movieId, userId);
  }
}
