import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AiChatWidget from "@/components/ai/AiChatWidget";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://ananseautomation.com";
const description =
  "Ananse Automation is a technology consulting and software development company that helps small and medium-sized businesses solve operational problems using data analytics, AI, automation, websites and custom software.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // Every page already sets its own full "X | Ananse Automation" title, so
  // this stays a plain string rather than a title.template -- a template
  // here would double-append the suffix onto every page's existing title.
  title: "Ananse Automation | Data. Automation. AI. Software.",
  description,
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "Ananse Automation",
    description,
    url: siteUrl,
    siteName: "Ananse Automation",
    images: [{ url: "/brand/ananse-logo-lockup.png", width: 1365, height: 421 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ananse Automation",
    description,
    images: ["/brand/ananse-logo-lockup.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-paper focus:outline-none focus:ring-2 focus:ring-gold"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <AiChatWidget />
      </body>
    </html>
  );
}
