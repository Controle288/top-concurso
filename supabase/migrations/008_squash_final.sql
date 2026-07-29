-- =====================================================
-- TOP CONCURSO - Squash Final (Schema Consolidado)
-- =====================================================
-- Esta migração contém TODO o schema final do projeto.
-- Para SETUP NOVO: rode apenas este arquivo (8) no Supabase.
-- Para UPGRADE: rode as migrações 1→7 em ordem.
--
-- Histórico:
--   001 -> Schema inicial (18 tabelas)
--   002 -> Fix + new features (flashcards, sessions, comentários)
--   003 -> Clean fix (recria tudo), pula 002_fix
--   004 -> Aulas concluídas
--   005 -> Push subscriptions
--   006 -> Cursos livres (5 tabelas)
--   007 -> Tarefas diárias + respostas de questões
--   008 -> SQUASH: consolida todo o schema acima
-- =====================================================

-- 1. Extensions
create extension if not exists "uuid-ossp";

-- 2. Profiles
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

-- 3. Bancas
create table if not exists public.bancas (
  id uuid default uuid_generate_v4() primary key,
  nome text not null unique,
  sigla text not null unique,
  created_at timestamptz default now()
);

-- 4. Concursos
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

-- 5. Disciplinas
create table if not exists public.disciplinas (
  id uuid default uuid_generate_v4() primary key,
  nome text not null,
  concurso_id uuid references public.concursos(id) on delete cascade,
  created_at timestamptz default now()
);

-- 6. Notícias
create table if not exists public.noticias (
  id uuid default uuid_generate_v4() primary key,
  titulo text not null,
  conteudo text not null,
  tipo text not null default 'noticia' check (tipo in ('noticia', 'edital', 'dica', 'aviso')),
  concurso_id uuid references public.concursos(id) on delete set null,
  link_url text,
  autor_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- 7. Aulas
create table if not exists public.aulas (
  id uuid default uuid_generate_v4() primary key,
  titulo text not null,
  descricao text,
  concurso_id uuid references public.concursos(id) on delete cascade,
  disciplina_id uuid references public.disciplinas(id) on delete set null,
  youtube_url text not null,
  youtube_id text,
  duracao_minutos int not null default 0,
  instrutor text,
  thumbnail_url text,
  created_at timestamptz default now()
);

-- 8. Aulas Concluídas
create table if not exists public.aulas_concluidas (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  aula_id uuid references public.aulas(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, aula_id)
);

-- 9. Questões
create table if not exists public.questoes (
  id uuid default uuid_generate_v4() primary key,
  enunciado text not null,
  alternativas jsonb not null,
  correta text not null check (correta in ('A', 'B', 'C', 'D', 'E')),
  explicacao text,
  banca_id uuid references public.bancas(id) on delete set null,
  concurso_id uuid references public.concursos(id) on delete set null,
  disciplina_id uuid references public.disciplinas(id) on delete set null,
  ano int,
  nivel text check (nivel in ('fundamental', 'medio', 'tecnico', 'superior')),
  created_at timestamptz default now()
);

-- 10. Questão Comentários
create table if not exists public.questao_comentarios (
  id uuid default uuid_generate_v4() primary key,
  questao_id uuid references public.questoes(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  conteudo text not null,
  created_at timestamptz default now()
);

-- 11. Questão Respostas
create table if not exists public.questao_respostas (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  questao_id uuid references public.questoes(id) on delete cascade not null,
  correta boolean not null,
  created_at timestamptz default now()
);
create index if not exists idx_questao_respostas_user on public.questao_respostas(user_id);
create index if not exists idx_questao_respostas_data on public.questao_respostas(user_id, created_at desc);

-- 12. PDFs
create table if not exists public.pdfs (
  id uuid default uuid_generate_v4() primary key,
  titulo text not null,
  tipo text not null default 'PDF' check (tipo in ('PDF', 'Audio', 'Resumo', 'Lei Seca')),
  concurso_id uuid references public.concursos(id) on delete cascade,
  disciplina_id uuid references public.disciplinas(id) on delete set null,
  descricao text,
  url text not null,
  size_or_duration text,
  created_at timestamptz default now()
);

-- 13. Resumos
create table if not exists public.resumos (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  titulo text not null,
  conteudo text not null,
  disciplina_id uuid references public.disciplinas(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 14. Cronogramas
create table if not exists public.cronogramas (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  concurso_id uuid references public.concursos(id) on delete set null,
  titulo text not null,
  horas_dia int not null default 3,
  turno text not null default 'integral' check (turno in ('manha', 'tarde', 'noite', 'integral')),
  data_inicio date,
  data_fim date,
  ativo boolean not null default true,
  created_at timestamptz default now()
);

-- 15. Cronograma Dias
create table if not exists public.cronograma_dias (
  id uuid default uuid_generate_v4() primary key,
  cronograma_id uuid references public.cronogramas(id) on delete cascade not null,
  data date not null,
  horas_previstas int,
  horas_realizadas int not null default 0,
  concluido boolean not null default false,
  observacao text,
  created_at timestamptz default now()
);

-- 16. Cronograma Aulas
create table if not exists public.cronograma_aulas (
  id uuid default uuid_generate_v4() primary key,
  cronograma_dia_id uuid references public.cronograma_dias(id) on delete cascade not null,
  aula_id uuid references public.aulas(id) on delete set null,
  titulo_personalizado text,
  youtube_url_personalizada text,
  duracao_minutos int,
  concluido boolean not null default false,
  estourou_tempo boolean not null default false,
  created_at timestamptz default now()
);

-- 17. Fórum Tópicos
create table if not exists public.forum_topics (
  id uuid default uuid_generate_v4() primary key,
  titulo text not null,
  descricao text not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text not null default 'aberto' check (status in ('aberto', 'em_andamento', 'resolvido', 'fechado')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 18. Fórum Comentários
create table if not exists public.forum_comments (
  id uuid default uuid_generate_v4() primary key,
  topic_id uuid references public.forum_topics(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  conteudo text not null,
  created_at timestamptz default now()
);

-- 19. Tickets
create table if not exists public.tickets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  assunto text not null,
  descricao text not null,
  status text not null default 'aberto' check (status in ('aberto', 'respondido', 'fechado')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 20. Ticket Mensagens
create table if not exists public.ticket_messages (
  id uuid default uuid_generate_v4() primary key,
  ticket_id uuid references public.tickets(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  mensagem text not null,
  created_at timestamptz default now()
);

-- 21. Assinaturas
create table if not exists public.assinaturas (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text not null default 'ativa' check (status in ('ativa', 'cancelada', 'expirada')),
  data_inicio timestamptz not null default now(),
  data_fim timestamptz,
  stripe_id text,
  valor decimal(10,2),
  created_at timestamptz default now()
);

-- 22. Flashcards
create table if not exists public.flashcards (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  front text not null,
  back text not null,
  box int not null default 0 check (box between 0 and 4),
  next_review timestamptz not null default now(),
  created_at timestamptz default now()
);

-- 23. Study Sessions
create table if not exists public.study_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  data date not null default current_date,
  minutos int not null default 0,
  created_at timestamptz default now()
);

-- 24. Push Subscriptions
create table if not exists public.push_subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  subscription jsonb not null,
  endpoint text,
  created_at timestamptz default now()
);

-- 25. Cursos
create table if not exists public.cursos (
  id uuid default uuid_generate_v4() primary key,
  titulo text not null,
  descricao text,
  categoria text not null check (categoria in ('idiomas', 'musica', 'artesanato', 'informatica', 'negocios', 'saude', 'outros')),
  nivel text check (nivel in ('iniciante', 'intermediario', 'avancado')),
  instrutor text not null,
  carga_horaria_minutos int not null default 0,
  preco decimal(10,2) not null default 0,
  thumbnail_url text,
  video_apresentacao text,
  ativo boolean not null default true,
  created_at timestamptz default now()
);

-- 26. Curso Módulos
create table if not exists public.curso_modulos (
  id uuid default uuid_generate_v4() primary key,
  curso_id uuid references public.cursos(id) on delete cascade not null,
  titulo text not null,
  descricao text,
  ordem int not null default 0,
  created_at timestamptz default now()
);

-- 27. Curso Aulas
create table if not exists public.curso_aulas (
  id uuid default uuid_generate_v4() primary key,
  modulo_id uuid references public.curso_modulos(id) on delete cascade not null,
  titulo text not null,
  descricao text,
  video_url text,
  duracao_minutos int not null default 0,
  ordem int not null default 0,
  created_at timestamptz default now()
);

-- 28. Curso Matrículas
create table if not exists public.curso_matriculas (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  curso_id uuid references public.cursos(id) on delete cascade not null,
  data_matricula timestamptz not null default now(),
  concluido boolean not null default false,
  created_at timestamptz default now(),
  unique(user_id, curso_id)
);

-- 29. Curso Progresso
create table if not exists public.curso_progresso (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  aula_id uuid references public.curso_aulas(id) on delete cascade not null,
  concluido boolean not null default false,
  created_at timestamptz default now(),
  unique(user_id, aula_id)
);

-- 30. Tarefas Diárias
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

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Profiles: usuários veem apenas seu próprio profile; admins veem todos
alter table public.profiles enable row level security;
create policy if not exists "Profiles select own" on public.profiles for select using (auth.uid() = id);
create policy if not exists "Profiles update own" on public.profiles for update using (auth.uid() = id);

-- Bancas: leitura para todos autenticados, escrita só admin
alter table public.bancas enable row level security;
create policy if not exists "Bancas select all" on public.bancas for select using (true);
create policy if not exists "Bancas insert admin" on public.bancas for insert with check (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy if not exists "Bancas update admin" on public.bancas for update using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy if not exists "Bancas delete admin" on public.bancas for delete using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- Concursos
alter table public.concursos enable row level security;
create policy if not exists "Concursos select all" on public.concursos for select using (true);
create policy if not exists "Concursos insert admin" on public.concursos for insert with check (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy if not exists "Concursos update admin" on public.concursos for update using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy if not exists "Concursos delete admin" on public.concursos for delete using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- Disciplinas
alter table public.disciplinas enable row level security;
create policy if not exists "Disciplinas select all" on public.disciplinas for select using (true);
create policy if not exists "Disciplinas insert admin" on public.disciplinas for insert with check (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy if not exists "Disciplinas update admin" on public.disciplinas for update using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy if not exists "Disciplinas delete admin" on public.disciplinas for delete using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- Notícias
alter table public.noticias enable row level security;
create policy if not exists "Noticias select all" on public.noticias for select using (true);
create policy if not exists "Noticias insert admin" on public.noticias for insert with check (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy if not exists "Noticias update admin" on public.noticias for update using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy if not exists "Noticias delete admin" on public.noticias for delete using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- Aulas
alter table public.aulas enable row level security;
create policy if not exists "Aulas select all" on public.aulas for select using (true);
create policy if not exists "Aulas insert admin" on public.aulas for insert with check (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy if not exists "Aulas update admin" on public.aulas for update using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy if not exists "Aulas delete admin" on public.aulas for delete using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- Aulas Concluídas
alter table public.aulas_concluidas enable row level security;
create policy if not exists "AulasConcluidas select own" on public.aulas_concluidas for select using (auth.uid() = user_id);
create policy if not exists "AulasConcluidas insert own" on public.aulas_concluidas for insert with check (auth.uid() = user_id);
create policy if not exists "AulasConcluidas delete own" on public.aulas_concluidas for delete using (auth.uid() = user_id);

-- Questões
alter table public.questoes enable row level security;
create policy if not exists "Questoes select all" on public.questoes for select using (true);
create policy if not exists "Questoes insert admin" on public.questoes for insert with check (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy if not exists "Questoes update admin" on public.questoes for update using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy if not exists "Questoes delete admin" on public.questoes for delete using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- Questão Comentários
alter table public.questao_comentarios enable row level security;
create policy if not exists "QuestaoComentarios select all" on public.questao_comentarios for select using (true);
create policy if not exists "QuestaoComentarios insert auth" on public.questao_comentarios for insert with check (auth.uid() = user_id);
create policy if not exists "QuestaoComentarios delete own" on public.questao_comentarios for delete using (auth.uid() = user_id);

-- Questão Respostas
alter table public.questao_respostas enable row level security;
create policy if not exists "QuestaoRespostas select own" on public.questao_respostas for select using (auth.uid() = user_id);
create policy if not exists "QuestaoRespostas insert own" on public.questao_respostas for insert with check (auth.uid() = user_id);

-- PDFs
alter table public.pdfs enable row level security;
create policy if not exists "PDFs select all" on public.pdfs for select using (true);
create policy if not exists "PDFs insert admin" on public.pdfs for insert with check (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy if not exists "PDFs update admin" on public.pdfs for update using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy if not exists "PDFs delete admin" on public.pdfs for delete using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- Resumos
alter table public.resumos enable row level security;
create policy if not exists "Resumos select own" on public.resumos for select using (auth.uid() = user_id);
create policy if not exists "Resumos insert own" on public.resumos for insert with check (auth.uid() = user_id);
create policy if not exists "Resumos update own" on public.resumos for update using (auth.uid() = user_id);
create policy if not exists "Resumos delete own" on public.resumos for delete using (auth.uid() = user_id);

-- Cronogramas
alter table public.cronogramas enable row level security;
create policy if not exists "Cronogramas select own" on public.cronogramas for select using (auth.uid() = user_id);
create policy if not exists "Cronogramas insert own" on public.cronogramas for insert with check (auth.uid() = user_id);
create policy if not exists "Cronogramas update own" on public.cronogramas for update using (auth.uid() = user_id);
create policy if not exists "Cronogramas delete own" on public.cronogramas for delete using (auth.uid() = user_id);

-- Cronograma Dias
alter table public.cronograma_dias enable row level security;
create policy if not exists "CronogramaDias select own" on public.cronograma_dias for select using (auth.uid() in (select user_id from public.cronogramas where id = cronograma_id));
create policy if not exists "CronogramaDias insert own" on public.cronograma_dias for insert with check (auth.uid() in (select user_id from public.cronogramas where id = cronograma_id));
create policy if not exists "CronogramaDias update own" on public.cronograma_dias for update using (auth.uid() in (select user_id from public.cronogramas where id = cronograma_id));
create policy if not exists "CronogramaDias delete own" on public.cronograma_dias for delete using (auth.uid() in (select user_id from public.cronogramas where id = cronograma_id));

-- Cronograma Aulas
alter table public.cronograma_aulas enable row level security;
create policy if not exists "CronogramaAulas select own" on public.cronograma_aulas for select using (auth.uid() in (select user_id from public.cronogramas where id = (select cronograma_id from public.cronograma_dias where id = cronograma_dia_id)));
create policy if not exists "CronogramaAulas insert own" on public.cronograma_aulas for insert with check (auth.uid() in (select user_id from public.cronogramas where id = (select cronograma_id from public.cronograma_dias where id = cronograma_dia_id)));
create policy if not exists "CronogramaAulas update own" on public.cronograma_aulas for update using (auth.uid() in (select user_id from public.cronogramas where id = (select cronograma_id from public.cronograma_dias where id = cronograma_dia_id)));

-- Fórum Tópicos
alter table public.forum_topics enable row level security;
create policy if not exists "ForumTopics select all" on public.forum_topics for select using (true);
create policy if not exists "ForumTopics insert auth" on public.forum_topics for insert with check (auth.uid() = user_id);
create policy if not exists "ForumTopics update own" on public.forum_topics for update using (auth.uid() = user_id);
create policy if not exists "ForumTopics delete own" on public.forum_topics for delete using (auth.uid() = user_id);

-- Fórum Comentários
alter table public.forum_comments enable row level security;
create policy if not exists "ForumComments select all" on public.forum_comments for select using (true);
create policy if not exists "ForumComments insert auth" on public.forum_comments for insert with check (auth.uid() = user_id);
create policy if not exists "ForumComments delete own" on public.forum_comments for delete using (auth.uid() = user_id);

-- Tickets
alter table public.tickets enable row level security;
create policy if not exists "Tickets select own" on public.tickets for select using (auth.uid() = user_id);
create policy if not exists "Tickets insert own" on public.tickets for insert with check (auth.uid() = user_id);
create policy if not exists "Tickets update own" on public.tickets for update using (auth.uid() = user_id);

-- Ticket Mensagens
alter table public.ticket_messages enable row level security;
create policy if not exists "TicketMessages select own" on public.ticket_messages for select using (auth.uid() = user_id);
create policy if not exists "TicketMessages insert auth" on public.ticket_messages for insert with check (auth.uid() = user_id);

-- Assinaturas
alter table public.assinaturas enable row level security;
create policy if not exists "Assinaturas select own" on public.assinaturas for select using (auth.uid() = user_id);
create policy if not exists "Assinaturas insert admin" on public.assinaturas for insert with check (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy if not exists "Assinaturas update admin" on public.assinaturas for update using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- Flashcards
alter table public.flashcards enable row level security;
create policy if not exists "Flashcards select own" on public.flashcards for select using (auth.uid() = user_id);
create policy if not exists "Flashcards insert own" on public.flashcards for insert with check (auth.uid() = user_id);
create policy if not exists "Flashcards update own" on public.flashcards for update using (auth.uid() = user_id);
create policy if not exists "Flashcards delete own" on public.flashcards for delete using (auth.uid() = user_id);

-- Study Sessions
alter table public.study_sessions enable row level security;
create policy if not exists "StudySessions select own" on public.study_sessions for select using (auth.uid() = user_id);
create policy if not exists "StudySessions insert own" on public.study_sessions for insert with check (auth.uid() = user_id);

-- Push Subscriptions
alter table public.push_subscriptions enable row level security;
create policy if not exists "PushSubscriptions select own" on public.push_subscriptions for select using (auth.uid() = user_id);
create policy if not exists "PushSubscriptions insert own" on public.push_subscriptions for insert with check (auth.uid() = user_id);
create policy if not exists "PushSubscriptions delete own" on public.push_subscriptions for delete using (auth.uid() = user_id);

-- Cursos
alter table public.cursos enable row level security;
create policy if not exists "Cursos select all" on public.cursos for select using (true);
create policy if not exists "Cursos insert admin" on public.cursos for insert with check (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy if not exists "Cursos update admin" on public.cursos for update using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy if not exists "Cursos delete admin" on public.cursos for delete using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- Curso Módulos
alter table public.curso_modulos enable row level security;
create policy if not exists "CursoModulos select all" on public.curso_modulos for select using (true);
create policy if not exists "CursoModulos insert admin" on public.curso_modulos for insert with check (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy if not exists "CursoModulos update admin" on public.curso_modulos for update using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy if not exists "CursoModulos delete admin" on public.curso_modulos for delete using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- Curso Aulas
alter table public.curso_aulas enable row level security;
create policy if not exists "CursoAulas select all" on public.curso_aulas for select using (true);
create policy if not exists "CursoAulas insert admin" on public.curso_aulas for insert with check (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy if not exists "CursoAulas update admin" on public.curso_aulas for update using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy if not exists "CursoAulas delete admin" on public.curso_aulas for delete using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- Curso Matrículas
alter table public.curso_matriculas enable row level security;
create policy if not exists "CursoMatriculas select own" on public.curso_matriculas for select using (auth.uid() = user_id);
create policy if not exists "CursoMatriculas insert own" on public.curso_matriculas for insert with check (auth.uid() = user_id);
create policy if not exists "CursoMatriculas update own" on public.curso_matriculas for update using (auth.uid() = user_id);

-- Curso Progresso
alter table public.curso_progresso enable row level security;
create policy if not exists "CursoProgresso select own" on public.curso_progresso for select using (auth.uid() = user_id);
create policy if not exists "CursoProgresso insert own" on public.curso_progresso for insert with check (auth.uid() = user_id);
create policy if not exists "CursoProgresso update own" on public.curso_progresso for update using (auth.uid() = user_id);

-- Tarefas Diárias
alter table public.tarefas_diarias enable row level security;
create policy if not exists "TarefasDiarias select own" on public.tarefas_diarias for select using (auth.uid() = user_id);
create policy if not exists "TarefasDiarias insert own" on public.tarefas_diarias for insert with check (auth.uid() = user_id);
create policy if not exists "TarefasDiarias update own" on public.tarefas_diarias for update using (auth.uid() = user_id);
create policy if not exists "TarefasDiarias delete own" on public.tarefas_diarias for delete using (auth.uid() = user_id);

-- =====================================================
-- TRIGGER: Criar profile automaticamente no signup
-- =====================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nome, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', ''), 'user');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
