import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  runTransaction,
  serverTimestamp,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import type { Movie } from "../../domain/entities/Movie";
import type { MovieRatingSummary } from "../../domain/entities/MovieRatingSummary";
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

  async getUserRating(movieId: string, userId: string): Promise<number | null> {
    const ratingRef = doc(db, "movies", movieId, "ratings", userId);
    const ratingDoc = await getDoc(ratingRef);

    if (!ratingDoc.exists()) return null;

    const rating = ratingDoc.data().rating;
    return typeof rating === "number" ? rating : null;
  }

  async submitRating(
    movieId: string,
    userId: string,
    rating: number,
  ): Promise<MovieRatingSummary> {
    if (rating < 0.5 || rating > 5 || (rating * 10) % 5 !== 0) {
      throw new Error("Rating must be between 0.5 and 5 in 0.5 steps.");
    }

    const movieRef = doc(db, "movies", movieId);
    const ratingRef = doc(db, "movies", movieId, "ratings", userId);

    return runTransaction(db, async (transaction) => {
      const [movieSnapshot, userRatingSnapshot] = await Promise.all([
        transaction.get(movieRef),
        transaction.get(ratingRef),
      ]);

      if (!movieSnapshot.exists()) {
        throw new Error("Movie not found.");
      }

      if (userRatingSnapshot.exists()) {
        throw new Error("You have already rated this movie.");
      }

      const movieData = movieSnapshot.data();
      const currentAverage =
        typeof movieData.averageRating === "number"
          ? movieData.averageRating
          : 0;
      const currentCount =
        typeof movieData.ratingsCount === "number" ? movieData.ratingsCount : 0;

      const nextCount = currentCount + 1;
      const nextAverage =
        Math.round(
          ((currentAverage * currentCount + rating) / nextCount) * 10,
        ) / 10;

      transaction.update(movieRef, {
        averageRating: nextAverage,
        ratingsCount: nextCount,
      });

      transaction.set(ratingRef, {
        userId,
        movieId,
        rating,
        createdAt: serverTimestamp(),
      });

      return {
        averageRating: nextAverage,
        ratingsCount: nextCount,
      };
    });
  }
}
