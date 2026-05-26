import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import startHereBg from "@/assets/start-here-bg.jpg";

export const Route = createFileRoute("/start-here")({
  head: () => ({
    meta: [
      { title: "Start Here | Alexandra Carter" },
      {
        name: "description",
        content:
          "Choose the right next step. Whether you're buying, selling, or just have a question, Alexandra Carter is here to help.",
      },
      { property: "og:title", content: "Start Here | Alexandra Carter" },
      {
        property: "og:description",
        content:
          "A simple way to take the right next step. Buying, selling, or just have a question?",
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

function StartHerePage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={startHereBg}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-[#0c0a08]/78" />
      </div>

      <Header />

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
                <span>Continue</span>
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom microcopy */}
        <p className="mt-14 lg:mt-20 text-stone-400/50 text-[11px] tracking-[0.2em] uppercase">
          No pressure. No spam. Just the right next step.
        </p>
      </div>
    </div>
  );
}
