-- Flatmate board: initial schema.
-- Privacy rule: phone numbers live only in private_contacts and leave it only
-- through get_match_contact(), after both sides accepted.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null check (char_length(first_name) between 1 and 40),
  gender text not null check (gender in ('male', 'female', 'other')),
  diet text not null check (diet in ('veg', 'eggetarian', 'nonveg')),
  smoking text not null check (smoking in ('no', 'outside', 'yes')),
  drinking text not null check (drinking in ('no', 'occasionally', 'yes')),
  sleep text not null check (sleep in ('early', 'midnight', 'late')),
  cleanliness text not null check (cleanliness in ('relaxed', 'average', 'tidy')),
  guests text not null check (guests in ('rarely', 'sometimes', 'often')),
  work text not null check (work in ('office', 'hybrid', 'wfh')),
  created_at timestamptz not null default now()
);

create table public.private_contacts (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  whatsapp text not null check (whatsapp ~ '^\+91[6-9][0-9]{9}$')
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('have_room', 'need_room')),
  city text not null check (city in ('Delhi', 'Gurugram', 'Noida', 'Ghaziabad', 'Faridabad')),
  area text not null check (char_length(area) between 2 and 60),
  rent integer not null check (rent between 1000 and 200000),
  deposit integer not null default 0 check (deposit between 0 and 1000000),
  move_in date not null,
  gender_pref text not null default 'any' check (gender_pref in ('any', 'male', 'female')),
  furnished text not null default 'semi' check (furnished in ('unfurnished', 'semi', 'full')),
  description text not null default '' check (char_length(description) <= 500),
  status text not null default 'active' check (status in ('active', 'hidden')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '30 days'
);
create index posts_browse_idx on public.posts (status, expires_at, city, kind);

create table public.interests (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  from_user uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  unique (from_user, post_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  reporter uuid not null references public.profiles (id) on delete cascade,
  reason text not null check (char_length(reason) between 3 and 500),
  created_at timestamptz not null default now(),
  unique (reporter, post_id)
);

-- Spam guard: at most 3 active posts per user.
create function public.limit_active_posts() returns trigger
language plpgsql as $$
begin
  if new.status = 'active' and (
    select count(*) from public.posts
    where user_id = new.user_id and status = 'active' and expires_at > now() and id <> new.id
  ) >= 3 then
    raise exception 'You can have at most 3 active posts';
  end if;
  return new;
end $$;
create trigger posts_limit before insert or update of status on public.posts
for each row execute function public.limit_active_posts();

-- Row level security ---------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.private_contacts enable row level security;
alter table public.posts enable row level security;
alter table public.interests enable row level security;
alter table public.reports enable row level security;

-- Profiles hold no contact data, so anyone may read them (shown on posts).
create policy profiles_read on public.profiles for select using (true);
create policy profiles_insert on public.profiles for insert to authenticated with check (id = auth.uid());
create policy profiles_update on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy contacts_own on public.private_contacts for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Public (incl. logged-out) can read live posts; this powers share links.
create policy posts_read on public.posts for select
  using ((status = 'active' and expires_at > now()) or user_id = auth.uid());
create policy posts_insert on public.posts for insert to authenticated with check (user_id = auth.uid());
create policy posts_update on public.posts for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy posts_delete on public.posts for delete to authenticated using (user_id = auth.uid());

create policy interests_read on public.interests for select to authenticated using (
  from_user = auth.uid()
  or exists (select 1 from public.posts p where p.id = post_id and p.user_id = auth.uid())
);
-- Requester can only create a pending interest on someone else's live post.
create policy interests_insert on public.interests for insert to authenticated with check (
  from_user = auth.uid() and status = 'pending'
  and exists (
    select 1 from public.posts p
    where p.id = post_id and p.user_id <> auth.uid() and p.status = 'active' and p.expires_at > now()
      and (p.gender_pref = 'any' or p.gender_pref = (select gender from public.profiles where id = auth.uid()))
  )
);
create policy interests_delete on public.interests for delete to authenticated using (from_user = auth.uid());

create policy reports_insert on public.reports for insert to authenticated with check (reporter = auth.uid());

-- Functions ------------------------------------------------------------------
-- Only the post owner can accept or decline; a raw UPDATE policy would let them edit any column.
create function public.respond_interest(interest_id uuid, accept boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  update interests i set status = case when accept then 'accepted' else 'declined' end
  from posts p
  where i.id = interest_id and p.id = i.post_id and p.user_id = auth.uid() and i.status = 'pending';
  if not found then raise exception 'Interest not found'; end if;
end $$;

-- Returns the other side's WhatsApp number only for an accepted interest the caller is part of.
create function public.get_match_contact(interest_id uuid) returns text
language sql stable security definer set search_path = public as $$
  select c.whatsapp
  from interests i
  join posts p on p.id = i.post_id
  join private_contacts c
    on c.user_id = case when auth.uid() = i.from_user then p.user_id else i.from_user end
  where i.id = interest_id and i.status = 'accepted'
    and auth.uid() in (i.from_user, p.user_id);
$$;

-- Area insights from live posts. Areas with fewer than 5 posts are hidden.
create function public.area_insights()
returns table (city text, area text, kind text, posts bigint, median_rent integer)
language sql stable security definer set search_path = public as $$
  select city, area, kind, count(*),
         percentile_cont(0.5) within group (order by rent)::integer
  from posts
  where status = 'active' and expires_at > now()
  group by city, area, kind
  having count(*) >= 5
  order by count(*) desc
  limit 30;
$$;

-- DPDP "erase my data": cascades through every table above.
create function public.delete_my_account() returns void
language sql security definer set search_path = public, auth as $$
  delete from auth.users where id = auth.uid();
$$;

revoke execute on function public.respond_interest(uuid, boolean) from public, anon;
revoke execute on function public.get_match_contact(uuid) from public, anon;
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.respond_interest(uuid, boolean) to authenticated;
grant execute on function public.get_match_contact(uuid) to authenticated;
grant execute on function public.delete_my_account() to authenticated;
grant execute on function public.area_insights() to anon, authenticated;
