import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import type { Movie } from "../../domain/entities/Movie";
import type { MovieRepository } from "../../domain/repositories/MovieRepository";

export class FirebaseMovieRepository implements MovieRepository {
  async getAll(): Promise<Movie[]> {
    const snapshot = await getDocs(collection(db, "movies"));

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Movie[];
  }

  async getById(id: string): Promise<Movie | null> {
    const movieDoc = await getDoc(doc(db, "movies", id));

    if (!movieDoc.exists()) return null;

    return {
      id: movieDoc.id,
      ...movieDoc.data(),
    } as Movie;
  }

  async getByCategory(category: string): Promise<Movie[]> {
    const q = query(
      collection(db, "movies"),
      where("category", "==", category),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Movie[];
  }
}
