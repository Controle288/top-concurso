-- 009_add_materias.sql
-- Cria tabela de matérias/tópicos por disciplina e vincula aulas

-- 1. Criar tabela materias
CREATE TABLE IF NOT EXISTS public.materias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concurso_id UUID NOT NULL REFERENCES public.concursos(id) ON DELETE CASCADE,
  disciplina_id UUID NOT NULL REFERENCES public.disciplinas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  ordem INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Adicionar materia_id na tabela aulas
ALTER TABLE public.aulas ADD COLUMN IF NOT EXISTS materia_id UUID REFERENCES public.materias(id) ON DELETE SET NULL;

-- 3. Criar índices
CREATE INDEX IF NOT EXISTS idx_materias_concurso ON public.materias(concurso_id);
CREATE INDEX IF NOT EXISTS idx_materias_disciplina ON public.materias(disciplina_id);
CREATE INDEX IF NOT EXISTS idx_aulas_materia ON public.aulas(materia_id);

-- 4. Popular matérias padrão para disciplinas existentes (cria uma matéria "Geral" pra cada disciplina)
INSERT INTO public.materias (concurso_id, disciplina_id, nome, ordem)
SELECT DISTINCT d.concurso_id, d.id, 'Geral', 0
FROM public.disciplinas d
WHERE NOT EXISTS (
  SELECT 1 FROM public.materias m WHERE m.disciplina_id = d.id
);

-- 5. Migrar aulas existentes para a matéria "Geral" da sua disciplina
UPDATE public.aulas a
SET materia_id = m.id
FROM public.materias m
WHERE a.disciplina_id = m.disciplina_id
  AND m.nome = 'Geral'
  AND a.materia_id IS NULL;

-- 6. Habilitar RLS
ALTER TABLE public.materias ENABLE ROW LEVEL SECURITY;

-- 7. Políticas RLS
CREATE POLICY "Materias são visíveis para todos" ON public.materias
  FOR SELECT USING (true);

CREATE POLICY "Admin pode gerenciar matérias" ON public.materias
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
