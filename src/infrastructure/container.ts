import { FirebaseMovieRepository } from "./repositories/FirebaseMovieRepository";
import { FirebaseAuthRepository } from "./repositories/FirebaseAuthRepository";
import { GetMovies } from "../application/usecases/GetMovies";
import { GetMovieById } from "../application/usecases/GetMovieById";
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
  registerUser: new RegisterUser(authRepository),
  loginUser: new LoginUser(authRepository),
  logoutUser: new LogoutUser(authRepository),
  getCurrentUser: new GetCurrentUser(authRepository),
  observeAuthState: new ObserveAuthState(authRepository),
};
