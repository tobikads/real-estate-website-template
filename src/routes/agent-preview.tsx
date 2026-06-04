import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Bell,
  Check,
  Clock,
  House,
  Mail,
  MessageSquareText,
  PhoneMissed,
  RefreshCw,
} from "lucide-react";

import { Header } from "@/components/Header";
import { REALTOR_PROFILE } from "@/data/realtor-profile";

const realtorFirstName = REALTOR_PROFILE.name.split(" ")[0] || REALTOR_PROFILE.name;
type DemoMode = "idle" | "missed-call" | "zillow";

export const Route = createFileRoute("/agent-preview")({
  head: () => ({
    meta: [
      { title: `Agent Preview | ${REALTOR_PROFILE.name}` },
      {
        name: "description",
        content:
          "Demo-only lead recovery preview showing missed calls, alerts, and follow-up next steps.",
      },
    ],
  }),
  component: AgentPreviewPage,
});

const missedCallLead = {
  phone: "(404) 555-0188",
  source: "Website phone button",
  time: "Just now",
  status: "Recovery text sent",
  textToCaller: `Hi, this is ${realtorFirstName}. Sorry I missed your call. You can start here and tell me if you're buying, selling, or have a question: /start-here`,
};

const zillowLead = {
  name: "Marcus Johnson",
  source: "Zillow Inquiry",
  time: "Just now",
  property: "1020 Ivy Ridge Court",
  propertySlug: "1020-ivy-ridge-court",
  message: "I'm interested in this property and would like more information.",
  signal: "Forwarded Zillow lead email + Zillow tracking number",
  status: "Property-aware lead captured",
  textToLead: `Hi Marcus, this is ${realtorFirstName}. I saw your Zillow request about 1020 Ivy Ridge Court. I can help with availability, showings, or similar homes. This quick link helps me send the right next step: /buyer?source=zillow&property=1020-ivy-ridge-court Reply STOP to opt out.`,
};

const sampleLeads = [
  {
    type: "Buyer lead",
    name: "Tobi Rakari",
    source: "Website buyer form",
    contact: "Text preferred · (404) 555-0188",
    received: "2 minutes ago",
    context: "Midtown search, $350k-$500k, 1-3 months",
    details: ["3+ beds", "2+ baths", "Single-family home", "Updated kitchen"],
    nextAction: "Text within 5 minutes",
    reason: "Active timeline, budget selected, and not currently represented.",
    automation: "Buyer intro text ready. Pause if they reply.",
    status: "Hot buyer",
  },
  {
    type: "Seller lead",
    name: "Homeowner in Marietta",
    source: "Website seller form",
    contact: "Call preferred · (404) 555-0194",
    received: "8 minutes ago",
    context: "Preliminary range $790k-$925k",
    details: ["3-6 months", "Well maintained", "HVAC updated", "Older roof"],
    nextAction: "Offer value review",
    reason:
      "The home has strong signals, but roof age should be reviewed before a stronger estimate.",
    automation: "Seller value-review invite ready. Follow up tomorrow if no response.",
    status: "Needs review",
  },
];

function AgentPreviewPage() {
  const [demoMode, setDemoMode] = useState<DemoMode>("idle");
  const hasMissedCall = demoMode === "missed-call";
  const hasZillowLead = demoMode === "zillow";

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900">
      <Header />
      <main className="pt-28 lg:pt-32">
        <section className="border-b border-stone-200/70 px-6 pb-14 pt-10 lg:px-10 lg:pb-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-[11px] uppercase tracking-[0.35em] text-stone-500">
              Demo Agent View
            </p>
            <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <h1 className="max-w-3xl font-serif text-4xl leading-[1.08] text-stone-950 sm:text-5xl lg:text-6xl">
                  Lead recovery preview
                </h1>
                <p className="mt-6 max-w-2xl text-base font-light leading-relaxed text-stone-600">
                  This shows the realtor what happens after someone misses a call or a Zillow
                  inquiry - how each becomes a cleaner, property-aware lead.
                </p>
              </div>
              <div className="border border-stone-200 bg-white p-5 shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">
                  Demo controls
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setDemoMode("missed-call")}
                    className={`inline-flex min-h-12 items-center gap-3 px-5 py-3 text-[11px] uppercase tracking-[0.26em] transition-colors ${
                      hasMissedCall
                        ? "bg-stone-900 text-[#faf7f2]"
                        : "border border-stone-300 text-stone-900 hover:border-stone-900"
                    }`}
                  >
                    <PhoneMissed className="h-4 w-4" strokeWidth={1.5} />
                    Simulate Missed Call
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoMode("zillow")}
                    className={`inline-flex min-h-12 items-center gap-3 px-5 py-3 text-[11px] uppercase tracking-[0.26em] transition-colors ${
                      hasZillowLead
                        ? "bg-stone-900 text-[#faf7f2]"
                        : "border border-stone-300 text-stone-900 hover:border-stone-900"
                    }`}
                  >
                    <House className="h-4 w-4" strokeWidth={1.5} />
                    Zillow Lead Active
                  </button>
                  {demoMode !== "idle" && (
                    <button
                      type="button"
                      onClick={() => setDemoMode("idle")}
                      className="inline-flex min-h-12 items-center gap-2 px-2 py-3 text-[11px] uppercase tracking-[0.26em] text-stone-500 transition-colors hover:text-stone-900"
                    >
                      <RefreshCw className="h-4 w-4" strokeWidth={1.5} />
                      Reset
                    </button>
                  )}
                </div>
                <p className="mt-4 text-xs font-light leading-relaxed text-stone-500">
                  Demo only. In a live version, these events could come from a phone provider or
                  Zillow's lead pipeline and trigger a private text or email alert.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-12 lg:px-10 lg:py-16">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_0.9fr]">
            <LeadCapturePanel demoMode={demoMode} />
            <AlertPreview demoMode={demoMode} />
          </div>
        </section>

        <section className="border-t border-stone-200/70 px-6 py-12 lg:px-10 lg:py-16">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <TimelinePanel demoMode={demoMode} />
            <LeadInboxPanel />
          </div>
        </section>
      </main>
    </div>
  );
}

function LeadCapturePanel({ demoMode }: { demoMode: DemoMode }) {
  const hasMissedCall = demoMode === "missed-call";

  if (demoMode === "zillow") {
    return (
      <article className="border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">
              Zillow Inquiry
            </p>
            <h2 className="mt-4 font-serif text-3xl text-stone-950">{zillowLead.name}</h2>
            <p className="mt-2 text-sm font-light leading-relaxed text-stone-600">
              asked about {zillowLead.property}
            </p>
          </div>
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-stone-900 text-white">
            <House className="h-5 w-5" strokeWidth={1.5} />
          </div>
        </div>

        <blockquote className="mt-6 border-l-2 border-stone-900 pl-4 text-sm italic leading-relaxed text-stone-700">
          "{zillowLead.message}"
        </blockquote>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <PreviewField label="Source" value={zillowLead.source} />
          <PreviewField label="Time" value={zillowLead.time} />
          <PreviewField label="Signal" value={zillowLead.signal} />
          <PreviewField label="Status" value={zillowLead.status} />
        </dl>

        <div className="mt-8 border border-stone-300 bg-stone-50 p-5">
          <p className="text-[10px] uppercase tracking-[0.32em] text-stone-500">
            Automated text to lead
          </p>
          <p className="mt-3 text-sm font-light leading-relaxed text-stone-700">
            {zillowLead.textToLead}
          </p>
        </div>

        <div className="mt-5 border border-stone-200 p-5">
          <p className="text-[10px] uppercase tracking-[0.32em] text-stone-500">
            What happens next
          </p>
          <p className="mt-3 text-sm font-light leading-relaxed text-stone-700">
            The buyer flow opens with the Zillow property already attached, so Marcus does not
            start from zero. A few quick answers tell {realtorFirstName} whether to confirm a
            showing or send close alternatives.
          </p>
          <Link
            to="/buyer"
            search={{ source: "zillow", property: zillowLead.propertySlug }}
            className="mt-5 inline-flex min-h-12 items-center gap-3 bg-stone-900 px-5 py-3 text-[11px] uppercase tracking-[0.26em] text-[#faf7f2] transition-colors hover:bg-stone-800"
          >
            Open Property-Aware Buyer Flow
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">Missed Call Lead</p>
          <h2 className="mt-4 font-serif text-3xl text-stone-950">
            {hasMissedCall ? missedCallLead.phone : "Ready to capture a missed call"}
          </h2>
        </div>
        <div
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${
            hasMissedCall ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-500"
          }`}
        >
          <PhoneMissed className="h-5 w-5" strokeWidth={1.5} />
        </div>
      </div>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <PreviewField label="Source" value={hasMissedCall ? missedCallLead.source : "Waiting"} />
        <PreviewField label="Time" value={hasMissedCall ? missedCallLead.time : "Not triggered"} />
        <PreviewField
          label="Status"
          value={hasMissedCall ? missedCallLead.status : "No missed call yet"}
        />
        <PreviewField
          label="Suggested action"
          value={hasMissedCall ? "No manual step yet" : "Simulate the call first"}
        />
      </dl>

      <div className="mt-8 border border-stone-300 bg-stone-50 p-5">
        <p className="text-[10px] uppercase tracking-[0.32em] text-stone-500">
          Automated text to caller
        </p>
        <p className="mt-3 text-sm font-light leading-relaxed text-stone-700">
          {hasMissedCall
            ? missedCallLead.textToCaller
            : "Click Simulate Missed Call to show how the website catches the first sign of interest before a form is submitted."}
        </p>
      </div>

      <div className="mt-5 border border-stone-200 p-5">
        <p className="text-[10px] uppercase tracking-[0.32em] text-stone-500">What happens next</p>
        <p className="mt-3 text-sm font-light leading-relaxed text-stone-700">
          {hasMissedCall
            ? "The agent can wait for the caller to choose Buyer, Seller, or Question. If they fill out a form, this card updates with their info, urgency, and suggested follow-up."
            : "After a missed call, the system can send the Start Here text first, then organize the lead once the caller responds."}
        </p>
        <Link
          to="/start-here"
          className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-stone-900 underline underline-offset-8 transition-colors hover:text-stone-600"
        >
          Open Start Here
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Link>
      </div>
    </article>
  );
}

function AlertPreview({ demoMode }: { demoMode: DemoMode }) {
  const hasMissedCall = demoMode === "missed-call";
  const hasZillowLead = demoMode === "zillow";
  const subject = hasZillowLead
    ? `Subject: New Zillow inquiry - ${zillowLead.property}`
    : "Subject: Missed lead call from your website";
  const body = hasZillowLead
    ? `${zillowLead.name} asked about ${zillowLead.property} through Zillow. A property-aware text was automatically sent with a link to a buyer flow that already has the home attached. Once Marcus answers a few questions, you'll see availability fit or close alternatives.`
    : hasMissedCall
      ? `You missed a call from ${missedCallLead.phone}. A Start Here text was automatically sent so they can choose Buyer, Seller, or Question. If they fill out a form, you'll get their info and the suggested next step.`
      : "When a call is missed or a Zillow inquiry comes in, this panel shows the private alert the agent would receive.";

  return (
    <article className="border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <Mail className="h-4 w-4 text-stone-500" strokeWidth={1.5} />
        <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">Alert Preview</p>
      </div>

      <div className="mt-6 rounded-lg border border-stone-200 bg-stone-50 p-5 text-sm font-light leading-relaxed text-stone-700 shadow-sm">
        <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400">
          Email - {demoMode !== "idle" ? "just now" : "preview"}
        </p>
        <p className="mt-4 font-medium text-stone-900">{subject}</p>
        <p className="mt-3">{body}</p>
      </div>

      <div className="mt-6 border border-stone-200 p-5">
        <div className="flex items-center gap-3">
          <MessageSquareText className="h-4 w-4 text-stone-500" strokeWidth={1.5} />
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Live version</p>
        </div>
        <p className="mt-3 text-sm font-light leading-relaxed text-stone-600">
          This demo uses an email-style preview. In the real version, the same alert could be sent
          as a text to the agent and a follow-up text to the lead.
        </p>
        <Link
          to="/lead-nurture"
          className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-stone-900 underline underline-offset-8 transition-colors hover:text-stone-600"
        >
          View Nurture Preview
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Link>
        <Link
          to="/lrn-inbox"
          className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-stone-900 underline underline-offset-8 transition-colors hover:text-stone-600"
        >
          Open LRN Inbox
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Link>
      </div>
    </article>
  );
}

function TimelinePanel({ demoMode }: { demoMode: DemoMode }) {
  const hasMissedCall = demoMode === "missed-call";
  const hasZillowLead = demoMode === "zillow";
  const items = hasZillowLead
    ? [
        {
          icon: House,
          title: "Zillow inquiry",
          body: `${zillowLead.name} asks about ${zillowLead.property}.`,
          active: true,
        },
        {
          icon: Bell,
          title: "Agent alert",
          body: "The agent receives the property-aware lead summary right away.",
          active: true,
        },
        {
          icon: MessageSquareText,
          title: "Property-aware text",
          body: "The lead gets a buyer flow that already knows which home they asked about.",
          active: true,
        },
        {
          icon: Check,
          title: "Lead enriched",
          body: "A few answers turn the inquiry into availability, showing, or alternatives context.",
          active: false,
        },
      ]
    : [
        {
          icon: PhoneMissed,
          title: "Missed call",
          body: hasMissedCall ? "Caller reached out but did not get an answer." : "Waiting for call.",
          active: hasMissedCall,
        },
        {
          icon: Bell,
          title: "Agent alert",
          body: hasMissedCall
            ? "Agent is notified, but the first recovery text already went out."
            : "Triggers after the missed call.",
          active: hasMissedCall,
        },
        {
          icon: MessageSquareText,
          title: "Start Here link",
          body: "Caller automatically receives a clean path into Buyer, Seller, or Question.",
          active: hasMissedCall,
        },
        {
          icon: Check,
          title: "Lead enriched",
          body: "Form answers turn the missed call into a better lead summary.",
          active: false,
        },
      ];

  return (
    <article className="border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">Lead Timeline</p>
      <div className="mt-6 space-y-5">
        {items.map((item) => (
          <div key={item.title} className="grid grid-cols-[2rem_1fr] gap-4">
            <div
              className={`grid h-8 w-8 place-items-center rounded-full border ${
                item.active
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 bg-stone-50 text-stone-400"
              }`}
            >
              <item.icon className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-serif text-lg text-stone-900">{item.title}</p>
              <p className="mt-1 text-sm font-light leading-relaxed text-stone-600">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function LeadInboxPanel() {
  return (
    <article className="border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <Clock className="h-4 w-4 text-stone-500" strokeWidth={1.5} />
        <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">Other Lead Cards</p>
      </div>

      <div className="mt-6 grid gap-4">
        {sampleLeads.map((lead) => (
          <div key={lead.type} className="border border-stone-200 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-stone-400">
                  {lead.type}
                </p>
                <h3 className="mt-2 font-serif text-xl text-stone-900">{lead.name}</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-stone-600">
                  {lead.context}
                </p>
              </div>
              <span className="w-fit border border-stone-300 px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-stone-700">
                {lead.status}
              </span>
            </div>

            <dl className="mt-5 grid gap-4 border-t border-stone-100 pt-5 sm:grid-cols-2">
              <PreviewField label="Source" value={lead.source} />
              <PreviewField label="Contact" value={lead.contact} />
              <PreviewField label="Received" value={lead.received} />
              <PreviewField label="Automation" value={lead.automation} />
            </dl>

            <div className="mt-5 flex flex-wrap gap-2">
              {lead.details.map((detail) => (
                <span
                  key={detail}
                  className="border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-light text-stone-700"
                >
                  {detail}
                </span>
              ))}
            </div>

            <p className="mt-4 border-l-2 border-stone-900 pl-4 text-sm font-light text-stone-800">
              {lead.nextAction}
            </p>
            <p className="mt-3 text-sm font-light leading-relaxed text-stone-500">{lead.reason}</p>
          </div>
        ))}
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
