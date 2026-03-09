import { FirebaseMovieRepository } from "./repositories/FirebaseMovieRepository";
import { GetMovies } from "../application/usecases/GetMovies";
import { GetMovieById } from "../application/usecases/GetMovieById";

const movieRepository = new FirebaseMovieRepository();

export const container = {
  getMovies: new GetMovies(movieRepository),
  getMovieById: new GetMovieById(movieRepository),
};
