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
import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";
import listing4 from "@/assets/listing-4.jpg";

export const Route = createFileRoute("/listings")({
  head: () => ({
    meta: [
      { title: "Listings | Alexandra Carter" },
      {
        name: "description",
        content:
          "Browse Atlanta-area homes, explore by community, and save favorites — a guided property discovery experience with Alexandra Carter.",
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

// Atlanta metro county shapes — polygons approximating the real metro layout
// on a 100x100 viewBox (north up). Shapes are stylized but geographically grounded.
type CountyShape = {
  name: string;
  points: string;
  label: [number, number];
  labelAnchor?: "start" | "middle" | "end";
  neighborhoods: Array<{ name: string; x: number; y: number }>;
};

const COUNTY_SHAPES: CountyShape[] = [
  {
    name: "Gilmer",
    points: "33,2 71,2 73,17 51,19 33,17",
    label: [52, 10],
    neighborhoods: [{ name: "Ellijay", x: 52, y: 11 }],
  },
  {
    name: "Pickens",
    points: "33,17 51,19 54,33 33,33",
    label: [43, 26],
    neighborhoods: [{ name: "Jasper", x: 43, y: 26 }],
  },
  {
    name: "Bartow",
    points: "0,22 33,17 33,33 30,48 6,49 0,40",
    label: [15, 35],
    neighborhoods: [
      { name: "Cartersville", x: 14, y: 37 },
      { name: "Adairsville", x: 10, y: 27 },
    ],
  },
  {
    name: "Cherokee",
    points: "33,33 54,33 56,48 30,48",
    label: [43, 41],
    neighborhoods: [
      { name: "Canton", x: 42, y: 38 },
      { name: "Woodstock", x: 48, y: 45 },
      { name: "Holly Springs", x: 44, y: 42 },
    ],
  },
  {
    name: "Forsyth",
    points: "54,33 73,32 76,49 56,49 56,48",
    label: [64, 41],
    neighborhoods: [
      { name: "Cumming", x: 64, y: 42 },
      { name: "Vickery", x: 67, y: 46 },
    ],
  },
  {
    name: "Hall",
    points: "73,32 100,27 100,52 78,55 76,49",
    label: [87, 42],
    neighborhoods: [
      { name: "Gainesville", x: 86, y: 44 },
      { name: "Flowery Branch", x: 81, y: 49 },
    ],
  },
  {
    name: "Paulding",
    points: "6,49 30,48 32,62 8,62",
    label: [18, 56],
    neighborhoods: [
      { name: "Dallas", x: 18, y: 56 },
      { name: "Hiram", x: 22, y: 60 },
    ],
  },
  {
    name: "Cobb",
    points: "30,48 56,48 56,49 54,60 52,62 32,62",
    label: [40, 56],
    neighborhoods: [
      { name: "Acworth", x: 36, y: 51 },
      { name: "Kennesaw", x: 38, y: 54 },
      { name: "Marietta", x: 42, y: 57 },
      { name: "Smyrna", x: 46, y: 61 },
      { name: "Powder Springs", x: 35, y: 60 },
    ],
  },
  {
    name: "Fulton",
    // North Fulton arm + central + south arm, drawn as one bowtie-style polygon
    points:
      "56,49 65,49 64,58 56,66 56,72 55,80 38,82 31,72 31,62 39,62 47,62 52,62 54,60 56,49",
    label: [46, 72],
    neighborhoods: [
      { name: "Alpharetta", x: 60, y: 51 },
      { name: "Roswell", x: 59, y: 55 },
      { name: "Sandy Springs", x: 56, y: 60 },
      { name: "Buckhead", x: 50, y: 64 },
      { name: "Midtown", x: 47, y: 67 },
      { name: "Atlanta", x: 46, y: 70 },
      { name: "East Point", x: 43, y: 76 },
    ],
  },
  {
    name: "Gwinnett",
    points: "65,49 95,51 96,66 80,68 65,65 64,58",
    label: [79, 58],
    neighborhoods: [
      { name: "Buford", x: 84, y: 53 },
      { name: "Suwanee", x: 76, y: 56 },
      { name: "Lawrenceville", x: 84, y: 60 },
      { name: "Duluth", x: 72, y: 60 },
      { name: "Peachtree Corners", x: 68, y: 62 },
      { name: "Norcross", x: 70, y: 65 },
    ],
  },
  {
    name: "Walton",
    points: "80,68 96,66 100,82 82,82",
    label: [89, 75],
    neighborhoods: [
      { name: "Monroe", x: 90, y: 74 },
      { name: "Loganville", x: 84, y: 73 },
    ],
  },
  {
    name: "DeKalb",
    points: "56,66 65,65 80,68 78,82 65,80 56,72",
    label: [68, 73],
    neighborhoods: [
      { name: "Dunwoody", x: 60, y: 67 },
      { name: "Brookhaven", x: 60, y: 70 },
      { name: "Chamblee", x: 64, y: 69 },
      { name: "Tucker", x: 72, y: 71 },
      { name: "Decatur", x: 62, y: 75 },
      { name: "Stone Mountain", x: 74, y: 76 },
    ],
  },
  {
    name: "Rockdale",
    points: "78,82 92,80 92,90 80,90",
    label: [85, 85],
    neighborhoods: [{ name: "Conyers", x: 85, y: 85 }],
  },
  {
    name: "Douglas",
    points: "8,62 31,62 31,72 31,77 8,76",
    label: [19, 69],
    neighborhoods: [
      { name: "Douglasville", x: 19, y: 69 },
      { name: "Lithia Springs", x: 25, y: 66 },
    ],
  },
  {
    name: "Clayton",
    points: "38,82 55,80 56,90 42,92",
    label: [47, 86],
    neighborhoods: [
      { name: "College Park", x: 41, y: 83 },
      { name: "Forest Park", x: 49, y: 85 },
      { name: "Riverdale", x: 45, y: 88 },
      { name: "Jonesboro", x: 51, y: 89 },
    ],
  },
  {
    name: "Henry",
    points: "55,80 78,82 80,90 80,99 60,99 56,90",
    label: [68, 90],
    neighborhoods: [
      { name: "Stockbridge", x: 62, y: 85 },
      { name: "McDonough", x: 70, y: 92 },
      { name: "Hampton", x: 64, y: 96 },
    ],
  },
  {
    name: "Fayette",
    points: "31,77 38,82 42,92 42,99 22,99 22,87",
    label: [33, 91],
    neighborhoods: [
      { name: "Tyrone", x: 28, y: 87 },
      { name: "Fayetteville", x: 36, y: 91 },
      { name: "Peachtree City", x: 30, y: 95 },
    ],
  },
];

// Lake Lanier — sprawling reservoir at the Hall/Forsyth border
const LAKE_LANIER_PATH =
  "M 80 32 Q 86 33 88 36 Q 90 40 86 42 Q 88 44 85 46 Q 82 45 80 43 Q 76 44 75 41 Q 74 38 77 36 Q 79 34 80 32 Z";

// Chattahoochee River — exits Lake Lanier and flows SW along the Cobb/Fulton border
const RIVER_PATH =
  "M 80 43 Q 72 47 66 52 Q 60 56 56 60 Q 52 64 48 66 Q 38 72 26 82 Q 16 90 6 96";

// Stylized I-285 perimeter ring around central Atlanta (in Fulton/DeKalb).
const PERIMETER = { cx: 50, cy: 70, rx: 12, ry: 9 };

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
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("ac_saved_listings", JSON.stringify(savedIds));
    } catch {}
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
              className={`relative px-3 sm:px-5 py-3 text-[11px] tracking-[0.3em] uppercase transition-colors ${
                active ? "text-stone-900" : "text-stone-500 hover:text-stone-800"
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
      className={`group relative bg-white border border-stone-200/70 overflow-hidden cursor-pointer transition-all duration-500 ease-out ${
        expanded ? "shadow-2xl shadow-stone-900/10 -translate-y-1" : "shadow-sm"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <img
          src={listing.image}
          alt={listing.address}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            expanded ? "scale-105" : "scale-100"
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
            className={`h-4 w-4 transition-colors ${
              saved ? "text-stone-900 fill-stone-900" : "text-stone-700"
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
          className={`grid transition-all duration-500 ease-out ${
            expanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"
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

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12 items-start">
          {/* Stylized Atlanta metro map */}
          <div className="relative bg-[#f7f4ed] border border-stone-300/70 aspect-[5/4] overflow-hidden shadow-[0_24px_80px_rgba(28,25,23,0.08)]">
            {/* Quiet map paper texture */}
            <div
              className="absolute inset-0 opacity-[0.045] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(#1c1917 1px, transparent 1px), linear-gradient(90deg, #1c1917 1px, transparent 1px)",
                backgroundSize: "7.5% 7.5%",
              }}
            />

            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter id="countyShadow" x="-18%" y="-18%" width="136%" height="136%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="0.9" />
                  <feOffset dx="0" dy="0.8" result="offset" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.32" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Counties */}
              {COUNTY_SHAPES.map((c) => {
                const primary = PRIMARY_COUNTIES.has(c.name);
                const active = selectedCounty === c.name;
                const fill = active
                  ? "#6f1d20"
                  : primary
                    ? "#3f3c37"
                    : "#57534c";
                const hoverFill = active ? fill : primary ? "#5b5146" : "#6b6258";
                return (
                  <polygon
                    key={c.name}
                    points={c.points}
                    fill={fill}
                    stroke="#f7f4ed"
                    strokeWidth={active ? "0.8" : "0.45"}
                    strokeLinejoin="round"
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${c.name} County`}
                    className="transition-all duration-300 cursor-pointer outline-none"
                    style={{ filter: active ? "url(#countyShadow)" : undefined }}
                    onClick={() => handleSelect(c.name)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelect(c.name);
                      }
                    }}
                    onMouseEnter={(e) => {
                      if (!active) (e.currentTarget as SVGPolygonElement).setAttribute("fill", hoverFill);
                    }}
                    onMouseLeave={(e) => {
                      if (!active) (e.currentTarget as SVGPolygonElement).setAttribute("fill", fill);
                    }}
                  />
                );
              })}

              {/* Chattahoochee River */}
              <path
                d={RIVER_PATH}
                stroke="#8ee5e7"
                strokeWidth="0.7"
                strokeLinecap="round"
                fill="none"
                opacity="0.88"
                pointerEvents="none"
              />

              {/* I-285 Perimeter ring (only visible subtly) */}
              <ellipse
                cx={PERIMETER.cx}
                cy={PERIMETER.cy}
                rx={PERIMETER.rx}
                ry={PERIMETER.ry}
                fill="none"
                stroke="#171412"
                strokeWidth="0.22"
                strokeDasharray="0.9 0.9"
                opacity="0.58"
                pointerEvents="none"
              />

              {/* Interstate hints crossing the metro */}
              <path
                d="M 30 5 C 32 24 39 45 48 62 C 56 76 64 88 74 98"
                stroke="#171412"
                strokeWidth="0.35"
                opacity="0.65"
                fill="none"
                pointerEvents="none"
              />
              <path
                d="M 92 23 C 73 35 60 48 49 62 C 36 76 24 88 13 99"
                stroke="#171412"
                strokeWidth="0.28"
                opacity="0.55"
                fill="none"
                pointerEvents="none"
              />
              <path
                d="M 2 66 C 27 60 48 60 66 66 C 77 70 88 72 98 73"
                stroke="#171412"
                strokeWidth="0.28"
                opacity="0.5"
                fill="none"
                pointerEvents="none"
              />

              {/* County labels */}
              {COUNTY_SHAPES.map((c) => {
                const active = selectedCounty === c.name;
                if (active) return null; // hidden when active to make room for neighborhoods
                return (
                  <text
                    key={`lbl-${c.name}`}
                    x={c.label[0]}
                    y={c.label[1]}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="pointer-events-none select-none"
                    style={{
                      fontSize: "2.55px",
                      letterSpacing: "0.45px",
                      fontFamily: "Inter, system-ui, sans-serif",
                      textTransform: "uppercase",
                      fontWeight: 650,
                      fill: "#f9f6ef",
                    }}
                  >
                    {c.name}
                  </text>
                );
              })}

              {/* Atlanta city marker */}
              {!selectedCounty && (
                <g pointerEvents="none">
                  <circle cx="46" cy="63" r="1.05" fill="#f9f6ef" />
                  <circle cx="46" cy="63" r="2.1" fill="none" stroke="#f9f6ef" strokeWidth="0.25" opacity="0.8" />
                  <text
                    x="46"
                    y="67.4"
                    textAnchor="middle"
                    style={{
                      fontSize: "2.2px",
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontStyle: "italic",
                      fill: "#f9f6ef",
                    }}
                  >
                    Atlanta
                  </text>
                </g>
              )}

              {/* Selected county: show neighborhoods inside */}
              {selectedCounty &&
                (() => {
                  const c = COUNTY_SHAPES.find((x) => x.name === selectedCounty);
                  if (!c) return null;
                  return (
                    <g>
                      {/* Selected county label */}
                      <text
                        x={c.label[0]}
                        y={c.label[1] - 3.5}
                        textAnchor="middle"
                        style={{
                          fontSize: "2.15px",
                          letterSpacing: "0.6px",
                          fontFamily: "Inter, system-ui, sans-serif",
                          textTransform: "uppercase",
                          fill: "#f9f6ef",
                          opacity: 0.75,
                        }}
                        pointerEvents="none"
                      >
                        {c.name} County
                      </text>
                      {c.neighborhoods.map((n) => (
                        <g
                          key={n.name}
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectNeighborhood(n.name);
                          }}
                        >
                          <circle cx={n.x} cy={n.y} r="0.75" fill="#f9f6ef" />
                          <circle cx={n.x} cy={n.y} r="1.55" fill="none" stroke="#f9f6ef" strokeWidth="0.18" opacity="0.6" />
                          <text
                            x={n.x}
                            y={n.y + 2.6}
                            textAnchor="middle"
                            style={{
                              fontSize: "1.75px",
                              fontFamily: "Inter, system-ui, sans-serif",
                              fill: "#f9f6ef",
                              fontWeight: 500,
                            }}
                          >
                            {n.name}
                          </text>
                        </g>
                      ))}
                    </g>
                  );
                })()}

              {/* Compass */}
              <g pointerEvents="none" opacity="0.55">
                <text x="95" y="6" textAnchor="middle" style={{ fontSize: "2.4px", fontFamily: "'Cormorant Garamond', serif", fill: "#1c1917" }}>N</text>
                <line x1="95" y1="7.5" x2="95" y2="11" stroke="#1c1917" strokeWidth="0.22" />
              </g>
            </svg>

            <div className="absolute bottom-3 left-4 text-[10px] tracking-[0.3em] uppercase text-stone-600/80">
              Atlanta Metro - Counties
            </div>
            <div className="absolute bottom-3 right-4 flex items-center gap-3 text-[9px] tracking-[0.2em] uppercase text-stone-600/70">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 bg-[#3f3c37] border border-[#f7f4ed]" />
                Primary
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 bg-[#57534c] border border-[#f7f4ed]" />
                Browse
              </span>
            </div>
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
                  className={`px-4 py-3.5 text-sm border transition-colors text-left ${
                    active
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
              className={`px-4 py-2.5 text-[11px] tracking-[0.25em] uppercase border transition-colors ${
                active
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
                  className={`h-1.5 rounded-full transition-all ${
                    i === imgIdx ? "w-6 bg-white" : "w-1.5 bg-white/60"
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
                      className={`w-full inline-flex items-center justify-center gap-2 text-[11px] tracking-[0.3em] uppercase border transition-colors px-5 py-3 mb-3 ${
                        saved
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
                      Alexandra typically responds within a few hours.
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
          Alexandra will follow up about <span className="italic">{listing.address}</span> shortly.
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
              className={`px-3.5 py-2 text-[11px] tracking-[0.25em] uppercase border transition-colors ${
                preferred === p
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
                  className={`px-3.5 py-2 text-[11px] tracking-[0.25em] uppercase border transition-colors ${
                    preApproved === p
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
            Tell Alexandra what you're looking for, and she'll follow up with homes that fit.
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
            <p className="font-serif text-2xl text-white">Alexandra Carter</p>
            <p className="mt-2 text-xs tracking-[0.25em] uppercase text-stone-400">
              Real Estate Agent · Atlanta, Georgia
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a href="#" aria-label="LinkedIn" className="text-stone-400 hover:text-white transition-colors">
                <Linkedin className="h-4 w-4" strokeWidth={1.5} />
              </a>
              <a href="#" aria-label="Instagram" className="text-stone-400 hover:text-white transition-colors">
                <Instagram className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div className="text-sm font-light space-y-2">
            <p className="text-[10px] tracking-[0.3em] uppercase text-stone-500 mb-3">Contact</p>
            <a href="tel:+14045550123" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="h-3.5 w-3.5" strokeWidth={1.5} /> (404) 555-0123
            </a>
            <a href="mailto:hello@alexandracarter.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="h-3.5 w-3.5" strokeWidth={1.5} /> hello@alexandracarter.com
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
          <p>© {new Date().getFullYear()} Alexandra Carter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
