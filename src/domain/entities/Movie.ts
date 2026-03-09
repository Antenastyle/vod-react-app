export interface Movie {
  id: string;
  title: string;
  description: string;
  categories: string[];
  releaseYear: number;
  posterUrl: string;
  averageRating: number;
  tmdbId: number;
}
