import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { LEAD_SOURCE_LABELS, PIPELINE_STATUSES } from "@/lib/leads";
import QuestionnaireAnswers from "@/components/admin/QuestionnaireAnswers";
import type { QuestionnaireDraft } from "@/lib/questionnaire";
import { updateLeadStatusAction, addNoteAction } from "./actions";

export const metadata = {
  title: "Lead Detail | Ananse Admin",
  robots: { index: false, follow: false },
};

type NoteRow = {
  id: string;
  body: string;
  created_at: string;
  admin_profiles: { display_name: string } | null;
};

type ActivityRow = {
  id: string;
  activity_type: string;
  detail: Record<string, unknown> | null;
  created_at: string;
  admin_profiles: { display_name: string } | null;
};

const ACTIVITY_LABELS: Record<string, string> = {
  created: "Lead created",
  status_change: "Status changed",
  note_added: "Note added",
  email_sent: "Email sent",
  assigned: "Assigned",
  other: "Update",
};

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await getSupabaseServerClient();

  const { data: lead } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();
  if (!lead) notFound();

  const [{ data: questionnaire }, { data: notes }, { data: activities }, { data: related }] =
    await Promise.all([
      supabase
        .from("questionnaire_responses")
        .select("answers")
        .eq("lead_id", id)
        .maybeSingle(),
      supabase
        .from("lead_notes")
        .select("id, body, created_at, admin_profiles(display_name)")
        .eq("lead_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("lead_activities")
        .select("id, activity_type, detail, created_at, admin_profiles(display_name)")
        .eq("lead_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("leads")
        .select("id, contact_name, source, created_at")
        .neq("id", id)
        .ilike("contact_email", lead.contact_email)
        .is("merged_into_lead_id", null)
        .limit(5),
    ]);

  const boundStatusAction = updateLeadStatusAction.bind(null, id);
  const boundNoteAction = addNoteAction.bind(null, id);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/admin/leads" className="text-sm text-gold hover:text-gold-bright">
          ← All leads
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section className="rounded-2xl border border-line bg-paper p-6">
            <h1 className="text-xl font-semibold text-ink">{lead.contact_name}</h1>
            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-slate uppercase">Email</dt>
                <dd className="text-ink">{lead.contact_email}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate uppercase">Phone</dt>
                <dd className="text-ink">{lead.contact_phone || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate uppercase">Business</dt>
                <dd className="text-ink">{lead.business_name || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate uppercase">Preferred contact</dt>
                <dd className="text-ink">{lead.preferred_contact_method || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate uppercase">Source</dt>
                <dd className="text-ink">{LEAD_SOURCE_LABELS[lead.source] ?? lead.source}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate uppercase">Received</dt>
                <dd className="text-ink">{new Date(lead.created_at).toLocaleString()}</dd>
              </div>
            </dl>

            {lead.requested_services && lead.requested_services.length > 0 ? (
              <div className="mt-4">
                <p className="text-xs font-medium text-slate uppercase">Requested services</p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {lead.requested_services.map((s: string) => (
                    <span
                      key={s}
                      className="rounded-full border border-line px-2.5 py-1 text-xs text-slate"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {lead.primary_message ? (
              <div className="mt-4">
                <p className="text-xs font-medium text-slate uppercase">Message</p>
                <p className="mt-1 text-sm whitespace-pre-line text-ink">{lead.primary_message}</p>
              </div>
            ) : null}
          </section>

          {related && related.length > 0 ? (
            <section className="rounded-2xl border border-line bg-paper p-6">
              <h2 className="text-sm font-semibold text-ink">Possibly Related Leads</h2>
              <p className="mt-1 text-xs text-slate">
                Same email address, not yet linked. Review manually before assuming these are the
                same inquiry.
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {related.map((r) => (
                  <li key={r.id} className="text-sm">
                    <Link href={`/admin/leads/${r.id}`} className="text-gold hover:text-gold-bright">
                      {r.contact_name}
                    </Link>{" "}
                    <span className="text-slate">
                      — {LEAD_SOURCE_LABELS[r.source] ?? r.source} —{" "}
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {questionnaire ? (
            <section className="rounded-2xl border border-line bg-paper p-6">
              <h2 className="mb-4 text-sm font-semibold text-ink">Questionnaire Answers</h2>
              <QuestionnaireAnswers answers={questionnaire.answers as QuestionnaireDraft} />
            </section>
          ) : null}

          <section className="rounded-2xl border border-line bg-paper p-6">
            <h2 className="mb-4 text-sm font-semibold text-ink">Internal Notes</h2>
            <p className="mb-4 text-xs text-slate">Visible only inside Ananse Admin — never public.</p>

            <form action={boundNoteAction} className="flex flex-col gap-3">
              <textarea
                name="body"
                rows={3}
                required
                placeholder="Add a note for the team…"
                className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-slate/50 focus:border-gold focus:outline-none"
              />
              <button
                type="submit"
                className="self-start rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
              >
                Add Note
              </button>
            </form>

            <ul className="mt-6 flex flex-col gap-4">
              {((notes ?? []) as unknown as NoteRow[]).map((note) => (
                <li key={note.id} className="border-t border-line pt-4 first:border-0 first:pt-0">
                  <p className="text-sm whitespace-pre-line text-ink">{note.body}</p>
                  <p className="mt-1 text-xs text-slate">
                    {note.admin_profiles?.display_name ?? "Unknown"} —{" "}
                    {new Date(note.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
              {(notes ?? []).length === 0 ? (
                <li className="text-sm text-slate">No notes yet.</li>
              ) : null}
            </ul>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-line bg-paper p-6">
            <h2 className="mb-3 text-sm font-semibold text-ink">Pipeline Status</h2>
            <form action={boundStatusAction} className="flex flex-col gap-3">
              <select
                name="status"
                defaultValue={lead.status}
                className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none"
              >
                {PIPELINE_STATUSES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-full bg-gold px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-gold-bright"
              >
                Update Status
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-line bg-paper p-6">
            <h2 className="mb-3 text-sm font-semibold text-ink">Activity</h2>
            <ul className="flex flex-col gap-3">
              {((activities ?? []) as unknown as ActivityRow[]).map((activity) => (
                <li key={activity.id} className="border-t border-line pt-3 first:border-0 first:pt-0">
                  <p className="text-sm text-ink">
                    {ACTIVITY_LABELS[activity.activity_type] ?? activity.activity_type}
                    {activity.activity_type === "status_change" && activity.detail
                      ? ` — ${String(activity.detail.from)} → ${String(activity.detail.to)}`
                      : null}
                  </p>
                  <p className="text-xs text-slate">
                    {activity.admin_profiles?.display_name ?? "System"} —{" "}
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
              {(activities ?? []).length === 0 ? (
                <li className="text-sm text-slate">No activity recorded yet.</li>
              ) : null}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
