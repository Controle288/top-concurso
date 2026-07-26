create table if not exists public.push_subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  subscription text not null,
  endpoint text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.push_subscriptions enable row level security;

create policy "usuario_ve_push" on public.push_subscriptions
  for select using (auth.uid() = user_id);
create policy "usuario_insere_push" on public.push_subscriptions
  for insert with check (auth.uid() = user_id);
create policy "usuario_atualiza_push" on public.push_subscriptions
  for update using (auth.uid() = user_id);
create policy "usuario_deleta_push" on public.push_subscriptions
  for delete using (auth.uid() = user_id);

create policy "admin_ve_push" on public.push_subscriptions
  for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "admin_gerencia_push" on public.push_subscriptions
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
