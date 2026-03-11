export interface Movie {
  id: string;
  title: string;
  description: string;
  categories: string[];
  releaseDate?: string;
  releaseYear: number;
  posterUrl: string;
  averageRating: number;
  ratingsCount?: number;
  tmdbId: number;
}
