/**
 * Fictional demo dataset for the /analytics "Ask Your Data" and live
 * dashboard demo. Everything here is generated, deterministic (seeded
 * PRNG, so the same data renders on every build/request), and describes a
 * fictional generic multi-location service business -- not any real
 * Ananse client, and not tied to any single industry, so a visitor from
 * almost any vertical can map it onto their own business.
 *
 * Data shape is intentionally transaction-level (one row per booking) so
 * lib/analytics-demo-engine.ts can derive every KPI, trend and ranking
 * from one source of truth instead of pre-baked numbers per filter
 * combination.
 */

export type Location = { id: string; name: string };
export type Service = { id: string; name: string; basePrice: number };
export type TeamMember = { id: string; name: string; locationId: string };

export type BookingStatus = "completed" | "cancelled" | "no-show";

export type Booking = {
  id: string;
  date: string; // "YYYY-MM-DD"
  monthKey: string; // "YYYY-MM"
  locationId: string;
  serviceId: string;
  teamMemberId: string;
  customerId: string;
  status: BookingStatus;
  revenue: number;
  /** True the first time this customerId ever appears in the dataset. */
  isFirstVisit: boolean;
};

export const DEMO_BUSINESS_NAME = "Meridian Professional Group";

export const LOCATIONS: Location[] = [
  { id: "downtown", name: "Downtown" },
  { id: "riverside", name: "Riverside" },
  { id: "uptown", name: "Uptown" },
  { id: "westfield", name: "Westfield" },
];

export const SERVICES: Service[] = [
  { id: "consultation", name: "Initial Consultation", basePrice: 85 },
  { id: "standard", name: "Standard Package", basePrice: 220 },
  { id: "premium", name: "Premium Package", basePrice: 410 },
  { id: "maintenance", name: "Maintenance Plan", basePrice: 150 },
  { id: "addon", name: "Add-On Service", basePrice: 60 },
];

const SERVICE_WEIGHTS: Record<string, number> = {
  consultation: 0.3,
  standard: 0.28,
  premium: 0.14,
  maintenance: 0.18,
  addon: 0.1,
};

export const TEAM_MEMBERS: TeamMember[] = [
  { id: "tm-1", name: "Maria Santos", locationId: "downtown" },
  { id: "tm-2", name: "James Okafor", locationId: "downtown" },
  { id: "tm-3", name: "Elena Kowalski", locationId: "downtown" },
  { id: "tm-4", name: "David Mensah", locationId: "riverside" },
  { id: "tm-5", name: "Priya Raman", locationId: "riverside" },
  { id: "tm-6", name: "Tomás Ibarra", locationId: "uptown" },
  { id: "tm-7", name: "Grace Nakamura", locationId: "uptown" },
  { id: "tm-8", name: "Samuel Boateng", locationId: "westfield" },
  { id: "tm-9", name: "Aisha Bello", locationId: "westfield" },
];

const LOCATION_BASELINE: Record<string, number> = {
  downtown: 46,
  riverside: 34,
  uptown: 30,
  westfield: 28,
};

// Fri/Sat busiest, Sunday quietest -- a realistic pattern the "busiest
// days" answer in lib/ai-analytics-demo.ts actually computes from the
// generated dates below, rather than a hardcoded claim.
const WEEKDAY_WEIGHTS = [0.04, 0.12, 0.14, 0.16, 0.16, 0.2, 0.18]; // Sun..Sat

const MONTH_COUNT = 18;
const START_YEAR = 2025;
const START_MONTH = 3; // March (1-indexed)

// The most recent complete month -- deliberately given a concentrated
// cancellation spike at one location so the "why did revenue decrease
// last month" demo question has a real, computed, grounded answer instead
// of a scripted one.
const DIP_MONTH_INDEX = MONTH_COUNT - 1;
const DIP_LOCATION_ID = "westfield";

function mulberry32(seed: number) {
  let a = seed;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function monthKeyAt(index: number): { year: number; month: number; key: string } {
  const totalMonth0 = START_MONTH - 1 + index;
  const year = START_YEAR + Math.floor(totalMonth0 / 12);
  const month = (totalMonth0 % 12) + 1; // 1-indexed
  const key = `${year}-${String(month).padStart(2, "0")}`;
  return { year, month, key };
}

export const MONTH_KEYS: string[] = Array.from({ length: MONTH_COUNT }, (_, i) => monthKeyAt(i).key);

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function weightedPick<T>(rng: () => number, items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

function pickWeightedDate(rng: () => number, year: number, month: number): string {
  const dayCount = daysInMonth(year, month);
  const dates: string[] = [];
  const weights: number[] = [];
  for (let day = 1; day <= dayCount; day++) {
    const weekday = new Date(year, month - 1, day).getDay(); // 0=Sun
    dates.push(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
    weights.push(WEEKDAY_WEIGHTS[weekday]);
  }
  return weightedPick(rng, dates, weights);
}

function generateBookings(): Booking[] {
  const rng = mulberry32(20260926);
  const bookings: Booking[] = [];
  const customerPoolByLocation: Record<string, string[]> = {};
  for (const loc of LOCATIONS) customerPoolByLocation[loc.id] = [];
  let customerCounter = 0;
  let bookingCounter = 0;

  const serviceIds = SERVICES.map((s) => s.id);
  const serviceWeights = serviceIds.map((id) => SERVICE_WEIGHTS[id]);

  for (let monthIndex = 0; monthIndex < MONTH_COUNT; monthIndex++) {
    const { year, month, key: monthKey } = monthKeyAt(monthIndex);
    const growthFactor = 1 + monthIndex * 0.015;
    const seasonal = 1 + 0.08 * Math.sin((monthIndex / 12) * 2 * Math.PI);
    const isDipMonth = monthIndex === DIP_MONTH_INDEX;

    for (const location of LOCATIONS) {
      const isDipLocation = isDipMonth && location.id === DIP_LOCATION_ID;
      const noise = 0.9 + rng() * 0.2;
      const broadDipAdj = isDipMonth ? 0.94 : 1;
      const locationDipAdj = isDipLocation ? 0.88 : 1;
      const baseline = LOCATION_BASELINE[location.id];

      const attempted = Math.round(
        baseline * growthFactor * seasonal * noise * broadDipAdj * locationDipAdj
      );

      const teamAtLocation = TEAM_MEMBERS.filter((t) => t.locationId === location.id);
      const pool = customerPoolByLocation[location.id];

      const cancelProb = isDipLocation ? 0.24 : 0.055;
      const noShowProb = isDipLocation ? 0.14 : 0.045;

      for (let i = 0; i < attempted; i++) {
        const forceNew = pool.length < 5;
        const isFirstVisit = forceNew || rng() < 0.24;

        let customerId: string;
        if (isFirstVisit) {
          customerId = `cust-${++customerCounter}`;
          pool.push(customerId);
        } else {
          customerId = pool[Math.floor(rng() * pool.length)];
        }

        const serviceId = weightedPick(rng, serviceIds, serviceWeights);
        const service = SERVICES.find((s) => s.id === serviceId)!;
        const teamMember = teamAtLocation[Math.floor(rng() * teamAtLocation.length)];

        const roll = rng();
        const status: BookingStatus =
          roll < cancelProb ? "cancelled" : roll < cancelProb + noShowProb ? "no-show" : "completed";

        const priceVariance = 0.9 + rng() * 0.2;
        const price = Math.round((service.basePrice * priceVariance) / 5) * 5;
        const revenue = status === "completed" ? price : 0;

        bookings.push({
          id: `bk-${++bookingCounter}`,
          date: pickWeightedDate(rng, year, month),
          monthKey,
          locationId: location.id,
          serviceId,
          teamMemberId: teamMember.id,
          customerId,
          status,
          revenue,
          isFirstVisit,
        });
      }
    }
  }

  bookings.sort((a, b) => a.date.localeCompare(b.date));
  return bookings;
}

export const BOOKINGS: Booking[] = generateBookings();
