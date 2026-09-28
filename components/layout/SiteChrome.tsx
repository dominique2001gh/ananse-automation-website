"use client";

/**
 * Switches between the public marketing site's chrome (Header, Footer,
 * Ask Ananse AI launcher) and nothing at all for /admin/** routes, which
 * have their own separate chrome (app/admin/(protected)/layout.tsx).
 *
 * This is the only change to app/layout.tsx's rendered output for every
 * existing public route -- usePathname() is false there, so Header/
 * Footer/AiChatWidget render exactly as before, unconditionally.
 */

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import AiChatWidget from "@/components/ai/AiChatWidget";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;

  if (isAdminRoute) {
    return <main id="main-content" className="flex-1">{children}</main>;
  }

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <AiChatWidget />
    </>
  );
}
