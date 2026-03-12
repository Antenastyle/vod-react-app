import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8"),
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function removeDuplicateMovies() {
  const snapshot = await db.collection("movies").get();

  const seen = new Map();
  const duplicates = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    const tmdbId = data.tmdbId;

    if (!tmdbId) return;

    if (seen.has(tmdbId)) {
      duplicates.push(doc.id);
    } else {
      seen.set(tmdbId, doc.id);
    }
  });

  console.log("Duplicates found:", duplicates.length);

  const batch = db.batch();

  duplicates.forEach((docId) => {
    const ref = db.collection("movies").doc(docId);
    batch.delete(ref);
  });

  await batch.commit();

  console.log("Duplicates removed");
}

removeDuplicateMovies();
