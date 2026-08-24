import Link from "next/link";
import type { ReactNode } from "react";
import type { Route } from "next";

type Variant = "primary" | "secondary";
type Tone = "light" | "dark";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const variants: Record<Tone, Record<Variant, string>> = {
  light: {
    primary:
      "bg-ink text-paper hover:bg-ink-soft focus-visible:ring-gold focus-visible:ring-offset-paper",
    secondary:
      "border border-ink/15 text-ink hover:border-ink/40 hover:bg-ink/[0.03] focus-visible:ring-ink/30 focus-visible:ring-offset-paper",
  },
  dark: {
    primary:
      "bg-gold text-ink hover:bg-gold-bright focus-visible:ring-paper/60 focus-visible:ring-offset-ink",
    secondary:
      "border border-paper/25 text-paper hover:border-paper/60 hover:bg-paper/[0.06] focus-visible:ring-paper/40 focus-visible:ring-offset-ink",
  },
};

/** Shared class-builder so non-Link elements (e.g. a native form submit
 * button) can render with the exact same look as <Button>. */
export function getButtonClassName({
  variant = "primary",
  tone = "light",
  className = "",
}: {
  variant?: Variant;
  tone?: Tone;
  className?: string;
} = {}) {
  return `${base} ${variants[tone][variant]} ${className}`;
}

export default function Button({
  href,
  children,
  variant = "primary",
  tone = "light",
  className = "",
  disabled = false,
}: {
  href: Route | string;
  children: ReactNode;
  variant?: Variant;
  tone?: Tone;
  className?: string;
  /** Renders an inert, visually-present placeholder instead of a link --
   * for CTAs that don't have a real destination yet (e.g. a product that
   * has no public URL). Never emits an href, so it can't 404. */
  disabled?: boolean;
}) {
  const classes = getButtonClassName({ variant, tone, className });

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={`${classes} pointer-events-none opacity-50`}
      >
        {children}
        <span aria-hidden>→</span>
      </span>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
      <span
        aria-hidden
        className="transition-transform duration-200 group-hover:translate-x-0.5"
      >
        →
      </span>
    </Link>
  );
}
