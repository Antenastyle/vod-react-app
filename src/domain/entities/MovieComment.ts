export interface MovieComment {
  id: string;
  movieId: string;
  userId: string;
  userEmail: string;
  text: string;
  createdAtMs: number;
}
