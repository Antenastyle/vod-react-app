import type { Movie } from "../../domain/entities/Movie";
import type { MovieRepository } from "../../domain/repositories/MovieRepository";

export class GetUserFavorites {
  private movieRepository: MovieRepository;

  constructor(movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  async execute(userId: string): Promise<Movie[]> {
    return this.movieRepository.getFavorites(userId);
  }
}
