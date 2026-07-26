-- =====================================================
-- TOP CONCURSO - Schema Inicial
-- =====================================================

-- 1. Extensions
create extension if not exists "uuid-ossp";

-- 2. Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  nome text not null default '',
  role text not null default 'user' check (role in ('user', 'admin')),
  assinatura_ativa boolean not null default false,
  assinatura_inicio timestamptz,
  assinatura_fim timestamptz,
  avatar_url text,
  created_at timestamptz default now()
);

-- 3. Bancas Organizadoras
create table public.bancas (
  id uuid default uuid_generate_v4() primary key,
  nome text not null unique,
  sigla text not null unique,
  created_at timestamptz default now()
);

-- 4. Concursos
create table public.concursos (
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
create table public.disciplinas (
  id uuid default uuid_generate_v4() primary key,
  nome text not null,
  concurso_id uuid references public.concursos(id) on delete cascade,
  created_at timestamptz default now(),
  unique(nome, concurso_id)
);

-- 6. Notícias / Mural
create table public.noticias (
  id uuid default uuid_generate_v4() primary key,
  titulo text not null,
  conteudo text not null,
  tipo text default 'noticia' check (tipo in ('noticia', 'edital', 'dica', 'aviso')),
  concurso_id uuid references public.concursos(id) on delete set null,
  link_url text,
  autor_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- 7. PDFs / Materiais
create table public.pdfs (
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

-- 8. Aulas (YouTube)
create table public.aulas (
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

-- 9. Questões
create table public.questoes (
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

-- 10. Resumos do usuário
create table public.resumos (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  titulo text not null,
  conteudo text not null,
  disciplina_id uuid references public.disciplinas(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 11. Cronogramas
create table public.cronogramas (
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

-- 12. Dias do Cronograma
create table public.cronograma_dias (
  id uuid default uuid_generate_v4() primary key,
  cronograma_id uuid references public.cronogramas(id) on delete cascade not null,
  data date not null,
  horas_previstas decimal(4,2),
  horas_realizadas decimal(4,2) default 0,
  concluido boolean default false,
  observacao text,
  created_at timestamptz default now()
);

-- 13. Aulas do Cronograma (detalhamento por aula dentro de cada dia)
create table public.cronograma_aulas (
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

-- 14. Fórum - Tópicos
create table public.forum_topics (
  id uuid default uuid_generate_v4() primary key,
  titulo text not null,
  descricao text not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text default 'aberto' check (status in ('aberto', 'em_andamento', 'resolvido', 'fechado')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 15. Fórum - Comentários
create table public.forum_comments (
  id uuid default uuid_generate_v4() primary key,
  topic_id uuid references public.forum_topics(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  conteudo text not null,
  created_at timestamptz default now()
);

-- 16. Tickets de Suporte
create table public.tickets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  assunto text not null,
  descricao text not null,
  status text default 'aberto' check (status in ('aberto', 'respondido', 'fechado')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 17. Mensagens dos Tickets
create table public.ticket_messages (
  id uuid default uuid_generate_v4() primary key,
  ticket_id uuid references public.tickets(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  mensagem text not null,
  created_at timestamptz default now()
);

-- 18. Assinaturas
create table public.assinaturas (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text not null default 'ativa' check (status in ('ativa', 'cancelada', 'expirada')),
  data_inicio timestamptz default now(),
  data_fim timestamptz,
  stripe_id text,
  valor decimal(10,2),
  created_at timestamptz default now()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Profiles
alter table public.profiles enable row level security;
create policy "Usuarios veem seu próprio profile"
  on public.profiles for select
  using (auth.uid() = id);
create policy "Admin veem todos os profiles"
  on public.profiles for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Admin pode editar profiles"
  on public.profiles for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Bancas
alter table public.bancas enable row level security;
create policy "Todos podem ver bancas"
  on public.bancas for select
  using (true);
create policy "Admin pode gerenciar bancas"
  on public.bancas for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Concursos
alter table public.concursos enable row level security;
create policy "Todos podem ver concursos"
  on public.concursos for select
  using (true);
create policy "Admin pode gerenciar concursos"
  on public.concursos for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Disciplinas
alter table public.disciplinas enable row level security;
create policy "Todos podem ver disciplinas"
  on public.disciplinas for select
  using (true);
create policy "Admin pode gerenciar disciplinas"
  on public.disciplinas for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Notícias
alter table public.noticias enable row level security;
create policy "Todos podem ver noticias"
  on public.noticias for select
  using (true);
create policy "Admin pode gerenciar noticias"
  on public.noticias for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- PDFs
alter table public.pdfs enable row level security;
create policy "Todos podem ver pdfs"
  on public.pdfs for select
  using (true);
create policy "Admin pode gerenciar pdfs"
  on public.pdfs for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Aulas
alter table public.aulas enable row level security;
create policy "Todos podem ver aulas"
  on public.aulas for select
  using (true);
create policy "Admin pode gerenciar aulas"
  on public.aulas for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Questões
alter table public.questoes enable row level security;
create policy "Todos podem ver questoes"
  on public.questoes for select
  using (true);
create policy "Admin pode gerenciar questoes"
  on public.questoes for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Resumos (cada um vê só os seus)
alter table public.resumos enable row level security;
create policy "Usuario ve seus proprios resumos"
  on public.resumos for select
  using (auth.uid() = user_id);
create policy "Usuario pode inserir seus resumos"
  on public.resumos for insert
  with check (auth.uid() = user_id);
create policy "Usuario pode editar seus resumos"
  on public.resumos for update
  using (auth.uid() = user_id);
create policy "Usuario pode deletar seus resumos"
  on public.resumos for delete
  using (auth.uid() = user_id);

-- Cronogramas
alter table public.cronogramas enable row level security;
create policy "Usuario ve seus cronogramas"
  on public.cronogramas for select
  using (auth.uid() = user_id);
create policy "Usuario pode gerenciar seus cronogramas"
  on public.cronogramas for all
  using (auth.uid() = user_id);

-- Cronograma Dias
alter table public.cronograma_dias enable row level security;
create policy "Usuario ve dias dos seus cronogramas"
  on public.cronograma_dias for select
  using (exists (select 1 from public.cronogramas where id = cronograma_id and user_id = auth.uid()));
create policy "Usuario gerencia dias dos seus cronogramas"
  on public.cronograma_dias for all
  using (exists (select 1 from public.cronogramas where id = cronograma_id and user_id = auth.uid()));

-- Cronograma Aulas
alter table public.cronograma_aulas enable row level security;
create policy "Usuario ve aulas dos seus cronogramas"
  on public.cronograma_aulas for select
  using (exists (
    select 1 from public.cronograma_dias cd
    join public.cronogramas c on c.id = cd.cronograma_id
    where cd.id = cronograma_dia_id and c.user_id = auth.uid()
  ));
create policy "Usuario gerencia aulas dos seus cronogramas"
  on public.cronograma_aulas for all
  using (exists (
    select 1 from public.cronograma_dias cd
    join public.cronogramas c on c.id = cd.cronograma_id
    where cd.id = cronograma_dia_id and c.user_id = auth.uid()
  ));

-- Forum Topics
alter table public.forum_topics enable row level security;
create policy "Todos podem ver topics"
  on public.forum_topics for select
  using (true);
create policy "Usuario pode criar topicos"
  on public.forum_topics for insert
  with check (auth.uid() = user_id);
create policy "Admin pode gerenciar topicos"
  on public.forum_topics for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Forum Comments
alter table public.forum_comments enable row level security;
create policy "Todos podem ver comentarios"
  on public.forum_comments for select
  using (true);
create policy "Usuario pode comentar"
  on public.forum_comments for insert
  with check (auth.uid() = user_id);
create policy "Admin pode gerenciar comentarios"
  on public.forum_comments for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Tickets
alter table public.tickets enable row level security;
create policy "Usuario ve seus proprios tickets"
  on public.tickets for select
  using (auth.uid() = user_id);
create policy "Admin ve todos os tickets"
  on public.tickets for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Usuario pode criar tickets"
  on public.tickets for insert
  with check (auth.uid() = user_id);
create policy "Admin pode responder tickets"
  on public.tickets for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Ticket Messages
alter table public.ticket_messages enable row level security;
create policy "Usuario ve mensagens dos seus tickets"
  on public.ticket_messages for select
  using (exists (select 1 from public.tickets where id = ticket_id and user_id = auth.uid()));
create policy "Admin ve mensagens de todos tickets"
  on public.ticket_messages for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Usuario pode enviar mensagens nos seus tickets"
  on public.ticket_messages for insert
  with check (
    exists (select 1 from public.tickets where id = ticket_id and user_id = auth.uid())
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Assinaturas
alter table public.assinaturas enable row level security;
create policy "Usuario ve suas assinaturas"
  on public.assinaturas for select
  using (auth.uid() = user_id);
create policy "Admin gerencia assinaturas"
  on public.assinaturas for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- =====================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =====================================================
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

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
