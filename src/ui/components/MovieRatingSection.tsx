import { useEffect, useState } from "react";
import type { AuthUser } from "../../domain/entities/AuthUser";
import type { MovieRatingSummary } from "../../domain/entities/MovieRatingSummary";
import { container } from "../../infrastructure/container";

interface Props {
  movieId: string;
  onRatingSaved: (summary: MovieRatingSummary) => void;
}

function getStarFillPercentage(value: number, star: number) {
  return Math.max(0, Math.min(100, (value - (star - 1)) * 100));
}

function StarIcon({
  fillPercentage,
  sizeClass,
}: {
  fillPercentage: number;
  sizeClass: string;
}) {
  return (
    <span className={`relative inline-block ${sizeClass}`}>
      <svg
        viewBox="0 0 24 24"
        className="absolute inset-0 h-full w-full text-slate-300"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M12 2.5l2.93 5.94 6.56.95-4.74 4.62 1.12 6.53L12 17.46l-5.87 3.08 1.12-6.53L2.5 9.39l6.56-.95L12 2.5z"
        />
      </svg>
      <span
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` }}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-full w-full text-amber-500"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M12 2.5l2.93 5.94 6.56.95-4.74 4.62 1.12 6.53L12 17.46l-5.87 3.08 1.12-6.53L2.5 9.39l6.56-.95L12 2.5z"
          />
        </svg>
      </span>
    </span>
  );
}

function renderStars(value: number) {
  return Array.from({ length: 5 }, (_, index) => {
    const star = index + 1;
    const fillPercentage = getStarFillPercentage(value, star);

    return (
      <StarIcon
        key={star}
        fillPercentage={fillPercentage}
        sizeClass="h-6 w-6"
      />
    );
  });
}

export function MovieRatingSection({ movieId, onRatingSaved }: Props) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [myRating, setMyRating] = useState<number | null>(null);
  const [draftRating, setDraftRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUser(container.getCurrentUser.execute());

    const unsubscribe = container.observeAuthState.execute((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchUserRating = async () => {
      if (!movieId || !currentUser?.uid) {
        setMyRating(null);
        return;
      }

      const existingRating = await container.getUserMovieRating.execute(
        movieId,
        currentUser.uid,
      );
      setMyRating(existingRating);
      if (existingRating) {
        setDraftRating(existingRating);
      }
    };

    fetchUserRating();
  }, [movieId, currentUser?.uid]);

  const handleRateMovie = async (selectedRating: number) => {
    if (!currentUser) return;

    if (selectedRating < 0.5) {
      setRatingError("Please select a rating.");
      return;
    }

    setRatingError(null);
    setSubmittingRating(true);

    try {
      const summary = await container.submitMovieRating.execute(
        movieId,
        currentUser.uid,
        selectedRating,
      );

      setDraftRating(selectedRating);
      setMyRating(selectedRating);
      onRatingSaved(summary);
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Failed to save your rating. Please try again.";
      setRatingError(message);
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white/85 p-4 shadow-sm ring-1 ring-slate-100">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Your Rating
      </p>

      {!currentUser ? (
        <p className="mt-2 text-sm text-slate-600">
          Please log in to rate this movie.
        </p>
      ) : myRating ? (
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(myRating)}</div>
            <span className="text-sm font-semibold text-slate-800">
              {myRating.toFixed(1)} / 5
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            You already rated this movie. Only one rating per user is allowed.
          </p>
        </div>
      ) : (
        <>
          <div
            className="mt-2 flex items-center"
            onMouseLeave={() => setHoverRating(null)}
          >
            {Array.from({ length: 5 }, (_, index) => {
              const star = index + 1;
              const activeRating = hoverRating ?? draftRating;
              const fillPercentage = getStarFillPercentage(activeRating, star);

              return (
                <div key={star} className="relative h-8 w-8">
                  <button
                    type="button"
                    className="absolute left-0 top-0 h-full w-1/2"
                    onMouseEnter={() => setHoverRating(star - 0.5)}
                    onClick={() => {
                      const value = star - 0.5;
                      setDraftRating(value);
                      handleRateMovie(value);
                    }}
                    aria-label={`Rate ${star - 0.5} stars`}
                    disabled={submittingRating}
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-0 h-full w-1/2"
                    onMouseEnter={() => setHoverRating(star)}
                    onClick={() => {
                      const value = star;
                      setDraftRating(value);
                      handleRateMovie(value);
                    }}
                    aria-label={`Rate ${star} stars`}
                    disabled={submittingRating}
                  />
                  <span className="pointer-events-none absolute inset-0 inline-flex items-center justify-center">
                    <StarIcon
                      fillPercentage={fillPercentage}
                      sizeClass="h-7 w-7"
                    />
                  </span>
                </div>
              );
            })}
            <p className="ml-3 text-sm text-slate-700">
              Selected: {(hoverRating ?? draftRating).toFixed(1)} / 5
            </p>
            {submittingRating ? (
              <p className="ml-3 text-sm font-semibold text-teal-700">
                Saving...
              </p>
            ) : null}
          </div>
        </>
      )}

      {ratingError ? (
        <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {ratingError}
        </p>
      ) : null}
    </div>
  );
}
