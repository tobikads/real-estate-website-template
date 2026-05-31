import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Linkedin,
  Instagram,
  Phone,
  Mail,
  BedDouble,
  Bath,
  Maximize,
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  SlidersHorizontal,
  Search,
  MapPin,
  Check,
} from "lucide-react";

import { Header } from "@/components/Header";
import { REALTOR_PROFILE } from "@/data/realtor-profile";
import { ALL_LISTINGS, type Category, type Status, type Listing } from "@/data/demo-listings";
import { COUNTY_SHAPES, MAP_W, MAP_H, type CountyShape } from "@/data/atlanta-counties";

const REALTOR_FIRST_NAME = REALTOR_PROFILE.name.split(" ")[0];

export const Route = createFileRoute("/listings")({
  head: () => ({
    meta: [
      { title: `Listings | ${REALTOR_PROFILE.name}` },
      {
        name: "description",
        content:
          `Browse Atlanta-area homes, explore by community, and save favorites — a guided property discovery experience with ${REALTOR_PROFILE.name}.`,
      },
    ],
  }),
  component: ListingsPage,
});

/* ---------- Types & data ---------- */

type Category = "featured" | "new" | "open" | "sold";
type Status = "Featured" | "New" | "Open House" | "Sold";

interface Listing {
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

const NEIGHBORHOODS_BY_COUNTY: Record<string, string[]> = {
  Fulton: ["Atlanta", "Buckhead", "Midtown", "Sandy Springs", "Alpharetta", "Roswell"],
  DeKalb: ["Brookhaven", "Decatur", "Dunwoody", "Tucker", "Chamblee", "Stone Mountain"],
  Cobb: ["Marietta", "Smyrna", "Kennesaw", "Acworth", "Powder Springs"],
  Gwinnett: ["Duluth", "Norcross", "Lawrenceville", "Suwanee", "Peachtree Corners", "Buford"],
  Clayton: ["Riverdale", "Jonesboro", "Forest Park", "College Park"],
  Henry: ["McDonough", "Stockbridge"],
  Fayette: ["Fayetteville", "Peachtree City", "Tyrone"],
  Rockdale: ["Conyers"],
  Douglas: ["Douglasville"],
  Coweta: ["Newnan"],
  Cherokee: ["Woodstock", "Canton"],
  Forsyth: ["Cumming"],
  Paulding: ["Dallas"],
};

const PRIMARY_COUNTIES = new Set(["Fulton", "DeKalb", "Cobb", "Gwinnett", "Cherokee", "Forsyth"]);

// Manual label tweaks where the geographic centroid falls in an awkward
// spot. Coordinates are in the d3-geo projected viewBox (0..1000).
const LABEL_OVERRIDES: Record<string, { x?: number; y?: number; size?: number; tracking?: number }> = {
  Fulton: { x: 395, y: 760, size: 30, tracking: 4 },
  DeKalb: { x: 540, y: 695, size: 24, tracking: 2.6 },
  Gwinnett: { x: 632, y: 560, size: 30, tracking: 3.6 },
  Cobb: { x: 345, y: 600, size: 28, tracking: 3.2 },
  Fulton2: { x: 0, y: 0 },
  Cherokee: { x: 398, y: 385, size: 28, tracking: 3.2 },
  Forsyth: { x: 580, y: 395, size: 26, tracking: 3 },
  Hall: { x: 760, y: 320, size: 26, tracking: 3 },
  Bartow: { x: 200, y: 380, size: 26, tracking: 3 },
  Paulding: { x: 197, y: 580, size: 24, tracking: 2.6 },
  Douglas: { x: 245, y: 720, size: 22, tracking: 2.2 },
  Rockdale: { x: 632, y: 760, size: 16, tracking: 1.2 },
  Clayton: { x: 454, y: 815, size: 18, tracking: 1.6 },
  Fayette: { x: 389, y: 900, size: 20, tracking: 2 },
  Henry: { x: 559, y: 880, size: 22, tracking: 2.4 },
  Walton: { x: 782, y: 680, size: 22, tracking: 2.4 },
  Pickens: { x: 402, y: 246, size: 20, tracking: 2 },
  Gilmer: { x: 410, y: 104, size: 20, tracking: 2 },
};

// Per-county neighborhood pin placements on the map (in viewBox coords).
// Only the names listed here will render as pins; the side panel still
// shows the full list. Hand-placed to match reference screenshots.
const MAP_PIN_COORDS: Record<string, Array<{ name: string; x: number; y: number; labelDx?: number; labelDy?: number; anchor?: "start" | "middle" | "end" }>> = {
  Fulton: [
    { name: "Alpharetta", x: 478, y: 535, labelDx: 10, anchor: "start" },
    { name: "Sandy Springs", x: 448, y: 640, labelDx: 10, anchor: "start" },
    { name: "Buckhead", x: 432, y: 700, labelDx: 10, anchor: "start" },
    { name: "Atlanta", x: 410, y: 765, labelDx: 10, anchor: "start" },
  ],
  Gwinnett: [
    { name: "Buford", x: 655, y: 510, labelDx: 10, anchor: "start" },
    { name: "Suwanee", x: 625, y: 540, labelDx: 10, anchor: "start" },
    { name: "Duluth", x: 605, y: 575, labelDx: -10, anchor: "end" },
    { name: "Lawrenceville", x: 670, y: 590, labelDx: 10, anchor: "start" },
  ],
  DeKalb: [
    { name: "Dunwoody", x: 510, y: 640, labelDx: 10, anchor: "start" },
    { name: "Brookhaven", x: 530, y: 668, labelDx: 10, anchor: "start" },
    { name: "Chamblee", x: 552, y: 660, labelDx: 10, anchor: "start" },
    { name: "Decatur", x: 525, y: 710, labelDx: 10, anchor: "start" },
  ],
  Cobb: [
    { name: "Acworth", x: 335, y: 525, labelDx: 10, anchor: "start" },
    { name: "Kennesaw", x: 345, y: 558, labelDx: -10, anchor: "end" },
    { name: "Marietta", x: 360, y: 590, labelDx: -10, anchor: "end" },
    { name: "Smyrna", x: 350, y: 630, labelDx: -10, anchor: "end" },
  ],
  Clayton: [
    { name: "Riverdale", x: 445, y: 800, labelDx: 10, anchor: "start" },
    { name: "Jonesboro", x: 462, y: 835, labelDx: 10, anchor: "start" },
  ],
  Henry: [
    { name: "Stockbridge", x: 530, y: 840, labelDx: 10, anchor: "start" },
    { name: "McDonough", x: 580, y: 880, labelDx: 10, anchor: "start" },
  ],
  Fayette: [
    { name: "Fayetteville", x: 410, y: 880, labelDx: 10, anchor: "start" },
    { name: "Peachtree City", x: 380, y: 915, labelDx: 10, anchor: "start" },
  ],
  Rockdale: [
    { name: "Conyers", x: 632, y: 758, labelDx: 10, anchor: "start" },
  ],
  Douglas: [
    { name: "Douglasville", x: 248, y: 720, labelDx: 10, anchor: "start" },
  ],
  Cherokee: [
    { name: "Canton", x: 398, y: 360, labelDx: 10, anchor: "start" },
    { name: "Woodstock", x: 420, y: 410, labelDx: 10, anchor: "start" },
  ],
  Forsyth: [
    { name: "Cumming", x: 580, y: 395, labelDx: 10, anchor: "start" },
  ],
  Hall: [
    { name: "Gainesville", x: 740, y: 320, labelDx: 10, anchor: "start" },
    { name: "Flowery Branch", x: 720, y: 380, labelDx: 10, anchor: "start" },
  ],
  Paulding: [
    { name: "Dallas", x: 197, y: 580, labelDx: 10, anchor: "start" },
    { name: "Hiram", x: 200, y: 615, labelDx: 10, anchor: "start" },
  ],
  Walton: [
    { name: "Monroe", x: 780, y: 660, labelDx: 10, anchor: "start" },
    { name: "Loganville", x: 770, y: 700, labelDx: 10, anchor: "start" },
  ],
  Bartow: [
    { name: "Cartersville", x: 210, y: 360, labelDx: 10, anchor: "start" },
  ],
  Pickens: [
    { name: "Jasper", x: 402, y: 246, labelDx: 10, anchor: "start" },
  ],
  Gilmer: [
    { name: "Ellijay", x: 410, y: 104, labelDx: 10, anchor: "start" },
  ],
};







function makeListings(): Listing[] {
  const list: Listing[] = [];
  let id = 1;
  const samples: Array<{
    n: string;
    c: string;
    base: number;
    type: Listing["type"];
  }> = [
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

      // Make sure each main category has plenty
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
        gallery: [IMG[(i + k) % IMG.length], IMG[(i + k + 1) % IMG.length], IMG[(i + k + 2) % IMG.length]],
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

const ALL_LISTINGS = makeListings();

const CATEGORY_META: Record<Category, { label: string; viewMore: string }> = {
  featured: { label: "Featured", viewMore: "View More Featured Homes" },
  new: { label: "New Listings", viewMore: "View More New Listings" },
  open: { label: "Open Houses", viewMore: "View More Open Houses" },
  sold: { label: "Sold", viewMore: "View More Sold Homes" },
};

/* ---------- Page ---------- */

function ListingsPage() {
  const [view, setView] = useState<"global" | "neighborhood">("global");
  const [category, setCategory] = useState<Category>("featured");
  const [visibleCount, setVisibleCount] = useState<Record<Category, number>>({
    featured: 8,
    new: 8,
    open: 8,
    sold: 8,
  });

  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
  const [neighborhoodCategory, setNeighborhoodCategory] = useState<Category | "all">("all");

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savedOpen, setSavedOpen] = useState(false);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchAll, setSearchAll] = useState(false);
  const [filters, setFilters] = useState({
    q: "",
    minPrice: "",
    maxPrice: "",
    beds: "",
    baths: "",
    type: "",
    minSqft: "",
    status: "",
  });

  // Load/save saved listings to localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("ac_saved_listings");
      if (raw) setSavedIds(JSON.parse(raw));
    } catch { }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("ac_saved_listings", JSON.stringify(savedIds));
    } catch { }
  }, [savedIds]);

  const toggleSave = (id: string) =>
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  // Filter helpers
  const inCategory = (l: Listing, c: Category) => l.categories.includes(c);

  const globalListings = useMemo(
    () => ALL_LISTINGS.filter((l) => inCategory(l, category)).slice(0, visibleCount[category]),
    [category, visibleCount],
  );

  const neighborhoodListings = useMemo(() => {
    if (!selectedNeighborhood) return [];
    let base = searchAll
      ? ALL_LISTINGS
      : ALL_LISTINGS.filter((l) => l.neighborhood === selectedNeighborhood);

    if (neighborhoodCategory !== "all") {
      base = base.filter((l) => inCategory(l, neighborhoodCategory));
    }
    if (filters.q) {
      const q = filters.q.toLowerCase();
      base = base.filter(
        (l) =>
          l.address.toLowerCase().includes(q) ||
          l.neighborhood.toLowerCase().includes(q) ||
          l.county.toLowerCase().includes(q),
      );
    }
    if (filters.minPrice) base = base.filter((l) => l.priceValue >= +filters.minPrice);
    if (filters.maxPrice) base = base.filter((l) => l.priceValue <= +filters.maxPrice);
    if (filters.beds) base = base.filter((l) => l.beds >= +filters.beds);
    if (filters.baths) base = base.filter((l) => l.baths >= +filters.baths);
    if (filters.type) base = base.filter((l) => l.type === filters.type);
    if (filters.minSqft) base = base.filter((l) => l.sqft >= +filters.minSqft);
    if (filters.status) base = base.filter((l) => l.status === filters.status);
    return base;
  }, [selectedNeighborhood, neighborhoodCategory, filters, searchAll]);

  const savedListings = useMemo(
    () => ALL_LISTINGS.filter((l) => savedIds.includes(l.id)),
    [savedIds],
  );

  const openNeighborhood = (n: string) => {
    setSelectedNeighborhood(n);
    setView("neighborhood");
    setNeighborhoodCategory(category === "featured" ? "all" : category);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  const backToCommunities = () => {
    setSelectedNeighborhood(null);
    setView("global");
    setFiltersOpen(false);
    setSearchAll(false);
    setTimeout(() => {
      const el = document.getElementById("communities-map");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Header />

      {/* Mobile saved sticky control */}
      <SavedSticky count={savedIds.length} onOpen={() => setSavedOpen(true)} />

      <main className="pt-28 lg:pt-32 pb-24">
        {view === "global" ? (
          <>
            <GlobalCategorySection
              category={category}
              setCategory={(c) => setCategory(c)}
              listings={globalListings}
              totalInCategory={ALL_LISTINGS.filter((l) => inCategory(l, category)).length}
              visibleCount={visibleCount[category]}
              onViewMore={() =>
                setVisibleCount((v) => ({ ...v, [category]: v[category] + 6 }))
              }
              onOpenDetail={setSelectedListing}
              savedIds={savedIds}
              toggleSave={toggleSave}
              savedCount={savedIds.length}
              onOpenSaved={() => setSavedOpen(true)}
            />

            <CommunitiesMap
              selectedCounty={selectedCounty}
              onSelectCounty={setSelectedCounty}
              onSelectNeighborhood={openNeighborhood}
            />
          </>
        ) : (
          <NeighborhoodView
            neighborhood={selectedNeighborhood!}
            county={
              Object.entries(NEIGHBORHOODS_BY_COUNTY).find(([, ns]) =>
                ns.includes(selectedNeighborhood!),
              )?.[0] ?? ""
            }
            onBack={backToCommunities}
            category={neighborhoodCategory}
            setCategory={setNeighborhoodCategory}
            listings={neighborhoodListings}
            onOpenDetail={setSelectedListing}
            savedIds={savedIds}
            toggleSave={toggleSave}
            filtersOpen={filtersOpen}
            setFiltersOpen={setFiltersOpen}
            filters={filters}
            setFilters={setFilters}
            searchAll={searchAll}
            setSearchAll={setSearchAll}
          />
        )}

        <CantFindCTA />
      </main>

      <Footer />

      {selectedListing && (
        <ListingDetailOverlay
          listing={selectedListing}
          saved={savedIds.includes(selectedListing.id)}
          toggleSave={() => toggleSave(selectedListing.id)}
          onClose={() => setSelectedListing(null)}
        />
      )}

      {savedOpen && (
        <SavedDrawer
          listings={savedListings}
          onClose={() => setSavedOpen(false)}
          onOpenDetail={(l) => {
            setSavedOpen(false);
            setSelectedListing(l);
          }}
          toggleSave={toggleSave}
        />
      )}
    </div>
  );
}

/* ---------- Global Category Section ---------- */

function GlobalCategorySection({
  category,
  setCategory,
  listings,
  totalInCategory,
  visibleCount,
  onViewMore,
  onOpenDetail,
  savedIds,
  toggleSave,
  savedCount,
  onOpenSaved,
}: {
  category: Category;
  setCategory: (c: Category) => void;
  listings: Listing[];
  totalInCategory: number;
  visibleCount: number;
  onViewMore: () => void;
  onOpenDetail: (l: Listing) => void;
  savedIds: string[];
  toggleSave: (id: string) => void;
  savedCount: number;
  onOpenSaved: () => void;
}) {
  const cats: Category[] = ["featured", "new", "open", "sold"];

  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-8 sm:mb-10">
        <div>
          <p className="text-[11px] tracking-[0.35em] uppercase text-stone-500 mb-3">
            Atlanta · Demo Listings
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 leading-[1.05]">
            A curated view of the market.
          </h1>
          <p className="mt-4 max-w-xl text-stone-600 font-light leading-relaxed">
            Browse by category, explore communities across the metro, then step into the
            neighborhoods that feel like home.
          </p>
        </div>

        <button
          onClick={onOpenSaved}
          className="hidden sm:inline-flex items-center gap-2.5 text-[11px] tracking-[0.3em] uppercase text-stone-900 border border-stone-300 hover:border-stone-900 transition-colors px-4 py-2.5 self-start sm:self-end"
        >
          <Heart className="h-3.5 w-3.5" strokeWidth={1.5} />
          Saved
          <span className="text-stone-500">{savedCount}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-1 border-b border-stone-200 mb-8">
        {cats.map((c) => {
          const active = c === category;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`relative px-3 sm:px-5 py-3 text-[11px] tracking-[0.3em] uppercase transition-colors ${active ? "text-stone-900" : "text-stone-500 hover:text-stone-800"
                }`}
            >
              {CATEGORY_META[c].label}
              {active && (
                <span className="absolute left-0 right-0 -bottom-px h-px bg-stone-900" />
              )}
            </button>
          );
        })}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
        {listings.map((l) => (
          <ListingCard
            key={l.id}
            listing={l}
            saved={savedIds.includes(l.id)}
            onSave={() => toggleSave(l.id)}
            onOpen={() => onOpenDetail(l)}
          />
        ))}
      </div>

      {totalInCategory > visibleCount && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={onViewMore}
            className="inline-flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-stone-900 border border-stone-900 hover:bg-stone-900 hover:text-stone-50 transition-colors px-7 py-4"
          >
            {CATEGORY_META[category].viewMore}
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>
      )}
    </section>
  );
}

/* ---------- Listing Card (Netflix-style expand) ---------- */

function ListingCard({
  listing,
  saved,
  onSave,
  onOpen,
}: {
  listing: Listing;
  saved: boolean;
  onSave: () => void;
  onOpen: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside tap (mobile)
  useEffect(() => {
    if (!expanded) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setExpanded(false);
    };
    const scroll = () => setExpanded(false);
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
      window.removeEventListener("scroll", scroll);
    };
  }, [expanded]);

  return (
    <div
      ref={ref}
      onClick={() => setExpanded(true)}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`group relative bg-white border border-stone-200/70 overflow-hidden cursor-pointer transition-all duration-500 ease-out ${expanded ? "shadow-2xl shadow-stone-900/10 -translate-y-1" : "shadow-sm"
        }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <img
          src={listing.image}
          alt={listing.address}
          className={`w-full h-full object-cover transition-transform duration-700 ${expanded ? "scale-105" : "scale-100"
            }`}
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <StatusBadge status={listing.status} />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave();
          }}
          aria-label={saved ? "Remove from saved" : "Save home"}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${saved ? "text-stone-900 fill-stone-900" : "text-stone-700"
              }`}
            strokeWidth={1.5}
          />
        </button>
      </div>

      <div className="p-5">
        <p className="font-serif text-2xl text-stone-900">{listing.price}</p>
        <p className="mt-1 text-sm text-stone-700 font-light">{listing.address}</p>
        <p className="text-[11px] tracking-[0.2em] uppercase text-stone-500 mt-1">
          {listing.neighborhood}, {listing.county} County
        </p>

        <div className="mt-4 flex items-center gap-4 text-xs text-stone-600 font-light">
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-3.5 w-3.5" strokeWidth={1.5} /> {listing.beds}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-3.5 w-3.5" strokeWidth={1.5} /> {listing.baths}
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize className="h-3.5 w-3.5" strokeWidth={1.5} /> {listing.sqft.toLocaleString()} sf
          </span>
        </div>

        <div
          className={`grid transition-all duration-500 ease-out ${expanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"
            }`}
        >
          <div className="overflow-hidden">
            <p className="text-sm text-stone-600 font-light leading-relaxed line-clamp-2">
              {listing.description}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 text-[11px] tracking-[0.3em] uppercase text-stone-50 bg-stone-900 hover:bg-stone-800 transition-colors px-5 py-3"
            >
              View Details
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    Featured: "bg-stone-900/85 text-stone-50",
    New: "bg-emerald-900/85 text-stone-50",
    "Open House": "bg-amber-800/90 text-stone-50",
    Sold: "bg-stone-200/95 text-stone-700",
  };
  return (
    <span
      className={`px-2.5 py-1 text-[10px] tracking-[0.25em] uppercase backdrop-blur-sm ${map[status]}`}
    >
      {status}
    </span>
  );
}

/* ---------- Communities Map ---------- */

function CommunitiesMap({
  selectedCounty,
  onSelectCounty,
  onSelectNeighborhood,
}: {
  selectedCounty: string | null;
  onSelectCounty: (c: string | null) => void;
  onSelectNeighborhood: (n: string) => void;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleSelect = (c: string) => {
    onSelectCounty(c);
    setSheetOpen(true);
  };

  return (
    <section id="communities-map" className="mt-24 lg:mt-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-[11px] tracking-[0.35em] uppercase text-stone-500 mb-4">
            Explore by Community
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-stone-900 leading-[1.05]">
            Communities Map
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-stone-600 font-light leading-relaxed">
            A look across the Atlanta metro. Choose a county to see its neighborhoods.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 lg:gap-10 items-start">
          {/* Atlanta metro county map — one SVG, real county boundaries.
              Each <path> is BOTH the visible shape and the click target. */}
          <div
            className="relative bg-white"
            style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}
          >
            <svg
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Counties */}
              {COUNTY_SHAPES.map((c) => {
                const active = selectedCounty === c.name;
                const baseFill = active ? "#b8a07a" : "#4a4744";
                return (
                  <path
                    key={c.name}
                    id={`county-${c.name}`}
                    d={c.d}
                    fill={baseFill}
                    stroke="#ffffff"
                    strokeWidth={1.2}
                    strokeLinejoin="round"
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${c.name} County`}
                    aria-pressed={active}
                    className="transition-[fill] duration-300 cursor-pointer outline-none focus-visible:stroke-[#b8a07a]"
                    onClick={() => handleSelect(c.name)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelect(c.name);
                      }
                    }}
                    onMouseEnter={(e) => {
                      if (!active)
                        (e.currentTarget as SVGPathElement).setAttribute("fill", "#5e5a55");
                    }}
                    onMouseLeave={(e) => {
                      if (!active)
                        (e.currentTarget as SVGPathElement).setAttribute("fill", baseFill);
                    }}
                  />
                );
              })}

              {/* County labels — hide for selected county (neighborhood dots take over) */}
              {COUNTY_SHAPES.map((c) => {
                const active = selectedCounty === c.name;
                if (active) return null;
                const override = LABEL_OVERRIDES[c.name];
                const lx = override?.x ?? c.label[0];
                const ly = override?.y ?? c.label[1];
                const tracking = override?.tracking ?? 2.4;
                const size = override?.size ?? 22;
                return (
                  <text
                    key={`lbl-${c.name}`}
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="pointer-events-none select-none"
                    style={{
                      fontSize: `${size}px`,
                      letterSpacing: `${tracking}px`,
                      fontFamily: "Inter, system-ui, sans-serif",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      fill: "#ffffff",
                    }}
                  >
                    {c.name.toUpperCase()}
                  </text>
                );
              })}

              {/* Selected county: neighborhood dots + black labels */}
              {selectedCounty &&
                (() => {
                  const pins = MAP_PIN_COORDS[selectedCounty] ?? [];
                  return (
                    <g>
                      {pins.map((n) => (
                        <g
                          key={n.name}
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectNeighborhood(n.name);
                          }}
                        >
                          <circle cx={n.x} cy={n.y} r={4} fill="#1a1a1a" />
                          <text
                            x={n.x + (n.labelDx ?? 8)}
                            y={n.y + (n.labelDy ?? 4)}
                            textAnchor={n.anchor ?? "start"}
                            style={{
                              fontSize: "16px",
                              fontFamily: "Inter, system-ui, sans-serif",
                              fill: "#1a1a1a",
                              fontWeight: 500,
                              letterSpacing: "0.2px",
                            }}
                          >
                            {n.name}
                          </text>
                        </g>
                      ))}
                    </g>
                  );
                })()}
            </svg>
          </div>

          {/* Desktop side panel */}
          <div className="hidden lg:block">
            <CountyPanel
              county={selectedCounty}
              onSelectNeighborhood={onSelectNeighborhood}
              onClear={() => onSelectCounty(null)}
            />
          </div>
        </div>



        {/* Mobile county cards */}
        <div className="lg:hidden mt-8">
          <p className="text-[11px] tracking-[0.3em] uppercase text-stone-500 mb-4">Counties</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {Object.keys(NEIGHBORHOODS_BY_COUNTY).map((c) => {
              const active = selectedCounty === c;
              return (
                <button
                  key={c}
                  onClick={() => handleSelect(c)}
                  className={`px-4 py-3.5 text-sm border transition-colors text-left ${active
                    ? "bg-stone-900 text-stone-50 border-stone-900"
                    : PRIMARY_COUNTIES.has(c)
                      ? "bg-white border-stone-300 text-stone-900 hover:border-stone-900"
                      : "bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-500"
                    }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile bottom sheet */}
        {sheetOpen && selectedCounty && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
              onClick={() => setSheetOpen(false)}
            />
            <div className="absolute bottom-0 inset-x-0 bg-[#faf7f2] rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
              <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-stone-300" />
              <CountyPanel
                county={selectedCounty}
                onSelectNeighborhood={(n) => {
                  setSheetOpen(false);
                  onSelectNeighborhood(n);
                }}
                onClear={() => setSheetOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CountyPanel({
  county,
  onSelectNeighborhood,
  onClear,
}: {
  county: string | null;
  onSelectNeighborhood: (n: string) => void;
  onClear: () => void;
}) {
  if (!county) {
    return (
      <div className="bg-white border border-stone-200 p-8 lg:p-10 h-full min-h-[320px] flex flex-col justify-center">
        <p className="text-[11px] tracking-[0.3em] uppercase text-stone-500 mb-4">
          Select a county
        </p>
        <p className="font-serif text-2xl text-stone-900 leading-snug">
          Choose any point on the map to see the neighborhoods within it.
        </p>
      </div>
    );
  }
  const neighborhoods = NEIGHBORHOODS_BY_COUNTY[county] ?? [];
  return (
    <div className="bg-white border border-stone-200 p-8 lg:p-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.3em] uppercase text-stone-500 mb-2">County</p>
          <p className="font-serif text-3xl text-stone-900">{county}</p>
        </div>
        <button
          onClick={onClear}
          className="text-stone-400 hover:text-stone-900 transition-colors"
          aria-label="Clear"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
      <div className="mt-6 pt-6 border-t border-stone-200">
        <p className="text-[11px] tracking-[0.3em] uppercase text-stone-500 mb-4">
          Neighborhoods
        </p>
        <ul className="divide-y divide-stone-100">
          {neighborhoods.map((n) => (
            <li key={n}>
              <button
                onClick={() => onSelectNeighborhood(n)}
                className="w-full flex items-center justify-between py-3 text-left group"
              >
                <span className="text-stone-800 font-light group-hover:text-stone-900 transition-colors">
                  {n}
                </span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  strokeWidth={1.5}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- Neighborhood View ---------- */

function NeighborhoodView({
  neighborhood,
  county,
  onBack,
  category,
  setCategory,
  listings,
  onOpenDetail,
  savedIds,
  toggleSave,
  filtersOpen,
  setFiltersOpen,
  filters,
  setFilters,
  searchAll,
  setSearchAll,
}: {
  neighborhood: string;
  county: string;
  onBack: () => void;
  category: Category | "all";
  setCategory: (c: Category | "all") => void;
  listings: Listing[];
  onOpenDetail: (l: Listing) => void;
  savedIds: string[];
  toggleSave: (id: string) => void;
  filtersOpen: boolean;
  setFiltersOpen: (b: boolean) => void;
  filters: {
    q: string;
    minPrice: string;
    maxPrice: string;
    beds: string;
    baths: string;
    type: string;
    minSqft: string;
    status: string;
  };
  setFilters: (f: any) => void;
  searchAll: boolean;
  setSearchAll: (b: boolean) => void;
}) {
  const chips: Array<{ key: Category | "all"; label: string }> = [
    { key: "all", label: "All" },
    { key: "featured", label: "Featured" },
    { key: "new", label: "New" },
    { key: "open", label: "Open Houses" },
    { key: "sold", label: "Sold" },
  ];

  const updateFilter = (k: string, v: string) => setFilters({ ...filters, [k]: v });

  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-stone-600 hover:text-stone-900 transition-colors"
      >
        <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Back to Communities Map
      </button>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] tracking-[0.35em] uppercase text-stone-500 mb-3">
            {county} County
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-stone-900 leading-[1.05]">
            Homes in {neighborhood}
          </h2>
        </div>
        <p className="text-sm text-stone-500 font-light">
          {listings.length} {listings.length === 1 ? "home" : "homes"}
        </p>
      </div>

      {/* Chips */}
      <div className="mt-8 flex flex-wrap gap-2">
        {chips.map((c) => {
          const active = category === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`px-4 py-2.5 text-[11px] tracking-[0.25em] uppercase border transition-colors ${active
                ? "bg-stone-900 text-stone-50 border-stone-900"
                : "bg-white border-stone-300 text-stone-700 hover:border-stone-900"
                }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="mt-6 border border-stone-200 bg-white">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="w-full flex items-center justify-between px-5 py-4 text-left"
        >
          <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-stone-800">
            <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
            Search & Filter
          </span>
          <span className="text-stone-400 text-xs">{filtersOpen ? "Close" : "Open"}</span>
        </button>
        {filtersOpen && (
          <div className="border-t border-stone-200 p-5 sm:p-6 space-y-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" strokeWidth={1.5} />
              <input
                value={filters.q}
                onChange={(e) => updateFilter("q", e.target.value)}
                placeholder="Search by address, city, or neighborhood"
                className="w-full pl-10 pr-3 py-3 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-stone-500"
              />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <input
                placeholder="Min price"
                value={filters.minPrice}
                onChange={(e) => updateFilter("minPrice", e.target.value.replace(/\D/g, ""))}
                className="px-3 py-3 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-stone-500"
              />
              <input
                placeholder="Max price"
                value={filters.maxPrice}
                onChange={(e) => updateFilter("maxPrice", e.target.value.replace(/\D/g, ""))}
                className="px-3 py-3 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-stone-500"
              />
              <select
                value={filters.beds}
                onChange={(e) => updateFilter("beds", e.target.value)}
                className="px-3 py-3 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-stone-500"
              >
                <option value="">Beds (any)</option>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n}+ beds</option>
                ))}
              </select>
              <select
                value={filters.baths}
                onChange={(e) => updateFilter("baths", e.target.value)}
                className="px-3 py-3 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-stone-500"
              >
                <option value="">Baths (any)</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}+ baths</option>
                ))}
              </select>
              <select
                value={filters.type}
                onChange={(e) => updateFilter("type", e.target.value)}
                className="px-3 py-3 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-stone-500"
              >
                <option value="">Property type (any)</option>
                {["Single Family", "Townhome", "Condo", "Estate"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <input
                placeholder="Min sqft"
                value={filters.minSqft}
                onChange={(e) => updateFilter("minSqft", e.target.value.replace(/\D/g, ""))}
                className="px-3 py-3 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-stone-500"
              />
              <select
                value={filters.status}
                onChange={(e) => updateFilter("status", e.target.value)}
                className="px-3 py-3 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-stone-500"
              >
                <option value="">Status (any)</option>
                {["Featured", "New", "Open House", "Sold"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <label className="flex items-center gap-2 px-3 py-3 text-xs font-light text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={searchAll}
                  onChange={(e) => setSearchAll(e.target.checked)}
                  className="accent-stone-900"
                />
                Search all areas instead
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Listings */}
      <div className="mt-10">
        {listings.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-stone-300">
            <p className="font-serif text-2xl text-stone-800">No homes match yet.</p>
            <p className="mt-3 text-sm text-stone-500 font-light">
              Try clearing a filter or widening your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {listings.map((l) => (
              <ListingCard
                key={l.id}
                listing={l}
                saved={savedIds.includes(l.id)}
                onSave={() => toggleSave(l.id)}
                onOpen={() => onOpenDetail(l)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- Listing Detail Overlay ---------- */

function ListingDetailOverlay({
  listing,
  saved,
  toggleSave,
  onClose,
}: {
  listing: Listing;
  saved: boolean;
  toggleSave: () => void;
  onClose: () => void;
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const [formMode, setFormMode] = useState<null | "ask" | "showing">(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const next = () => setImgIdx((i) => (i + 1) % listing.gallery.length);
  const prev = () => setImgIdx((i) => (i - 1 + listing.gallery.length) % listing.gallery.length);

  return (
    <div className="fixed inset-0 z-[60] bg-stone-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-full flex items-start justify-center p-0 sm:p-6">
        <div className="bg-[#faf7f2] w-full max-w-6xl shadow-2xl relative">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
          >
            <X className="h-4 w-4 text-stone-800" strokeWidth={1.5} />
          </button>

          {/* Carousel */}
          <div className="relative aspect-[16/10] bg-stone-200 overflow-hidden">
            <img
              src={listing.gallery[imgIdx]}
              alt={listing.address}
              className="w-full h-full object-cover"
            />
            <button
              onClick={prev}
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-stone-800" strokeWidth={1.5} />
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white flex items-center justify-center transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-stone-800" strokeWidth={1.5} />
            </button>
            <div className="absolute bottom-4 left-4">
              <StatusBadge status={listing.status} />
            </div>
            <div className="absolute bottom-4 right-4 flex gap-1.5">
              {listing.gallery.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${i === imgIdx ? "w-6 bg-white" : "w-1.5 bg-white/60"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="grid lg:grid-cols-[1.6fr_1fr] gap-10 p-6 sm:p-10">
            <div>
              <p className="font-serif text-4xl sm:text-5xl text-stone-900">{listing.price}</p>
              <p className="mt-2 text-stone-700 font-light">{listing.address}</p>
              <p className="text-[11px] tracking-[0.3em] uppercase text-stone-500 mt-1">
                {listing.neighborhood}, {listing.county} County
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-stone-700 font-light border-y border-stone-200 py-5">
                <span className="flex items-center gap-2">
                  <BedDouble className="h-4 w-4" strokeWidth={1.5} /> {listing.beds} bed
                </span>
                <span className="flex items-center gap-2">
                  <Bath className="h-4 w-4" strokeWidth={1.5} /> {listing.baths} bath
                </span>
                <span className="flex items-center gap-2">
                  <Maximize className="h-4 w-4" strokeWidth={1.5} />{" "}
                  {listing.sqft.toLocaleString()} sqft
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" strokeWidth={1.5} /> {listing.type}
                </span>
              </div>

              <div className="mt-6">
                <p className="text-[11px] tracking-[0.3em] uppercase text-stone-500 mb-3">
                  About this home
                </p>
                <p className="text-stone-700 font-light leading-relaxed">{listing.description}</p>
              </div>

              <div className="mt-8">
                <p className="text-[11px] tracking-[0.3em] uppercase text-stone-500 mb-4">
                  Key features
                </p>
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                  {listing.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-stone-700 font-light">
                      <Check className="h-3.5 w-3.5 text-stone-500" strokeWidth={1.5} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions sidebar */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <div className="bg-white border border-stone-200 p-6">
                {formMode === null ? (
                  <>
                    <button
                      onClick={toggleSave}
                      className={`w-full inline-flex items-center justify-center gap-2 text-[11px] tracking-[0.3em] uppercase border transition-colors px-5 py-3 mb-3 ${saved
                        ? "border-stone-900 bg-stone-900 text-stone-50"
                        : "border-stone-300 text-stone-800 hover:border-stone-900"
                        }`}
                    >
                      <Heart
                        className={`h-3.5 w-3.5 ${saved ? "fill-stone-50" : ""}`}
                        strokeWidth={1.5}
                      />
                      {saved ? "Saved" : "Save home"}
                    </button>
                    <button
                      onClick={() => setFormMode("ask")}
                      className="w-full inline-flex items-center justify-center gap-2 text-[11px] tracking-[0.3em] uppercase bg-stone-900 text-stone-50 hover:bg-stone-800 transition-colors px-5 py-3.5 mb-3"
                    >
                      Ask About This Home
                    </button>
                    <button
                      onClick={() => setFormMode("showing")}
                      className="w-full inline-flex items-center justify-center gap-2 text-[11px] tracking-[0.3em] uppercase border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-stone-50 transition-colors px-5 py-3.5"
                    >
                      Schedule a Showing
                    </button>
                    <p className="mt-5 text-xs text-stone-500 font-light leading-relaxed">
                      {REALTOR_FIRST_NAME} typically responds within a few hours.
                    </p>
                  </>
                ) : (
                  <ListingLeadForm
                    mode={formMode}
                    listing={listing}
                    onCancel={() => setFormMode(null)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Listing Lead Forms ---------- */

function ListingLeadForm({
  mode,
  listing,
  onCancel,
}: {
  mode: "ask" | "showing";
  listing: Listing;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [preferred, setPreferred] = useState<"Text" | "Call" | "Email">("Text");
  const [message, setMessage] = useState(
    mode === "ask" ? "I'm interested in this home." : "",
  );
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [preApproved, setPreApproved] = useState<"Yes" | "No" | "Not sure" | "">("");
  const [notice, setNotice] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setNotice("Please share your name.");
    if (!contact.trim()) return setNotice("Please share a phone or email.");
    if (mode === "showing" && !day.trim()) return setNotice("Please suggest a day or time.");
    setNotice("");

    const lead = {
      type: mode === "ask" ? "listing_inquiry" : "listing_showing",
      listing: {
        id: listing.id,
        address: listing.address,
        price: listing.price,
        status: listing.status,
        neighborhood: listing.neighborhood,
        county: listing.county,
      },
      name,
      contact,
      preferredFollowUp: preferred,
      ...(mode === "ask"
        ? { message }
        : { preferredDayTime: `${day}${time ? " · " + time : ""}`, preApproved }),
    };
    // eslint-disable-next-line no-console
    console.log("Listing lead:", lead);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-6">
        <p className="font-serif text-2xl text-stone-900">Thank you.</p>
        <p className="mt-3 text-sm text-stone-600 font-light leading-relaxed">
          {REALTOR_FIRST_NAME} will follow up about <span className="italic">{listing.address}</span> shortly.
        </p>
        <button
          onClick={onCancel}
          className="mt-6 text-[11px] tracking-[0.3em] uppercase text-stone-700 border-b border-stone-700 pb-1 hover:text-stone-900"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const input =
    "mt-1.5 w-full px-3 py-2.5 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-stone-500";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] tracking-[0.3em] uppercase text-stone-800">
          {mode === "ask" ? "Ask About This Home" : "Schedule a Showing"}
        </p>
        <button
          type="button"
          onClick={onCancel}
          className="text-stone-400 hover:text-stone-900"
          aria-label="Close"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      <div>
        <label className="text-[10px] tracking-[0.3em] uppercase text-stone-500">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={120} className={input} />
      </div>
      <div>
        <label className="text-[10px] tracking-[0.3em] uppercase text-stone-500">
          Phone or Email
        </label>
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          maxLength={160}
          className={input}
        />
      </div>

      <div>
        <label className="text-[10px] tracking-[0.3em] uppercase text-stone-500">
          Preferred follow-up
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["Text", "Call", "Email"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPreferred(p)}
              className={`px-3.5 py-2 text-[11px] tracking-[0.25em] uppercase border transition-colors ${preferred === p
                ? "bg-stone-900 text-stone-50 border-stone-900"
                : "bg-white border-stone-300 text-stone-700 hover:border-stone-900"
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {mode === "ask" ? (
        <div>
          <label className="text-[10px] tracking-[0.3em] uppercase text-stone-500">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            maxLength={800}
            className={input}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] tracking-[0.3em] uppercase text-stone-500">Day</label>
              <input
                value={day}
                onChange={(e) => setDay(e.target.value)}
                placeholder="e.g. Saturday"
                className={input}
              />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.3em] uppercase text-stone-500">Time</label>
              <input
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 2pm"
                className={input}
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] tracking-[0.3em] uppercase text-stone-500">
              Are you pre-approved?
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["Yes", "No", "Not sure"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPreApproved(p)}
                  className={`px-3.5 py-2 text-[11px] tracking-[0.25em] uppercase border transition-colors ${preApproved === p
                    ? "bg-stone-900 text-stone-50 border-stone-900"
                    : "bg-white border-stone-300 text-stone-700 hover:border-stone-900"
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <p className="text-[11px] text-stone-500 font-light italic">
        About: {listing.address} · {listing.price}
      </p>

      {notice && (
        <p className="text-xs text-stone-700 bg-stone-100 border border-stone-200 px-3 py-2">
          {notice}
        </p>
      )}

      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-2 text-[11px] tracking-[0.3em] uppercase bg-stone-900 text-stone-50 hover:bg-stone-800 transition-colors px-5 py-3.5"
      >
        {mode === "ask" ? "Send Inquiry" : "Request Showing"}
      </button>
    </form>
  );
}

/* ---------- Saved Drawer ---------- */

function SavedSticky({ count, onOpen }: { count: number; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="sm:hidden fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 bg-stone-900 text-stone-50 px-4 py-3 rounded-full shadow-xl shadow-stone-900/20"
    >
      <Heart className="h-4 w-4" strokeWidth={1.5} />
      <span className="text-[11px] tracking-[0.25em] uppercase">Saved</span>
      <span className="text-xs">{count}</span>
    </button>
  );
}

function SavedDrawer({
  listings,
  onClose,
  onOpenDetail,
  toggleSave,
}: {
  listings: Listing[];
  onClose: () => void;
  onOpenDetail: (l: Listing) => void;
  toggleSave: (id: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-[55]">
      <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[440px] bg-[#faf7f2] shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-stone-500">Saved Homes</p>
            <p className="font-serif text-2xl text-stone-900 mt-1">{listings.length} saved</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-stone-500 hover:text-stone-900">
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="p-6">
          {listings.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-6 w-6 mx-auto text-stone-300" strokeWidth={1.5} />
              <p className="font-serif text-2xl text-stone-800 mt-4">No saved homes yet.</p>
              <p className="mt-3 text-sm text-stone-500 font-light">
                Tap the heart on any home to start a private list.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {listings.map((l) => (
                <li key={l.id} className="flex gap-4 bg-white border border-stone-200 p-3">
                  <button onClick={() => onOpenDetail(l)} className="shrink-0">
                    <img src={l.image} alt={l.address} className="w-24 h-24 object-cover" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-xl text-stone-900">{l.price}</p>
                    <p className="text-xs text-stone-600 font-light truncate">{l.address}</p>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-stone-500 mt-0.5">
                      {l.neighborhood}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => onOpenDetail(l)}
                        className="text-[10px] tracking-[0.25em] uppercase text-stone-900 border-b border-stone-900 pb-0.5"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => toggleSave(l.id)}
                        className="ml-auto text-[10px] tracking-[0.25em] uppercase text-stone-500 hover:text-stone-900"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Can't find CTA ---------- */

function CantFindCTA() {
  return (
    <section className="mt-24 lg:mt-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <div className="bg-[#14110e] text-stone-100 p-10 sm:p-14 text-center">
          <p className="text-[11px] tracking-[0.35em] uppercase text-stone-400 mb-4">
            Personalized search
          </p>
          <h3 className="font-serif text-3xl sm:text-4xl leading-[1.1]">
            Can't find the right home yet?
          </h3>
          <p className="mt-5 max-w-xl mx-auto text-stone-300 font-light leading-relaxed">
            Tell {REALTOR_FIRST_NAME} what you're looking for, and she'll follow up with homes that fit.
          </p>
          <Link
            to="/buyer"
            className="mt-8 inline-flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase bg-stone-50 text-stone-900 hover:bg-white transition-colors px-7 py-4"
          >
            Share My Search
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */

function Footer() {
  return (
    <footer className="bg-[#14110e] text-stone-300 mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          <div>
            <p className="font-serif text-2xl text-white">{REALTOR_PROFILE.name}</p>
            <p className="mt-2 text-xs tracking-[0.25em] uppercase text-stone-400">
              {REALTOR_PROFILE.title} in {REALTOR_PROFILE.location}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a href={REALTOR_PROFILE.socialLinks.linkedin} aria-label="LinkedIn" className="text-stone-400 hover:text-white transition-colors">
                <Linkedin className="h-4 w-4" strokeWidth={1.5} />
              </a>
              <a href={REALTOR_PROFILE.socialLinks.instagram} aria-label="Instagram" className="text-stone-400 hover:text-white transition-colors">
                <Instagram className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div className="text-sm font-light space-y-2">
            <p className="text-[10px] tracking-[0.3em] uppercase text-stone-500 mb-3">Contact</p>
            <a href={`tel:${REALTOR_PROFILE.phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="h-3.5 w-3.5" strokeWidth={1.5} /> {REALTOR_PROFILE.phone}
            </a>
            <a href={`mailto:${REALTOR_PROFILE.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="h-3.5 w-3.5" strokeWidth={1.5} /> {REALTOR_PROFILE.email}
            </a>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-stone-500 mb-3">Quick Links</p>
            <ul className="space-y-2 text-sm font-light">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/start-here" className="hover:text-white transition-colors">Start Here</Link></li>
              <li><Link to="/testimonials" className="hover:text-white transition-colors">Testimonials</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-[11px] text-stone-500 font-light">
          <p>Demo listings shown for design purposes only. Not live MLS/IDX data.</p>
          <p>© {new Date().getFullYear()} {REALTOR_PROFILE.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
