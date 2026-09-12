import { signIn, auth } from "../../../auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-8 text-center shadow-2xl shadow-black/30">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-soft-border)] text-[var(--accent-strong)]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h10M4 18h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="19" cy="12" r="2.4" fill="currentColor" />
          </svg>
        </div>

        <h1 className="text-[19px] font-semibold tracking-tight text-[var(--text)]">Welcome to Ledger</h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--text-muted)]">
          Sign in to track your expenses, and keep tabs on who owes who.
        </p>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
          className="mt-8"
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-[13.5px] font-semibold text-[#161006] transition hover:bg-[var(--accent-strong)] active:scale-[0.98]"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </form>

        <p className="mt-6 text-[12px] text-[var(--text-muted)]">
          Your data is private to your account — no one else can see your ledger.
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.6 4.5 24 4.5 12.9 4.5 4 13.4 4 24.5s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.4 18.9 12.5 24 12.5c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.6 4.5 24 4.5c-7.6 0-14.1 4.3-17.4 10.2z"
      />
      <path
        fill="#4CAF50"
        d="M24 44.5c5.5 0 10.4-1.9 14.1-5.1l-6.5-5.4C29.5 35.6 26.9 36.5 24 36.5c-5.2 0-9.6-3.4-11.2-8.1l-6.6 5C9.8 39.8 16.3 44.5 24 44.5z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.5 5.4C40.9 36.2 44 30.9 44 24.5c0-1.3-.1-2.7-.4-4z"
      />
    </svg>
  );
}
