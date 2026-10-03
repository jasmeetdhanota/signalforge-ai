create table public.feature_requests (
  id uuid primary key default gen_random_uuid(),

  title text not null
    check (char_length(trim(title)) between 1 and 120),

  description text not null
    check (char_length(trim(description)) between 1 and 600),

  theme text not null default 'Workflow',

  status text not null default 'New'
    check (
      status in (
        'New',
        'Trending',
        'Under Review',
        'Planned',
        'In Progress'
      )
    ),

  support_count integer not null default 1
    check (support_count >= 0),

  created_at timestamptz not null default now()
);

alter table public.feature_requests
enable row level security;

revoke all on table public.feature_requests from anon;
revoke all on table public.feature_requests from authenticated;

grant select, insert on table public.feature_requests to anon;
grant select, insert on table public.feature_requests to authenticated;

create policy "Feature requests are publicly readable"
on public.feature_requests
for select
to anon, authenticated
using (true);

create policy "Feature requests can be submitted publicly"
on public.feature_requests
for insert
to anon, authenticated
with check (
  char_length(trim(title)) between 1 and 120
  and char_length(trim(description)) between 1 and 600
  and status = 'New'
  and support_count = 1
);