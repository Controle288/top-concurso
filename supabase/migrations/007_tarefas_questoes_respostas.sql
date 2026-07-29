-- =====================================================
-- TOP CONCURSO - Tarefas diárias + Respostas de questões
-- Migra dados do localStorage para o banco
-- =====================================================

-- Tarefas diárias do usuário
create table if not exists public.tarefas_diarias (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  data date not null default current_date,
  titulo text not null,
  tipo text not null default 'Teoria' check (tipo in ('Teoria', 'Revisão', 'Exercícios')),
  assunto text not null default '',
  duracao text not null default '30 min',
  concluida boolean not null default false,
  created_at timestamptz default now()
);

create index if not exists idx_tarefas_diarias_user_data on public.tarefas_diarias(user_id, data);

alter table public.tarefas_diarias enable row level security;

create policy "Usuários veem suas próprias tarefas"
  on public.tarefas_diarias for select
  using (auth.uid() = user_id);

create policy "Usuários criam suas próprias tarefas"
  on public.tarefas_diarias for insert
  with check (auth.uid() = user_id);

create policy "Usuários atualizam suas próprias tarefas"
  on public.tarefas_diarias for update
  using (auth.uid() = user_id);

create policy "Usuários deletam suas próprias tarefas"
  on public.tarefas_diarias for delete
  using (auth.uid() = user_id);

-- Histórico de respostas de questões
create table if not exists public.questao_respostas (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  questao_id uuid references public.questoes(id) on delete cascade not null,
  correta boolean not null,
  created_at timestamptz default now()
);

create index if not exists idx_questao_respostas_user on public.questao_respostas(user_id);
create index if not exists idx_questao_respostas_data on public.questao_respostas(user_id, created_at desc);

alter table public.questao_respostas enable row level security;

create policy "Usuários veem suas próprias respostas"
  on public.questao_respostas for select
  using (auth.uid() = user_id);

create policy "Usuários inserem suas próprias respostas"
  on public.questao_respostas for insert
  with check (auth.uid() = user_id);
