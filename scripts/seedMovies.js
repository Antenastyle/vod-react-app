import admin from "firebase-admin";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "..", ".env");

if (typeof process.loadEnvFile === "function") {
  process.loadEnvFile(envPath);
}

const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8"),
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
  throw new Error(
    `TMDB_API_KEY is missing. Add it to ${envPath} or export it in your shell before running the seed script.`,
  );
}

const TOTAL_PAGES = 500;

async function seedMovies() {
  const genreResponse = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`,
  );
  const genreData = await genreResponse.json();

  const genreMap = {};
  genreData.genres.forEach((g) => {
    genreMap[g.id] = g.name;
  });

  for (let page = 1; page <= TOTAL_PAGES; page++) {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`,
    );

    const data = await response.json();

    for (const movie of data.results) {
      const movieData = {
        title: movie.title,
        description: movie.overview,
        categories: movie.genre_ids.map((id) => genreMap[id] || "Unknown"),
        tmdbId: movie.id,
        releaseDate: movie.release_date || "Unknown",
        releaseYear: movie.release_date
          ? Number(movie.release_date.substring(0, 4))
          : 0,
        posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        averageRating: 0,
      };

      await db.collection("movies").add(movieData);

      console.log(`Added: ${movie.title}`);
    }
  }

  console.log("Seeding complete");
}

seedMovies();
