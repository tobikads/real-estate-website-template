import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/lets-connect")({
  head: () => ({
    meta: [
      { title: "Let's Connect | Alexandra Carter" },
      {
        name: "description",
        content: "Reach Alexandra Carter directly to start a conversation about your Atlanta real estate plans.",
      },
    ],
  }),
  component: ConnectPage,
});

function ConnectPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Header />
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <p className="text-[11px] tracking-[0.35em] uppercase text-stone-500 mb-6">
            Let's Connect
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 leading-[1.05]">
            Coming Soon
          </h1>
          <p className="mt-6 text-stone-600 font-light leading-relaxed">
            A direct contact page is on the way. In the meantime, call (404) 555-0123 or email hello@alexandracarter.com.
          </p>
        </div>
      </div>
    </div>
  );
}
