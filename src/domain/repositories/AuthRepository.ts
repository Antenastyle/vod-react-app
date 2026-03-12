import type { AuthUser } from "../entities/AuthUser";

export interface AuthRepository {
  register(email: string, password: string): Promise<AuthUser>;
  login(email: string, password: string): Promise<AuthUser>;
  logout(): Promise<void>;
  getCurrentUser(): AuthUser | null;
  observeAuthState(callback: (user: AuthUser | null) => void): () => void;
}
