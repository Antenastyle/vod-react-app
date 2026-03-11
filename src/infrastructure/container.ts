import { FirebaseMovieRepository } from "./repositories/FirebaseMovieRepository";
import { FirebaseAuthRepository } from "./repositories/FirebaseAuthRepository";
import { GetMovies } from "../application/usecases/GetMovies";
import { GetMovieById } from "../application/usecases/GetMovieById";
import { SubmitMovieRating } from "../application/usecases/SubmitMovieRating";
import { GetUserMovieRating } from "../application/usecases/GetUserMovieRating";
import { GetMovieComments } from "../application/usecases/GetMovieComments";
import { AddMovieComment } from "../application/usecases/AddMovieComment";
import { GetUserFavorites } from "../application/usecases/GetUserFavorites";
import { IsMovieFavorite } from "../application/usecases/IsMovieFavorite";
import { AddMovieToFavorites } from "../application/usecases/AddMovieToFavorites";
import { RemoveMovieFromFavorites } from "../application/usecases/RemoveMovieFromFavorites";
import { RegisterUser } from "../application/usecases/RegisterUser";
import { LoginUser } from "../application/usecases/LoginUser";
import { LogoutUser } from "../application/usecases/LogoutUser";
import { GetCurrentUser } from "../application/usecases/GetCurrentUser";
import { ObserveAuthState } from "../application/usecases/ObserveAuthState";

const movieRepository = new FirebaseMovieRepository();
const authRepository = new FirebaseAuthRepository();

export const container = {
  getMovies: new GetMovies(movieRepository),
  getMovieById: new GetMovieById(movieRepository),
  submitMovieRating: new SubmitMovieRating(movieRepository),
  getUserMovieRating: new GetUserMovieRating(movieRepository),
  getMovieComments: new GetMovieComments(movieRepository),
  addMovieComment: new AddMovieComment(movieRepository),
  getUserFavorites: new GetUserFavorites(movieRepository),
  isMovieFavorite: new IsMovieFavorite(movieRepository),
  addMovieToFavorites: new AddMovieToFavorites(movieRepository),
  removeMovieFromFavorites: new RemoveMovieFromFavorites(movieRepository),
  registerUser: new RegisterUser(authRepository),
  loginUser: new LoginUser(authRepository),
  logoutUser: new LogoutUser(authRepository),
  getCurrentUser: new GetCurrentUser(authRepository),
  observeAuthState: new ObserveAuthState(authRepository),
};
