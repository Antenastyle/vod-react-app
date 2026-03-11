import type { MovieComment } from "../../domain/entities/MovieComment";
import type { MovieRepository } from "../../domain/repositories/MovieRepository";

export class AddMovieComment {
  private movieRepository: MovieRepository;

  constructor(movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  async execute(
    movieId: string,
    userId: string,
    userEmail: string,
    text: string,
  ): Promise<MovieComment> {
    return this.movieRepository.addComment(movieId, userId, userEmail, text);
  }
}
