-- Pin search_path on the trigger function (Supabase linter 0011).
alter function public.limit_active_posts() set search_path = public;
