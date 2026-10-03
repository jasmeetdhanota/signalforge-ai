grant select on table public.feature_requests to service_role;

grant select, insert, update
on table public.request_analyses
to service_role;

grant select, insert, update, delete
on table public.request_relationships
to service_role;
