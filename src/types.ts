export interface Profile {
  id: string;
  nome: string;
  role: 'user' | 'admin';
  assinatura_ativa: boolean;
  assinatura_inicio?: string;
  assinatura_fim?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Banca {
  id: string;
  nome: string;
  sigla: string;
  created_at: string;
}

export interface Concurso {
  id: string;
  titulo: string;
  orgao: string;
  banca_id?: string;
  banca_nome?: string;
  edital_url?: string;
  vagas: number;
  inscritos_estimados: number;
  data_prova?: string;
  data_edital?: string;
  status: 'aberto' | 'previsto' | 'encerrado';
  nivel?: 'fundamental' | 'medio' | 'tecnico' | 'superior';
  salario?: number;
  created_at: string;
}

export interface Disciplina {
  id: string;
  nome: string;
  concurso_id: string;
  created_at: string;
}

export interface Noticia {
  id: string;
  titulo: string;
  conteudo: string;
  tipo: 'noticia' | 'edital' | 'dica' | 'aviso';
  concurso_id?: string;
  link_url?: string;
  autor_id?: string;
  created_at: string;
}

export interface Pdf {
  id: string;
  titulo: string;
  tipo: 'PDF' | 'Audio' | 'Resumo' | 'Lei Seca';
  concurso_id: string;
  disciplina_id?: string;
  descricao?: string;
  url: string;
  size_or_duration?: string;
  created_at: string;
}

export interface Aula {
  id: string;
  titulo: string;
  descricao?: string;
  concurso_id: string;
  disciplina_id?: string;
  youtube_url: string;
  youtube_id?: string;
  duracao_minutos: number;
  instrutor?: string;
  thumbnail_url?: string;
  created_at: string;
}

export interface Questao {
  id: string;
  enunciado: string;
  alternativas: { key: 'A' | 'B' | 'C' | 'D' | 'E'; text: string }[];
  correta: 'A' | 'B' | 'C' | 'D' | 'E';
  explicacao?: string;
  banca_id?: string;
  banca_nome?: string;
  concurso_id?: string;
  concurso_titulo?: string;
  disciplina_id?: string;
  disciplina_nome?: string;
  ano?: number;
  nivel?: 'fundamental' | 'medio' | 'tecnico' | 'superior';
  created_at: string;
}

export interface Resumo {
  id: string;
  user_id: string;
  titulo: string;
  conteudo: string;
  disciplina_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Cronograma {
  id: string;
  user_id: string;
  concurso_id?: string;
  titulo: string;
  horas_dia: number;
  turno: 'manha' | 'tarde' | 'noite' | 'integral';
  data_inicio?: string;
  data_fim?: string;
  ativo: boolean;
  created_at: string;
}

export interface CronogramaDia {
  id: string;
  cronograma_id: string;
  data: string;
  horas_previstas?: number;
  horas_realizadas: number;
  concluido: boolean;
  observacao?: string;
  aulas?: CronogramaAula[];
}

export interface CronogramaAula {
  id: string;
  cronograma_dia_id: string;
  aula_id?: string;
  titulo_personalizado?: string;
  youtube_url_personalizada?: string;
  duracao_minutos?: number;
  concluido: boolean;
  estourou_tempo: boolean;
}

export interface ForumTopic {
  id: string;
  titulo: string;
  descricao: string;
  user_id: string;
  autor_nome?: string;
  status: 'aberto' | 'em_andamento' | 'resolvido' | 'fechado';
  created_at: string;
  updated_at: string;
  comentarios?: ForumComment[];
}

export interface ForumComment {
  id: string;
  topic_id: string;
  user_id: string;
  autor_nome?: string;
  conteudo: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  user_id: string;
  assunto: string;
  descricao: string;
  status: 'aberto' | 'respondido' | 'fechado';
  created_at: string;
  updated_at: string;
  mensagens?: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  mensagem: string;
  created_at: string;
}

export interface AulaConcluida {
  id: string;
  user_id: string;
  aula_id: string;
  created_at: string;
}

export interface Flashcard {
  id: string;
  user_id: string;
  front: string;
  back: string;
  box: number;
  next_review: string;
  created_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  data: string;
  minutos: number;
  created_at: string;
}

export interface Curso {
  id: string;
  titulo: string;
  descricao?: string;
  categoria: 'idiomas' | 'musica' | 'artesanato' | 'informatica' | 'negocios' | 'saude' | 'outros';
  nivel?: 'iniciante' | 'intermediario' | 'avancado';
  instrutor: string;
  carga_horaria_minutos: number;
  preco: number;
  thumbnail_url?: string;
  video_apresentacao?: string;
  ativo: boolean;
  created_at: string;
}

export interface CursoModulo {
  id: string;
  curso_id: string;
  titulo: string;
  descricao?: string;
  ordem: number;
  created_at: string;
  aulas?: CursoAula[];
}

export interface CursoAula {
  id: string;
  modulo_id: string;
  titulo: string;
  descricao?: string;
  video_url?: string;
  duracao_minutos: number;
  ordem: number;
  created_at: string;
}

export interface CursoMatricula {
  id: string;
  user_id: string;
  curso_id: string;
  data_matricula: string;
  concluido: boolean;
  created_at: string;
}

export interface CursoProgresso {
  id: string;
  user_id: string;
  aula_id: string;
  concluido: boolean;
  created_at: string;
}

export interface Assinatura {
  id: string;
  user_id: string;
  status: 'ativa' | 'cancelada' | 'expirada';
  data_inicio: string;
  data_fim?: string;
  stripe_id?: string;
  valor?: number;
  created_at: string;
}
