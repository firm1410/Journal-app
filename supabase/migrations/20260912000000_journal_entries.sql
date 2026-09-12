create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  title text,
  body text not null,
  source text not null default 'written' check (source in ('written', 'transcribed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint journal_entries_body_nonempty check (length(btrim(body)) > 0),
  constraint journal_entries_title_nonempty check (title is null or length(btrim(title)) > 0)
);

create index journal_entries_user_created_idx
  on public.journal_entries (user_id, created_at desc, id desc);

create function public.set_journal_entry_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger journal_entry_updated_at
before update on public.journal_entries
for each row execute function public.set_journal_entry_updated_at();

alter table public.journal_entries enable row level security;
revoke all on public.journal_entries from public;
revoke all on public.journal_entries from anon;
grant select, delete on public.journal_entries to authenticated;
grant insert (user_id, title, body, source) on public.journal_entries to authenticated;
grant update (title, body, source) on public.journal_entries to authenticated;

create policy journal_entries_select on public.journal_entries
  for select to authenticated using ((select auth.uid()) = user_id);
create policy journal_entries_insert on public.journal_entries
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy journal_entries_update on public.journal_entries
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy journal_entries_delete on public.journal_entries
  for delete to authenticated using ((select auth.uid()) = user_id);
