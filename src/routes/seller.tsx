import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState, type ReactNode } from "react";
import {
  Linkedin,
  Instagram,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  Check,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import { Header } from "@/components/Header";
import sellerHero from "@/assets/seller-hero.jpg";

export const Route = createFileRoute("/seller")({
  head: () => ({
    meta: [
      { title: "Selling a Home | Alexandra Carter" },
      {
        name: "description",
        content:
          "Share a few details about your Atlanta home and get a preliminary selling range. Alexandra Carter follows up with a personalized value review.",
      },
    ],
  }),
  component: SellerPage,
});

/* ---------- Areas ---------- */

type AreaGroup = { label: string; options: string[] };

const AREA_GROUPS: AreaGroup[] = [
  {
    label: "Core Atlanta / Intown",
    options: [
      "Atlanta",
      "Buckhead",
      "Midtown",
      "Brookhaven",
      "Decatur",
      "East Point",
      "College Park",
      "Hapeville",
    ],
  },
  {
    label: "Cobb County Area",
    options: ["Marietta", "Smyrna", "Kennesaw"],
  },
  {
    label: "Gwinnett County Area",
    options: ["Duluth", "Norcross", "Lawrenceville", "Suwanee"],
  },
  {
    label: "DeKalb County Area",
    options: ["Chamblee", "Doraville", "Dunwoody", "Tucker", "Stone Mountain"],
  },
  {
    label: "North Metro",
    options: ["Sandy Springs", "Alpharetta", "Roswell", "Johns Creek", "Milton"],
  },
  {
    label: "South Metro",
    options: [
      "Riverdale",
      "Jonesboro",
      "Union City",
      "Fairburn",
      "McDonough",
      "Stockbridge",
    ],
  },
  {
    label: "Outer Metro Atlanta",
    options: [
      "Woodstock",
      "Canton",
      "Douglasville",
      "Peachtree City",
      "Newnan",
      "Conyers",
      "Cumming",
      "Dallas",
    ],
  },
];

/* ---------- Demo calibration (placeholder — replace later) ---------- */

// Base price per square foot by area. Demo only.
const AREA_PPSF: Record<string, number> = {
  Buckhead: 520,
  Midtown: 480,
  Atlanta: 380,
  Brookhaven: 450,
  Decatur: 430,
  "Sandy Springs": 400,
  Alpharetta: 380,
  Roswell: 360,
  "Johns Creek": 360,
  Milton: 400,
  Dunwoody: 380,
  Chamblee: 360,
  Doraville: 320,
  Tucker: 300,
  "Stone Mountain": 240,
  Marietta: 310,
  Smyrna: 340,
  Kennesaw: 280,
  Duluth: 280,
  Norcross: 260,
  Lawrenceville: 260,
  Suwanee: 320,
  "East Point": 280,
  "College Park": 270,
  Hapeville: 280,
  Riverdale: 200,
  Jonesboro: 210,
  "Union City": 210,
  Fairburn: 230,
  McDonough: 220,
  Stockbridge: 220,
  Woodstock: 290,
  Canton: 250,
  Douglasville: 220,
  "Peachtree City": 290,
  Newnan: 230,
  Conyers: 210,
  Cumming: 290,
  Dallas: 210,
};
const DEFAULT_PPSF = 280;

const TYPE_FACTOR: Record<string, number> = {
  "Single-family home": 1.0,
  Condo: 0.9,
  Townhouse: 0.95,
};

const CONDITION_FACTOR: Record<string, number> = {
  "Needs major work": 0.78,
  "Needs some updates": 0.9,
  "Average condition": 1.0,
  "Well maintained": 1.06,
  "Recently renovated": 1.14,
};

const UPDATE_BONUS: Record<string, number> = {
  "Kitchen updated": 0.03,
  "Bathrooms updated": 0.025,
  "Roof updated": 0.015,
  "HVAC updated": 0.012,
  "Flooring updated": 0.012,
  "Finished basement": 0.025,
  "Exterior / curb appeal updates": 0.015,
};

const ISSUE_PENALTY: Record<string, number> = {
  "Older roof": -0.015,
  "Older HVAC": -0.012,
  "Foundation concerns": -0.06,
  "Outdated kitchen": -0.03,
  "Outdated bathrooms": -0.025,
  "Curb appeal needs work": -0.015,
  "Small lot": -0.01,
  "Layout concerns": -0.02,
  "Location drawback": -0.025,
};

/* ---------- Constants ---------- */

const PROPERTY_TYPES = [
  "Single-family home",
  "Condo",
  "Townhouse",
  "Multi-family",
  "Land",
  "Other",
];
const COMPLEX_TYPES = new Set(["Multi-family", "Land", "Other"]);

const BED_OPTIONS = ["1", "2", "3", "4", "5+"];
const BATH_OPTIONS = ["1", "2", "3", "4+"];

const CONDITION_OPTIONS = [
  "Needs major work",
  "Needs some updates",
  "Average condition",
  "Well maintained",
  "Recently renovated",
];

const UPDATE_OPTIONS = [
  "Kitchen updated",
  "Bathrooms updated",
  "Roof updated",
  "HVAC updated",
  "Flooring updated",
  "Finished basement",
  "Exterior / curb appeal updates",
  "No major updates",
  "Not sure",
];

const ISSUE_OPTIONS = [
  "Older roof",
  "Older HVAC",
  "Foundation concerns",
  "Outdated kitchen",
  "Outdated bathrooms",
  "Curb appeal needs work",
  "Small lot",
  "Layout concerns",
  "Location drawback",
  "Not sure",
];

const TIMELINE_OPTIONS = ["ASAP", "1–3 months", "3–6 months", "6+ months", "Just curious"];

const REASON_OPTIONS = [
  "Upsizing",
  "Downsizing",
  "Relocating",
  "Investment sale",
  "Inherited property",
  "Financial reasons",
  "Testing the market",
  "Other",
];

const OCCUPANCY_OPTIONS = ["Owner-occupied", "Vacant", "Tenant-occupied", "Not sure / other"];
const FOLLOWUP_OPTIONS = ["Call", "Text", "Email"];
const AGENT_OPTIONS = ["No", "Yes", "Not sure"];

/* ---------- State ---------- */

type SellerState = {
  area: string;
  address: string;
  propertyType: string;
  beds: string;
  baths: string;
  sqft: string;
  condition: string;
  updates: string[];
  issues: string[];
  notes: string;
  timeline: string;
  reasons: string[];
  occupancy: string;
  name: string;
  phone: string;
  email: string;
  followUp: string;
  workingWithAgent: string;
  hopedPrice: string;
  photoCount: number;
};

const INITIAL: SellerState = {
  area: "",
  address: "",
  propertyType: "",
  beds: "",
  baths: "",
  sqft: "",
  condition: "",
  updates: [],
  issues: [],
  notes: "",
  timeline: "",
  reasons: [],
  occupancy: "",
  name: "",
  phone: "",
  email: "",
  followUp: "",
  workingWithAgent: "",
  hopedPrice: "",
  photoCount: 0,
};

const TOTAL_STEPS = 5;

/* ---------- Page ---------- */

function SellerPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Header />
      <main>
        <SellerHero />
        <WhatHappensNext />
        <SellerWizard />
        <SellerReassurance />
      </main>
      <Footer />
    </div>
  );
}

function SellerHero() {
  const scrollToWizard = () => {
    document.getElementById("seller-wizard")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[82svh] min-h-[600px] w-full overflow-hidden">
      <img
        src={sellerHero}
        alt=""
        className="h-full w-full object-cover"
        width={1920}
        height={1280}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/20 to-[#faf7f2]/90" />
      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-20 sm:pb-28 text-center px-6">
        <p className="text-[11px] tracking-[0.4em] uppercase text-stone-700 mb-6">
          For Sellers
        </p>
        <h1 className="font-serif text-stone-900 text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] leading-[1.05] font-light max-w-3xl">
          Get a clearer first look at your home's selling range.
        </h1>
        <p className="mt-8 max-w-xl text-stone-700 font-light text-base sm:text-lg leading-relaxed">
          Share a few details about your home, and I'll follow up with a
          personalized value review.
        </p>
        <button
          type="button"
          onClick={scrollToWizard}
          className="mt-10 inline-flex items-center gap-3 min-h-12 text-[11px] tracking-[0.3em] uppercase text-[#faf7f2] bg-stone-900 px-8 py-4 hover:bg-stone-800 transition-colors"
        >
          Start Value Review
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
}

/* ---------- What Happens Next ---------- */

function WhatHappensNext() {
  const steps = [
    { n: "01", title: "Share a few details", body: "About your home, timeline, and what's on your mind." },
    { n: "02", title: "Get a preliminary range", body: "Or a note that the home deserves a closer personal review." },
    { n: "03", title: "Alexandra follows up", body: "With clear next steps and a more accurate review." },
  ];
  return (
    <section className="bg-[#faf7f2] py-16 lg:py-20 border-b border-stone-200/60">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <p className="text-[11px] tracking-[0.35em] uppercase text-stone-500 mb-4 text-center">
          What happens next
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((s) => (
            <div key={s.n} className="text-center md:text-left">
              <p className="font-serif text-stone-400 text-xl">{s.n}</p>
              <p className="mt-3 font-serif text-xl text-stone-900">{s.title}</p>
              <p className="mt-2 text-sm text-stone-600 font-light leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Wizard ---------- */

type ResultType = "range" | "personal";
type ResultData = {
  type: ResultType;
  low?: number;
  high?: number;
  helpfulSignals: string[];
  worthReviewing: string[];
};

function computeResult(state: SellerState): ResultData {
  const helpfulSignals: string[] = [];
  const worthReviewing: string[] = [];

  if (state.condition === "Well maintained" || state.condition === "Recently renovated") {
    helpfulSignals.push(state.condition);
  }
  if (state.condition === "Needs major work" || state.condition === "Needs some updates") {
    worthReviewing.push(state.condition);
  }
  state.updates.forEach((u) => {
    if (UPDATE_BONUS[u]) helpfulSignals.push(u);
  });
  state.issues.forEach((i) => {
    if (ISSUE_PENALTY[i]) worthReviewing.push(i);
  });
  if (state.timeline && state.timeline !== "Just curious") {
    helpfulSignals.push(`${state.timeline} timeline`);
  }

  // Personal review triggers
  if (COMPLEX_TYPES.has(state.propertyType)) {
    return { type: "personal", helpfulSignals, worthReviewing };
  }
  if (state.issues.includes("Foundation concerns")) {
    return { type: "personal", helpfulSignals, worthReviewing };
  }

  const sqftNum = parseInt(state.sqft.replace(/[^0-9]/g, ""), 10);
  if (!sqftNum || sqftNum < 300) {
    return { type: "personal", helpfulSignals, worthReviewing };
  }

  const ppsf = AREA_PPSF[state.area] ?? DEFAULT_PPSF;
  const typeF = TYPE_FACTOR[state.propertyType] ?? 1;
  const condF = CONDITION_FACTOR[state.condition] ?? 1;

  let bonus = 0;
  state.updates.forEach((u) => (bonus += UPDATE_BONUS[u] ?? 0));
  state.issues.forEach((i) => (bonus += ISSUE_PENALTY[i] ?? 0));

  const base = sqftNum * ppsf * typeF * condF * (1 + bonus);
  const low = Math.round((base * 0.92) / 5000) * 5000;
  const high = Math.round((base * 1.08) / 5000) * 5000;

  // Check hoped-for price
  const hoped = parseInt(state.hopedPrice.replace(/[^0-9]/g, ""), 10);
  if (hoped && hoped > 0) {
    const tolerance = 75_000;
    const outsideLow = hoped < low - tolerance;
    const outsideHigh = hoped > high + tolerance;
    if (outsideLow || outsideHigh) {
      return { type: "personal", helpfulSignals, worthReviewing };
    }
  }

  return { type: "range", low, high, helpfulSignals, worthReviewing };
}

function SellerWizard() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<SellerState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const wizardRef = useRef<HTMLDivElement | null>(null);
  const [result, setResult] = useState<ResultData | null>(null);

  const update = <K extends keyof SellerState>(k: K, v: SellerState[K]) => {
    setState((s) => ({ ...s, [k]: v }));
    if (notice) setNotice(null);
  };

  const toggleArr = (k: "updates" | "issues" | "reasons", value: string) => {
    setState((s) => {
      const arr = s[k];
      return {
        ...s,
        [k]: arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value],
      };
    });
    if (notice) setNotice(null);
  };

  const validateStep = (): string | null => {
    if (step === 1 && !state.area) return "Choose an area to continue.";
    if (step === 2) {
      if (!state.propertyType) return "Choose a property type to continue.";
      if (!state.beds) return "Choose a bedroom option to continue.";
      if (!state.baths) return "Choose a bathroom option to continue.";
      if (!state.sqft.trim()) return "Enter approximate square footage to continue.";
    }
    if (step === 3 && !state.condition) return "Choose a condition to continue.";
    if (step === 4 && !state.timeline) return "Choose a timeline to continue.";
    return null;
  };

  const handleContinue = () => {
    const msg = validateStep();
    if (msg) {
      setNotice(msg);
      return;
    }
    setNotice(null);
    setStep((s) => s + 1);
  };

  const handleSubmit = () => {
    if (!state.name.trim()) {
      setNotice("Please share your name to continue.");
      return;
    }
    if (!state.phone.trim() && !state.email.trim()) {
      setNotice("Please share a phone or email so Alexandra can follow up.");
      return;
    }
    const r = computeResult(state);
    // Structured lead summary (logged for replacement with real submit)
    const lead = {
      contact: {
        name: state.name,
        phone: state.phone || null,
        email: state.email || null,
        preferredFollowUp: state.followUp || null,
        workingWithAgent: state.workingWithAgent || null,
      },
      property: {
        area: state.area,
        address: state.address || null,
        type: state.propertyType,
        beds: state.beds,
        baths: state.baths,
        sqft: state.sqft,
      },
      condition: {
        rating: state.condition,
        updates: state.updates,
        issues: state.issues,
        notes: state.notes || null,
      },
      situation: {
        timeline: state.timeline,
        reasons: state.reasons,
        occupancy: state.occupancy || null,
      },
      hopedPrice: state.hopedPrice || null,
      photoCount: state.photoCount,
      result:
        r.type === "range"
          ? { type: "preliminary_range", low: r.low, high: r.high }
          : { type: "personal_review_needed" },
      helpfulSignals: r.helpfulSignals,
      worthReviewing: r.worthReviewing,
    };
    // eslint-disable-next-line no-console
    console.log("[seller-lead]", lead);
    setNotice(null);
    setResult(r);
    setSubmitted(true);
    setTimeout(() => {
      wizardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleEdit = () => {
    setSubmitted(false);
    setResult(null);
  };

  return (
    <section
      id="seller-wizard"
      className="bg-stone-50 py-20 lg:py-28 border-t border-stone-200/70 scroll-mt-24"
    >
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <div className="text-center mb-10 lg:mb-14">
          <p className="text-[11px] tracking-[0.35em] uppercase text-stone-500 mb-5">
            Value Review
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 leading-[1.1]">
            Tell me about your home
          </h2>
          <p className="mt-5 text-stone-500 text-sm font-light">
            Takes about 3 minutes.
          </p>
        </div>

        <div ref={wizardRef} className="min-h-[780px]">
          {submitted && result ? (
            <ResultCard result={result} onEdit={handleEdit} />
          ) : (
            <div className="bg-white border border-stone-200 shadow-sm">
              {/* Progress */}
              <div className="px-6 sm:px-10 pt-8">
                <div className="flex items-center justify-between text-[10px] tracking-[0.3em] uppercase text-stone-500">
                  <span>Step {step} of {TOTAL_STEPS}</span>
                  <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
                </div>
                <div className="mt-3 h-px bg-stone-200 relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-stone-900 transition-all duration-500"
                    style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                  />
                </div>
              </div>

              <div className="px-6 sm:px-10 py-10 sm:py-12">
                {step === 1 && <Step1Location state={state} update={update} />}
                {step === 2 && <Step2Basics state={state} update={update} />}
                {step === 3 && (
                  <Step3Condition state={state} update={update} toggle={toggleArr} />
                )}
                {step === 4 && (
                  <Step4Timeline state={state} update={update} toggle={toggleArr} />
                )}
                {step === 5 && <Step5Contact state={state} update={update} />}
              </div>

              {notice && (
                <div
                  role="status"
                  className="mx-6 sm:mx-10 mb-2 bg-stone-100 border-l-2 border-stone-400 px-4 py-3 text-sm font-light text-stone-700"
                >
                  {notice}
                </div>
              )}

              {step === TOTAL_STEPS && (
                <p className="px-6 sm:px-10 pb-4 text-xs text-stone-500 font-light italic">
                  This gives you a preliminary selling range, not an appraisal.
                </p>
              )}

              <div className="px-5 sm:px-10 pt-5 pb-6 sm:pb-7 border-t border-stone-100 flex items-center justify-between gap-4">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setNotice(null);
                      setStep((s) => s - 1);
                    }}
                    className="inline-flex items-center gap-2 min-h-11 px-3 text-[11px] tracking-[0.3em] uppercase text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Back
                  </button>
                ) : (
                  <span />
                )}

                {step < TOTAL_STEPS ? (
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="inline-flex items-center gap-2 min-h-12 text-[11px] tracking-[0.3em] uppercase text-[#faf7f2] bg-stone-900 px-6 sm:px-8 py-3.5 hover:bg-stone-800 transition-colors"
                  >
                    Continue <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-2 min-h-12 text-[11px] tracking-[0.3em] uppercase text-[#faf7f2] bg-stone-900 px-6 sm:px-8 py-3.5 hover:bg-stone-800 transition-colors"
                  >
                    Request Value Review
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <p className="mt-10 text-center text-sm text-stone-500 font-light leading-relaxed max-w-lg mx-auto">
          Prefer to talk it through? You can{" "}
          <a
            href="tel:+14045550123"
            className="text-stone-900 underline underline-offset-4 hover:text-stone-700"
          >
            call Alexandra directly
          </a>
          .
        </p>
      </div>
    </section>
  );
}

/* ---------- Result ---------- */

function formatPrice(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2).replace(/\.00$/, "")}M`;
  return `$${Math.round(n / 1000)}k`;
}

function ResultCard({ result, onEdit }: { result: ResultData; onEdit: () => void }) {
  if (result.type === "personal") {
    return (
      <div className="bg-white border border-stone-200 p-8 sm:p-12 shadow-sm">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 rounded-full bg-stone-900 text-white grid place-items-center">
            <Sparkles className="h-4 w-4" strokeWidth={1.5} />
          </div>
          <p className="mt-5 text-[10px] tracking-[0.35em] uppercase text-stone-500">
            Your home
          </p>
          <h3 className="mt-3 font-serif text-3xl sm:text-4xl text-stone-900 leading-[1.1]">
            Personal Review Needed
          </h3>
          <p className="mt-6 max-w-lg mx-auto text-stone-700 font-light text-base leading-relaxed">
            This home deserves a closer look before I estimate a range.
          </p>
          <p className="mt-3 max-w-lg mx-auto text-stone-500 font-light text-sm leading-relaxed">
            I'll review the details you shared and follow up with a more accurate
            next step.
          </p>
        </div>
        <div className="mt-10 flex flex-col items-center gap-4">
          <a
            href="tel:+14045550123"
            className="inline-flex items-center gap-2 min-h-12 text-[11px] tracking-[0.3em] uppercase text-[#faf7f2] bg-stone-900 px-8 py-4 hover:bg-stone-800 transition-colors"
          >
            Request Personal Review
          </a>
          <button
            type="button"
            onClick={onEdit}
            className="text-[11px] tracking-[0.25em] uppercase text-stone-500 hover:text-stone-900 transition-colors"
          >
            Edit Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-stone-200 p-8 sm:p-12 shadow-sm">
      <div className="text-center">
        <p className="text-[10px] tracking-[0.35em] uppercase text-stone-500">
          Preliminary Selling Range
        </p>
        <h3 className="mt-4 font-serif text-4xl sm:text-5xl text-stone-900 tracking-tight">
          {formatPrice(result.low!)} – {formatPrice(result.high!)}
        </h3>
        <p className="mt-5 max-w-md mx-auto text-xs text-stone-500 font-light italic leading-relaxed">
          This is a preliminary range based on what you shared, not an appraisal.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
        {result.helpfulSignals.length > 0 && (
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-stone-500 mb-4">
              Helpful signals
            </p>
            <div className="flex flex-wrap gap-2">
              {result.helpfulSignals.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-light border border-stone-300 bg-white text-stone-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
        {result.worthReviewing.length > 0 && (
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-stone-500 mb-4">
              Worth reviewing
            </p>
            <div className="flex flex-wrap gap-2">
              {result.worthReviewing.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-light border border-stone-300 bg-stone-50 text-stone-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 flex flex-col items-center gap-4">
        <Link
          to="/lets-connect"
          className="inline-flex items-center gap-2 min-h-12 text-[11px] tracking-[0.3em] uppercase text-[#faf7f2] bg-stone-900 px-8 py-4 hover:bg-stone-800 transition-colors"
        >
          Schedule My Value Review
        </Link>
        <button
          type="button"
          onClick={onEdit}
          className="text-[11px] tracking-[0.25em] uppercase text-stone-500 hover:text-stone-900 transition-colors"
        >
          Edit Details
        </button>
      </div>
    </div>
  );
}

/* ---------- Step pieces ---------- */

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] tracking-[0.3em] uppercase text-stone-500 mb-4">
      {children}
    </p>
  );
}

function StepHeading({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-8">
      <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 leading-[1.15]">
        {title}
      </h3>
      {sub && <p className="mt-3 text-stone-500 text-sm font-light">{sub}</p>}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center px-4 py-2.5 text-sm font-light border transition-all min-h-11
        ${
          active
            ? "border-stone-900 bg-stone-900 text-[#faf7f2]"
            : "border-stone-300 bg-white text-stone-700 hover:border-stone-900 hover:text-stone-900"
        }`}
    >
      {children}
    </button>
  );
}

const inputCls =
  "w-full bg-transparent border-b border-stone-300 focus:border-stone-900 outline-none py-2.5 text-sm font-light text-stone-900 placeholder:text-stone-400 transition-colors";

/* ---------- Step 1: Location ---------- */

function Step1Location({
  state,
  update,
}: {
  state: SellerState;
  update: <K extends keyof SellerState>(k: K, v: SellerState[K]) => void;
}) {
  const [query, setQuery] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const allOptions = useMemo(
    () => AREA_GROUPS.flatMap((g) => g.options),
    [],
  );

  const matches = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allOptions.filter((o) => o.toLowerCase().includes(q)).slice(0, 8);
  }, [query, allOptions]);

  return (
    <div>
      <StepHeading
        title="Where is the home located?"
        sub="Search or browse by area."
      />

      <div className="relative">
        <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" strokeWidth={1.5} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city, neighborhood, or ZIP"
          className={`${inputCls} pl-7`}
        />
        {matches.length > 0 && (
          <div className="mt-2 border border-stone-200 bg-white shadow-sm divide-y divide-stone-100">
            {matches.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  update("area", m);
                  setQuery("");
                }}
                className="block w-full text-left px-4 py-3 text-sm font-light text-stone-700 hover:bg-stone-50"
              >
                {m}
              </button>
            ))}
          </div>
        )}
      </div>

      {state.area && (
        <div className="mt-6 inline-flex items-center gap-3 bg-stone-900 text-[#faf7f2] px-4 py-2 text-sm">
          <Check className="h-3.5 w-3.5" strokeWidth={2} />
          <span>{state.area}</span>
          <button
            type="button"
            onClick={() => update("area", "")}
            className="text-[#faf7f2]/70 hover:text-white text-xs"
            aria-label="Clear selected area"
          >
            ×
          </button>
        </div>
      )}

      <div className="mt-10">
        <FieldLabel>Or browse by area</FieldLabel>
        <div className="border-t border-stone-200">
          {AREA_GROUPS.map((group) => {
            const open = !!openGroups[group.label];
            return (
              <div key={group.label} className="border-b border-stone-200">
                <button
                  type="button"
                  onClick={() => setOpenGroups((g) => ({ ...g, [group.label]: !open }))}
                  className="w-full flex items-center justify-between py-4 text-left min-h-12"
                >
                  <span className="text-[12px] tracking-[0.22em] uppercase text-stone-700">
                    {group.label}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-stone-500 transition-transform ${open ? "rotate-180" : ""}`}
                    strokeWidth={1.5}
                  />
                </button>
                {open && (
                  <div className="pb-5 flex flex-wrap gap-2">
                    {group.options.map((opt) => (
                      <Chip
                        key={opt}
                        active={state.area === opt}
                        onClick={() => update("area", opt)}
                      >
                        {opt}
                      </Chip>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-10">
        <FieldLabel>
          Street address <span className="text-stone-400 normal-case tracking-normal italic">— optional</span>
        </FieldLabel>
        <input
          type="text"
          value={state.address}
          onChange={(e) => update("address", e.target.value)}
          maxLength={200}
          placeholder="123 Magnolia Ln"
          className={inputCls}
        />
        <p className="mt-2 text-xs text-stone-400 font-light italic">
          Optional, but it helps me review your home more accurately.
        </p>
      </div>
    </div>
  );
}

/* ---------- Step 2: Property Basics ---------- */

function Step2Basics({
  state,
  update,
}: {
  state: SellerState;
  update: <K extends keyof SellerState>(k: K, v: SellerState[K]) => void;
}) {
  return (
    <div className="space-y-10">
      <div>
        <StepHeading title="A few property basics" />
        <FieldLabel>Property type</FieldLabel>
        <div className="flex flex-wrap gap-2.5">
          {PROPERTY_TYPES.map((t) => (
            <Chip
              key={t}
              active={state.propertyType === t}
              onClick={() => update("propertyType", t)}
            >
              {t}
            </Chip>
          ))}
        </div>
        {COMPLEX_TYPES.has(state.propertyType) && (
          <p className="mt-4 text-xs text-stone-500 font-light italic">
            This type of property usually needs a closer review, but you can still continue.
          </p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <FieldLabel>Bedrooms</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {BED_OPTIONS.map((opt) => (
              <Chip key={opt} active={state.beds === opt} onClick={() => update("beds", opt)}>
                {opt}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <FieldLabel>Bathrooms</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {BATH_OPTIONS.map((opt) => (
              <Chip key={opt} active={state.baths === opt} onClick={() => update("baths", opt)}>
                {opt}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div>
        <FieldLabel>Approx square footage</FieldLabel>
        <input
          type="text"
          inputMode="numeric"
          value={state.sqft}
          onChange={(e) => update("sqft", e.target.value.replace(/[^0-9,]/g, ""))}
          maxLength={8}
          placeholder="e.g. 2,400"
          className={inputCls}
        />
      </div>
    </div>
  );
}

/* ---------- Step 3: Condition + Updates ---------- */

function Step3Condition({
  state,
  update,
  toggle,
}: {
  state: SellerState;
  update: <K extends keyof SellerState>(k: K, v: SellerState[K]) => void;
  toggle: (k: "updates" | "issues" | "reasons", v: string) => void;
}) {
  return (
    <div className="space-y-10">
      <div>
        <StepHeading title="How would you describe the home?" />
        <FieldLabel>Overall condition</FieldLabel>
        <div className="flex flex-wrap gap-2.5">
          {CONDITION_OPTIONS.map((c) => (
            <Chip key={c} active={state.condition === c} onClick={() => update("condition", c)}>
              {c}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>Recent updates <span className="text-stone-400 normal-case tracking-normal italic">— optional</span></FieldLabel>
        <div className="flex flex-wrap gap-2.5">
          {UPDATE_OPTIONS.map((u) => (
            <Chip
              key={u}
              active={state.updates.includes(u)}
              onClick={() => toggle("updates", u)}
            >
              {u}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>
          Anything Alexandra should know before reviewing the value? <span className="text-stone-400 normal-case tracking-normal italic">— optional</span>
        </FieldLabel>
        <div className="flex flex-wrap gap-2.5">
          {ISSUE_OPTIONS.map((i) => (
            <Chip
              key={i}
              active={state.issues.includes(i)}
              onClick={() => toggle("issues", i)}
            >
              {i}
            </Chip>
          ))}
        </div>
        <div className="mt-6">
          <FieldLabel>
            Anything else? <span className="text-stone-400 normal-case tracking-normal italic">— optional</span>
          </FieldLabel>
          <input
            type="text"
            value={state.notes}
            onChange={(e) => update("notes", e.target.value)}
            maxLength={300}
            placeholder="A short note about the home"
            className={inputCls}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Step 4: Timeline + Reason ---------- */

function Step4Timeline({
  state,
  update,
  toggle,
}: {
  state: SellerState;
  update: <K extends keyof SellerState>(k: K, v: SellerState[K]) => void;
  toggle: (k: "updates" | "issues" | "reasons", v: string) => void;
}) {
  return (
    <div className="space-y-10">
      <div>
        <StepHeading title="When are you thinking about selling?" />
        <FieldLabel>Timeline</FieldLabel>
        <div className="flex flex-wrap gap-2.5">
          {TIMELINE_OPTIONS.map((t) => (
            <Chip key={t} active={state.timeline === t} onClick={() => update("timeline", t)}>
              {t}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>
          Reason for selling <span className="text-stone-400 normal-case tracking-normal italic">— optional</span>
        </FieldLabel>
        <div className="flex flex-wrap gap-2.5">
          {REASON_OPTIONS.map((r) => (
            <Chip
              key={r}
              active={state.reasons.includes(r)}
              onClick={() => toggle("reasons", r)}
            >
              {r}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>
          Occupancy <span className="text-stone-400 normal-case tracking-normal italic">— optional</span>
        </FieldLabel>
        <div className="flex flex-wrap gap-2.5">
          {OCCUPANCY_OPTIONS.map((o) => (
            <Chip
              key={o}
              active={state.occupancy === o}
              onClick={() => update("occupancy", o)}
            >
              {o}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Step 5: Contact + Review ---------- */

function Step5Contact({
  state,
  update,
}: {
  state: SellerState;
  update: <K extends keyof SellerState>(k: K, v: SellerState[K]) => void;
}) {
  return (
    <div className="space-y-10">
      <div>
        <p className="font-serif text-xl text-stone-900 mb-6">How should I follow up?</p>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <label className="text-[10px] tracking-[0.3em] uppercase text-stone-500">
              Name <span className="text-stone-900">*</span>
            </label>
            <input
              type="text"
              value={state.name}
              onChange={(e) => update("name", e.target.value)}
              maxLength={100}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.3em] uppercase text-stone-500">
              Phone <span className="normal-case tracking-normal italic text-stone-400">— optional</span>
            </label>
            <input
              type="tel"
              value={state.phone}
              onChange={(e) => update("phone", e.target.value)}
              maxLength={30}
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-[10px] tracking-[0.3em] uppercase text-stone-500">
              Email <span className="normal-case tracking-normal italic text-stone-400">— optional</span>
            </label>
            <input
              type="email"
              value={state.email}
              onChange={(e) => update("email", e.target.value)}
              maxLength={255}
              className={inputCls}
            />
          </div>
        </div>
        <p className="mt-3 text-xs text-stone-400 font-light italic">
          Share a phone or email — whichever you prefer.
        </p>

        <div className="mt-6">
          <FieldLabel>Preferred follow-up</FieldLabel>
          <div className="flex flex-wrap gap-2.5">
            {FOLLOWUP_OPTIONS.map((opt) => (
              <Chip
                key={opt}
                active={state.followUp === opt}
                onClick={() => update("followUp", opt)}
              >
                {opt}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div>
        <FieldLabel>Are you currently working with another real estate agent?</FieldLabel>
        <div className="flex flex-wrap gap-2.5">
          {AGENT_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              active={state.workingWithAgent === opt}
              onClick={() => update("workingWithAgent", opt)}
            >
              {opt}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>
          Is there a price you're hoping for? <span className="text-stone-400 normal-case tracking-normal italic">— optional</span>
        </FieldLabel>
        <input
          type="text"
          inputMode="numeric"
          value={state.hopedPrice}
          onChange={(e) => update("hopedPrice", e.target.value.replace(/[^0-9,]/g, ""))}
          maxLength={12}
          placeholder="e.g. 575,000"
          className={inputCls}
        />
        <p className="mt-2 text-xs text-stone-400 font-light italic">
          Optional — this helps me understand your expectations before I follow up.
        </p>
      </div>

      <div>
        <FieldLabel>
          Add photos, if you'd like <span className="text-stone-400 normal-case tracking-normal italic">— optional</span>
        </FieldLabel>
        <label className="block border border-dashed border-stone-300 px-5 py-6 text-sm font-light text-stone-600 cursor-pointer hover:border-stone-500 transition-colors text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => update("photoCount", e.target.files?.length ?? 0)}
          />
          {state.photoCount > 0
            ? `${state.photoCount} photo${state.photoCount === 1 ? "" : "s"} ready to share`
            : "Tap to add photos"}
        </label>
        <p className="mt-2 text-xs text-stone-400 font-light italic">
          A few photos can help me understand condition and updates, but you can skip this.
        </p>
      </div>

      {/* Review */}
      <div className="bg-stone-50 border border-stone-200 p-6">
        <p className="text-[10px] tracking-[0.35em] uppercase text-stone-500 mb-4">
          Your home details so far
        </p>
        <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm font-light text-stone-700">
          <ReviewRow label="Area" value={state.area} />
          <ReviewRow label="Property type" value={state.propertyType} />
          <ReviewRow
            label="Beds / Baths"
            value={
              state.beds || state.baths
                ? `${state.beds || "—"} bd · ${state.baths || "—"} ba`
                : ""
            }
          />
          <ReviewRow label="Sq ft" value={state.sqft} />
          <ReviewRow label="Condition" value={state.condition} />
          <ReviewRow label="Timeline" value={state.timeline} />
          {state.updates.length > 0 && (
            <ReviewRow label="Updates" value={state.updates.join(", ")} full />
          )}
          {state.issues.length > 0 && (
            <ReviewRow label="Worth noting" value={state.issues.join(", ")} full />
          )}
          {state.notes && <ReviewRow label="Notes" value={state.notes} full />}
        </dl>
      </div>
    </div>
  );
}

function ReviewRow({
  label,
  value,
  full,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <dt className="text-[10px] tracking-[0.28em] uppercase text-stone-400">{label}</dt>
      <dd className="mt-1 text-stone-800">
        {value || <span className="text-stone-400">—</span>}
      </dd>
    </div>
  );
}

/* ---------- Reassurance ---------- */

function SellerReassurance() {
  return (
    <section className="bg-[#faf7f2] py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-10 text-center">
        <p className="text-[11px] tracking-[0.35em] uppercase text-stone-500 mb-6">
          From sellers
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 leading-[1.15] max-w-2xl mx-auto">
          Alexandra has helped sellers move from unsure to prepared.
        </h2>
        <blockquote className="mt-12 font-serif italic text-xl sm:text-2xl text-stone-700 leading-relaxed">
          &ldquo;She walked us through every option before we listed. By the time
          we went to market, we felt completely ready.&rdquo;
        </blockquote>
        <p className="mt-6 text-[11px] tracking-[0.3em] uppercase text-stone-500">
          — Recent Seller, Brookhaven
        </p>
        <div className="mt-12">
          <Link
            to="/testimonials"
            className="inline-flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-stone-900 border-b border-stone-900 pb-2 hover:gap-5 transition-all"
          >
            View Testimonials
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
    <footer className="bg-[#14110e] text-stone-300">
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
          <p>Brokerage: Carter & Co. Realty · GA License #000000 · Equal Housing Opportunity</p>
          <p>© {new Date().getFullYear()} Alexandra Carter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
