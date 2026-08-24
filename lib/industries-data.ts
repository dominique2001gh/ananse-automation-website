import type { ComponentType, SVGProps } from "react";
import {
  IconBuilding,
  IconBriefcase,
  IconTruck,
  IconUtensils,
  IconBag,
  IconChartBar,
  IconRepeat,
  IconChat,
  IconNetwork,
  IconCompass,
  IconGear,
  IconChatClock,
  IconCube,
} from "@/components/graphics/icons";

export type IndustryNote = {
  text: string;
  linkLabel?: string;
  linkHref?: string;
  /** "reference" nods to a real, in-development Ananse product (gold accent).
   * "disclaimer" sets an honest scope boundary (neutral accent). */
  tone: "reference" | "disclaimer";
};

export type Industry = {
  id: string;
  index: string;
  name: string;
  headline: string;
  businessTypes?: string[];
  challengesLabel?: string;
  challenges: string[];
  capabilitiesLabel?: string;
  capabilities: string[];
  note?: IndustryNote;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const industries: Industry[] = [
  {
    id: "hospitality",
    index: "01",
    name: "Hospitality",
    headline: "Better Visibility Across Hotel Operations.",
    businessTypes: [
      "Independent hotels",
      "Guesthouses",
      "Boutique hotels",
      "Small hospitality groups",
      "Lodging businesses",
    ],
    challenges: [
      "Reservations spread across multiple channels",
      "Manual guest records",
      "Front-desk workflows",
      "Room status visibility",
      "Payment and folio tracking",
      "Housekeeping coordination",
      "Maintenance tracking",
      "Inventory management",
      "Occupancy reporting",
      "Revenue visibility",
      "Customer communication",
    ],
    capabilities: [
      "Hotel operations software",
      "Booking and reservation workflows",
      "Dashboards and reporting",
      "Automated customer communication",
      "AI customer-service assistants",
      "Inventory and operations systems",
      "Website and booking integrations",
    ],
    note: {
      text: "We’re actively developing Innexa, a hotel operations platform, as an example of this kind of system.",
      linkLabel: "See Innexa on our Solutions page",
      linkHref: "/solutions#featured",
      tone: "reference",
    },
    icon: IconBuilding,
  },
  {
    id: "professional-services",
    index: "02",
    name: "Professional Services",
    headline: "Less Administration. More Time for Clients.",
    businessTypes: [
      "Tax professionals",
      "Law firms",
      "Consultants",
      "Accounting practices",
      "Independent service businesses",
    ],
    challenges: [
      "Client intake",
      "Document collection",
      "Repetitive customer questions",
      "Manual follow-ups",
      "Scheduling",
      "Task tracking",
      "Workflow visibility",
      "Reporting",
      "Client status communication",
    ],
    capabilities: [
      "Client workflow systems",
      "Automated reminders",
      "Customer portals",
      "AI assistants",
      "Document workflows",
      "Intake automation",
      "Reporting dashboards",
      "Websites",
      "Custom practice-management tools",
    ],
    icon: IconBriefcase,
  },
  {
    id: "logistics-shipping",
    index: "03",
    name: "Logistics & Shipping",
    headline: "Keep Customers Informed Without Running the Business From Your Phone.",
    businessTypes: [
      "Shipping companies",
      "Freight and delivery services",
      "Courier operators",
      "Distribution businesses",
    ],
    challenges: [
      "Frequent customer status questions",
      "WhatsApp inquiries",
      "Shipment status communication",
      "Customer records",
      "Manual tracking",
      "Route and delivery information",
      "Operational reporting",
      "Inventory and package visibility",
      "Staff communication",
    ],
    capabilities: [
      "AI customer-service agents",
      "WhatsApp / customer inquiry automation",
      "Shipment-management workflows",
      "Customer portals",
      "Logistics dashboards",
      "Internal operations software",
      "Website integrations",
      "Automated notifications",
    ],
    icon: IconTruck,
  },
  {
    id: "restaurants-food-service",
    index: "04",
    name: "Restaurants & Food Service",
    headline: "Technology Behind the Day-to-Day Operation.",
    businessTypes: [
      "Independent restaurants",
      "Small restaurant groups",
      "Hotel restaurants",
      "Hospitality food-service operations",
    ],
    challenges: [
      "Orders",
      "Inventory",
      "Menu management",
      "Staff workflows",
      "Expense visibility",
      "Reporting",
      "Sales visibility",
      "Manual records",
      "Disconnected systems",
    ],
    capabilities: [
      "Restaurant management systems",
      "Inventory tools",
      "Reporting dashboards",
      "Menu and operations workflows",
      "Internal management software",
      "Automation",
      "Websites and online customer experiences",
    ],
    note: {
      text: "Restaurant operations are another area where we’re applying our approach to inventory, reporting, workflows and day-to-day management.",
      linkLabel: "Explore our Solutions",
      linkHref: "/solutions",
      tone: "reference",
    },
    icon: IconUtensils,
  },
  {
    id: "retail-distribution",
    index: "05",
    name: "Retail & Distribution",
    headline: "Know What Is Selling, What Is Moving and What Needs Attention.",
    businessTypes: [
      "Retail stores",
      "Distributors",
      "Wholesalers",
      "Multi-location businesses",
      "Franchise operations",
    ],
    challenges: [
      "Inventory visibility",
      "Multiple locations",
      "Sales reporting",
      "Distribution tracking",
      "Manual spreadsheets",
      "Stock monitoring",
      "Customer communication",
      "Business performance visibility",
    ],
    capabilities: [
      "Inventory systems",
      "Distribution platforms",
      "Dashboards",
      "Sales reporting",
      "Automated reports",
      "Internal management tools",
      "Website / e-commerce integrations",
      "Custom operational systems",
    ],
    icon: IconBag,
  },
  {
    id: "healthcare-human-services",
    index: "06",
    name: "Healthcare & Human Services",
    headline: "Better Data and Reporting for Complex Programs.",
    challengesLabel: "Where We Focus",
    challenges: [
      "Data",
      "Reporting",
      "Analytics",
      "Workflow automation",
      "Dashboards",
      "Operational visibility",
      "Program monitoring",
    ],
    capabilitiesLabel: "Potential Capabilities",
    capabilities: [
      "Reporting automation",
      "Data cleanup and transformation",
      "KPI dashboards",
      "Operational reporting",
      "SQL / data analysis",
      "Workflow support",
      "Performance tracking",
    ],
    note: {
      text: "Our work here is focused on data, reporting and operational technology — not clinical, treatment or compliance systems.",
      tone: "disclaimer",
    },
    icon: IconChartBar,
  },
];

export const otherBusinessExamples: string[] = [
  "Construction",
  "Property management",
  "Home services",
  "Transportation",
  "Education and training",
  "Warehousing",
  "Distribution",
  "Franchises",
  "Local service businesses",
  "Growing small businesses",
];

export const crossIndustryProblems: {
  title: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { title: "Too much manual work", icon: IconRepeat },
  { title: "Information trapped in spreadsheets", icon: IconChartBar },
  { title: "Repetitive customer inquiries", icon: IconChat },
  { title: "Disconnected software", icon: IconNetwork },
  { title: "Poor operational visibility", icon: IconCompass },
  { title: "Slow reporting", icon: IconGear },
  { title: "Missed follow-ups", icon: IconChatClock },
  { title: "Systems that do not fit the business", icon: IconCube },
];
