-- =====================================================
-- TOP CONCURSO - Cursos Livres
-- =====================================================

-- 1. Cursos
create table if not exists public.cursos (
  id uuid default uuid_generate_v4() primary key,
  titulo text not null,
  descricao text,
  categoria text not null check (categoria in ('idiomas', 'musica', 'artesanato', 'informatica', 'negocios', 'saude', 'outros')),
  nivel text check (nivel in ('iniciante', 'intermediario', 'avancado')),
  instrutor text not null,
  carga_horaria_minutos int default 0,
  preco decimal(10,2) default 0,
  thumbnail_url text,
  video_apresentacao text,
  ativo boolean default true,
  created_at timestamptz default now()
);

-- 2. Módulos dos Cursos
create table if not exists public.curso_modulos (
  id uuid default uuid_generate_v4() primary key,
  curso_id uuid references public.cursos(id) on delete cascade,
  titulo text not null,
  descricao text,
  ordem int not null,
  created_at timestamptz default now()
);

-- 3. Aulas de cada módulo
create table if not exists public.curso_aulas (
  id uuid default uuid_generate_v4() primary key,
  modulo_id uuid references public.curso_modulos(id) on delete cascade,
  titulo text not null,
  descricao text,
  video_url text,
  duracao_minutos int default 0,
  ordem int not null,
  created_at timestamptz default now()
);

-- 4. Matrículas (inscrição do usuário no curso)
create table if not exists public.curso_matriculas (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  curso_id uuid references public.cursos(id) on delete cascade,
  data_matricula timestamptz default now(),
  concluido boolean default false,
  created_at timestamptz default now(),
  unique(user_id, curso_id)
);

-- 5. Progresso do usuário (aulas assistidas)
create table if not exists public.curso_progresso (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  aula_id uuid references public.curso_aulas(id) on delete cascade,
  concluido boolean default false,
  created_at timestamptz default now(),
  unique(user_id, aula_id)
);

-- RLS
alter table public.cursos enable row level security;
alter table public.curso_modulos enable row level security;
alter table public.curso_aulas enable row level security;
alter table public.curso_matriculas enable row level security;
alter table public.curso_progresso enable row level security;

-- Policies - Cursos
create policy "todos_veem_cursos" on public.cursos
  for select using (true);
create policy "admin_gerencia_cursos" on public.cursos
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Policies - Módulos
create policy "todos_veem_modulos" on public.curso_modulos
  for select using (true);
create policy "admin_gerencia_modulos" on public.curso_modulos
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Policies - Aulas
create policy "todos_veem_aulas_curso" on public.curso_aulas
  for select using (true);
create policy "admin_gerencia_aulas_curso" on public.curso_aulas
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Policies - Matrículas
create policy "usuario_ve_proprias_matriculas" on public.curso_matriculas
  for select using (auth.uid() = user_id);
create policy "usuario_faz_matricula" on public.curso_matriculas
  for insert with check (auth.uid() = user_id);

-- Policies - Progresso
create policy "usuario_ve_proprio_progresso" on public.curso_progresso
  for select using (auth.uid() = user_id);
create policy "usuario_marca_progresso" on public.curso_progresso
  for insert with check (auth.uid() = user_id);
create policy "usuario_atualiza_progresso" on public.curso_progresso
  for update using (auth.uid() = user_id);
