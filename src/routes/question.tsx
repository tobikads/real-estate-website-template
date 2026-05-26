import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/question")({
  head: () => ({
    meta: [
      { title: "I Have a Question | Alexandra Carter" },
      {
        name: "description",
        content:
          "Not ready to buy or sell? Alexandra Carter is here to give you a clear, honest answer to your real estate questions.",
      },
    ],
  }),
  component: QuestionPage,
});

function QuestionPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Header />
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <p className="text-[11px] tracking-[0.35em] uppercase text-stone-500 mb-6">
            I Have a Question
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 leading-[1.05]">
            Coming Soon
          </h1>
          <p className="mt-6 text-stone-600 font-light leading-relaxed">
            We're preparing a simple way to ask questions and get clear answers.
            Check back soon.
          </p>
        </div>
      </div>
    </div>
  );
}
