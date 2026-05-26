import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Linkedin,
  Instagram,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  BedDouble,
  Bath,
  Maximize,
  ArrowUpRight,
} from "lucide-react";

import { Header } from "@/components/Header";

import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import portrait from "@/assets/alexandra-portrait.jpg";
import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";
import listing4 from "@/assets/listing-4.jpg";
import testimonialsBg from "@/assets/testimonials-bg.jpg";
import workBg from "@/assets/work-with-bg.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const HERO_IMAGES = [hero1, hero2, hero3];

const TESTIMONIALS = [
  {
    quote:
      "Alexandra made the process clear from the first call. She listened more than she sold, and when it came time to make decisions we felt fully prepared. Buying our first home in Atlanta could not have felt calmer.",
    name: "Marcus J.",
  },
  {
    quote:
      "We interviewed three agents. Alexandra was the only one who treated our questions like they mattered. She is patient, deeply informed about the city, and incredibly easy to trust with something this big.",
    name: "Priya & Daniel R.",
  },
  {
    quote:
      "Selling the house I raised my children in was emotional. Alexandra handled every detail with such grace that I never once felt rushed. She is a rare professional and an even better person.",
    name: "Eleanor W.",
  },
];

const LISTINGS = [
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
    blurb: "Resort-style backyard with heated saltwater pool.",
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
  {
    image: listing4,
    price: "$485,000",
    neighborhood: "Decatur, GA",
    beds: 4,
    baths: 2,
    sqft: "2,100",
    blurb: "Classic brick ranch on a generous corner lot.",
  },
];


function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-[1800ms] ease-in-out"
          style={{ opacity: i === active ? 1 : 0 }}
        >
          <img
            src={src}
            alt=""
            className="h-full w-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
            width={1920}
            height={1280}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/65" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
        <h1 className="font-serif text-white text-[2.75rem] sm:text-6xl lg:text-7xl xl:text-[5.5rem] tracking-[0.18em] sm:tracking-[0.22em] font-light leading-[1.05]">
          ALEXANDRA CARTER
        </h1>
        <div className="mt-5 h-px w-12 bg-white/60" />
        <p className="mt-6 text-white/90 font-light text-sm sm:text-base tracking-[0.2em] uppercase">
          Real Estate Agent in Atlanta, Georgia
        </p>
        <div className="mt-10 sm:mt-14">
          <p className="text-white/80 text-[11px] sm:text-xs tracking-[0.3em] uppercase font-light">
            Ready to
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {[
              { label: "Buy", to: "/buyer" },
              { label: "Sell", to: "/seller" },
              { label: "Ask a Question", to: "/question" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="inline-flex min-h-10 items-center justify-center border border-white/45 bg-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-white/90 backdrop-blur-sm transition-colors hover:border-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-px transition-all duration-500 ${
              i === active ? "w-10 bg-white" : "w-5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

function MeetAlexandra() {
  return (
    <section id="meet" className="bg-[#faf7f2] py-24 lg:py-36">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Portrait — first on mobile via order */}
          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto overflow-hidden">
              <img
                src={portrait}
                alt="Portrait of Alexandra Carter"
                className="h-full w-full object-cover"
                loading="lazy"
                width={1024}
                height={1280}
              />
            </div>
          </div>

          <div className="order-2 lg:order-1">
            <p className="text-[11px] tracking-[0.35em] uppercase text-stone-500 mb-6">
              About
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 leading-[1.05]">
              Meet Alexandra
            </h2>
            <div className="mt-8 space-y-5 text-stone-600 text-[15px] sm:text-base leading-relaxed font-light max-w-lg">
              <p>
                I'm Alexandra — a lifelong Atlantan and a real estate agent who believes
                this milestone deserves more than a transaction. Whether you're buying
                your first home in Grant Park or quietly listing an estate in Buckhead,
                my work is to make every step feel clear, calm, and honest.
              </p>
              <p>
                I work with a small, intentional roster of clients each year. That means
                you'll always speak to me directly, never a team — and the answer you get
                will be the right one for your life, not the loudest one in the room.
              </p>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-sm text-stone-700">
              <a href="tel:+14045550123" className="flex items-center gap-3 hover:text-stone-900 transition-colors">
                <Phone className="h-4 w-4 text-stone-400" strokeWidth={1.5} />
                <span className="font-light tracking-wide">(404) 555-0123</span>
              </a>
              <a href="mailto:hello@alexandracarter.com" className="flex items-center gap-3 hover:text-stone-900 transition-colors">
                <Mail className="h-4 w-4 text-stone-400" strokeWidth={1.5} />
                <span className="font-light tracking-wide">hello@alexandracarter.com</span>
              </a>
            </div>

            <div className="mt-10">
              <a
                href="#"
                className="inline-flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-stone-900 border-b border-stone-900 pb-2 hover:gap-5 transition-all"
              >
                Learn More
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setActive((a) => (a + 1) % TESTIMONIALS.length);
    }, 8000);
  };

  useEffect(() => {
    start();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const go = (i: number) => {
    setActive((i + TESTIMONIALS.length) % TESTIMONIALS.length);
    start();
  };

  return (
    <section
      id="testimonials"
      className="relative py-28 lg:py-40 overflow-hidden"
    >
      <div className="absolute inset-0">
        <img
          src={testimonialsBg}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-[#1a1612]/85" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-10 text-center">
        <p className="text-[11px] tracking-[0.4em] uppercase text-stone-300/80 mb-12">
          Testimonials
        </p>

        <div className="relative min-h-[220px] sm:min-h-[200px]">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{
                opacity: i === active ? 1 : 0,
                pointerEvents: i === active ? "auto" : "none",
              }}
            >
              <blockquote className="font-serif text-white/95 text-2xl sm:text-3xl lg:text-[2.25rem] leading-[1.4] font-light italic">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <p className="mt-8 text-[11px] tracking-[0.35em] uppercase text-stone-300/80">
                — {t.name}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop arrows */}
        <div className="hidden sm:flex items-center justify-center gap-8 mt-16">
          <button
            onClick={() => go(active - 1)}
            aria-label="Previous"
            className="text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={1.25} />
          </button>
          <span className="text-[11px] tracking-[0.3em] text-white/50">
            {String(active + 1).padStart(2, "0")} / {String(TESTIMONIALS.length).padStart(2, "0")}
          </span>
          <button
            onClick={() => go(active + 1)}
            aria-label="Next"
            className="text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronRight className="h-6 w-6" strokeWidth={1.25} />
          </button>
        </div>

        {/* Mobile dots */}
        <div className="flex sm:hidden items-center justify-center gap-3 mt-12">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Testimonial ${i + 1}`}
              className={`h-1.5 w-1.5 rounded-full transition-all ${
                i === active ? "bg-white w-6" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ListingCard({
  listing,
  expanded,
  onToggle,
}: {
  listing: (typeof LISTINGS)[number];
  expanded: boolean;
  onToggle: () => void;
}) {
  const handleCardClick = () => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    onToggle();
  };

  return (
    <article
      data-listing-card
      data-expanded={expanded ? "true" : "false"}
      className="group relative overflow-hidden bg-stone-100 cursor-pointer
                 transition-transform duration-500 ease-out
                 lg:hover:scale-[1.025] lg:hover:shadow-2xl"
      onClick={handleCardClick}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={listing.image}
          alt={listing.neighborhood}
          loading="lazy"
          width={1280}
          height={896}
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out lg:group-hover:scale-110"
        />
        {/* Always-visible base info */}
        <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6 bg-gradient-to-t from-black/75 via-black/20 to-transparent">
          <p className="text-white font-serif text-xl lg:text-2xl tracking-wide">
            {listing.price}
          </p>
          <p className="text-white/80 text-[11px] tracking-[0.25em] uppercase mt-1">
            {listing.neighborhood}
          </p>
        </div>

        {/* Hover / expanded overlay */}
        <div
          className={`absolute inset-0 bg-black/70 flex flex-col justify-end p-5 lg:p-7
            transition-opacity duration-500
            ${expanded ? "opacity-100" : "opacity-0"} lg:group-hover:opacity-100`}
        >
          <p className="text-white font-serif text-2xl lg:text-3xl">{listing.price}</p>
          <p className="text-white/80 text-[11px] tracking-[0.25em] uppercase mt-1">
            {listing.neighborhood}
          </p>
          <p className="text-white/85 text-sm font-light mt-4 leading-relaxed">
            {listing.blurb}
          </p>
          <div className="flex items-center gap-5 mt-5 text-white/90 text-xs font-light">
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
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <a
              href="#"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 text-center text-[11px] tracking-[0.25em] uppercase text-stone-900 bg-[#faf7f2] py-3 hover:bg-white transition-colors"
            >
              View Details
            </a>
            <a
              href="#"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 text-center text-[11px] tracking-[0.25em] uppercase text-white border border-white/40 py-3 hover:border-white transition-colors"
            >
              Ask About This Home
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

function FeaturedListings() {
  const [expandedListing, setExpandedListing] = useState<string | null>(null);

  useEffect(() => {
    if (!expandedListing) {
      return;
    }

    const closeOnOutsidePress = (event: PointerEvent) => {
      const target = event.target;

      if (target instanceof Element && !target.closest("[data-listing-card]")) {
        setExpandedListing(null);
      }
    };

    const closeOnScroll = () => setExpandedListing(null);

    document.addEventListener("pointerdown", closeOnOutsidePress);
    window.addEventListener("scroll", closeOnScroll, { passive: true });

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      window.removeEventListener("scroll", closeOnScroll);
    };
  }, [expandedListing]);

  return (
    <section className="bg-[#faf7f2] py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center mb-14 lg:mb-20">
          <p className="text-[11px] tracking-[0.4em] uppercase text-stone-500 mb-5">
            Now Showing
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900">
            Featured Atlanta Homes
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {LISTINGS.map((l) => (
            <ListingCard
              key={l.neighborhood}
              listing={l}
              expanded={expandedListing === l.neighborhood}
              onToggle={() =>
                setExpandedListing((current) =>
                  current === l.neighborhood ? null : l.neighborhood,
                )
              }
            />
          ))}
        </div>

        <div className="mt-14 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-stone-900 border-b border-stone-900 pb-2 hover:gap-5 transition-all"
          >
            View All Listings
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </section>
  );
}

function WorkWith() {
  return (
    <section id="work" className="relative py-28 lg:py-40 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={workBg}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 lg:px-10 text-center">
        <h2 className="font-serif text-white text-3xl sm:text-5xl lg:text-6xl tracking-[0.12em] sm:tracking-[0.18em] font-light leading-[1.1]">
          WORK WITH ALEXANDRA
        </h2>
        <div className="mt-6 h-px w-12 bg-white/50 mx-auto" />
        <p className="mt-8 text-white/85 text-base sm:text-lg font-light leading-relaxed max-w-xl mx-auto">
          Buying, selling, or just need a clear answer? Start with one simple step.
        </p>
        <div className="mt-12">
          <Link
            to="/start-here"
            className="inline-block text-[11px] tracking-[0.35em] uppercase text-stone-900 bg-[#faf7f2] px-10 py-4 hover:bg-white transition-colors"
          >
            Start Here
          </Link>
        </div>
      </div>
    </section>
  );
}

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
              <li><a href="#meet" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Listings</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
              <li><Link to="/start-here" className="hover:text-white transition-colors">Start Here</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-[11px] text-stone-500 font-light">
          <p>
            Brokerage: Carter & Co. Realty · GA License #000000 · Equal Housing Opportunity
          </p>
          <p>© {new Date().getFullYear()} Alexandra Carter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Header />
      <main>
        <Hero />
        <MeetAlexandra />
        <Testimonials />
        <FeaturedListings />
        <WorkWith />
      </main>
      <Footer />
    </div>
  );
}
