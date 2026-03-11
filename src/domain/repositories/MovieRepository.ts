import type { Movie } from "../entities/Movie";
import type { MovieComment } from "../entities/MovieComment";
import type { MovieRatingSummary } from "../entities/MovieRatingSummary";

export interface MovieRepository {
  getAll(limit?: number, startAfterId?: number): Promise<Movie[]>;
  getById(id: string): Promise<Movie | null>;
  getByCategory(
    category: string,
    limit?: number,
    startAfterId?: number,
  ): Promise<Movie[]>;
  getUserRating(movieId: string, userId: string): Promise<number | null>;
  submitRating(
    movieId: string,
    userId: string,
    rating: number,
  ): Promise<MovieRatingSummary>;
  getComments(movieId: string): Promise<MovieComment[]>;
  addComment(
    movieId: string,
    userId: string,
    userEmail: string,
    text: string,
  ): Promise<MovieComment>;
}
