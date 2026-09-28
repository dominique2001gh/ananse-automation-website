import { signInAction } from "./actions";

export const metadata = {
  title: "Admin Login | Ananse Automation",
  robots: { index: false, follow: false },
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "That email or password isn't right.",
  missing_fields: "Enter both your email and password.",
  not_authorized: "That account isn't set up for Ananse Admin access.",
  rate_limited: "Too many attempts -- please wait a few minutes and try again.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage = error ? (ERROR_MESSAGES[error] ?? "Something went wrong. Please try again.") : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6 py-16">
      <div className="w-full max-w-sm rounded-3xl border border-paper/10 bg-ink-soft p-8 sm:p-10">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <span className="font-mono text-xs font-medium tracking-[0.2em] text-gold-bright uppercase">
            Ananse Automation
          </span>
          <h1 className="text-2xl font-semibold text-paper">Admin Sign In</h1>
        </div>

        <form action={signInAction} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-paper/90">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-paper/15 bg-ink px-4 py-3 text-sm text-paper placeholder:text-slate-invert/50 focus:border-gold focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-paper/90">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-paper/15 bg-ink px-4 py-3 text-sm text-paper placeholder:text-slate-invert/50 focus:border-gold focus:outline-none"
            />
          </div>

          {errorMessage ? (
            <p role="alert" className="text-sm text-terracotta">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink transition-colors duration-200 hover:bg-gold-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-soft"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
