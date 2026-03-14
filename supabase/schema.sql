create extension if not exists pgcrypto;

create table if not exists public.site_metrics (
    id integer primary key default 1,
    views bigint not null default 0,
    whatsapp_clicks bigint not null default 0,
    form_submissions bigint not null default 0,
    form_starts bigint not null default 0,
    created_at timestamptz not null default now(),
    last_updated_at timestamptz not null default now(),
    constraint site_metrics_single_row check (id = 1)
);

create table if not exists public.reservations (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    nombre text not null,
    apellido text not null,
    email text not null,
    telefono text not null,
    evento text not null,
    cantidad integer not null,
    notas text not null default ''
);

insert into public.site_metrics (id)
values (1)
on conflict (id) do nothing;

create or replace function public.increment_site_metric(metric_name text)
returns public.site_metrics
language plpgsql
security definer
as $$
declare
    updated_row public.site_metrics;
begin
    insert into public.site_metrics (id)
    values (1)
    on conflict (id) do nothing;

    update public.site_metrics
    set
        views = views + case when metric_name = 'views' then 1 else 0 end,
        whatsapp_clicks = whatsapp_clicks + case when metric_name = 'whatsapp_clicks' then 1 else 0 end,
        form_submissions = form_submissions + case when metric_name = 'form_submissions' then 1 else 0 end,
        form_starts = form_starts + case when metric_name = 'form_starts' then 1 else 0 end,
        last_updated_at = now()
    where id = 1
    returning * into updated_row;

    return updated_row;
end;
$$;

alter table public.site_metrics enable row level security;
alter table public.reservations enable row level security;

drop policy if exists "anon_select_site_metrics" on public.site_metrics;
create policy "anon_select_site_metrics"
on public.site_metrics
for select
to anon
using (true);

drop policy if exists "anon_update_site_metrics" on public.site_metrics;
create policy "anon_update_site_metrics"
on public.site_metrics
for update
to anon
using (id = 1)
with check (id = 1);

drop policy if exists "anon_insert_site_metrics" on public.site_metrics;
create policy "anon_insert_site_metrics"
on public.site_metrics
for insert
to anon
with check (id = 1);

drop policy if exists "anon_insert_reservations" on public.reservations;
create policy "anon_insert_reservations"
on public.reservations
for insert
to anon
with check (true);

grant execute on function public.increment_site_metric(text) to anon;