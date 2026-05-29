import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { REALTOR_PROFILE } from "@/data/realtor-profile";
import { FEATURED_LISTINGS } from "@/data/listings";
import {
  HOMEPAGE_HERO_IMAGES,
  HOMEPAGE_TESTIMONIALS,
  HOMEPAGE_TESTIMONIALS_BACKGROUND,
  HOMEPAGE_WORK_WITH_BACKGROUND,
} from "@/data/homepage-content";
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

export const Route = createFileRoute("/")({
  component: Index,
});

const TESTIMONIALS = HOMEPAGE_TESTIMONIALS;

const LISTINGS = FEATURED_LISTINGS;

function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % HOMEPAGE_HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {HOMEPAGE_HERO_IMAGES.map((src, i) => (
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
          {REALTOR_PROFILE.name.toUpperCase()}
        </h1>
        <div className="mt-5 h-px w-12 bg-white/60" />
        <p className="mt-6 text-white/90 font-light text-sm sm:text-base tracking-[0.2em] uppercase">
          {REALTOR_PROFILE.title} in {REALTOR_PROFILE.location}
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
        {HOMEPAGE_HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-px transition-all duration-500 ${i === active ? "w-10 bg-white" : "w-5 bg-white/40"
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
                src={REALTOR_PROFILE.portraitImage}
                alt={`Portrait of ${REALTOR_PROFILE.name}`}
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
              Meet {REALTOR_PROFILE.name.split(" ")[0]}
            </h2>
            <div className="mt-8 space-y-5 text-stone-600 text-[15px] sm:text-base leading-relaxed font-light max-w-lg">
              <p>{REALTOR_PROFILE.bio}</p>
              <p>{REALTOR_PROFILE.approach}</p>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-sm text-stone-700">
              <a href={`tel:${REALTOR_PROFILE.phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-3 hover:text-stone-900 transition-colors">
                <Phone className="h-4 w-4 text-stone-400" strokeWidth={1.5} />
                <span className="font-light tracking-wide">{REALTOR_PROFILE.phone}</span>
              </a>
              <a href={`mailto:${REALTOR_PROFILE.email}`} className="flex items-center gap-3 hover:text-stone-900 transition-colors">
                <Mail className="h-4 w-4 text-stone-400" strokeWidth={1.5} />
                <span className="font-light tracking-wide">{REALTOR_PROFILE.email}</span>
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
          src={HOMEPAGE_TESTIMONIALS_BACKGROUND}
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
              className={`h-1.5 w-1.5 rounded-full transition-all ${i === active ? "bg-white w-6" : "bg-white/40"
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
          src={HOMEPAGE_WORK_WITH_BACKGROUND}
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
          WORK WITH {REALTOR_PROFILE.name.split(" ")[0].toUpperCase()}
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
              <li><a href="#meet" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Listings</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
              <li><Link to="/start-here" className="hover:text-white transition-colors">Start Here</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-[11px] text-stone-500 font-light">
          <p>
            Brokerage: {REALTOR_PROFILE.company} · GA License #{REALTOR_PROFILE.licenseNumber} · Equal Housing Opportunity
          </p>
          <p>© {new Date().getFullYear()} {REALTOR_PROFILE.name}. All rights reserved.</p>
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
