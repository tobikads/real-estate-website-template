import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Bell,
  CalendarClock,
  Check,
  Clock,
  MessageSquareText,
  PauseCircle,
  Send,
  ShieldCheck,
} from "lucide-react";

import { Header } from "@/components/Header";
import { REALTOR_PROFILE } from "@/data/realtor-profile";

export const Route = createFileRoute("/lead-nurture")({
  head: () => ({
    meta: [
      { title: `Lead Nurture Preview | ${REALTOR_PROFILE.name}` },
      {
        name: "description",
        content:
          "Demo-only lead nurture preview showing how follow-up texts change by buyer or seller timeline.",
      },
    ],
  }),
  component: LeadNurturePage,
});

type TimelineKey = "asap" | "oneToThree" | "threeToSix";

type NurtureStep = {
  when: string;
  title: string;
  body: string;
  text: string;
};

type NurturePlan = {
  label: string;
  shortLabel: string;
  urgency: string;
  leadName: string;
  leadType: string;
  timeline: string;
  context: string;
  selectedNeed: string;
  status: string;
  suggestedAction: string;
  agentAlert: string;
  firstText: string;
  steps: NurtureStep[];
};

const timelineOrder: TimelineKey[] = ["asap", "oneToThree", "threeToSix"];

const nurturePlans: Record<TimelineKey, NurturePlan> = {
  asap: {
    label: "ASAP",
    shortLabel: "Ready now",
    urgency: "Immediate alert",
    leadName: "Tobi Rakari",
    leadType: "Buyer lead",
    timeline: "ASAP",
    context: "Midtown search, $350k-$500k, not currently represented",
    selectedNeed: "Needs 3+ beds, updated kitchen, and a good commute",
    status: "Hot lead",
    suggestedAction: "Text within 5 minutes and offer a quick call or showing plan.",
    agentAlert:
      "Tobi is looking ASAP in Midtown with a $350k-$500k budget. Suggested next step: text within 5 minutes.",
    firstText:
      "Hi Tobi, this is Johunna. I saw you are looking ASAP in Midtown. I can help narrow the best options today. Want me to send a few that fit?",
    steps: [
      {
        when: "Now",
        title: "Send intro text",
        body: "The lead gets a fast, personal response while intent is still high.",
        text: "Hi Tobi, this is Johunna. I saw you are looking ASAP in Midtown. I can help narrow the best options today.",
      },
      {
        when: "5 minutes",
        title: "Alert the realtor",
        body: "The agent sees the lead summary, timeline, budget, area, and suggested next action.",
        text: "Hot buyer lead: Tobi is looking ASAP. Text now and offer a quick call.",
      },
      {
        when: "2 hours",
        title: "Send helpful follow-up",
        body: "If there is no reply, the lead gets one useful listing-style follow-up.",
        text: "I found a few homes close to what you shared. Want me to send the strongest matches?",
      },
      {
        when: "Tomorrow",
        title: "Check in once",
        body: "The automation checks in without making the agent chase manually.",
        text: "Just checking in. Are you still trying to see options this week?",
      },
    ],
  },
  oneToThree: {
    label: "1-3 months",
    shortLabel: "Active soon",
    urgency: "Same-day alert",
    leadName: "Jasmine Brown",
    leadType: "Buyer lead",
    timeline: "1-3 months",
    context: "Marietta search, $350k-$425k, backyard and schools matter",
    selectedNeed: "Wants 3 beds, backyard, and good schools",
    status: "Warm active lead",
    suggestedAction: "Send intro today, then keep them warm with useful listing updates.",
    agentAlert:
      "Jasmine is looking in Marietta within 1-3 months. Suggested next step: send intro text today.",
    firstText:
      "Hi Jasmine, this is Johunna. I saw you are planning for Marietta in the next 1-3 months. I can send a few homes that match your range and must-haves.",
    steps: [
      {
        when: "Today",
        title: "Send intro text",
        body: "The first message confirms the timeline and offers help without pressure.",
        text: "Hi Jasmine, this is Johunna. I saw you are planning for Marietta in the next 1-3 months.",
      },
      {
        when: "Tomorrow",
        title: "Check in if no response",
        body: "A light second touch keeps the conversation alive.",
        text: "Do you want me to send homes with a backyard and strong school options first?",
      },
      {
        when: "Day 3",
        title: "Send listing follow-up",
        body: "The lead receives something useful based on the form answers.",
        text: "Here are a few Marietta options close to the range you shared. Want me to keep watching this area?",
      },
      {
        when: "Every 2 weeks",
        title: "Send market check-in",
        body: "The system keeps the lead warm until they are ready or they reply.",
        text: "Quick Marietta update: homes in your range are still moving. Want a refreshed list?",
      },
    ],
  },
  threeToSix: {
    label: "3-6 months",
    shortLabel: "Future lead",
    urgency: "Quiet nurture",
    leadName: "Marcus Hill",
    leadType: "Seller lead",
    timeline: "3-6 months",
    context: "Marietta homeowner, preliminary range $790k-$925k",
    selectedNeed: "Well maintained home, HVAC updated, older roof to review",
    status: "Longer-term nurture",
    suggestedAction: "Send value-review invite, then monthly check-ins until timing gets closer.",
    agentAlert:
      "Marcus may sell in 3-6 months. Suggested next step: offer a value review and let nurture handle light check-ins.",
    firstText:
      "Hi Marcus, this is Johunna. I saw you are thinking about selling in the next 3-6 months. I can help you understand what to watch before you list.",
    steps: [
      {
        when: "Today",
        title: "Send soft intro",
        body: "The message matches the longer timeline and avoids sounding pushy.",
        text: "Hi Marcus, this is Johunna. I saw you are thinking about selling in the next 3-6 months.",
      },
      {
        when: "7 days",
        title: "Send prep follow-up",
        body: "The lead gets a helpful next step instead of a hard sales message.",
        text: "Since you have time, I can send a short pre-listing checklist for Marietta sellers.",
      },
      {
        when: "Every 30 days",
        title: "Send market update",
        body: "Monthly updates keep the agent present while the lead is still early.",
        text: "Quick market note: here is what similar Marietta homes are doing right now.",
      },
      {
        when: "60 days out",
        title: "Move to active follow-up",
        body: "The lead becomes more important as their timeline gets closer.",
        text: "Are you getting closer to choosing a list date? I can help you review timing and prep.",
      },
    ],
  },
};

function LeadNurturePage() {
  const [selectedTimeline, setSelectedTimeline] = useState<TimelineKey>("oneToThree");
  const plan = nurturePlans[selectedTimeline];

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900">
      <Header />
      <main className="pt-28 lg:pt-32">
        <section className="border-b border-stone-200/70 px-6 pb-12 pt-10 lg:px-10 lg:pb-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-[11px] uppercase tracking-[0.35em] text-stone-500">
              Demo Nurture View
            </p>
            <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div>
                <h1 className="max-w-3xl font-serif text-4xl leading-[1.08] text-stone-950 sm:text-5xl lg:text-6xl">
                  Lead nurture preview
                </h1>
                <p className="mt-6 max-w-2xl text-base font-light leading-relaxed text-stone-600">
                  Pick a timeline and show how the website changes the follow-up plan so the lead
                  does not go cold after the form.
                </p>
              </div>

              <div className="border border-stone-200 bg-white p-5 shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">
                  Timeline selector
                </p>
                <div className="mt-4 grid gap-2">
                  {timelineOrder.map((key) => {
                    const option = nurturePlans[key];
                    const active = selectedTimeline === key;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedTimeline(key)}
                        className={`flex min-h-14 items-center justify-between gap-4 border px-4 py-3 text-left transition-colors ${
                          active
                            ? "border-stone-900 bg-stone-900 text-[#faf7f2]"
                            : "border-stone-200 bg-white text-stone-800 hover:bg-stone-50"
                        }`}
                      >
                        <span>
                          <span className="block text-[11px] font-semibold uppercase tracking-[0.24em]">
                            {option.label}
                          </span>
                          <span
                            className={`mt-1 block text-xs font-light ${
                              active ? "text-stone-200" : "text-stone-500"
                            }`}
                          >
                            {option.shortLabel}
                          </span>
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em]">
                          {option.urgency}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-12 lg:px-10 lg:py-16">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <LeadSnapshot plan={plan} />
            <AutomationPlan plan={plan} />
          </div>
        </section>

        <section className="border-t border-stone-200/70 px-6 py-12 lg:px-10 lg:py-16">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <TextPreview plan={plan} />
            <AgentAlert plan={plan} />
          </div>
        </section>

        <section className="border-t border-stone-200/70 px-6 py-12 lg:px-10 lg:py-16">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <NurtureRules />
            <DemoPath />
          </div>
        </section>
      </main>
    </div>
  );
}

function LeadSnapshot({ plan }: { plan: NurturePlan }) {
  return (
    <article className="border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">
            Lead Summary
          </p>
          <h2 className="mt-4 font-serif text-3xl text-stone-950">{plan.leadName}</h2>
          <p className="mt-2 text-sm font-light leading-relaxed text-stone-600">
            {plan.leadType}
          </p>
        </div>
        <span className="w-fit border border-stone-300 px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-stone-700">
          {plan.status}
        </span>
      </div>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <PreviewField label="Timeline" value={plan.timeline} />
        <PreviewField label="Urgency" value={plan.urgency} />
        <PreviewField label="Context" value={plan.context} />
        <PreviewField label="Needs" value={plan.selectedNeed} />
      </dl>

      <div className="mt-8 border-l-2 border-stone-900 pl-4">
        <p className="text-[10px] uppercase tracking-[0.32em] text-stone-500">
          Suggested action
        </p>
        <p className="mt-3 text-sm font-light leading-relaxed text-stone-800">
          {plan.suggestedAction}
        </p>
      </div>
    </article>
  );
}

function AutomationPlan({ plan }: { plan: NurturePlan }) {
  return (
    <article className="border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <CalendarClock className="h-4 w-4 text-stone-500" strokeWidth={1.5} />
        <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">
          Follow-Up Plan
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {plan.steps.map((step, index) => (
          <div key={`${plan.timeline}-${step.when}`} className="grid grid-cols-[2rem_1fr] gap-4">
            <div
              className={`grid h-8 w-8 place-items-center rounded-full border ${
                index === 0
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 bg-stone-50 text-stone-500"
              }`}
            >
              {index === 0 ? (
                <Send className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <Clock className="h-4 w-4" strokeWidth={1.5} />
              )}
            </div>
            <div className="border-b border-stone-100 pb-5 last:border-b-0 last:pb-0">
              <p className="text-[10px] uppercase tracking-[0.28em] text-stone-400">
                {step.when}
              </p>
              <h3 className="mt-2 font-serif text-xl text-stone-900">{step.title}</h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-stone-600">
                {step.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function TextPreview({ plan }: { plan: NurturePlan }) {
  return (
    <article className="border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <MessageSquareText className="h-4 w-4 text-stone-500" strokeWidth={1.5} />
        <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">
          Text Preview
        </p>
      </div>

      <div className="mt-6 border border-stone-200 bg-stone-50 p-5">
        <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400">
          First automated text
        </p>
        <p className="mt-4 text-sm font-light leading-relaxed text-stone-800">
          {plan.firstText}
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        {plan.steps.slice(1).map((step) => (
          <div key={step.when} className="border border-stone-200 p-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-stone-400">{step.when}</p>
            <p className="mt-2 text-sm font-light leading-relaxed text-stone-700">
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}

function AgentAlert({ plan }: { plan: NurturePlan }) {
  return (
    <article className="border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <Bell className="h-4 w-4 text-stone-500" strokeWidth={1.5} />
        <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">
          Agent Alert Preview
        </p>
      </div>

      <div className="mt-6 border border-stone-200 bg-stone-50 p-5 text-sm font-light leading-relaxed text-stone-700 shadow-sm">
        <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400">
          Text to agent
        </p>
        <p className="mt-4 font-medium text-stone-900">New nurtured lead from your website</p>
        <p className="mt-3">{plan.agentAlert}</p>
      </div>

      <div className="mt-6 border border-stone-200 p-5">
        <p className="text-[10px] uppercase tracking-[0.32em] text-stone-500">
          Why this matters
        </p>
        <p className="mt-3 text-sm font-light leading-relaxed text-stone-600">
          The realtor sees who is urgent and who can be kept warm quietly, instead of treating
          every form submission the same way.
        </p>
      </div>
    </article>
  );
}

function NurtureRules() {
  const rules = [
    "Stop the sequence when the lead replies.",
    "Stop if the lead texts STOP or asks not to be contacted.",
    "Pause solicitation if they say they are already working with another agent.",
    "Move ASAP and 1-3 month leads higher in the agent alert queue.",
  ];

  return (
    <article className="border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-4 w-4 text-stone-500" strokeWidth={1.5} />
        <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">
          Nurture Rules
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        {rules.map((rule) => (
          <div key={rule} className="flex gap-3 border border-stone-200 p-4">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-stone-700" strokeWidth={1.5} />
            <p className="text-sm font-light leading-relaxed text-stone-700">{rule}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function DemoPath() {
  return (
    <article className="border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <PauseCircle className="h-4 w-4 text-stone-500" strokeWidth={1.5} />
        <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">Demo Path</p>
      </div>

      <div className="mt-6 space-y-4 text-sm font-light leading-relaxed text-stone-600">
        <p>
          Use this after the buyer or seller form. The form answer becomes the timeline, the
          timeline chooses the nurture plan, and the plan shows the next texts.
        </p>
        <p>
          In the live version, this would connect to the real text provider and database. In the
          demo, it shows the logic clearly without pretending the backend is finished.
        </p>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/lrn-inbox"
          className="inline-flex min-h-12 items-center justify-center gap-2 bg-stone-900 px-5 py-3 text-center text-[11px] uppercase tracking-[0.24em] text-[#faf7f2] transition-colors hover:bg-stone-800"
        >
          LRN Inbox
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Link>
        <Link
          to="/agent-preview"
          className="inline-flex min-h-12 items-center justify-center gap-2 border border-stone-300 px-5 py-3 text-center text-[11px] uppercase tracking-[0.24em] text-stone-800 transition-colors hover:bg-stone-50"
        >
          Lead Recovery
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Link>
        <Link
          to="/start-here"
          className="inline-flex min-h-12 items-center justify-center gap-2 border border-stone-300 px-5 py-3 text-center text-[11px] uppercase tracking-[0.24em] text-stone-800 transition-colors hover:bg-stone-50"
        >
          Start Here
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Link>
      </div>
    </article>
  );
}

function PreviewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.28em] text-stone-400">{label}</dt>
      <dd className="mt-1 text-sm font-light leading-relaxed text-stone-800">{value}</dd>
    </div>
  );
}
