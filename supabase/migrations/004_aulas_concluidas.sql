-- =====================================================
-- TOP CONCURSO - Aulas Concluídas
-- Rastreia quais aulas cada usuário já assistiu
-- =====================================================

create table if not exists public.aulas_concluidas (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  aula_id uuid references public.aulas(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, aula_id)
);

alter table public.aulas_concluidas enable row level security;

create policy "usuario_ve_aulas_concluidas" on public.aulas_concluidas
  for select using (auth.uid() = user_id);
create policy "usuario_marca_aula_concluida" on public.aulas_concluidas
  for insert with check (auth.uid() = user_id);
create policy "usuario_desmarca_aula_concluida" on public.aulas_concluidas
  for delete using (auth.uid() = user_id);
