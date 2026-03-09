import type { Movie } from "../entities/Movie";

export interface MovieRepository {
  getAll(): Promise<Movie[]>;
  getById(id: string): Promise<Movie | null>;
  getByCategory(category: string): Promise<Movie[]>;
}
