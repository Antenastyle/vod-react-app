import type { MovieComment } from "../../domain/entities/MovieComment";
import type { MovieRepository } from "../../domain/repositories/MovieRepository";

export class GetMovieComments {
  private movieRepository: MovieRepository;

  constructor(movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  async execute(movieId: string): Promise<MovieComment[]> {
    return this.movieRepository.getComments(movieId);
  }
}
