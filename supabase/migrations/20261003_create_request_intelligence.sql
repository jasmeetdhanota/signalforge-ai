create table public.request_analyses (
  id uuid primary key default gen_random_uuid(),

  request_id uuid not null unique
    references public.feature_requests(id)
    on delete cascade,

  customer_need text not null
    check (char_length(trim(customer_need)) between 1 and 300),

  suggested_theme text not null,

  reasoning text not null
    check (char_length(trim(reasoning)) between 1 and 1000),

  confidence numeric(4, 3) not null
    check (confidence >= 0 and confidence <= 1),

  created_at timestamptz not null default now()
);

create table public.request_relationships (
  id uuid primary key default gen_random_uuid(),

  request_id uuid not null
    references public.feature_requests(id)
    on delete cascade,

  related_request_id uuid not null
    references public.feature_requests(id)
    on delete cascade,

  reasoning text not null
    check (char_length(trim(reasoning)) between 1 and 600),

  confidence numeric(4, 3) not null
    check (confidence >= 0 and confidence <= 1),

  created_at timestamptz not null default now(),

  check (request_id <> related_request_id),

  unique (request_id, related_request_id)
);

alter table public.request_analyses
enable row level security;

alter table public.request_relationships
enable row level security;

revoke all on table public.request_analyses from anon;
revoke all on table public.request_analyses from authenticated;

revoke all on table public.request_relationships from anon;
revoke all on table public.request_relationships from authenticated;

grant select on table public.request_analyses to anon;
grant select on table public.request_analyses to authenticated;

grant select on table public.request_relationships to anon;
grant select on table public.request_relationships to authenticated;

create policy "Request analyses are publicly readable"
on public.request_analyses
for select
to anon, authenticated
using (true);

create policy "Request relationships are publicly readable"
on public.request_relationships
for select
to anon, authenticated
using (true);