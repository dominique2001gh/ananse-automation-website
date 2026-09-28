import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { signOutAction } from "./actions";

/**
 * Everything under this route group is authenticated + authorized --
 * requireAdmin() re-checks both (defense-in-depth alongside proxy.ts) and
 * redirects to /admin/login otherwise. app/admin/login/page.tsx is a
 * sibling of this route group, not a child of it, so it never inherits
 * this gate or this chrome.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireAdmin();

  return (
    <div className="min-h-screen bg-paper-dim">
      <header className="border-b border-line bg-ink">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-8">
            <span className="font-mono text-xs font-medium tracking-[0.2em] text-gold-bright uppercase">
              Ananse Admin
            </span>
            <nav className="flex items-center gap-6" aria-label="Admin">
              <Link href="/admin" className="text-sm text-paper/80 transition-colors hover:text-paper">
                Dashboard
              </Link>
              <Link
                href="/admin/leads"
                className="text-sm text-paper/80 transition-colors hover:text-paper"
              >
                Leads
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-invert sm:inline">{profile.display_name}</span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-full border border-paper/25 px-4 py-1.5 text-sm text-paper transition-colors hover:border-paper/60 hover:bg-paper/[0.06]"
              >
                Log Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
