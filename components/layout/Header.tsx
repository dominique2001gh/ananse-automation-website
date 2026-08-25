"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import Button, { getButtonClassName } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { navLinks, type NavLink } from "@/lib/nav";
import {
  IconGrid,
  IconBulb,
  IconBuilding,
  IconBriefcase,
  IconPerson,
  IconEnvelope,
} from "@/components/graphics/icons";
import type { ComponentType, SVGProps } from "react";

// Small secondary icon per destination, keyed by label so a nav-copy change
// doesn't silently orphan an icon.
const navIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  Services: IconGrid,
  Solutions: IconBulb,
  Industries: IconBuilding,
  "Our Work": IconBriefcase,
  About: IconPerson,
  Contact: IconEnvelope,
};

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on viewport resize back to desktop.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // While the drawer is open: lock page scroll, move focus into it, and
  // let Escape close it (returning focus to the toggle button).
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
          scrolled
            ? "border-line bg-paper/90 backdrop-blur-md"
            : "border-transparent bg-paper/70 backdrop-blur-sm"
        }`}
      >
        <Container className="flex h-16 items-center justify-between lg:h-[4.5rem]">
          <Logo priority imageClassName="h-8 w-auto sm:h-9 lg:h-[50px]" />

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button href="/contact#inquiry-form" className="px-5 py-2.5">
              Let&rsquo;s Talk
            </Button>
          </div>

          <button
            ref={toggleButtonRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          >
            {/* Always the hamburger glyph -- the drawer's own backdrop and
                in-drawer interactions are the way to close it, so there is
                no X state to render here. */}
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
              <path
                d="M3 6h16M3 11h16M3 16h16"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </Container>
      </header>

      {/* Backdrop -- rendered as a header sibling, not a child: `header`
          always carries a backdrop-filter (backdrop-blur-*), and per spec
          that establishes a containing block for fixed-position descendants.
          Nested here, `fixed inset-0` would resolve against header's own
          ~64px box instead of the viewport. */}
      <div
        onClick={closeMenu}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-ink/40 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Off-canvas drawer -- top-16 matches the mobile header's h-16 so the
          panel begins just below it instead of overlapping it. */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={`fixed top-16 right-0 bottom-0 z-[61] flex w-[78%] max-w-sm flex-col rounded-l-3xl border-l border-line bg-paper shadow-[-24px_0_64px_-24px_rgba(23,20,15,0.45)] transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex-1 overflow-y-auto px-2 pt-3" aria-label="Primary">
          <ul className="flex flex-col">
            {navLinks.map((link: NavLink, index) => {
              const Icon = navIcons[link.label];
              return (
                <li key={link.label} className="border-b border-line last:border-b-0">
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={link.href}
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-3 py-4 text-base font-medium text-ink transition-colors hover:bg-ink/[0.04]"
                  >
                    {Icon ? <Icon className="h-5 w-5 shrink-0 text-gold" /> : null}
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-line px-5 py-5">
          <Link
            href="/contact#inquiry-form"
            onClick={closeMenu}
            className={getButtonClassName({ className: "w-full" })}
          >
            Let&rsquo;s Talk
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
