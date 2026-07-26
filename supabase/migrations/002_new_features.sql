-- ============================================================
-- Migration: Novas tabelas para features implementadas
-- ============================================================

-- 1. Flashcards sync (Revisão Espaçada)
CREATE TABLE IF NOT EXISTS flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  box INTEGER DEFAULT 0,
  next_review TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios flashcards"
  ON flashcards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios flashcards"
  ON flashcards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios flashcards"
  ON flashcards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios flashcards"
  ON flashcards FOR DELETE
  USING (auth.uid() = user_id);

-- 2. Study Sessions (Estatísticas de Estudo)
CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  minutos INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, data)
);

ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias sessões"
  ON study_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias sessões"
  ON study_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias sessões"
  ON study_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- 3. Questão Comentários
CREATE TABLE IF NOT EXISTS questao_comentarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questao_id UUID REFERENCES questoes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  autor_nome TEXT,
  conteudo TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE questao_comentarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver comentários"
  ON questao_comentarios FOR SELECT
  USING (true);

CREATE POLICY "Usuários autenticados podem comentar"
  ON questao_comentarios FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Autor ou admin pode deletar"
  ON questao_comentarios FOR DELETE
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

-- 4. Adicionar coluna de trial no perfil
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_start TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_used BOOLEAN DEFAULT false;

-- Função para ativar trial (7 dias)
CREATE OR REPLACE FUNCTION activate_trial()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET trial_start = NOW(),
      trial_used = true,
      assinatura_ativa = true,
      assinatura_inicio = NOW(),
      assinatura_fim = NOW() + INTERVAL '7 days'
  WHERE id = auth.uid()
    AND (trial_used IS NULL OR trial_used = false);
END;
$$;
