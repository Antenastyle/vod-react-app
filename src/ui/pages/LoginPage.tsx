import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthUser } from "../../domain/entities/AuthUser";
import { container } from "../../infrastructure/container";

export function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setCurrentUser(container.getCurrentUser.execute());

    const unsubscribe = container.observeAuthState.execute((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "register") {
        await container.registerUser.execute(email, password);
        setSuccessMessage(
          "Account created successfully. You are now logged in.",
        );
      } else {
        await container.loginUser.execute(email, password);
        setSuccessMessage("Welcome back! Login successful.");
      }

      setPassword("");
      setConfirmPassword("");
      navigate("/", { replace: true });
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Authentication failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setError(null);
    setSuccessMessage(null);

    try {
      await container.logoutUser.execute();
      setSuccessMessage("You have been logged out.");
    } catch (logoutError) {
      const message =
        logoutError instanceof Error
          ? logoutError.message
          : "Failed to log out. Please try again.";
      setError(message);
    }
  };

  const infoPanel = (
    <div className="glass-card rounded-3xl p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </p>
      <h1 className="display-title mt-2 text-4xl font-bold text-slate-900">
        {mode === "login" ? "Login" : "Register"}
      </h1>
      <p className="mt-4 text-sm leading-7 text-slate-600">
        {mode === "login"
          ? "Sign in to sync favorites, keep your watch history, and personalize recommendations."
          : "Create an account with email and password to save your preferences across sessions."}
      </p>

      {currentUser ? (
        <div className="mt-6 rounded-2xl bg-teal-50 p-4 text-sm text-teal-900">
          Logged in as{" "}
          <span className="font-semibold">{currentUser.email}</span>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => {
          setMode((previousMode) =>
            previousMode === "login" ? "register" : "login",
          );
          setPassword("");
          setConfirmPassword("");
          setShowPassword(false);
          setShowConfirmPassword(false);
          setError(null);
          setSuccessMessage(null);
        }}
        className="mt-6 text-sm font-semibold text-teal-800 underline-offset-4 transition hover:underline"
      >
        {mode === "login"
          ? "Need an account? Register"
          : "Already have an account? Login"}
      </button>
    </div>
  );

  const formPanel = (
    <form className="glass-card rounded-3xl p-6 sm:p-8" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-teal-700"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Password
          <div className="relative mt-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 pr-12 text-sm outline-none transition focus:border-teal-700"
            />
            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              className="absolute inset-y-0 right-3 inline-flex items-center text-slate-500 transition hover:text-slate-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </label>

        {mode === "register" ? (
          <label className="block text-sm font-medium text-slate-700">
            Confirm password
            <div className="relative mt-2">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="********"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 pr-12 text-sm outline-none transition focus:border-teal-700"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((previous) => !previous)}
                className="absolute inset-y-0 right-3 inline-flex items-center text-slate-500 transition hover:text-slate-700"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </label>
        ) : null}
      </div>

      {error ? (
        <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {successMessage ? (
        <p className="mt-4 rounded-xl bg-teal-50 px-3 py-2 text-sm text-teal-800">
          {successMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-full bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading
          ? "Please wait..."
          : mode === "login"
            ? "Sign in"
            : "Create account"}
      </button>

      {currentUser ? (
        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 w-full rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Log out
        </button>
      ) : null}
    </form>
  );

  return (
    <section className="fade-up py-6 sm:py-8">
      <div className="mx-auto grid max-w-4xl gap-6 rounded-3xl sm:grid-cols-2">
        {mode === "login" ? (
          <>
            {infoPanel}
            {formPanel}
          </>
        ) : (
          <>
            {formPanel}
            {infoPanel}
          </>
        )}
      </div>
    </section>
  );
}
