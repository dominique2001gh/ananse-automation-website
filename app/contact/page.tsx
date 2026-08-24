import ContactHero from "@/components/sections/contact/ContactHero";
import ContactForm from "@/components/sections/contact/ContactForm";
import WhatHappensNext from "@/components/sections/contact/WhatHappensNext";
import FinalCta from "@/components/sections/FinalCta";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata = buildPageMetadata({
  path: "/contact",
  title: "Contact | Ananse Automation",
  description:
    "Tell Ananse Automation what's slowing your business down. We'll help determine whether data, automation, AI, a website or custom software is the right fit.",
});

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactForm />
      <WhatHappensNext />
      <FinalCta
        headline="Not Sure What You Need Yet?"
        copy="That’s completely fine. Start by telling us what’s difficult, repetitive, disconnected, or taking too much time. We’ll start there."
        buttonLabel="Tell Us About Your Business"
        buttonHref="#inquiry-form"
      />
    </>
  );
}
