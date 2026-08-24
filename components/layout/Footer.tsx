import Link from "next/link";
import Container from "@/components/ui/Container";
import Logo from "./Logo";
import NetworkMesh from "@/components/graphics/NetworkMesh";
import { navLinks } from "@/lib/nav";

// No real social URLs exist yet -- rendered as inert text (not `#` links)
// so nothing here is keyboard-focusable or clickable while it does nothing.
// Swap to real hrefs the moment these accounts exist.
const socials = ["LinkedIn", "Facebook", "TikTok"];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-ink-line bg-ink text-paper">
      <NetworkMesh
        tone="dark"
        className="pointer-events-none absolute -right-16 -top-24 h-[28rem] w-[28rem] opacity-70"
      />

      <Container className="relative flex flex-col gap-12 py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-w-sm flex-col gap-4">
            <Logo tone="dark" />
            <p className="font-mono text-xs tracking-[0.2em] text-gold-bright uppercase">
              Data. Automation. AI. Software.
            </p>
            <p className="text-sm leading-relaxed text-slate-invert">
              Technology consulting and software development for small and
              growing businesses.
            </p>
          </div>

          <nav
            className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-3"
            aria-label="Footer"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-slate-invert transition-colors hover:text-paper"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs tracking-[0.2em] text-slate-invert/70 uppercase">
              Follow
            </span>
            <div className="flex gap-4">
              {socials.map((label) => (
                <span key={label} className="text-sm text-slate-invert">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-paper/10 pt-8 text-xs text-slate-invert/70 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Ananse Automation. All rights reserved.</p>
          <p>Built with intent, in service of the businesses we work with.</p>
        </div>
      </Container>
    </footer>
  );
}
