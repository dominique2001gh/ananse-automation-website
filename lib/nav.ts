export type NavLink = {
  label: string;
  href: string;
};

// Every item now has a dedicated route. "Our Work" intentionally points to
// /solutions rather than a separate portfolio page: that page already is
// "the work Ananse is building" (Innexa, the tax workflow platform, etc.),
// and a second page covering the same ground would either duplicate it or
// require fabricating client case studies this project has no basis for.
export const navLinks: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Industries", href: "/industries" },
  { label: "Our Work", href: "/solutions" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
