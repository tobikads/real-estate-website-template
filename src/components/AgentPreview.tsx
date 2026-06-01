import type { ReactNode } from "react";
import { MessageSquare } from "lucide-react";

/**
 * Agent Preview — demo-only section shown beneath the customer-facing
 * buyer/seller result. Visualizes what the realtor would receive privately
 * (lead summary, suggested next action, follow-up cadence, text alert).
 *
 * Pure presentation: no backend, no real notifications.
 */

export type AgentPreviewItem = { label: string; value: string };

export type AgentPreviewProps = {
  subtitle: string;
  summaryTitle: string;       // e.g. "Lead Summary" or "Seller Lead Summary"
  summary: AgentPreviewItem[];
  nextAction: string;
  followUp: string[];         // bullet list lines
  textAlert: string;
};

export function AgentPreview({
  subtitle,
  summaryTitle,
  summary,
  nextAction,
  followUp,
  textAlert,
}: AgentPreviewProps) {
  return (
    <section
      aria-label="Agent preview"
      className="mt-10 border border-dashed border-stone-300 bg-stone-50/60"
    >
      {/* Header */}
      <header className="px-6 sm:px-10 pt-8 pb-6 border-b border-stone-200/70">
        <div className="flex items-center gap-3">
          <span className="text-[10px] tracking-[0.3em] uppercase text-stone-500 border border-stone-300 px-2 py-1">
            For the agent
          </span>
        </div>
        <h3 className="mt-4 font-serif text-2xl sm:text-3xl text-stone-900 leading-tight">
          Agent Preview
        </h3>
        <p className="mt-2 text-sm text-stone-600 font-light leading-relaxed">
          {subtitle}
        </p>
      </header>

      <div className="px-6 sm:px-10 py-8 space-y-10">
        {/* 1. Lead Summary */}
        <Block title={summaryTitle}>
          <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm font-light text-stone-800">
            {summary.map((row) => (
              <SummaryRow key={row.label} {...row} />
            ))}
          </dl>
        </Block>

        {/* 2. Suggested Next Action */}
        <Block title="Suggested Next Action">
          <p className="text-sm sm:text-base text-stone-800 font-light leading-relaxed border-l-2 border-stone-900 pl-4">
            {nextAction}
          </p>
        </Block>

        {/* 3. Follow-Up Preview */}
        <Block title="Follow-Up Preview">
          <ul className="space-y-2 text-sm text-stone-700 font-light">
            {followUp.map((line) => (
              <li key={line} className="flex gap-3">
                <span className="text-stone-400">—</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </Block>

        {/* 4. Text Alert Preview */}
        <Block title="Text Alert Preview">
          <div className="max-w-sm">
            <div className="rounded-2xl rounded-bl-sm bg-white border border-stone-200 px-4 py-3 text-sm text-stone-800 font-light leading-relaxed shadow-sm">
              <div className="flex items-center gap-2 mb-1.5 text-[10px] tracking-[0.25em] uppercase text-stone-400">
                <MessageSquare className="h-3 w-3" strokeWidth={1.5} />
                <span>Text · just now</span>
              </div>
              {textAlert}
            </div>
          </div>
        </Block>

        <p className="text-xs text-stone-500 font-light italic pt-2 border-t border-stone-200/70">
          Demo preview only. In the live version, this would be sent privately to the agent.
        </p>
      </div>
    </section>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.3em] uppercase text-stone-500 mb-4">
        {title}
      </p>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: AgentPreviewItem) {
  return (
    <div>
      <dt className="text-[10px] tracking-[0.28em] uppercase text-stone-400">{label}</dt>
      <dd className="mt-1 text-stone-800">
        {value || <span className="text-stone-400 italic">Not provided yet.</span>}
      </dd>
    </div>
  );
}

/* ---------- Shared helpers ---------- */

export function fallback(v: string | undefined | null): string {
  return v && String(v).trim() ? String(v) : "";
}
