import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Menu, X } from "lucide-react";
import startHereBg from "@/assets/Alexandra/start-here-bg.jpg";
import { REALTOR_PROFILE } from "@/data/realtor-profile";

export const Route = createFileRoute("/start-here")({
  head: () => ({
    meta: [
      { title: `Start Here | ${REALTOR_PROFILE.name}` },
      {
        name: "description",
        content: `Choose the right next step. Whether you're buying, selling, or just have a question, ${REALTOR_PROFILE.name} is here to help.`,
      },
      { property: "og:title", content: `Start Here | ${REALTOR_PROFILE.name}` },
      {
        property: "og:description",
        content: `A simple way to take the right next step. Buying, selling, or just have a question? ${REALTOR_PROFILE.name} is here to help.`,
      },
    ],
  }),
  component: StartHerePage,
});

const choices = [
  {
    title: "Buying a Home",
    description: "I'm looking for the right home, area, or next step.",
    to: "/buyer" as const,
  },
  {
    title: "Selling a Home",
    description: "I want to understand my options before making a move.",
    to: "/seller" as const,
  },
  {
    title: "I Have a Question",
    description: "I'm not ready to buy or sell, but I need a clear answer.",
    to: "/question" as const,
  },
];

const MENU_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Lead Recovery", to: "/agent-preview" },
  { label: "Lead Nurture", to: "/lead-nurture" },
  { label: "Listings", to: "/listings" },
  { label: "About", to: "/about" },
  { label: "Areas Served", to: "/areas-served" },
  { label: "Testimonials", to: "/testimonials" },
  { label: "Let's Connect", to: "/lets-connect" },
  { label: "FAQ", to: "/faq" },
];

function FocusedHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  const desktopMenu = menuOpen ? (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} aria-hidden />
      <div className="absolute right-0 top-full mt-4 w-64 bg-[#0c0a08] border border-white/10 shadow-2xl z-50 py-2">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-3 text-[12px] tracking-[0.2em] uppercase text-stone-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </>
  ) : null;

  const mobileMenu = mobileOpen
    ? createPortal(
        <div className="fixed inset-0 z-[100] bg-[#0c0a08] text-stone-200 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="font-serif text-2xl leading-none text-white hover:text-white/80 transition-colors"
            >
              {REALTOR_PROFILE.name}
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-12 w-12 items-center justify-center -mr-3 text-white"
            >
              <X className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex-1 px-7 py-8">
            <div className="divide-y divide-white/10 border-y border-white/10">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-[52px] items-center justify-between text-[13px] uppercase tracking-[0.24em] text-stone-300 transition-colors hover:text-white"
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-5 lg:py-6 flex items-center justify-between gap-6">
          <Link
            to="/"
            className="font-serif text-xl lg:text-2xl leading-none text-white hover:text-white/80 transition-colors"
          >
            {REALTOR_PROFILE.name}
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Open menu"
              className="hidden lg:flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-white hover:text-white/70 transition-colors cursor-pointer"
            >
              Menu
              <span className="flex flex-col gap-[3px]">
                <span className="block h-px w-5 bg-current" />
                <span className="block h-px w-5 bg-current" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open mobile menu"
              aria-expanded={mobileOpen}
              className="lg:hidden inline-flex h-11 items-center justify-center gap-2 -mr-2 px-2 text-white hover:text-white/70 transition-colors"
            >
              <span className="text-[10px] tracking-[0.28em] uppercase">Menu</span>
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            </button>

            {desktopMenu}
          </div>
        </div>
      </header>
      {mobileMenu}
    </>
  );
}

function StartHerePage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={startHereBg} alt="" className="h-full w-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-[#0c0a08]/78" />
      </div>

      <FocusedHeader />

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-24 lg:py-32">
        <div className="text-center">
          <p className="text-[11px] tracking-[0.4em] uppercase text-stone-300/70 mb-6">
            START HERE
          </p>
          <h1 className="font-serif text-white text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.08] max-w-2xl mx-auto">
            A simple way to take the right next step.
          </h1>
          <p className="mt-6 text-stone-300/70 text-sm sm:text-base font-light tracking-wide max-w-md mx-auto">
            Choose what fits where you are today.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 lg:mt-20 grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7 max-w-5xl w-full">
          {choices.map((choice) => (
            <Link
              key={choice.to}
              to={choice.to}
              className="group relative flex flex-col justify-between border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8 lg:p-10 transition-all duration-500 hover:bg-white/[0.06] hover:border-white/[0.14] hover:-translate-y-1.5 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]"
            >
              <div>
                <h2 className="font-serif text-2xl lg:text-[1.65rem] text-white leading-tight">
                  {choice.title}
                </h2>
                <p className="mt-4 text-stone-300/70 text-[13px] sm:text-sm font-light leading-relaxed">
                  {choice.description}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase text-stone-300/80 group-hover:text-white transition-colors duration-300">
                <span>CONTINUE</span>
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom microcopy */}
        <p className="mt-14 lg:mt-20 text-stone-400/50 text-[11px] tracking-[0.2em] uppercase max-w-md text-center">
          Choose a path, answer a few quick questions, and I'll follow up with the right next step.
        </p>
      </div>
    </div>
  );
}
