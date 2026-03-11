import type { AuthUser } from "../../domain/entities/AuthUser";
import type { AuthRepository } from "../../domain/repositories/AuthRepository";

export class ObserveAuthState {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  execute(callback: (user: AuthUser | null) => void): () => void {
    return this.authRepository.observeAuthState(callback);
  }
}
