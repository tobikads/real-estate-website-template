import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/areas-served")({
  head: () => ({
    meta: [
      { title: "Areas Served | Alexandra Carter" },
      {
        name: "description",
        content: "Atlanta neighborhoods and nearby areas served by Alexandra Carter.",
      },
    ],
  }),
  component: AreasPage,
});

function AreasPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Header />
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <p className="text-[11px] tracking-[0.35em] uppercase text-stone-500 mb-6">
            Areas Served
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 leading-[1.05]">
            Coming Soon
          </h1>
          <p className="mt-6 text-stone-600 font-light leading-relaxed">
            A guide to the Atlanta neighborhoods and nearby areas Alexandra serves is on the way.
          </p>
        </div>
      </div>
    </div>
  );
}
