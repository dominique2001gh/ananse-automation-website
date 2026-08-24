import type { SolutionStatus } from "@/components/ui/StatusPill";

export type FeaturedSolution = {
  id: string;
  name: string;
  status: SolutionStatus;
  category: string;
  headline: string;
  description: string[];
  capabilitiesLabel: "Capabilities" | "Potential Capabilities";
  capabilities: string[];
  businessProblem?: string;
  outcome?: string;
  cta?: string;
  /** External URL for `cta`, if the product has a live site to link to. */
  ctaHref?: string;
};

// Real products Ananse Automation is designing/building. Status is kept
// honest per item -- nothing here implies a commercial launch or paying
// customers unless that's actually true.
export const featuredSolutions: FeaturedSolution[] = [
  {
    id: "innexa-hotel",
    name: "Innexa Hotel Management",
    status: "In Development",
    category: "Hospitality Operations / SaaS",
    headline: "Run Hotel Operations From One Connected System.",
    description: [
      "Innexa is a hotel operations platform being developed for small and mid-sized hotels, guesthouses and independent hospitality businesses.",
      "It brings essential day-to-day operations into one system instead of relying on disconnected spreadsheets, notebooks and manual processes.",
    ],
    capabilitiesLabel: "Capabilities",
    capabilities: [
      "Guest management",
      "Room and room-type management",
      "Reservations and bookings",
      "Check-in and checkout workflows",
      "Payment recording",
      "Folio management",
      "Staff roles and permissions",
      "Housekeeping and maintenance workflows",
      "Operational reporting",
      "Inventory management",
      "Occupancy and revenue visibility",
    ],
    businessProblem:
      "Independent hotels often operate using disconnected tools, spreadsheets and manual processes that make it difficult to know what is happening across the property.",
    outcome:
      "A centralized operational system designed to give hotel teams better visibility and control.",
    cta: "Explore Innexa",
    ctaHref: "https://innexa.app",
  },
  {
    id: "innexa-resume",
    name: "Innexa Resume",
    status: "In Development",
    category: "AI / Career Technology",
    headline: "AI-Powered Tools for the Modern Job Search.",
    description: [
      "An AI-assisted career platform designed to help job seekers understand opportunities, tailor their resumes to specific positions, and present their experience more effectively.",
    ],
    capabilitiesLabel: "Potential Capabilities",
    capabilities: [
      "Resume analysis",
      "Job-description matching",
      "Resume tailoring",
      "Skills-gap identification",
      "Application support",
      "AI-assisted career guidance",
    ],
    businessProblem:
      "Job seekers often apply to dozens of positions using resumes that do not clearly communicate how their experience matches the opportunity.",
    outcome: "A more focused and intelligent job-application workflow.",
  },
  {
    id: "tax-workflow",
    name: "Tax Professional Workflow Software",
    status: "In Development",
    category: "Professional Services / Automation",
    headline: "Less Administrative Work. More Time for Clients.",
    description: [
      "A business workflow platform being designed around the operational needs of independent tax professionals and small tax practices.",
    ],
    capabilitiesLabel: "Potential Capabilities",
    capabilities: [
      "Client intake",
      "Document collection workflows",
      "Client status tracking",
      "Automated reminders",
      "Task management",
      "Customer communication",
      "Internal workflow visibility",
    ],
    businessProblem:
      "Tax professionals can spend significant time chasing documents, answering repetitive status questions and manually tracking clients across email, spreadsheets and messaging applications.",
    outcome:
      "A more organized client workflow with less repetitive administrative work.",
  },
  {
    id: "restaurant-platform",
    name: "Restaurant Management Platform",
    status: "Planned",
    category: "Hospitality / Restaurant Operations",
    headline: "Practical Operations Software for Independent Restaurants.",
    description: [
      "A planned restaurant-management platform intended for independent restaurants as well as restaurant operations attached to hotels and hospitality businesses.",
    ],
    capabilitiesLabel: "Potential Capabilities",
    capabilities: [
      "Orders",
      "Menu management",
      "Inventory",
      "Staff workflows",
      "Sales reporting",
      "Expense visibility",
      "Operational dashboards",
    ],
  },
];

// Example categories beyond the featured products -- illustrative only,
// not a claim that Ananse has already built one for each.
export const customSolutionCategories: string[] = [
  "Logistics & shipping systems",
  "Inventory and distribution platforms",
  "Professional-services workflows",
  "Booking and reservation systems",
  "Customer portals",
  "Internal management systems",
  "Reporting and analytics platforms",
  "AI customer-service assistants",
  "WhatsApp and inquiry automation",
  "Industry-specific SaaS applications",
];
