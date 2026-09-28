import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { LEAD_SOURCE_LABELS, PIPELINE_STATUSES } from "@/lib/leads";

export const metadata = {
  title: "Leads | Ananse Admin",
  robots: { index: false, follow: false },
};

const PAGE_SIZE = 25;

type LeadRow = {
  id: string;
  contact_name: string;
  business_name: string | null;
  contact_email: string;
  contact_phone: string | null;
  requested_services: string[] | null;
  source: string;
  status: string;
  created_at: string;
};

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; source?: string; status?: string; page?: string }>;
}) {
  const { q = "", source = "", status = "", page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await getSupabaseServerClient();
  let query = supabase
    .from("leads")
    .select(
      "id, contact_name, business_name, contact_email, contact_phone, requested_services, source, status, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (source) query = query.eq("source", source);
  if (status) query = query.eq("status", status);
  if (q.trim()) {
    const term = `%${q.trim()}%`;
    query = query.or(`contact_name.ilike.${term},contact_email.ilike.${term},business_name.ilike.${term}`);
  }

  const { data, count, error } = await query;
  const leads = (data ?? []) as LeadRow[];
  const totalPages = count ? Math.max(1, Math.ceil(count / PAGE_SIZE)) : 1;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-ink">Leads</h1>

      <form className="flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-paper p-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="q" className="text-xs font-medium text-slate">
            Search
          </label>
          <input
            id="q"
            name="q"
            type="text"
            defaultValue={q}
            placeholder="Name, email, or business"
            className="w-56 rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-gold focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="source" className="text-xs font-medium text-slate">
            Source
          </label>
          <select
            id="source"
            name="source"
            defaultValue={source}
            className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-gold focus:outline-none"
          >
            <option value="">All sources</option>
            {Object.entries(LEAD_SOURCE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-xs font-medium text-slate">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status}
            className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-gold focus:outline-none"
          >
            <option value="">All statuses</option>
            {PIPELINE_STATUSES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
        >
          Apply
        </button>
        {(q || source || status) && (
          <Link href="/admin/leads" className="text-sm text-gold hover:text-gold-bright">
            Clear
          </Link>
        )}
      </form>

      {error ? (
        <p role="alert" className="text-sm text-terracotta">
          Couldn&rsquo;t load leads: {error.message}
        </p>
      ) : leads.length === 0 ? (
        <p className="text-sm text-slate">No leads match these filters yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line text-xs font-medium text-slate uppercase">
              <tr>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Business</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Received</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-line last:border-0 hover:bg-paper-dim">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-medium text-ink hover:text-gold"
                    >
                      {lead.contact_name}
                    </Link>
                    <p className="text-xs text-slate">{lead.contact_email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate">{lead.business_name || "—"}</td>
                  <td className="px-4 py-3 text-slate">{LEAD_SOURCE_LABELS[lead.source] ?? lead.source}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full border border-line px-2.5 py-1 text-xs text-slate">
                      {PIPELINE_STATUSES.find((s) => s.key === lead.status)?.label ?? lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center gap-3 text-sm text-slate">
          {page > 1 ? (
            <Link
              href={{ pathname: "/admin/leads", query: { q, source, status, page: page - 1 } }}
              className="text-gold hover:text-gold-bright"
            >
              ← Previous
            </Link>
          ) : null}
          <span>
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={{ pathname: "/admin/leads", query: { q, source, status, page: page + 1 } }}
              className="text-gold hover:text-gold-bright"
            >
              Next →
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
