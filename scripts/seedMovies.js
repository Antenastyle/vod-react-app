import admin from "firebase-admin";
import fetch from "node-fetch";
import fs from "fs";

const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8"),
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TOTAL_PAGES = 13;

async function seedMovies() {
  for (let page = 1; page <= TOTAL_PAGES; page++) {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`,
    );

    const data = await response.json();

    for (const movie of data.results) {
      const movieData = {
        title: movie.title,
        description: movie.overview,
        category: movie.genre_ids[0]?.toString() || "Unknown",
        categoryId: movie.genre_ids,
        tmdbId: movie.id,
        releaseDate: movie.release_date || "Unknown",
        releaseYear: movie.release_date
          ? Number(movie.release_date.substring(0, 4))
          : 0,
        posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        averageRating: movie.vote_average,
      };

      await db.collection("movies").add(movieData);

      console.log(`Added: ${movie.title}`);
    }
  }

  console.log("Seeding complete");
}

seedMovies();
