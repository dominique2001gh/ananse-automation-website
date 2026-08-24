import type { ComponentType, SVGProps } from "react";
import {
  IconChartBar,
  IconNetwork,
  IconGlobe,
  IconCode,
} from "@/components/graphics/icons";

export type ServicePillar = {
  id: string;
  index: string;
  title: string;
  positioning: string;
  problems: string[];
  capabilities: string[];
  outcome: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

// Single source of truth for the four service pillars, shared by the
// services overview grid and the detailed section for each pillar.
export const servicePillars: ServicePillar[] = [
  {
    id: "data-analytics",
    index: "01",
    title: "Data & Analytics",
    positioning:
      "Help your business turn scattered or underused information into decisions you can act on.",
    problems: [
      "We spend hours preparing the same reports every week.",
      "Our information is spread across different spreadsheets.",
      "We have plenty of data but don't know what it is telling us.",
      "Management cannot easily see how the business is performing.",
    ],
    capabilities: [
      "Business dashboards",
      "Automated reporting",
      "Business intelligence",
      "Data analysis",
      "KPI and performance tracking",
      "Excel and spreadsheet automation",
      "Data cleanup and transformation",
      "SQL-based reporting",
      "Data integration and pipelines",
      "Operational and management reporting",
    ],
    outcome:
      "Leadership gets a clear, current view of the business — without anyone spending hours assembling it by hand.",
    icon: IconChartBar,
  },
  {
    id: "ai-automation",
    index: "02",
    title: "AI & Automation",
    positioning:
      "Reduce repetitive work and help your business respond and operate faster.",
    problems: [
      "Our staff spend too much time doing repetitive work.",
      "Customers need answers when nobody is available.",
      "We manually move information between systems.",
      "Important follow-ups sometimes get missed.",
    ],
    capabilities: [
      "Workflow automation",
      "AI customer-service assistants",
      "AI agents",
      "WhatsApp / customer inquiry automation",
      "Automated notifications and follow-ups",
      "Document and information workflows",
      "Business process automation",
      "Integration between existing tools",
      "Repetitive administrative task automation",
    ],
    outcome:
      "Your team spends less time on repetitive tasks, and customers get faster, more consistent responses.",
    icon: IconNetwork,
  },
  {
    id: "web-digital",
    index: "03",
    title: "Web & Digital",
    positioning:
      "Build digital experiences that make your business look credible, generate opportunities, and serve customers better. This is about more than a website that looks good — we connect it to your automation, data and business processes.",
    problems: [
      "Our website doesn't reflect how good the business actually is.",
      "People find us online, but the site doesn't turn them into customers.",
      "Our website isn't connected to anything — inquiries fall through the cracks.",
      "We're not sure our website is helping the business at all.",
    ],
    capabilities: [
      "Business websites",
      "Website redesign",
      "Lead-generation websites",
      "Responsive, mobile-first development",
      "Web applications",
      "Customer portals",
      "Website integrations",
      "SEO-minded website structure",
      "Online forms and business workflows",
      "AI-enabled websites",
    ],
    outcome:
      "A website that doesn't just look credible — it actively brings in and supports business, connected to the tools you already run on.",
    icon: IconGlobe,
  },
  {
    id: "custom-software",
    index: "04",
    title: "Custom Software & SaaS",
    positioning:
      "When off-the-shelf software doesn't fit how your company operates, we build technology around the business.",
    problems: [
      "We're stuck working around software that doesn't fit how we operate.",
      "Important processes are still running through spreadsheets and email.",
      "We're paying for several different tools that don't talk to each other.",
      "Our operations have outgrown what off-the-shelf software can do.",
    ],
    capabilities: [
      "Custom business applications",
      "Internal operational systems",
      "SaaS platforms",
      "Management systems",
      "Client and customer portals",
      "Booking and reservation systems",
      "Inventory and operational tools",
      "Reporting systems",
      "System integrations",
      "Industry-specific applications",
    ],
    outcome:
      "Software that finally matches how your business actually works, instead of forcing your business to match the software.",
    icon: IconCode,
  },
];
