import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import AdminKpiCard from "@/components/admin/AdminKpiCard";

export const metadata = {
  title: "Dashboard | Ananse Admin",
  robots: { index: false, follow: false },
};

// Every KPI here is a direct count against real leads data -- nothing
// invented. "Consultation Requests" will read 0 until that intake source
// actually exists (a later phase); it's wired up now rather than faked.
export default async function AdminDashboardPage() {
  const supabase = await getSupabaseServerClient();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [newLeads, openLeads, questionnaireSubmissions, consultationRequests, leadsThisMonth] =
    await Promise.all([
      supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .not("status", "in", "(won,lost)")
        .is("merged_into_lead_id", null),
      supabase.from("questionnaire_responses").select("*", { count: "exact", head: true }),
      supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("source", "consultation_request"),
      supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfMonth.toISOString()),
    ]);

  const kpis = [
    { label: "New Leads", value: newLeads.count ?? 0 },
    { label: "Open Leads", value: openLeads.count ?? 0 },
    { label: "Questionnaire Submissions", value: questionnaireSubmissions.count ?? 0 },
    { label: "Consultation Requests", value: consultationRequests.count ?? 0 },
    { label: "Leads This Month", value: leadsThisMonth.count ?? 0 },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-ink">Dashboard</h1>
        <Link
          href="/admin/leads"
          className="text-sm font-medium text-gold hover:text-gold-bright"
        >
          View all leads →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <AdminKpiCard key={kpi.label} label={kpi.label} value={kpi.value} />
        ))}
      </div>
    </div>
  );
}
