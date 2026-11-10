-- Open posts to India's top metros. Existing NCR rows stay valid (the list only grows).
-- Keep in sync with CITIES in src/lib/options.ts.
alter table public.posts drop constraint posts_city_check;
alter table public.posts add constraint posts_city_check check (city in (
  'Delhi', 'Gurugram', 'Noida', 'Ghaziabad', 'Faridabad',
  'Bengaluru', 'Mumbai', 'Pune', 'Hyderabad', 'Chennai'
));
