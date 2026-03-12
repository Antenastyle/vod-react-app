import type { AuthUser } from "../../domain/entities/AuthUser";
import type { AuthRepository } from "../../domain/repositories/AuthRepository";

export class RegisterUser {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(email: string, password: string): Promise<AuthUser> {
    return this.authRepository.register(email, password);
  }
}
