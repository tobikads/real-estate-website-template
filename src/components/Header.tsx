import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X, Linkedin, Instagram, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";

const DROPDOWN_ITEMS = [
  { label: "FAQ", to: "/faq" },
  { label: "About", to: "/about" },
  { label: "Areas Served", to: "/areas-served" },
  { label: "Testimonials", to: "/testimonials" },
  { label: "Let's Connect", to: "/lets-connect" },
];

const NAV_LEFT = [
  { label: "Buyer", to: "/buyer" },
  { label: "Seller", to: "/seller" },
];

const NAV_RIGHT = [
  { label: "Question", to: "/question" },
  { label: "Listings", to: "/listings" },
];

const MOBILE_ITEMS = [
  { label: "START HERE", to: "/start-here", isPrimary: true },
  { label: "Buyer", to: "/buyer" },
  { label: "Seller", to: "/seller" },
  { label: "Question", to: "/question" },
  { label: "Listings", to: "/listings" },
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Areas Served", to: "/areas-served" },
  { label: "Testimonials", to: "/testimonials" },
  { label: "Let's Connect", to: "/lets-connect" },
];


export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isStartHerePage = location.pathname === "/start-here";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  const linkColor = isStartHerePage
    ? "text-white"
    : scrolled
      ? "text-stone-800"
      : "text-white";
  const linkHover = isStartHerePage
    ? "hover:text-white/70"
    : scrolled
      ? "hover:text-stone-500"
      : "hover:text-white/70";

  const bgClass = isStartHerePage
    ? "bg-transparent"
    : scrolled
      ? "bg-[#faf7f2]/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.04)]"
      : "bg-transparent";

  const startHereClass = isStartHerePage
    ? "bg-white text-stone-900 border border-white"
    : scrolled
      ? "border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-[#faf7f2]"
      : "border border-white/80 text-white bg-white/10 hover:bg-white/20";

  const mobileMenu = mobileOpen
    ? createPortal(
        <div
          data-mobile-menu
          className="fixed inset-0 z-[100] bg-[#faf7f2] text-stone-900 flex flex-col overflow-y-auto"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200/70">
            <div>
              <p className="font-serif text-2xl leading-none text-stone-900">
                Alexandra Carter
              </p>
              <p className="mt-2 text-[10px] tracking-[0.28em] uppercase text-stone-500">
                Atlanta Real Estate
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-12 w-12 items-center justify-center -mr-3 text-stone-800"
            >
              <X className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex-1 px-7 py-8">
            {MOBILE_ITEMS.filter((i) => i.isPrimary).map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="mb-7 flex min-h-[56px] items-center justify-center border border-stone-950 bg-stone-950 px-6 py-4 text-center text-[13px] font-semibold uppercase tracking-[0.32em] text-[#faf7f2] transition-colors hover:bg-stone-800"
              >
                {item.label}
              </Link>
            ))}

            <div className="divide-y divide-stone-200/80 border-y border-stone-200/80">
              {MOBILE_ITEMS.filter((i) => !i.isPrimary).map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-[52px] items-center justify-between text-[13px] uppercase tracking-[0.24em] text-stone-800 transition-colors hover:text-stone-500"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-stone-400" strokeWidth={1.5} />
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
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${bgClass}`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-5 lg:py-6 flex items-center justify-between gap-6">
          {/* Left: socials */}
          <div className={`flex items-center gap-4 ${linkColor} transition-colors`}>
            <a href="#" aria-label="LinkedIn" className={`${linkHover} transition-colors`}>
              <Linkedin className="h-5 w-5 lg:h-4 lg:w-4" strokeWidth={1.5} />
            </a>
            <a href="#" aria-label="Instagram" className={`${linkHover} transition-colors`}>
              <Instagram className="h-5 w-5 lg:h-4 lg:w-4" strokeWidth={1.5} />
            </a>
          </div>

          {/* Center nav (desktop) */}
          <nav
            className={`hidden lg:flex items-center gap-8 xl:gap-10 text-[12px] tracking-[0.18em] uppercase ${linkColor} transition-colors`}
          >
            {NAV_LEFT.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`${linkHover} font-light transition-colors`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/start-here"
              className={`inline-flex items-center rounded-full px-5 xl:px-6 py-2.5 text-[13px] tracking-[0.25em] font-semibold transition-colors ${startHereClass}`}
            >
              START HERE
            </Link>
            {NAV_RIGHT.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`${linkHover} font-light transition-colors`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: dropdown (desktop) / hamburger (mobile) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Open menu"
              className={`hidden lg:flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase ${linkColor} ${linkHover} transition-colors cursor-pointer`}
            >
              Menu
              <span className="flex flex-col gap-[3px]">
                <span className="block h-px w-5 bg-current" />
                <span className="block h-px w-5 bg-current" />
              </span>
            </button>

            {/* Mobile burger */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open mobile menu"
              aria-expanded={mobileOpen}
              className={`lg:hidden inline-flex h-11 items-center justify-center gap-2 -mr-2 px-2 ${linkColor} ${linkHover} transition-colors`}
            >
              <span className="text-[10px] tracking-[0.28em] uppercase">Menu</span>
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                  aria-hidden
                />
                <div className="absolute right-0 top-full mt-4 w-64 bg-[#faf7f2] border border-stone-200/70 shadow-xl z-50 py-2">
                  {DROPDOWN_ITEMS.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className="block px-6 py-3 text-[12px] tracking-[0.2em] uppercase text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}

                </div>
              </>
            )}
          </div>
        </div>
      </header>
      {mobileMenu}
    </>
  );
}
