import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import type { Movie } from "../../domain/entities/Movie";
import type { MovieRepository } from "../../domain/repositories/MovieRepository";

export class FirebaseMovieRepository implements MovieRepository {
  async getAll(
    limitCount: number = 32,
    startAfterId?: number,
  ): Promise<Movie[]> {
    let q;

    if (startAfterId) {
      q = query(
        collection(db, "movies"),
        orderBy("tmdbId"),
        startAfter(startAfterId),
        limit(limitCount),
      );
    } else {
      q = query(collection(db, "movies"), orderBy("tmdbId"), limit(limitCount));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Movie);
  }

  async getById(id: string): Promise<Movie | null> {
    const movieDoc = await getDoc(doc(db, "movies", id));

    if (!movieDoc.exists()) return null;

    return {
      id: movieDoc.id,
      ...movieDoc.data(),
    } as Movie;
  }

  async getByCategory(
    category: string,
    limitCount: number = 20,
    startAfterId?: number,
  ): Promise<Movie[]> {
    let q;

    if (startAfterId) {
      q = query(
        collection(db, "movies"),
        where("categories", "array-contains", category),
        orderBy("tmdbId"),
        startAfter(startAfterId),
        limit(limitCount),
      );
    } else {
      q = query(
        collection(db, "movies"),
        where("categories", "array-contains", category),
        orderBy("tmdbId"),
        limit(limitCount),
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Movie);
  }
}
