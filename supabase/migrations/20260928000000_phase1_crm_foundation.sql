-- =============================================================
-- Ananse Automation -- Admin/CRM Phase 1 schema
-- Project: ananse-automation-crm
--
-- This is the exact "CREATE NOW" schema approved in the Phase 1
-- architecture review. Deferred AI Agent / Voice Agent tables
-- (consultation_requests, agent_conversations, agent_messages,
-- agent_actions) are intentionally NOT included here.
--
-- Not executed automatically -- run this once, manually, in the
-- Supabase SQL Editor for the ananse-automation-crm project.
-- =============================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------
-- Lookup tables
-- ---------------------------------------------------------------

create table public.lead_sources (
  key         text primary key,
  label       text not null,
  created_at  timestamptz not null default now()
);

create table public.pipeline_statuses (
  key         text primary key,
  label       text not null,
  sort_order  integer not null,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

insert into public.lead_sources (key, label) values
  ('contact_form',         'Contact Form'),
  ('questionnaire',        'Project Questionnaire'),
  ('ai_chat',               'Ask Ananse AI'),
  ('consultation_request', 'Consultation Request'),
  ('voice_agent',          'Voice Agent'),
  ('manual',               'Manual'),
  ('other',                'Other');

insert into public.pipeline_statuses (key, label, sort_order) values
  ('new',            'New',            1),
  ('contacted',      'Contacted',      2),
  ('qualified',      'Qualified',      3),
  ('proposal_sent',  'Proposal Sent',  4),
  ('won',            'Won',            5),
  ('lost',           'Lost',           6);

-- ---------------------------------------------------------------
-- Authorization
-- ---------------------------------------------------------------

-- Identity (auth.users) does not imply authorization. A row here,
-- created deliberately (never via self-signup), is what actually
-- grants admin access -- see is_admin() below and every RLS policy.
create table public.admin_profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text not null,
  role          text not null default 'admin' check (role in ('admin', 'staff')),
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- SECURITY DEFINER so this function can read admin_profiles
-- regardless of the calling user's own RLS on that table --
-- avoids recursive-policy evaluation. search_path pinned per
-- Supabase security guidance.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_profiles p
    where p.id = auth.uid() and p.is_active
  );
$$;

-- ---------------------------------------------------------------
-- Canonical leads table
-- ---------------------------------------------------------------

create table public.leads (
  id                    uuid primary key default gen_random_uuid(),
  source                text not null references public.lead_sources(key),
  status                text not null default 'new' references public.pipeline_statuses(key),
  contact_name          text not null,
  contact_email         text not null,
  contact_phone         text,
  business_name         text,
  preferred_contact_method text,
  requested_services    text[],
  primary_message       text,
  assigned_to           uuid references public.admin_profiles(id) on delete set null,
  -- Manual, human-confirmed dedupe link -- never auto-populated.
  -- See Phase 1 architecture report section 8.
  merged_into_lead_id   uuid references public.leads(id) on delete set null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index idx_leads_status on public.leads (status);
create index idx_leads_source on public.leads (source);
create index idx_leads_created_at on public.leads (created_at desc);
create index idx_leads_contact_email_lower on public.leads (lower(contact_email));
create index idx_leads_merged_into on public.leads (merged_into_lead_id)
  where merged_into_lead_id is not null;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_leads_set_updated_at
before update on public.leads
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------------
-- Questionnaire detail (1:1 with a lead)
-- ---------------------------------------------------------------

create table public.questionnaire_responses (
  id            uuid primary key default gen_random_uuid(),
  lead_id       uuid not null unique references public.leads(id) on delete cascade,
  answers       jsonb not null,
  submitted_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- Internal notes (never public)
-- ---------------------------------------------------------------

create table public.lead_notes (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references public.leads(id) on delete cascade,
  author_id   uuid not null references public.admin_profiles(id) on delete restrict,
  body        text not null,
  created_at  timestamptz not null default now()
);

create index idx_lead_notes_lead_id on public.lead_notes (lead_id);

-- ---------------------------------------------------------------
-- Activity / audit trail
-- ---------------------------------------------------------------

create table public.lead_activities (
  id             uuid primary key default gen_random_uuid(),
  lead_id        uuid not null references public.leads(id) on delete cascade,
  actor_id       uuid references public.admin_profiles(id) on delete set null,
  activity_type  text not null check (
    activity_type in ('created', 'status_change', 'note_added', 'email_sent', 'assigned', 'other')
  ),
  detail         jsonb,
  created_at     timestamptz not null default now()
);

create index idx_lead_activities_lead_created
  on public.lead_activities (lead_id, created_at);

-- ---------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------

alter table public.lead_sources          enable row level security;
alter table public.pipeline_statuses     enable row level security;
alter table public.admin_profiles        enable row level security;
alter table public.leads                 enable row level security;
alter table public.questionnaire_responses enable row level security;
alter table public.lead_notes            enable row level security;
alter table public.lead_activities       enable row level security;

-- Lookup tables: admin-read only (public site never queries these directly)
create policy "admins read lead_sources" on public.lead_sources
  for select using (is_admin());
create policy "admins read pipeline_statuses" on public.pipeline_statuses
  for select using (is_admin());

-- admin_profiles: admins can see the staff list; no self-service writes
create policy "admins read admin_profiles" on public.admin_profiles
  for select using (is_admin());

-- leads: admins can read and update (status/assignment); no client-side insert/delete
create policy "admins read leads" on public.leads
  for select using (is_admin());
create policy "admins update leads" on public.leads
  for update using (is_admin());

-- questionnaire_responses: admin-read only; always written by the secret-key client
create policy "admins read questionnaire_responses" on public.questionnaire_responses
  for select using (is_admin());

-- lead_notes: admins can read and add notes
create policy "admins read lead_notes" on public.lead_notes
  for select using (is_admin());
create policy "admins insert lead_notes" on public.lead_notes
  for insert with check (is_admin() and author_id = auth.uid());

-- lead_activities: admins can read and append activity entries
create policy "admins read lead_activities" on public.lead_activities
  for select using (is_admin());
create policy "admins insert lead_activities" on public.lead_activities
  for insert with check (is_admin());

-- No policies granting anon anything, anywhere.
-- No delete policies anywhere in Phase 1.
-- The secret-key client bypasses RLS by default -- used only by trusted
-- server-side application code (never the browser) to insert leads/
-- questionnaire rows from public form submissions, once that wiring is
-- added in a later phase.
