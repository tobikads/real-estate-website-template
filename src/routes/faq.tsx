import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | Alexandra Carter" },
      {
        name: "description",
        content: "Answers to common questions about buying and selling Atlanta real estate with Alexandra Carter.",
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Header />
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <p className="text-[11px] tracking-[0.35em] uppercase text-stone-500 mb-6">
            FAQ
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 leading-[1.05]">
            Coming Soon
          </h1>
          <p className="mt-6 text-stone-600 font-light leading-relaxed">
            A simple set of answers to the questions people ask most often is on the way.
          </p>
        </div>
      </div>
    </div>
  );
}
