-- =====================================================
-- TOP CONCURSO - Correção final
-- Remove tabelas antigas e recria do zero
-- =====================================================

-- Remove todas as tabelas na ordem inversa das dependências
drop table if exists public.cronograma_aulas cascade;
drop table if exists public.cronograma_dias cascade;
drop table if exists public.cronogramas cascade;
drop table if exists public.ticket_messages cascade;
drop table if exists public.tickets cascade;
drop table if exists public.forum_comments cascade;
drop table if exists public.forum_topics cascade;
drop table if exists public.assinaturas cascade;
drop table if exists public.resumos cascade;
drop table if exists public.questoes cascade;
drop table if exists public.aulas cascade;
drop table if exists public.pdfs cascade;
drop table if exists public.noticias cascade;
drop table if exists public.disciplinas cascade;
drop table if exists public.concursos cascade;
drop table if exists public.bancas cascade;

-- Recria tudo
create extension if not exists "uuid-ossp";

-- Profiles (recria se não existir)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  nome text not null default '',
  role text not null default 'user' check (role in ('user', 'admin')),
  assinatura_ativa boolean not null default false,
  assinatura_inicio timestamptz,
  assinatura_fim timestamptz,
  avatar_url text,
  created_at timestamptz default now()
);

-- Bancas
create table if not exists public.bancas (
  id uuid default uuid_generate_v4() primary key,
  nome text not null unique,
  sigla text not null unique,
  created_at timestamptz default now()
);

-- Concursos
create table if not exists public.concursos (
  id uuid default uuid_generate_v4() primary key,
  titulo text not null,
  orgao text not null,
  banca_id uuid references public.bancas(id) on delete set null,
  edital_url text,
  vagas int default 0,
  inscritos_estimados int default 0,
  data_prova date,
  data_edital date,
  status text default 'aberto' check (status in ('aberto', 'previsto', 'encerrado')),
  nivel text check (nivel in ('fundamental', 'medio', 'tecnico', 'superior')),
  salario decimal(10,2),
  created_at timestamptz default now()
);

-- Disciplinas
create table if not exists public.disciplinas (
  id uuid default uuid_generate_v4() primary key,
  nome text not null,
  concurso_id uuid references public.concursos(id) on delete cascade,
  created_at timestamptz default now(),
  unique(nome, concurso_id)
);

-- Notícias
create table if not exists public.noticias (
  id uuid default uuid_generate_v4() primary key,
  titulo text not null,
  conteudo text not null,
  tipo text default 'noticia' check (tipo in ('noticia', 'edital', 'dica', 'aviso')),
  concurso_id uuid references public.concursos(id) on delete set null,
  link_url text,
  autor_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- PDFs
create table if not exists public.pdfs (
  id uuid default uuid_generate_v4() primary key,
  titulo text not null,
  tipo text not null check (tipo in ('PDF', 'Audio', 'Resumo', 'Lei Seca')),
  concurso_id uuid references public.concursos(id) on delete cascade,
  disciplina_id uuid references public.disciplinas(id) on delete set null,
  descricao text,
  url text not null,
  size_or_duration text,
  created_at timestamptz default now()
);

-- Aulas
create table if not exists public.aulas (
  id uuid default uuid_generate_v4() primary key,
  titulo text not null,
  descricao text,
  concurso_id uuid references public.concursos(id) on delete cascade,
  disciplina_id uuid references public.disciplinas(id) on delete set null,
  youtube_url text not null,
  youtube_id text,
  duracao_minutos int default 0,
  instrutor text,
  thumbnail_url text,
  created_at timestamptz default now()
);

-- Questões
create table if not exists public.questoes (
  id uuid default uuid_generate_v4() primary key,
  enunciado text not null,
  alternativas jsonb not null,
  correta text not null,
  explicacao text,
  banca_id uuid references public.bancas(id) on delete set null,
  concurso_id uuid references public.concursos(id) on delete set null,
  disciplina_id uuid references public.disciplinas(id) on delete set null,
  ano int,
  nivel text check (nivel in ('fundamental', 'medio', 'tecnico', 'superior')),
  created_at timestamptz default now()
);

-- Resumos
create table if not exists public.resumos (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  titulo text not null,
  conteudo text not null,
  disciplina_id uuid references public.disciplinas(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Cronogramas
create table if not exists public.cronogramas (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  concurso_id uuid references public.concursos(id) on delete set null,
  titulo text not null,
  horas_dia decimal(4,2) default 3.00,
  turno text check (turno in ('manha', 'tarde', 'noite', 'integral')),
  data_inicio date,
  data_fim date,
  ativo boolean default true,
  created_at timestamptz default now()
);

-- Cronograma Dias
create table if not exists public.cronograma_dias (
  id uuid default uuid_generate_v4() primary key,
  cronograma_id uuid references public.cronogramas(id) on delete cascade not null,
  data date not null,
  horas_previstas decimal(4,2),
  horas_realizadas decimal(4,2) default 0,
  concluido boolean default false,
  observacao text,
  created_at timestamptz default now()
);

-- Cronograma Aulas
create table if not exists public.cronograma_aulas (
  id uuid default uuid_generate_v4() primary key,
  cronograma_dia_id uuid references public.cronograma_dias(id) on delete cascade not null,
  aula_id uuid references public.aulas(id) on delete set null,
  titulo_personalizado text,
  youtube_url_personalizada text,
  duracao_minutos int,
  concluido boolean default false,
  estourou_tempo boolean default false,
  created_at timestamptz default now()
);

-- Fórum - Tópicos
create table if not exists public.forum_topics (
  id uuid default uuid_generate_v4() primary key,
  titulo text not null,
  descricao text not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text default 'aberto' check (status in ('aberto', 'em_andamento', 'resolvido', 'fechado')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Fórum - Comentários
create table if not exists public.forum_comments (
  id uuid default uuid_generate_v4() primary key,
  topic_id uuid references public.forum_topics(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  conteudo text not null,
  created_at timestamptz default now()
);

-- Tickets
create table if not exists public.tickets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  assunto text not null,
  descricao text not null,
  status text default 'aberto' check (status in ('aberto', 'respondido', 'fechado')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ticket Messages
create table if not exists public.ticket_messages (
  id uuid default uuid_generate_v4() primary key,
  ticket_id uuid references public.tickets(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  mensagem text not null,
  created_at timestamptz default now()
);

-- Assinaturas
create table if not exists public.assinaturas (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text not null default 'ativa' check (status in ('ativa', 'cancelada', 'expirada')),
  data_inicio timestamptz default now(),
  data_fim timestamptz,
  stripe_id text,
  valor decimal(10,2),
  created_at timestamptz default now()
);

-- RLS - Drop and recreate policies
do $$ 
declare
  tbl text;
  pol text;
begin
  for tbl in select unnest(array['profiles','bancas','concursos','disciplinas','noticias','pdfs','aulas','questoes','resumos','cronogramas','cronograma_dias','cronograma_aulas','forum_topics','forum_comments','tickets','ticket_messages','assinaturas']) loop
    execute format('alter table public.%I enable row level security;', tbl);
    for pol in select policyname from pg_policies where schemaname='public' and tablename=tbl loop
      execute format('drop policy if exists %I on public.%I;', pol, tbl);
    end loop;
  end loop;
end $$;

-- Recreate all policies
-- Profiles
create policy "usuarios_veem_proprio_profile" on public.profiles for select using (auth.uid() = id);
create policy "admin_veem_todos_profiles" on public.profiles for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "admin_edita_profiles" on public.profiles for update using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Bancas
create policy "todos_veem_bancas" on public.bancas for select using (true);
create policy "admin_gerencia_bancas" on public.bancas for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Concursos
create policy "todos_veem_concursos" on public.concursos for select using (true);
create policy "admin_gerencia_concursos" on public.concursos for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Disciplinas
create policy "todos_veem_disciplinas" on public.disciplinas for select using (true);
create policy "admin_gerencia_disciplinas" on public.disciplinas for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Noticias
create policy "todos_veem_noticias" on public.noticias for select using (true);
create policy "admin_gerencia_noticias" on public.noticias for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- PDFs
create policy "todos_veem_pdfs" on public.pdfs for select using (true);
create policy "admin_gerencia_pdfs" on public.pdfs for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Aulas
create policy "todos_veem_aulas" on public.aulas for select using (true);
create policy "admin_gerencia_aulas" on public.aulas for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Questões
create policy "todos_veem_questoes" on public.questoes for select using (true);
create policy "admin_gerencia_questoes" on public.questoes for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Resumos
create policy "usuario_ve_resumos" on public.resumos for select using (auth.uid() = user_id);
create policy "usuario_cria_resumos" on public.resumos for insert with check (auth.uid() = user_id);
create policy "usuario_edita_resumos" on public.resumos for update using (auth.uid() = user_id);
create policy "usuario_deleta_resumos" on public.resumos for delete using (auth.uid() = user_id);

-- Cronogramas
create policy "usuario_ve_cronogramas" on public.cronogramas for select using (auth.uid() = user_id);
create policy "usuario_gerencia_cronogramas" on public.cronogramas for all using (auth.uid() = user_id);

-- Cronograma Dias
create policy "usuario_ve_dias" on public.cronograma_dias for select
  using (exists (select 1 from public.cronogramas where id = cronograma_id and user_id = auth.uid()));
create policy "usuario_gerencia_dias" on public.cronograma_dias for all
  using (exists (select 1 from public.cronogramas where id = cronograma_id and user_id = auth.uid()));

-- Cronograma Aulas
create policy "usuario_ve_aulas_crono" on public.cronograma_aulas for select
  using (exists (select 1 from public.cronograma_dias cd join public.cronogramas c on c.id = cd.cronograma_id where cd.id = cronograma_dia_id and c.user_id = auth.uid()));
create policy "usuario_gerencia_aulas_crono" on public.cronograma_aulas for all
  using (exists (select 1 from public.cronograma_dias cd join public.cronogramas c on c.id = cd.cronograma_id where cd.id = cronograma_dia_id and c.user_id = auth.uid()));

-- Forum
create policy "todos_veem_topics" on public.forum_topics for select using (true);
create policy "usuario_cria_topics" on public.forum_topics for insert with check (auth.uid() = user_id);
create policy "admin_gerencia_topics" on public.forum_topics for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "todos_veem_comentarios" on public.forum_comments for select using (true);
create policy "usuario_comenta" on public.forum_comments for insert with check (auth.uid() = user_id);
create policy "admin_gerencia_comentarios" on public.forum_comments for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Tickets
create policy "usuario_ve_tickets" on public.tickets for select using (auth.uid() = user_id);
create policy "admin_ve_todos_tickets" on public.tickets for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "usuario_cria_tickets" on public.tickets for insert with check (auth.uid() = user_id);
create policy "admin_responde_tickets" on public.tickets for update using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Ticket Messages
create policy "usuario_ve_mensagens" on public.ticket_messages for select
  using (exists (select 1 from public.tickets where id = ticket_id and user_id = auth.uid()));
create policy "admin_ve_todas_mensagens" on public.ticket_messages for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "usuario_envia_mensagens" on public.ticket_messages for insert
  with check (exists (select 1 from public.tickets where id = ticket_id and user_id = auth.uid())
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Assinaturas
create policy "usuario_ve_assinaturas" on public.assinaturas for select using (auth.uid() = user_id);
create policy "admin_gerencia_assinaturas" on public.assinaturas for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Function and trigger for auto-creating profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, nome, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nome', 'Usuario'), 'user');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
