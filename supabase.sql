-- Run once in your Supabase project's SQL editor. Never use a service-role key in the app.
create table if not exists public.workout_sync (
  user_id uuid primary key references auth.users(id) on delete cascade,
  revision bigint not null default 1,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.workout_sync enable row level security;
create policy "Users read their own log" on public.workout_sync for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users insert their own log" on public.workout_sync for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users update their own log" on public.workout_sync for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
grant select, insert, update on public.workout_sync to authenticated;
create or replace function public.save_workout(expected_revision bigint, payload jsonb)
returns bigint language plpgsql security invoker set search_path = public as $$
declare next_revision bigint;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if expected_revision = 0 then
    insert into public.workout_sync(user_id, revision, data) values(auth.uid(),1,payload)
      on conflict (user_id) do nothing returning revision into next_revision;
  else
    update public.workout_sync set data=payload,revision=revision+1,updated_at=now()
      where user_id=auth.uid() and revision=expected_revision returning revision into next_revision;
  end if;
  if next_revision is null then raise exception 'SYNC_CONFLICT'; end if;
  return next_revision;
end; $$;
revoke all on function public.save_workout(bigint,jsonb) from public, anon;
grant execute on function public.save_workout(bigint,jsonb) to authenticated;
