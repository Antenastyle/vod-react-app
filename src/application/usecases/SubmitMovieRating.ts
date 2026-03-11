import type { MovieRatingSummary } from "../../domain/entities/MovieRatingSummary";
import type { MovieRepository } from "../../domain/repositories/MovieRepository";

export class SubmitMovieRating {
  private movieRepository: MovieRepository;

  constructor(movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  async execute(
    movieId: string,
    userId: string,
    rating: number,
  ): Promise<MovieRatingSummary> {
    return this.movieRepository.submitRating(movieId, userId, rating);
  }
}
