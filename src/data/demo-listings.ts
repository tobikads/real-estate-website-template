/**
 * Shared demo listings used by the Listings page and the Buyer match result.
 * Keeping the data here means both pages stay in sync without duplication.
 */
import listing1 from "@/assets/Alexandra/listing-1.jpg";
import listing2 from "@/assets/Alexandra/listing-2.jpg";
import listing3 from "@/assets/Alexandra/listing-3.jpg";
import listing4 from "@/assets/Alexandra/listing-4.jpg";

export type Category = "featured" | "new" | "open" | "sold";
export type Status = "Featured" | "New" | "Open House" | "Sold";

export interface Listing {
  id: string;
  image: string;
  gallery: string[];
  price: string;
  priceValue: number;
  address: string;
  neighborhood: string;
  county: string;
  beds: number;
  baths: number;
  sqft: number;
  type: "Single Family" | "Townhome" | "Condo" | "Estate";
  status: Status;
  categories: Category[];
  description: string;
  features: string[];
}

const IMG = [listing1, listing2, listing3, listing4];

function makeListings(): Listing[] {
  const list: Listing[] = [];
  let id = 1;
  const samples: Array<{ n: string; c: string; base: number; type: Listing["type"] }> = [
    { n: "Buckhead", c: "Fulton", base: 2400000, type: "Estate" },
    { n: "Midtown", c: "Fulton", base: 950000, type: "Condo" },
    { n: "Sandy Springs", c: "Fulton", base: 1450000, type: "Single Family" },
    { n: "Alpharetta", c: "Fulton", base: 1180000, type: "Single Family" },
    { n: "Roswell", c: "Fulton", base: 875000, type: "Single Family" },
    { n: "Atlanta", c: "Fulton", base: 720000, type: "Townhome" },
    { n: "Brookhaven", c: "DeKalb", base: 1690000, type: "Single Family" },
    { n: "Decatur", c: "DeKalb", base: 845000, type: "Single Family" },
    { n: "Dunwoody", c: "DeKalb", base: 1120000, type: "Single Family" },
    { n: "Chamblee", c: "DeKalb", base: 695000, type: "Townhome" },
    { n: "Marietta", c: "Cobb", base: 765000, type: "Single Family" },
    { n: "Smyrna", c: "Cobb", base: 615000, type: "Townhome" },
    { n: "Kennesaw", c: "Cobb", base: 545000, type: "Single Family" },
    { n: "Duluth", c: "Gwinnett", base: 680000, type: "Single Family" },
    { n: "Suwanee", c: "Gwinnett", base: 925000, type: "Single Family" },
    { n: "Peachtree Corners", c: "Gwinnett", base: 815000, type: "Single Family" },
    { n: "Woodstock", c: "Cherokee", base: 720000, type: "Single Family" },
    { n: "Canton", c: "Cherokee", base: 595000, type: "Single Family" },
    { n: "Cumming", c: "Forsyth", base: 825000, type: "Single Family" },
    { n: "Peachtree City", c: "Fayette", base: 705000, type: "Single Family" },
    { n: "McDonough", c: "Henry", base: 465000, type: "Single Family" },
    { n: "Newnan", c: "Coweta", base: 525000, type: "Single Family" },
    { n: "Douglasville", c: "Douglas", base: 415000, type: "Single Family" },
    { n: "Conyers", c: "Rockdale", base: 385000, type: "Single Family" },
    { n: "College Park", c: "Clayton", base: 345000, type: "Townhome" },
    { n: "Lawrenceville", c: "Gwinnett", base: 525000, type: "Single Family" },
    { n: "Tucker", c: "DeKalb", base: 575000, type: "Single Family" },
    { n: "Acworth", c: "Cobb", base: 495000, type: "Single Family" },
  ];

  const streets = [
    "Magnolia Lane",
    "Peachtree Hollow",
    "Ivy Ridge Court",
    "Camellia Way",
    "Dogwood Crossing",
    "Oakhaven Drive",
    "Stonebrook Path",
    "Willow Bend",
    "Westover Place",
    "Briarcliff Trail",
  ];

  const featuresPool = [
    "Chef's kitchen",
    "Primary on main",
    "Heated saltwater pool",
    "Three-car garage",
    "Wine cellar",
    "Screened porch",
    "Walk-out terrace",
    "Smart-home wiring",
    "Designer lighting",
    "Custom millwork",
    "Spa-style primary bath",
    "Walkable to village",
  ];

  samples.forEach((s, i) => {
    for (let k = 0; k < 2; k++) {
      const cats: Category[] = [];
      const r = (i + k * 3) % 7;
      if (r === 0) cats.push("sold");
      else if (r === 1) cats.push("new", "open");
      else if (r === 2) cats.push("open");
      else if (r === 3) cats.push("new");
      else if (r === 4) cats.push("featured");
      else if (r === 5) cats.push("featured", "new");
      else cats.push("featured");

      if (i % 2 === 0 && !cats.includes("featured")) cats.push("featured");

      const status: Status = cats.includes("sold")
        ? "Sold"
        : cats.includes("open")
          ? "Open House"
          : cats.includes("new")
            ? "New"
            : "Featured";

      const priceValue = Math.round((s.base + k * 60000 + (i % 4) * 25000) / 1000) * 1000;
      const beds = s.type === "Condo" ? 2 + (i % 2) : 3 + ((i + k) % 4);
      const baths = Math.max(2, beds - 1 + (k % 2));
      const sqft = (s.type === "Condo" ? 1400 : 2400) + ((i + k * 2) % 6) * 350;

      list.push({
        id: `L-${id++}`,
        image: IMG[(i + k) % IMG.length],
        gallery: [
          IMG[(i + k) % IMG.length],
          IMG[(i + k + 1) % IMG.length],
          IMG[(i + k + 2) % IMG.length],
        ],
        price: `$${priceValue.toLocaleString()}`,
        priceValue,
        address: `${1000 + i * 13 + k * 7} ${streets[(i + k) % streets.length]}`,
        neighborhood: s.n,
        county: s.c,
        beds,
        baths,
        sqft,
        type: s.type,
        status,
        categories: cats,
        description:
          "A composed, light-filled home with refined finishes throughout — designed for easy entertaining and quiet, everyday luxury.",
        features: [
          featuresPool[(i + k) % featuresPool.length],
          featuresPool[(i + k + 3) % featuresPool.length],
          featuresPool[(i + k + 6) % featuresPool.length],
          featuresPool[(i + k + 9) % featuresPool.length],
        ],
      });
    }
  });

  return list;
}

export const ALL_LISTINGS: Listing[] = makeListings();

/* ---------- Buyer ↔ Listing matching ---------- */

export type BuyerCriteria = {
  areas: string[];        // neighborhood and/or county names the buyer chose
  budget: string;         // one of BUDGET_OPTIONS
  beds: string;           // e.g. "3+"
  baths: string;          // e.g. "2+"
  homeTypes: string[];    // selected home type labels
  mustHaves: string[];    // selected must-have labels
};

export type MatchResult = {
  listing: Listing;
  score: number;          // 0..1 internal score
  strong: boolean;        // score >= 0.8
  reason: string;         // short human sentence
};

const BUDGET_RANGES: Record<string, [number, number]> = {
  "Under $250k": [0, 250_000],
  "$250k–$350k": [250_000, 350_000],
  "$350k–$500k": [350_000, 500_000],
  "$500k–$750k": [500_000, 750_000],
  "$750k+": [750_000, Number.POSITIVE_INFINITY],
};

const HOME_TYPE_MAP: Record<string, Listing["type"][]> = {
  "Single-family home": ["Single Family", "Estate"],
  Condo: ["Condo"],
  Townhouse: ["Townhome"],
  "Multi-family": [],
  "New construction": ["Single Family", "Townhome", "Condo", "Estate"],
  Land: [],
  "Investment property": ["Single Family", "Townhome", "Condo"],
  "Not sure yet": ["Single Family", "Townhome", "Condo", "Estate"],
};

// Must-have → listing feature keywords (loose matching).
const MUST_HAVE_KEYWORDS: Record<string, string[]> = {
  Backyard: ["porch", "terrace", "garden", "yard"],
  "Updated kitchen": ["kitchen"],
  "Home office": ["office", "study"],
  "Walkable area": ["walk", "village"],
  "Good schools": [], // soft — handled by area bonus
  Garage: ["garage"],
  Pool: ["pool"],
  "Move-in ready": ["designer", "smart-home", "millwork", "spa"],
  "Fixer-upper potential": [], // none of the demo listings advertise this
};

function parseMin(opt: string): number {
  const n = parseInt(opt, 10);
  return Number.isFinite(n) ? n : 0;
}

function scoreListing(listing: Listing, c: BuyerCriteria): { score: number; reason: string } {
  // Weights — area + budget dominate, beds/baths/type next, must-haves bonus.
  const W = { area: 0.3, budget: 0.3, beds: 0.1, baths: 0.08, type: 0.12, must: 0.1 };

  // Area match: full credit if neighborhood matches, partial for county match.
  let areaPts = 0;
  let areaReason = "";
  if (c.areas.length === 0 || c.areas.includes("Not sure yet")) {
    areaPts = 0.6; // neutral
  } else {
    const lower = c.areas.map((a) => a.toLowerCase());
    if (lower.includes(listing.neighborhood.toLowerCase())) {
      areaPts = 1;
      areaReason = `in ${listing.neighborhood}`;
    } else if (lower.includes(listing.county.toLowerCase())) {
      areaPts = 0.7;
      areaReason = `in ${listing.county} County`;
    } else {
      areaPts = 0.15;
    }
  }

  // Budget match.
  let budgetPts = 0;
  let budgetReason = "";
  const range = BUDGET_RANGES[c.budget];
  if (!range) {
    budgetPts = 0.6;
  } else {
    const [lo, hi] = range;
    if (listing.priceValue >= lo && listing.priceValue <= hi) {
      budgetPts = 1;
      budgetReason = "within your budget";
    } else {
      const dist = listing.priceValue < lo ? lo - listing.priceValue : listing.priceValue - hi;
      const ref = Math.max(hi === Number.POSITIVE_INFINITY ? lo : hi, 1);
      budgetPts = Math.max(0, 1 - dist / ref);
    }
  }

  // Beds / baths.
  const minBeds = parseMin(c.beds);
  const minBaths = parseMin(c.baths);
  const bedsPts = !minBeds ? 0.7 : listing.beds >= minBeds ? 1 : Math.max(0, 1 - (minBeds - listing.beds) * 0.4);
  const bathsPts = !minBaths ? 0.7 : listing.baths >= minBaths ? 1 : Math.max(0, 1 - (minBaths - listing.baths) * 0.4);

  // Home type.
  let typePts = 0.6;
  if (c.homeTypes.length > 0) {
    const allowed = new Set<Listing["type"]>();
    c.homeTypes.forEach((t) => HOME_TYPE_MAP[t]?.forEach((x) => allowed.add(x)));
    typePts = allowed.size === 0 ? 0.6 : allowed.has(listing.type) ? 1 : 0.2;
  }

  // Must-haves — bonus, capped at 1.
  let mustPts = 0;
  const matchedMust: string[] = [];
  if (c.mustHaves.length === 0) {
    mustPts = 0.5;
  } else {
    const haystack = [...listing.features, listing.description].join(" ").toLowerCase();
    c.mustHaves.forEach((m) => {
      const kw = MUST_HAVE_KEYWORDS[m] ?? [];
      if (kw.some((k) => haystack.includes(k))) matchedMust.push(m);
    });
    mustPts = Math.min(1, matchedMust.length / Math.max(1, c.mustHaves.length));
  }

  const score =
    areaPts * W.area +
    budgetPts * W.budget +
    bedsPts * W.beds +
    bathsPts * W.baths +
    typePts * W.type +
    mustPts * W.must;

  // Reason — pick the strongest one or two phrases.
  const parts: string[] = [];
  if (areaReason) parts.push(areaReason);
  if (budgetReason) parts.push(budgetReason);
  if (matchedMust.length > 0) parts.push(`with ${matchedMust.slice(0, 2).join(" and ").toLowerCase()}`);
  if (parts.length === 0) parts.push(`a ${listing.type.toLowerCase()} in ${listing.neighborhood}`);
  const reason = `${parts.join(", ")}.`;

  return { score, reason: reason.charAt(0).toUpperCase() + reason.slice(1) };
}

export function findBestMatch(criteria: BuyerCriteria): MatchResult | null {
  // Don't recommend a sold home.
  const pool = ALL_LISTINGS.filter((l) => l.status !== "Sold");
  if (pool.length === 0) return null;

  let best: { listing: Listing; score: number; reason: string } | null = null;
  for (const l of pool) {
    const { score, reason } = scoreListing(l, criteria);
    if (!best || score > best.score) best = { listing: l, score, reason };
  }
  if (!best) return null;
  return { ...best, strong: best.score >= 0.8 };
}
