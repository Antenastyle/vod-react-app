import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import type { AuthUser } from "../../domain/entities/AuthUser";
import type { AuthRepository } from "../../domain/repositories/AuthRepository";
import { auth } from "../firebase/firebaseConfig";

function mapAuthUser(user: { uid: string; email: string | null }): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
  };
}

export class FirebaseAuthRepository implements AuthRepository {
  async register(email: string, password: string): Promise<AuthUser> {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return mapAuthUser(credential.user);
  }

  async login(email: string, password: string): Promise<AuthUser> {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return mapAuthUser(credential.user);
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  getCurrentUser(): AuthUser | null {
    if (!auth.currentUser) return null;

    return mapAuthUser(auth.currentUser);
  }

  observeAuthState(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, (user) => {
      if (!user) {
        callback(null);
        return;
      }

      callback(mapAuthUser(user));
    });
  }
}
