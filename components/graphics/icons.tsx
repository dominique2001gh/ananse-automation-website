import type { SVGProps } from "react";

/**
 * Minimal 1.5px line icons, hand-drawn as SVG paths rather than pulled from
 * an icon pack, so the whole set shares one visual language.
 */
function Base(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    />
  );
}

export function IconGlobe(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.3 3.8 5.3 3.8 8.5s-1.3 6.2-3.8 8.5c-2.5-2.3-3.8-5.3-3.8-8.5S9.5 5.8 12 3.5Z" />
    </Base>
  );
}

export function IconRepeat(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M4 12a8 8 0 0 1 13.66-5.66L20 8" />
      <path d="M20 4v4h-4" />
      <path d="M20 12a8 8 0 0 1-13.66 5.66L4 16" />
      <path d="M4 20v-4h4" />
    </Base>
  );
}

export function IconChartBar(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M4 20V10M12 20V4M20 20v-7" />
      <path d="M3 20h18" />
    </Base>
  );
}

export function IconCube(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M12 3.5 20 8v8l-8 4.5L4 16V8l8-4.5Z" />
      <path d="M4 8l8 4.5L20 8M12 12.5V21" />
    </Base>
  );
}

export function IconChatClock(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M20 12a7 7 0 1 1-3.2-5.9" />
      <path d="M4 20l1.2-3.6A7 7 0 0 1 4.5 12" />
      <path d="M16.5 5V3M16.5 5a4.5 4.5 0 1 1 0 9" />
      <path d="M16.5 6.8V9l1.6 1" />
    </Base>
  );
}

export function IconNetwork(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <circle cx="12" cy="4.5" r="1.8" />
      <circle cx="5" cy="17" r="1.8" />
      <circle cx="19" cy="17" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <path d="M12 6.3v4M10.6 13.1 6.4 15.6M13.4 13.1l4.2 2.5M6.6 17h10.8" />
    </Base>
  );
}

export function IconCode(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M9 8 5 12l4 4M15 8l4 4-4 4M13 5l-2 14" />
    </Base>
  );
}

export function IconBuilding(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M5 21V5.5L12 3l7 2.5V21" />
      <path d="M3 21h18M9 21v-4h6v4M9 9h1M14 9h1M9 13h1M14 13h1" />
    </Base>
  );
}

export function IconUtensils(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M6 3v7a2 2 0 0 0 4 0V3M8 10v11" />
      <path d="M17 3c-1.7 0-3 2-3 5s1.3 5 3 5m0-10v16" />
    </Base>
  );
}

export function IconBriefcase(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <rect x="3.5" y="7.5" width="17" height="12" rx="1.5" />
      <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5M3.5 12.5h17" />
    </Base>
  );
}

export function IconChat(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M4 5.5h16v11H10l-4.5 4v-4H4v-11Z" />
      <path d="M8 10h8M8 13.5h5" />
    </Base>
  );
}

export function IconTruck(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
      <circle cx="7.5" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </Base>
  );
}

export function IconTarget(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
    </Base>
  );
}

export function IconGear(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5v2.3M12 18.2v2.3M20.5 12h-2.3M5.8 12H3.5M17.8 6.2l-1.6 1.6M7.8 16.2l-1.6 1.6M17.8 17.8l-1.6-1.6M7.8 7.8 6.2 6.2" />
    </Base>
  );
}

export function IconTrendUp(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M4 17 10 11l3.5 3.5L20 7" />
      <path d="M14.5 7H20v5.5" />
    </Base>
  );
}

export function IconCompass(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m14.5 9.5-1.8 4.7-4.7 1.8 1.8-4.7 4.7-1.8Z" />
    </Base>
  );
}

export function IconBag(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M6 8h12l-1 12.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 20.5L6 8Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </Base>
  );
}

export function IconGrid(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.2" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.2" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.2" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="1.2" />
    </Base>
  );
}

export function IconBulb(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M9 18.5h6M9.5 21h5" />
      <path d="M12 3.5a6 6 0 0 0-3.5 10.9c.6.45 1 1.15 1 1.9v.7h5v-.7c0-.75.4-1.45 1-1.9A6 6 0 0 0 12 3.5Z" />
    </Base>
  );
}

export function IconPerson(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <circle cx="12" cy="7.5" r="3.5" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </Base>
  );
}

export function IconEnvelope(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4.5 6.5 7.5 6.5 7.5-6.5" />
    </Base>
  );
}
