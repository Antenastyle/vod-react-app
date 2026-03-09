import type { Movie } from "../entities/Movie";

export interface MovieRepository {
  getAll(limit?: number, startAfterId?: number): Promise<Movie[]>;
  getById(id: string): Promise<Movie | null>;
  getByCategory(
    category: string,
    limit?: number,
    startAfterId?: number,
  ): Promise<Movie[]>;
}
