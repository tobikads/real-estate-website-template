import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, type ReactNode } from "react";
import {
  Linkedin,
  Instagram,
  Phone,
  Mail,
  BedDouble,
  Bath,
  Maximize,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";


import { Header } from "@/components/Header";
import buyerHero from "@/assets/buyer-hero.jpg";
import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";

export const Route = createFileRoute("/buyer")({
  head: () => ({
    meta: [
      { title: "Buying a Home | Alexandra Carter" },
      {
        name: "description",
        content:
          "Share what you're looking for in an Atlanta home. Alexandra Carter follows up with homes and next steps that fit your search.",
      },
    ],
  }),
  component: BuyerPage,
});

const TEASER_LISTINGS = [
  {
    image: listing1,
    price: "$2,450,000",
    neighborhood: "Buckhead, Atlanta",
    beds: 5,
    baths: 6,
    sqft: "6,400",
    blurb: "Modern stone-and-glass estate on a quiet tree-lined street.",
  },
  {
    image: listing2,
    price: "$1,895,000",
    neighborhood: "Brookhaven, Atlanta",
    beds: 5,
    baths: 5,
    sqft: "5,100",
    blurb: "Resort-style backyard with a heated saltwater pool.",
  },
  {
    image: listing3,
    price: "$595,000",
    neighborhood: "Grant Park, Atlanta",
    beds: 3,
    baths: 2,
    sqft: "1,820",
    blurb: "Restored craftsman bungalow with a wide front porch.",
  },
];

const TIMELINE_OPTIONS = ["ASAP", "1–3 months", "3–6 months", "6+ months", "Just browsing"];

const AREA_GROUPS: { label: string; options: string[] }[] = [
  {
    label: "Atlanta neighborhoods",
    options: [
      "Buckhead",
      "Midtown",
      "Grant Park",
      "Virginia-Highland",
      "Morningside",
      "Old Fourth Ward",
    ],
  },
  {
    label: "Nearby areas",
    options: ["Decatur", "Sandy Springs", "Brookhaven", "Marietta", "Alpharetta", "Roswell"],
  },
];

const BUDGET_OPTIONS = [
  "Under $250k",
  "$250k–$350k",
  "$350k–$500k",
  "$500k–$750k",
  "$750k+",
];

const FINANCING_OPTIONS = [
  "Already pre-approved",
  "Planning to get pre-approved",
  "Buying with cash",
  "Need guidance",
  "Not sure yet",
];

const BED_OPTIONS = ["1+", "2+", "3+", "4+", "5+"];
const BATH_OPTIONS = ["1+", "2+", "3+", "4+"];

const HOME_TYPES = [
  "Single-family home",
  "Condo",
  "Townhouse",
  "Multi-family",
  "New construction",
  "Land",
  "Investment property",
  "Not sure yet",
];

const MUST_HAVES = [
  "Backyard",
  "Updated kitchen",
  "Home office",
  "Walkable area",
  "Good schools",
  "Garage",
  "Pool",
  "Move-in ready",
  "Fixer-upper potential",
];

const AGENT_OPTIONS = ["No", "Yes", "Not sure"];
const SELL_OPTIONS = ["No", "Yes", "Not sure"];
const SHOWING_OPTIONS = ["Yes", "Not yet", "Depends on the home"];
const FOLLOWUP_OPTIONS = ["Call", "Text", "Email"];

type BuyerState = {
  timeline: string;
  areas: string[];
  budget: string;
  financing: string;
  beds: string;
  baths: string;
  homeTypes: string[];
  mustHaves: string[];
  otherMatters: string;
  dealBreakers: string;
  name: string;
  phone: string;
  email: string;
  followUp: string;
  workingWithAgent: string;
  needsToSell: string;
  showing: string;
};

const INITIAL: BuyerState = {
  timeline: "",
  areas: [],
  budget: "",
  financing: "",
  beds: "",
  baths: "",
  homeTypes: [],
  mustHaves: [],
  otherMatters: "",
  dealBreakers: "",
  name: "",
  phone: "",
  email: "",
  followUp: "",
  workingWithAgent: "",
  needsToSell: "",
  showing: "",
};

function BuyerPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Header />
      <main>
        <BuyerHero />
        <TeaserListings />
        <BuyerWizard />
        <BuyerReassurance />
      </main>
      <Footer />
    </div>
  );
}

function BuyerHero() {
  return (
    <section className="relative h-[78svh] min-h-[560px] w-full overflow-hidden">
      <img
        src={buyerHero}
        alt=""
        className="h-full w-full object-cover"
        width={1920}
        height={1280}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/25 to-[#faf7f2]/85" />
      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-20 sm:pb-28 text-center px-6">
        <p className="text-[11px] tracking-[0.4em] uppercase text-stone-700 mb-6">
          For Buyers
        </p>
        <h1 className="font-serif text-stone-900 text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] leading-[1.05] font-light max-w-3xl">
          Find the right home with a clearer path.
        </h1>
        <p className="mt-8 max-w-xl text-stone-700 font-light text-base sm:text-lg leading-relaxed">
          Share what you're looking for, and I'll help you understand the homes,
          areas, and next steps that fit where you are.
        </p>
      </div>
    </section>
  );
}

function TeaserListings() {
  return (
    <section className="bg-[#faf7f2] pt-20 lg:pt-28 pb-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-[11px] tracking-[0.35em] uppercase text-stone-500 mb-5">
            A first look
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 leading-[1.1]">
            A First Look at What's Available
          </h2>
          <p className="mt-6 text-stone-600 font-light leading-relaxed">
            A few homes can start the conversation. Your preferences help me
            narrow in on what actually fits.
          </p>
        </div>

        {/* Desktop grid / mobile swipe */}
        <div
          className="mt-12 lg:mt-16 flex gap-5 lg:gap-6 overflow-x-auto snap-x snap-mandatory lg:overflow-visible lg:grid lg:grid-cols-3 -mx-6 px-6 lg:mx-0 lg:px-0 pb-2 lg:pb-0
                     [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TEASER_LISTINGS.map((l) => (
            <TeaserCard key={l.neighborhood} listing={l} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeaserCard({ listing }: { listing: (typeof TEASER_LISTINGS)[number] }) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setExpanded((e) => !e);
  };

  return (
    <article
      onClick={handleClick}
      className="group relative shrink-0 w-[78%] sm:w-[55%] lg:w-auto snap-start overflow-hidden bg-stone-100 cursor-pointer transition-all duration-500 ease-out lg:hover:shadow-lg lg:hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={listing.image}
          alt={listing.neighborhood}
          loading="lazy"
          width={1280}
          height={960}
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out lg:group-hover:scale-[1.04]"
        />
        <div
          className={`absolute inset-0 bg-stone-900/75 flex flex-col justify-end p-4 lg:p-5 transition-opacity duration-500
            ${expanded ? "opacity-100" : "opacity-0"} lg:group-hover:opacity-100`}
        >
          <p className="text-white/85 text-[10px] tracking-[0.28em] uppercase">
            {listing.neighborhood}
          </p>
          <p className="text-white/90 text-sm font-light mt-2 leading-relaxed line-clamp-2">
            {listing.blurb}
          </p>
        </div>
      </div>
      <div className="bg-white border-t border-stone-100 px-4 py-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-serif text-lg text-stone-900">{listing.price}</p>
          <p className="text-[10px] tracking-[0.25em] uppercase text-stone-500">
            {listing.neighborhood}
          </p>
        </div>
        <div className="mt-3 flex items-center gap-4 text-stone-600 text-xs font-light">
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-3.5 w-3.5" strokeWidth={1.5} /> {listing.beds} bd
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-3.5 w-3.5" strokeWidth={1.5} /> {listing.baths} ba
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize className="h-3.5 w-3.5" strokeWidth={1.5} /> {listing.sqft} sqft
          </span>
        </div>
        <Link
          to="/listings"
          onClick={(e) => e.stopPropagation()}
          className="mt-4 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-stone-900 border-b border-stone-900 pb-1 hover:gap-3 transition-all"
        >
          View Details <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
        </Link>
      </div>
    </article>
  );
}


/* ---------- Wizard ---------- */

const TOTAL_STEPS = 5;

function BuyerWizard() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<BuyerState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const wizardRef = useRef<HTMLDivElement | null>(null);

  const update = <K extends keyof BuyerState>(k: K, v: BuyerState[K]) => {
    setState((s) => ({ ...s, [k]: v }));
    if (notice) setNotice(null);
  };

  const toggleArr = (k: "areas" | "homeTypes" | "mustHaves", value: string) => {
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
    if (step === 1 && !state.timeline) return "Choose one option to continue.";
    if (step === 2 && state.areas.length === 0)
      return "Choose at least one area to continue.";
    if (step === 3) {
      if (!state.budget) return "Choose a budget range to continue.";
      if (!state.financing) return "Choose a financing option to continue.";
    }
    if (step === 4) {
      if (!state.beds) return "Choose a bedroom option to continue.";
      if (!state.baths) return "Choose a bathroom option to continue.";
    }
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
    setNotice(null);
    setSubmitted(true);
  };

  return (
    <section className="bg-stone-50 py-20 lg:py-28 border-t border-stone-200/70">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <div className="text-center mb-10 lg:mb-14">
          <p className="text-[11px] tracking-[0.35em] uppercase text-stone-500 mb-5">
            Buyer Intake
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 leading-[1.1]">
            Tell me what you're looking for
          </h2>
          <p className="mt-5 text-stone-500 text-sm font-light">
            Takes about 2 minutes.
          </p>
          <p className="mt-3 text-stone-400 text-xs font-light italic max-w-md mx-auto">
            Your answers are only used to help Alexandra follow up with more
            relevant homes.
          </p>
        </div>

        {/* Fixed-min-height shell keeps page from jumping on submit */}
        <div ref={wizardRef} className="min-h-[760px]">
          {submitted ? (
            <div className="bg-white border border-stone-200 p-10 sm:p-14 text-center shadow-sm">
              <div className="mx-auto h-10 w-10 rounded-full bg-stone-900 text-white grid place-items-center">
                <Check className="h-4 w-4" strokeWidth={2} />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 mt-6">
                Thank you
              </h3>
              <p className="mt-4 text-stone-600 font-light leading-relaxed max-w-md mx-auto">
                I'll review what you shared and follow up with homes or next
                steps that fit your search.
              </p>
            </div>
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
                {step === 1 && <Step1 state={state} update={update} />}
                {step === 2 && (
                  <Step2 state={state} toggle={(v) => toggleArr("areas", v)} />
                )}
                {step === 3 && <Step3 state={state} update={update} />}
                {step === 4 && (
                  <Step4 state={state} update={update} toggle={toggleArr} />
                )}
                {step === 5 && <Step5 state={state} update={update} />}
              </div>

              {/* Calm inline notice */}
              {notice && (
                <div
                  role="status"
                  className="mx-6 sm:mx-10 mb-2 bg-stone-100 border-l-2 border-stone-400 px-4 py-3 text-sm font-light text-stone-700"
                >
                  {notice}
                </div>
              )}

              {/* Controls — sticky-friendly padding for mobile reach */}
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
                    Send to Alexandra
                  </button>
                )}
              </div>
            </div>
          )}
        </div>


        {/* Secondary phone option */}
        <p className="mt-10 text-center text-sm text-stone-500 font-light leading-relaxed max-w-lg mx-auto">
          Prefer to talk it through? You can{" "}
          <a
            href="tel:+14045550123"
            className="text-stone-900 underline underline-offset-4 hover:text-stone-700"
          >
            call Alexandra directly
          </a>
          , or submit the form so she has your details before following up.
        </p>
      </div>
    </section>
  );
}

/* ---------- Step components ---------- */

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

function Step1({
  state,
  update,
}: {
  state: BuyerState;
  update: <K extends keyof BuyerState>(k: K, v: BuyerState[K]) => void;
}) {
  return (
    <div>
      <StepHeading title="When are you hoping to buy?" />
      <div className="flex flex-wrap gap-3">
        {TIMELINE_OPTIONS.map((opt) => (
          <Chip
            key={opt}
            active={state.timeline === opt}
            onClick={() => update("timeline", opt)}
          >
            {opt}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function Step2({
  state,
  toggle,
}: {
  state: BuyerState;
  toggle: (v: string) => void;
}) {
  return (
    <div>
      <StepHeading
        title="Where are you open to looking?"
        sub="Select any that interest you."
      />
      <div className="space-y-7">
        {AREA_GROUPS.map((group) => (
          <div key={group.label}>
            <FieldLabel>{group.label}</FieldLabel>
            <div className="flex flex-wrap gap-2.5">
              {group.options.map((opt) => (
                <Chip
                  key={opt}
                  active={state.areas.includes(opt)}
                  onClick={() => toggle(opt)}
                >
                  {opt}
                </Chip>
              ))}
            </div>
          </div>
        ))}
        <div>
          <Chip
            active={state.areas.includes("Not sure yet")}
            onClick={() => toggle("Not sure yet")}
          >
            Not sure yet
          </Chip>
        </div>
      </div>
    </div>
  );
}

function Step3({
  state,
  update,
}: {
  state: BuyerState;
  update: <K extends keyof BuyerState>(k: K, v: BuyerState[K]) => void;
}) {
  return (
    <div className="space-y-10">
      <div>
        <StepHeading title="What budget range feels right?" />
        <div className="flex flex-wrap gap-3">
          {BUDGET_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              active={state.budget === opt}
              onClick={() => update("budget", opt)}
            >
              {opt}
            </Chip>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>Where are you with financing?</FieldLabel>
        <div className="flex flex-wrap gap-3">
          {FINANCING_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              active={state.financing === opt}
              onClick={() => update("financing", opt)}
            >
              {opt}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step4({
  state,
  update,
  toggle,
}: {
  state: BuyerState;
  update: <K extends keyof BuyerState>(k: K, v: BuyerState[K]) => void;
  toggle: (k: "areas" | "homeTypes" | "mustHaves", value: string) => void;
}) {
  return (
    <div className="space-y-9">
      <StepHeading title="What kind of home fits?" />
      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <FieldLabel>Bedrooms</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {BED_OPTIONS.map((opt) => (
              <Chip
                key={opt}
                active={state.beds === opt}
                onClick={() => update("beds", opt)}
              >
                {opt}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <FieldLabel>Bathrooms</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {BATH_OPTIONS.map((opt) => (
              <Chip
                key={opt}
                active={state.baths === opt}
                onClick={() => update("baths", opt)}
              >
                {opt}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div>
        <FieldLabel>Home type</FieldLabel>
        <div className="flex flex-wrap gap-2.5">
          {HOME_TYPES.map((opt) => (
            <Chip
              key={opt}
              active={state.homeTypes.includes(opt)}
              onClick={() => toggle("homeTypes", opt)}
            >
              {opt}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>Must-haves</FieldLabel>
        <div className="flex flex-wrap gap-2.5">
          {MUST_HAVES.map((opt) => (
            <Chip
              key={opt}
              active={state.mustHaves.includes(opt)}
              onClick={() => toggle("mustHaves", opt)}
            >
              {opt}
            </Chip>
          ))}
        </div>
        <div className="mt-5">
          <FieldLabel>Anything else that matters? <span className="text-stone-400 normal-case tracking-normal italic">— optional</span></FieldLabel>
          <input
            type="text"
            value={state.otherMatters}
            onChange={(e) => update("otherMatters", e.target.value)}
            maxLength={200}
            placeholder="A quiet street, garden space, walk to coffee…"
            className="w-full bg-transparent border-b border-stone-300 focus:border-stone-900 outline-none py-2.5 text-sm font-light text-stone-900 placeholder:text-stone-400 transition-colors"
          />
        </div>
      </div>

      <div>
        <FieldLabel>Deal-breakers <span className="text-stone-400 normal-case tracking-normal italic">— optional</span></FieldLabel>
        <input
          type="text"
          value={state.dealBreakers}
          onChange={(e) => update("dealBreakers", e.target.value)}
          maxLength={200}
          placeholder="Anything you want to avoid?"
          className="w-full bg-transparent border-b border-stone-300 focus:border-stone-900 outline-none py-2.5 text-sm font-light text-stone-900 placeholder:text-stone-400 transition-colors"
        />
      </div>

    </div>
  );
}

function Step5({
  state,
  update,
}: {
  state: BuyerState;
  update: <K extends keyof BuyerState>(k: K, v: BuyerState[K]) => void;
}) {

  const inputCls =
    "w-full bg-transparent border-b border-stone-300 focus:border-stone-900 outline-none py-2.5 text-sm font-light text-stone-900 placeholder:text-stone-400 transition-colors";

  return (
    <div className="space-y-10">
      {/* Group 1 */}
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

      {/* Group 2 */}
      <div>
        <p className="font-serif text-xl text-stone-900 mb-6">A few helpful details</p>
        <div className="space-y-6">
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
            <FieldLabel>Do you need to sell a home before you buy?</FieldLabel>
            <div className="flex flex-wrap gap-2.5">
              {SELL_OPTIONS.map((opt) => (
                <Chip
                  key={opt}
                  active={state.needsToSell === opt}
                  onClick={() => update("needsToSell", opt)}
                >
                  {opt}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <FieldLabel>Would you like to schedule a showing if a home fits?</FieldLabel>
            <div className="flex flex-wrap gap-2.5">
              {SHOWING_OPTIONS.map((opt) => (
                <Chip
                  key={opt}
                  active={state.showing === opt}
                  onClick={() => update("showing", opt)}
                >
                  {opt}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compact review */}
      <div className="bg-stone-50 border border-stone-200 p-6">
        <p className="text-[10px] tracking-[0.35em] uppercase text-stone-500 mb-4">
          Your search so far
        </p>
        <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm font-light text-stone-700">
          <ReviewRow label="Timeline" value={state.timeline} />
          <ReviewRow label="Budget" value={state.budget} />
          <ReviewRow label="Financing" value={state.financing} />
          <ReviewRow
            label="Beds / Baths"
            value={
              state.beds || state.baths
                ? `${state.beds || "—"} bd · ${state.baths || "—"} ba`
                : ""
            }
          />
          <ReviewRow label="Areas" value={state.areas.join(", ")} full />
          <ReviewRow label="Home types" value={state.homeTypes.join(", ")} full />
          <ReviewRow label="Must-haves" value={state.mustHaves.join(", ")} full />
          {state.otherMatters && (
            <ReviewRow label="Also matters" value={state.otherMatters} full />
          )}
          {state.dealBreakers && (
            <ReviewRow label="Avoid" value={state.dealBreakers} full />
          )}
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
      <dd className="mt-1 text-stone-800">{value || <span className="text-stone-400">—</span>}</dd>
    </div>
  );
}

/* ---------- Reassurance ---------- */

function BuyerReassurance() {
  return (
    <section className="bg-[#faf7f2] py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-10 text-center">
        <p className="text-[11px] tracking-[0.35em] uppercase text-stone-500 mb-6">
          From buyers
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 leading-[1.15] max-w-2xl mx-auto">
          Alexandra has helped buyers like you move from unsure to clear.
        </h2>
        <blockquote className="mt-12 font-serif italic text-xl sm:text-2xl text-stone-700 leading-relaxed">
          &ldquo;Alexandra made the process clear from the first call.&rdquo;
        </blockquote>
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
