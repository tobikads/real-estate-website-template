import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Inbox,
  LockKeyhole,
  MessageSquareText,
  PhoneMissed,
  ShieldCheck,
} from "lucide-react";

import { Header } from "@/components/Header";
import { REALTOR_PROFILE } from "@/data/realtor-profile";

export const Route = createFileRoute("/lrn-inbox")({
  head: () => ({
    meta: [
      { title: `LRN Inbox | ${REALTOR_PROFILE.name}` },
      {
        name: "description",
        content:
          "Demo-only private agent inbox for recovered and nurtured real estate leads.",
      },
    ],
  }),
  component: LrnInboxPage,
});

type ViewKey = "today" | "week" | "month";

type InboxStat = {
  label: string;
  value: string;
  note: string;
};

type AutomationStep = {
  status: "Done" | "Scheduled" | "Waiting" | "Paused";
  timing: string;
  text: string;
};

type RealtorFollowUp = {
  status: "Do now" | "Review" | "Waiting" | "Paused";
  timing: string;
  action: string;
  reason: string;
};

type InboxLead = {
  name: string;
  source: string;
  status: string;
  priority: string;
  timeline: string;
  lastContact: string;
  nextAction: string;
  details: string[];
  automatedFollowUps: AutomationStep[];
  realtorFollowUps: RealtorFollowUp[];
};

type MonthlyInsight = {
  label: string;
  metric: string;
  title: string;
  summary: string;
  details: string[];
  takeaway: string;
};

type InboxView = {
  label: string;
  title: string;
  subtitle: string;
  stats: InboxStat[];
  leads: InboxLead[];
  focus: string;
  monthlyInsights?: MonthlyInsight[];
};

const viewOrder: ViewKey[] = ["today", "week", "month"];

const inboxViews: Record<ViewKey, InboxView> = {
  today: {
    label: "Today",
    title: "Who needs attention today?",
    subtitle:
      "A quick daily view of new leads, recovered calls, replies, and urgent follow-up.",
    focus:
      "Use this view at the start or end of the day so the agent knows who needs action first.",
    stats: [
      { label: "New leads", value: "5", note: "Captured today" },
      { label: "Need action", value: "2", note: "Hot or time-sensitive" },
      { label: "Missed calls", value: "1", note: "Recovery text sent" },
      { label: "In nurture", value: "3", note: "No manual chase needed" },
    ],
    leads: [
      {
        name: "(404) 555-0188",
        source: "Missed call",
        status: "Recovery text sent",
        priority: "New",
        timeline: "Waiting for Start Here response",
        lastContact: "Start Here text sent just now",
        nextAction: "No manual step yet. Wait for the caller to choose Buyer, Seller, or Question.",
        details: ["Website phone button", "No form submitted yet", "Caller has the Start Here link"],
        automatedFollowUps: [
          {
            status: "Done",
            timing: "Just now",
            text: "Sent missed-call text with Start Here link.",
          },
          {
            status: "Scheduled",
            timing: "24 hours",
            text: "Send gentle check-in if no form is submitted.",
          },
          {
            status: "Scheduled",
            timing: "Day 3",
            text: "Send one more Start Here reminder, then stop if they reply or submit.",
          },
        ],
        realtorFollowUps: [
          {
            status: "Waiting",
            timing: "Now",
            action: "Do nothing manually yet.",
            reason: "The system already sent the recovery text. Wait until they choose Buyer, Seller, or Question.",
          },
          {
            status: "Review",
            timing: "After form submit",
            action: "Review the lead once a form comes in.",
            reason: "The next useful step depends on whether this caller is buying, selling, or asking a question.",
          },
          {
            status: "Do now",
            timing: "If they call back",
            action: "Ask which path fits them.",
            reason: "Buyer, seller, or question is the fastest way to route them without guessing.",
          },
        ],
      },
      {
        name: "Jasmine Brown",
        source: "Buyer form",
        status: "Hot buyer",
        priority: "High",
        timeline: "ASAP",
        lastContact: "Intro text ready",
        nextAction: "Text within 5 minutes and offer a quick call or showing plan.",
        details: ["Marietta", "$350k-$425k", "3 beds", "Backyard", "Good schools"],
        automatedFollowUps: [
          {
            status: "Done",
            timing: "On submit",
            text: "Showed closest-fit buyer result and saved the buyer summary.",
          },
          {
            status: "Scheduled",
            timing: "Tomorrow",
            text: "Send light check-in if the buyer does not reply.",
          },
          {
            status: "Scheduled",
            timing: "Day 3",
            text: "Send helpful listing follow-up unless the buyer replies first.",
          },
        ],
        realtorFollowUps: [
          {
            status: "Do now",
            timing: "Within 5 minutes",
            action: "Text within 5 minutes.",
            reason: "ASAP buyer with clear budget, area, and must-haves.",
          },
          {
            status: "Do now",
            timing: "First reply",
            action: "Offer a quick call or showing plan.",
            reason: "The form gives enough context to start a specific conversation instead of a generic follow-up.",
          },
          {
            status: "Review",
            timing: "Before sending listings",
            action: "Check agent status and must-haves.",
            reason: "They are not represented, and the backyard/good schools notes should shape the first recommendation.",
          },
        ],
      },
      {
        name: "Marcus Hill",
        source: "Seller form",
        status: "Needs review",
        priority: "Medium",
        timeline: "3-6 months",
        lastContact: "Value review invite ready",
        nextAction: "Offer a value review and ask about the roof before giving a stronger estimate.",
        details: ["Marietta homeowner", "$790k-$925k preliminary range", "HVAC updated", "Older roof"],
        automatedFollowUps: [
          {
            status: "Done",
            timing: "On submit",
            text: "Sent preliminary range page and saved seller signals.",
          },
          {
            status: "Scheduled",
            timing: "7 days",
            text: "Send seller prep checklist if no appointment is booked.",
          },
          {
            status: "Scheduled",
            timing: "Monthly",
            text: "Send local market note while they stay in nurture.",
          },
        ],
        realtorFollowUps: [
          {
            status: "Review",
            timing: "Today",
            action: "Offer a value review.",
            reason: "The lead is not urgent, but the range and timeline show real seller interest.",
          },
          {
            status: "Do now",
            timing: "Before price talk",
            action: "Ask about the roof before discussing price confidence.",
            reason: "The older roof affects how safe the preliminary range is.",
          },
          {
            status: "Waiting",
            timing: "After invite",
            action: "Let nurture carry the next touch if they do not respond.",
            reason: "A 3-6 month seller should feel helped, not chased.",
          },
        ],
      },
    ],
  },
  week: {
    label: "This Week",
    title: "Which leads need to stay warm?",
    subtitle:
      "A weekly view of nurture touches, quiet follow-ups, and leads that are getting closer.",
    focus:
      "Use this view to avoid losing people who are not urgent today but are still worth keeping warm.",
    stats: [
      { label: "Follow-ups due", value: "9", note: "Scheduled this week" },
      { label: "Warm leads", value: "7", note: "1-6 month timelines" },
      { label: "Replies", value: "2", note: "Need agent review" },
      { label: "Paused", value: "1", note: "Already has agent" },
    ],
    leads: [
      {
        name: "Tobi Rakari",
        source: "Buyer form",
        status: "Nurture buyer",
        priority: "Medium",
        timeline: "1-3 months",
        lastContact: "Checked in yesterday",
        nextAction: "Send a helpful Midtown listing follow-up if there is no reply by tomorrow.",
        details: ["Midtown", "$350k-$500k", "Updated kitchen", "Not represented"],
        automatedFollowUps: [
          {
            status: "Done",
            timing: "Yesterday",
            text: "Sent first check-in after buyer form.",
          },
          {
            status: "Scheduled",
            timing: "Tomorrow",
            text: "Send no-response check-in.",
          },
          {
            status: "Scheduled",
            timing: "Day 3",
            text: "Send Midtown listing follow-up if still quiet.",
          },
        ],
        realtorFollowUps: [
          {
            status: "Review",
            timing: "This week",
            action: "Send one personal Midtown listing note.",
            reason: "This buyer is 1-3 months out, so a useful listing keeps the conversation warm without pressure.",
          },
          {
            status: "Waiting",
            timing: "After next reply",
            action: "Ask if their timeline moved up.",
            reason: "A 1-3 month buyer may become active quickly if the right listing appears.",
          },
          {
            status: "Review",
            timing: "Before Friday",
            action: "Check whether the automated check-in got a reply.",
            reason: "If they engage, the realtor should step in personally instead of letting automation keep talking.",
          },
        ],
      },
      {
        name: "Homeowner in Brookhaven",
        source: "Seller form",
        status: "Seller nurture",
        priority: "Low",
        timeline: "6+ months",
        lastContact: "Seller prep checklist sent",
        nextAction: "Let the nurture sequence carry this lead until timing gets closer.",
        details: ["Brookhaven", "Just curious", "Well maintained", "No urgent sale pressure"],
        automatedFollowUps: [
          {
            status: "Done",
            timing: "This week",
            text: "Sent seller prep checklist.",
          },
          {
            status: "Scheduled",
            timing: "30 days",
            text: "Send Brookhaven market update.",
          },
          {
            status: "Scheduled",
            timing: "60 days",
            text: "Ask whether their listing timeline has changed.",
          },
        ],
        realtorFollowUps: [
          {
            status: "Waiting",
            timing: "This week",
            action: "No personal follow-up this week.",
            reason: "They are just curious and have no urgent sale pressure.",
          },
          {
            status: "Review",
            timing: "Next month",
            action: "Review next month if they engage with the market update.",
            reason: "Manual attention should wait until the lead shows stronger intent.",
          },
          {
            status: "Waiting",
            timing: "After market update",
            action: "Only step in if they reply or ask for a value review.",
            reason: "The system can keep them warm without making the realtor chase a cold seller.",
          },
        ],
      },
      {
        name: "Avery Cole",
        source: "Buyer form",
        status: "Ethics pause",
        priority: "Paused",
        timeline: "ASAP",
        lastContact: "General info only",
        nextAction: "Do not solicit. Buyer says they are already working with another agent.",
        details: ["Question about Midtown homes", "Currently represented", "Keep informational only"],
        automatedFollowUps: [
          {
            status: "Paused",
            timing: "Now",
            text: "Paused property recommendations and nurture texts.",
          },
          {
            status: "Paused",
            timing: "Future",
            text: "No listing follow-ups while they are represented.",
          },
        ],
        realtorFollowUps: [
          {
            status: "Paused",
            timing: "Now",
            action: "Do not solicit.",
            reason: "Buyer says they are already working with another agent.",
          },
          {
            status: "Paused",
            timing: "Only if they ask",
            action: "Only answer general questions if they reach out.",
            reason: "This keeps the follow-up ethical and low-risk.",
          },
          {
            status: "Review",
            timing: "Before any response",
            action: "Keep the reply informational.",
            reason: "The inbox should remind the realtor why this lead is paused.",
          },
        ],
      },
    ],
  },
  month: {
    label: "This Month",
    title: "Is the LRN system working?",
    subtitle:
      "A reporting view of captured leads, lead mix, recovered calls, and what the realtor should understand from the month.",
    focus:
      "Use this view as a monthly readout, not an action queue. It shows what happened and what the realtor can learn from it.",
    stats: [
      { label: "Leads captured", value: "23", note: "This month" },
      { label: "Buyers", value: "12", note: "Most common path" },
      { label: "Sellers", value: "7", note: "Value review interest" },
      { label: "Questions", value: "4", note: "Lower-pressure leads" },
      { label: "Calls recovered", value: "5", note: "Would have been missed" },
    ],
    leads: [],
    monthlyInsights: [
      {
        label: "Lead Mix",
        metric: "23 total leads",
        title: "Buyers were the strongest path this month.",
        summary:
          "The LRN system captured more buyer interest than seller or question traffic, so the realtor can see where the current demand is coming from.",
        details: ["12 buyers", "7 sellers", "4 questions", "5 missed calls recovered"],
        takeaway:
          "Buyer interest is carrying the month, so the agent should keep the buyer Start Here path easy to find.",
      },
      {
        label: "Area Demand",
        metric: "4 active areas",
        title: "Marietta and Midtown showed up most often.",
        summary:
          "The inbox groups repeated area requests so the realtor can see what people are asking for without reading every lead one by one.",
        details: ["Marietta", "Midtown", "Brookhaven", "Smyrna"],
        takeaway:
          "Use these areas to decide which listings, examples, or local notes deserve more attention next month.",
      },
      {
        label: "Response Signals",
        metric: "2 replies",
        title: "A small number of warm leads replied.",
        summary:
          "The monthly view keeps the realtor aware of whether follow-up is creating real conversations, not just sending messages.",
        details: ["2 replies this week", "9 leads still warming", "1 lead paused for ethics"],
        takeaway:
          "The realtor can focus attention on replies and hotter timelines instead of manually chasing every quiet lead.",
      },
      {
        label: "Recovered Calls",
        metric: "5 saved calls",
        title: "Missed calls became trackable leads.",
        summary:
          "Instead of disappearing after a missed call, callers were routed back into the Start Here flow where their intent could be captured.",
        details: ["5 missed calls recovered", "3 chose a Start Here path", "2 still waiting"],
        takeaway:
          "This is the clearest monthly proof that the LRN system is catching interest that could have been lost.",
      },
    ],
  },
};

function LrnInboxPage() {
  const [activeView, setActiveView] = useState<ViewKey>("today");
  const view = inboxViews[activeView];

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900">
      <Header />
      <main className="pt-28 lg:pt-32">
        <section className="border-b border-stone-200/70 px-6 pb-12 pt-10 lg:px-10 lg:pb-16">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-stone-500">
                Private Agent View
              </p>
              <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-[1.08] text-stone-950 sm:text-5xl lg:text-6xl">
                LRN Inbox
              </h1>
              <p className="mt-6 max-w-2xl text-base font-light leading-relaxed text-stone-600">
                A simple place for the agent to see recovered leads, what the LRN system has
                already handled, and which personal follow-ups still need the realtor.
              </p>
            </div>

            <div className="border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <LockKeyhole className="h-4 w-4 text-stone-500" strokeWidth={1.5} />
                <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">
                  Demo access note
                </p>
              </div>
              <p className="mt-4 text-sm font-light leading-relaxed text-stone-600">
                In the live version, this page would require a private realtor login. For the demo,
                it uses sample data to show lead actions, follow-up logs, and monthly readouts.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-10 lg:px-10 lg:py-12">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-3 sm:grid-cols-3">
              {viewOrder.map((key) => {
                const option = inboxViews[key];
                const active = key === activeView;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveView(key)}
                    className={`min-h-14 border px-5 py-3 text-left transition-colors ${
                      active
                        ? "border-stone-900 bg-stone-900 text-[#faf7f2]"
                        : "border-stone-200 bg-white text-stone-800 hover:bg-stone-50"
                    }`}
                  >
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.26em]">
                      {option.label}
                    </span>
                    <span className={`mt-1 block text-xs ${active ? "text-stone-200" : "text-stone-500"}`}>
                      {option.title}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {view.stats.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-stone-200/70 px-6 py-12 lg:px-10 lg:py-16">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            {activeView === "month" ? <MonthlyReport view={view} /> : <LeadQueue view={view} />}
            <InboxSidePanel view={view} activeView={activeView} />
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ stat }: { stat: InboxStat }) {
  return (
    <article className="border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-[10px] uppercase tracking-[0.28em] text-stone-400">{stat.label}</p>
      <p className="mt-3 font-serif text-4xl leading-none text-stone-950">{stat.value}</p>
      <p className="mt-3 text-xs font-light leading-relaxed text-stone-500">{stat.note}</p>
    </article>
  );
}

function LeadQueue({ view }: { view: InboxView }) {
  return (
    <section>
      <div>
        <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">Lead Queue</p>
        <h2 className="mt-3 font-serif text-3xl text-stone-950">{view.title}</h2>
        <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-stone-600">
          {view.subtitle}
        </p>
      </div>

      <div className="mt-7 grid gap-5">
        {view.leads.map((lead) => (
          <LeadCard key={`${view.label}-${lead.name}`} lead={lead} />
        ))}
      </div>
    </section>
  );
}

function MonthlyReport({ view }: { view: InboxView }) {
  const insights = view.monthlyInsights ?? [];

  return (
    <section>
      <div>
        <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">
          Monthly Report
        </p>
        <h2 className="mt-3 font-serif text-3xl text-stone-950">{view.title}</h2>
        <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-stone-600">
          {view.subtitle}
        </p>
      </div>

      <div className="mt-7 grid gap-5">
        {insights.map((insight) => (
          <MonthlyInsightCard key={insight.label} insight={insight} />
        ))}
      </div>
    </section>
  );
}

function MonthlyInsightCard({ insight }: { insight: MonthlyInsight }) {
  return (
    <article className="border border-stone-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-stone-400">
            {insight.label}
          </p>
          <h3 className="mt-2 font-serif text-2xl text-stone-950">{insight.title}</h3>
        </div>
        <span className="border border-stone-900 bg-stone-900 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-[#faf7f2]">
          {insight.metric}
        </span>
      </div>

      <p className="mt-5 max-w-2xl text-sm font-light leading-relaxed text-stone-600">
        {insight.summary}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {insight.details.map((detail) => (
          <span
            key={detail}
            className="border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-light text-stone-700"
          >
            {detail}
          </span>
        ))}
      </div>

      <div className="mt-6 border-l border-stone-900 pl-4">
        <p className="text-[10px] uppercase tracking-[0.28em] text-stone-500">
          Realtor Readout
        </p>
        <p className="mt-2 text-sm font-light leading-relaxed text-stone-700">
          {insight.takeaway}
        </p>
      </div>
    </article>
  );
}

function LeadCard({ lead }: { lead: InboxLead }) {
  return (
    <article className="border border-stone-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-stone-400">
            {lead.source}
          </p>
          <h3 className="mt-2 font-serif text-2xl text-stone-950">{lead.name}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="border border-stone-900 bg-stone-900 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-[#faf7f2]">
            {lead.status}
          </span>
          <span className="border border-stone-300 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-stone-700">
            {lead.priority}
          </span>
        </div>
      </div>

      <dl className="mt-6 grid gap-4 border-t border-stone-100 pt-5 sm:grid-cols-3">
        <PreviewField label="Timeline" value={lead.timeline} />
        <PreviewField label="Last contact" value={lead.lastContact} />
        <PreviewField label="Realtor action" value={lead.nextAction} />
      </dl>

      <div className="mt-6 flex flex-wrap gap-2">
        {lead.details.map((detail) => (
          <span
            key={detail}
            className="border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-light text-stone-700"
          >
            {detail}
          </span>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="border border-stone-200 bg-stone-50 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-stone-500">
                Automated Follow-Ups
              </p>
              <p className="mt-1 text-xs font-light text-stone-500">
                Done or scheduled by the LRN system.
              </p>
            </div>
            <Clock className="h-4 w-4 shrink-0 text-stone-500" strokeWidth={1.5} />
          </div>
          <ul className="mt-4 space-y-3">
            {lead.automatedFollowUps.map((item) => (
              <li key={`${item.timing}-${item.text}`} className="border border-stone-200 bg-white p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <AutomationBadge status={item.status} />
                  <span className="text-[10px] uppercase tracking-[0.22em] text-stone-400">
                    {item.timing}
                  </span>
                </div>
                <p className="mt-2 text-sm font-light leading-relaxed text-stone-700">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-stone-300 bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-stone-500">
                Realtor Follow-Ups
              </p>
              <p className="mt-1 text-xs font-light text-stone-500">
                Recommended personal actions for the agent.
              </p>
            </div>
            <MessageSquareText className="h-4 w-4 shrink-0 text-stone-500" strokeWidth={1.5} />
          </div>
          <ul className="mt-4 space-y-3">
            {lead.realtorFollowUps.map((item) => (
              <li key={`${item.timing}-${item.action}`} className="border border-stone-200 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <RealtorFollowUpBadge status={item.status} />
                  <span className="text-[10px] uppercase tracking-[0.22em] text-stone-400">
                    {item.timing}
                  </span>
                </div>
                <p className="mt-3 font-serif text-lg leading-tight text-stone-950">
                  {item.action}
                </p>
                <p className="mt-1 text-sm font-light leading-relaxed text-stone-600">
                  {item.reason}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function RealtorFollowUpBadge({ status }: { status: RealtorFollowUp["status"] }) {
  const styles: Record<RealtorFollowUp["status"], string> = {
    "Do now": "border-stone-900 bg-stone-900 text-[#faf7f2]",
    Review: "border-stone-300 bg-stone-100 text-stone-700",
    Waiting: "border-stone-300 bg-white text-stone-600",
    Paused: "border-stone-300 bg-white text-stone-500",
  };

  return (
    <span className={`border px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] ${styles[status]}`}>
      {status}
    </span>
  );
}

function AutomationBadge({ status }: { status: AutomationStep["status"] }) {
  const styles: Record<AutomationStep["status"], string> = {
    Done: "border-stone-900 bg-stone-900 text-[#faf7f2]",
    Scheduled: "border-stone-300 bg-white text-stone-700",
    Waiting: "border-stone-300 bg-stone-100 text-stone-600",
    Paused: "border-stone-300 bg-white text-stone-500",
  };

  return (
    <span className={`border px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] ${styles[status]}`}>
      {status}
    </span>
  );
}

function InboxSidePanel({ view, activeView }: { view: InboxView; activeView: ViewKey }) {
  const rhythm =
    activeView === "today"
      ? "Daily"
      : activeView === "week"
        ? "Weekly"
        : "Monthly";
  const talkTrack =
    activeView === "month"
      ? "This monthly view is not a task list. It shows what the LRN system captured, which lead types were strongest, and what patterns the realtor should notice."
      : "After the LRN system captures a missed call, buyer form, seller form, or question, this is where the realtor sees what automation handled and what personal follow-up still needs attention.";

  return (
    <aside className="space-y-5">
      <article className="border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <Inbox className="h-4 w-4 text-stone-500" strokeWidth={1.5} />
          <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">
            {rhythm} Focus
          </p>
        </div>
        <p className="mt-5 text-sm font-light leading-relaxed text-stone-600">{view.focus}</p>
      </article>

      <article className="border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <MessageSquareText className="h-4 w-4 text-stone-500" strokeWidth={1.5} />
          <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">
            Demo Talk Track
          </p>
        </div>
        <p className="mt-5 text-sm font-light leading-relaxed text-stone-600">
          {talkTrack}
        </p>
      </article>

      <article className="border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-4 w-4 text-stone-500" strokeWidth={1.5} />
          <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">
            Live Version
          </p>
        </div>
        <ul className="mt-5 space-y-3 text-sm font-light leading-relaxed text-stone-600">
          <li className="flex gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-stone-700" strokeWidth={1.5} />
            <span>Require private realtor login.</span>
          </li>
          <li className="flex gap-3">
            <PhoneMissed className="mt-0.5 h-4 w-4 shrink-0 text-stone-700" strokeWidth={1.5} />
            <span>Merge missed calls and forms by phone number.</span>
          </li>
          <li className="flex gap-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-stone-700" strokeWidth={1.5} />
            <span>Use real follow-up timing from the database.</span>
          </li>
        </ul>
      </article>

      <article className="border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-4 w-4 text-stone-500" strokeWidth={1.5} />
          <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">Demo Path</p>
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            to="/lead-nurture"
            className="inline-flex min-h-12 items-center justify-center gap-2 bg-stone-900 px-5 py-3 text-center text-[11px] uppercase tracking-[0.24em] text-[#faf7f2] transition-colors hover:bg-stone-800"
          >
            Lead Nurture
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
          <Link
            to="/agent-preview"
            className="inline-flex min-h-12 items-center justify-center gap-2 border border-stone-300 px-5 py-3 text-center text-[11px] uppercase tracking-[0.24em] text-stone-800 transition-colors hover:bg-stone-50"
          >
            Lead Recovery
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      </article>
    </aside>
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
