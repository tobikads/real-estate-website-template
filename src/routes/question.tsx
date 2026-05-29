import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  Linkedin,
  Instagram,
  Phone,
  Mail,
  Check,
  ArrowUpRight,
} from "lucide-react";

import { Header } from "@/components/Header";
import { REALTOR_PROFILE } from "@/data/realtor-profile";
import questionHero from "@/assets/Alexandra/question-hero.jpg";

const REALTOR_FIRST_NAME = REALTOR_PROFILE.name.split(" ")[0];

export const Route = createFileRoute("/question")({
  head: () => ({
    meta: [
      { title: `I Have a Question | ${REALTOR_PROFILE.name}` },
      {
        name: "description",
        content:
          `Not ready to buy or sell? Ask ${REALTOR_PROFILE.name} your real estate question and get a clear, honest answer.`,
      },
    ],
  }),
  component: QuestionPage,
});

const CATEGORY_OPTIONS = [
  "Buying a home",
  "Selling a home",
  "A specific listing",
  "Home value",
  "Neighborhood / area",
  "Financing or pre-approval",
  "Timing / next steps",
  "Something else",
];

const FOLLOWUP_OPTIONS = ["Call", "Text", "Email"];

type QuestionState = {
  category: string;
  question: string;
  name: string;
  phone: string;
  email: string;
  followUp: string;
};

const INITIAL: QuestionState = {
  category: "",
  question: "",
  name: "",
  phone: "",
  email: "",
  followUp: "",
};

function QuestionPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Header />
      <main>
        <QuestionHero />
        <QuestionForm />
        <QuestionReassurance />
      </main>
      <Footer />
    </div>
  );
}

/* ---------- Hero ---------- */

function QuestionHero() {
  return (
    <section className="relative h-[65svh] min-h-[460px] w-full overflow-hidden">
      <img
        src={questionHero}
        alt=""
        className="h-full w-full object-cover"
        width={1536}
        height={1024}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-[#faf7f2]/85" />
      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-16 sm:pb-24 text-center px-6">
        <p className="text-[11px] tracking-[0.4em] uppercase text-stone-700 mb-5">
          Ask {REALTOR_FIRST_NAME}
        </p>
        <h1 className="font-serif text-stone-900 text-4xl sm:text-5xl lg:text-6xl leading-[1.05] font-light max-w-3xl">
          Have a question before you make a move?
        </h1>
        <p className="mt-6 max-w-xl text-stone-700 font-light text-base sm:text-lg leading-relaxed">
          Ask what&apos;s on your mind, and I&apos;ll point you toward the right next step.
        </p>
        <a
          href="#question-form"
          className="mt-10 inline-flex items-center gap-3 min-h-12 text-[11px] tracking-[0.3em] uppercase text-[#faf7f2] bg-stone-900 px-8 py-4 hover:bg-stone-800 transition-colors"
        >
          Ask {REALTOR_FIRST_NAME}
        </a>
      </div>
    </section>
  );
}

/* ---------- Form ---------- */

function QuestionForm() {
  const [state, setState] = useState<QuestionState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  const update = <K extends keyof QuestionState>(k: K, v: QuestionState[K]) => {
    setState((s) => ({ ...s, [k]: v }));
    if (notice) setNotice(null);
  };

  const handleSubmit = () => {
    if (!state.category) {
      setNotice("Choose one option to continue.");
      return;
    }
    if (!state.question.trim()) {
      setNotice("Please share your question so I can help.");
      return;
    }
    if (!state.name.trim()) {
      setNotice("Please share your name so I can follow up.");
      return;
    }
    if (!state.phone.trim() && !state.email.trim()) {
      setNotice("Please share a phone or email so I can reach you.");
      return;
    }

    const lead = {
      category: state.category,
      question: state.question,
      name: state.name,
      phone: state.phone || null,
      email: state.email || null,
      preferredFollowUp: state.followUp || null,
    };
    // eslint-disable-next-line no-console
    console.log("[question-lead]", lead);

    setNotice(null);
    setSubmitted(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <section id="question-form" className="bg-[#faf7f2] py-20 lg:py-28 scroll-mt-24">
      <div className="mx-auto max-w-2xl px-6 lg:px-10">
        <div className="text-center mb-10 lg:mb-14">
          <p className="text-[11px] tracking-[0.35em] uppercase text-stone-500 mb-5">
            Send a Question
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 leading-[1.1]">
            What&apos;s on your mind?
          </h2>
          <p className="mt-5 text-stone-500 text-sm font-light">
            No pressure. Just an honest answer.
          </p>
        </div>

        <div ref={formRef} className="min-h-[480px]">
          {submitted ? (
            <div className="bg-white border border-stone-200 p-10 sm:p-14 text-center shadow-sm">
              <div className="mx-auto h-10 w-10 rounded-full bg-stone-900 text-white grid place-items-center">
                <Check className="h-4 w-4" strokeWidth={2} />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 mt-6">
                Thank you — I&apos;ll take a look and follow up soon.
              </h3>
              <p className="mt-4 text-stone-600 font-light leading-relaxed max-w-md mx-auto">
                If your question is better answered through the buyer or seller path,
                I&apos;ll point you in the right direction.
              </p>
              <div className="mt-10">
                <Link
                  to="/listings"
                  className="inline-flex items-center gap-2 min-h-12 text-[11px] tracking-[0.3em] uppercase text-[#faf7f2] bg-stone-900 px-8 py-4 hover:bg-stone-800 transition-colors"
                >
                  Browse Listings
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-stone-200 shadow-sm">
              <div className="px-6 sm:px-10 py-10 sm:py-12 space-y-10">
                {/* Category */}
                <div>
                  <p className="text-[11px] tracking-[0.3em] uppercase text-stone-500 mb-4">
                    What is your question about?
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {CATEGORY_OPTIONS.map((opt) => (
                      <Chip
                        key={opt}
                        active={state.category === opt}
                        onClick={() => update("category", opt)}
                      >
                        {opt}
                      </Chip>
                    ))}
                  </div>
                </div>

                {/* Question textarea */}
                <div>
                  <p className="text-[11px] tracking-[0.3em] uppercase text-stone-500 mb-4">
                    Your question
                  </p>
                  <textarea
                    value={state.question}
                    onChange={(e) => update("question", e.target.value)}
                    rows={4}
                    placeholder="Tell me what you&apos;re wondering about."
                    className="w-full bg-transparent border border-stone-300 focus:border-stone-900 outline-none px-4 py-3 text-sm font-light text-stone-900 placeholder:text-stone-400 transition-colors resize-none min-h-[120px]"
                  />
                </div>

                {/* Contact */}
                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] tracking-[0.3em] uppercase text-stone-500">
                      Name <span className="text-stone-900">*</span>
                    </label>
                    <input
                      type="text"
                      value={state.name}
                      onChange={(e) => update("name", e.target.value)}
                      maxLength={100}
                      className="w-full bg-transparent border-b border-stone-300 focus:border-stone-900 outline-none py-2.5 text-sm font-light text-stone-900 placeholder:text-stone-400 transition-colors"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-8">
                    <div>
                      <label className="text-[10px] tracking-[0.3em] uppercase text-stone-500">
                        Phone <span className="normal-case tracking-normal italic text-stone-400">— optional</span>
                      </label>
                      <input
                        type="tel"
                        value={state.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        maxLength={30}
                        className="w-full bg-transparent border-b border-stone-300 focus:border-stone-900 outline-none py-2.5 text-sm font-light text-stone-900 placeholder:text-stone-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] tracking-[0.3em] uppercase text-stone-500">
                        Email <span className="normal-case tracking-normal italic text-stone-400">— optional</span>
                      </label>
                      <input
                        type="email"
                        value={state.email}
                        onChange={(e) => update("email", e.target.value)}
                        maxLength={255}
                        className="w-full bg-transparent border-b border-stone-300 focus:border-stone-900 outline-none py-2.5 text-sm font-light text-stone-900 placeholder:text-stone-400 transition-colors"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-stone-400 font-light italic -mt-3">
                    Share a phone or email — whichever you prefer.
                  </p>

                  <div>
                    <p className="text-[11px] tracking-[0.3em] uppercase text-stone-500 mb-4">
                      Preferred follow-up
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {FOLLOWUP_OPTIONS.map((opt) => (
                        <Chip
                          key={opt}
                          active={state.followUp === opt}
                          onClick={() => update("followUp", opt)}
                        >
                          {opt}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Calm inline notice */}
              {notice && (
                <div
                  role="status"
                  className="mx-6 sm:mx-10 mb-2 bg-stone-100 border-l-2 border-stone-400 px-4 py-3 text-sm font-light text-stone-700"
                >
                  {notice}
                </div>
              )}

              {/* Submit */}
              <div className="px-6 sm:px-10 pt-5 pb-6 sm:pb-7 border-t border-stone-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-2 min-h-12 text-[11px] tracking-[0.3em] uppercase text-[#faf7f2] bg-stone-900 px-6 sm:px-8 py-3.5 hover:bg-stone-800 transition-colors"
                >
                  Send Question
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Secondary phone option */}
        {!submitted && (
          <p className="mt-10 text-center text-sm text-stone-500 font-light leading-relaxed max-w-lg mx-auto">
            Prefer to talk it through? You can{" "}
            <a
              href="tel:+14045550123"
              className="text-stone-900 underline underline-offset-4 hover:text-stone-700"
            >
              call {REALTOR_FIRST_NAME} directly
            </a>
            .
          </p>
        )}
      </div>
    </section>
  );
}

/* ---------- Reassurance / Testimonial ---------- */

function QuestionReassurance() {
  return (
    <section className="bg-stone-50 py-24 lg:py-32 border-t border-stone-200/60">
      <div className="mx-auto max-w-3xl px-6 lg:px-10 text-center">
        <p className="text-[11px] tracking-[0.35em] uppercase text-stone-500 mb-6">
          A simple first step
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 leading-[1.15] max-w-2xl mx-auto">
          A simple question can be the first step.
        </h2>
        <p className="mt-6 text-stone-600 font-light leading-relaxed max-w-xl mx-auto">
          {REALTOR_FIRST_NAME} helps buyers and sellers get clear before they make a move.
        </p>

        <blockquote className="mt-14 font-serif italic text-xl sm:text-2xl text-stone-700 leading-relaxed max-w-2xl mx-auto">
          &ldquo;I wasn&apos;t sure where to start, and {REALTOR_FIRST_NAME} answered my questions without any pressure to commit.&rdquo;
        </blockquote>
        <p className="mt-4 text-sm text-stone-500 font-light">
          — Client in Buckhead
        </p>

        <div className="mt-12">
          <Link
            to="/testimonials"
            className="inline-flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-stone-900 border-b border-stone-900 pb-2 hover:gap-5 transition-all"
          >
            View Testimonials
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Shared components ---------- */

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center px-4 py-2.5 text-sm font-light border transition-all min-h-11
        ${active
          ? "border-stone-900 bg-stone-900 text-[#faf7f2]"
          : "border-stone-300 bg-white text-stone-700 hover:border-stone-900 hover:text-stone-900"
        }`}
    >
      {children}
    </button>
  );
}

/* ---------- Footer ---------- */

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
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/start-here" className="hover:text-white transition-colors">Start Here</Link></li>
              <li><Link to="/testimonials" className="hover:text-white transition-colors">Testimonials</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-[11px] text-stone-500 font-light">
          <p>Brokerage: {REALTOR_PROFILE.company} · GA License {REALTOR_PROFILE.licenseNumber} · Equal Housing Opportunity</p>
          <p>© {new Date().getFullYear()} {REALTOR_PROFILE.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
