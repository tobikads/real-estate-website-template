import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/buyer")({
  head: () => ({
    meta: [
      { title: "Buying a Home | Alexandra Carter" },
      {
        name: "description",
        content:
          "Guidance for home buyers in Atlanta. Alexandra Carter helps you find the right home, area, and next step.",
      },
    ],
  }),
  component: BuyerPage,
});

function BuyerPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Header />
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <p className="text-[11px] tracking-[0.35em] uppercase text-stone-500 mb-6">
            Buying a Home
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 leading-[1.05]">
            Coming Soon
          </h1>
          <p className="mt-6 text-stone-600 font-light leading-relaxed">
            We're preparing something thoughtful for home buyers. A clear, calm
            way to begin your search. Check back soon.
          </p>
        </div>
      </div>
    </div>
  );
}
