-- 010_templates_seed.sql
-- Templates de matérias por concurso + seed completo

-- 0. Adicionar materia_id em cronograma_aulas
ALTER TABLE public.cronograma_aulas ADD COLUMN IF NOT EXISTS materia_id UUID REFERENCES public.materias(id) ON DELETE SET NULL;

-- 1. Criar tabela de templates
CREATE TABLE IF NOT EXISTS public.concurso_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  orgao_pattern TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.template_materias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.concurso_templates(id) ON DELETE CASCADE,
  disciplina_nome TEXT NOT NULL,
  materia_nome TEXT NOT NULL,
  ordem INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_template_materias_template ON public.template_materias(template_id);

ALTER TABLE public.concurso_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_materias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates visíveis para todos" ON public.concurso_templates FOR SELECT USING (true);
CREATE POLICY "Admin gerencia templates" ON public.concurso_templates FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Template materias visíveis para todos" ON public.template_materias FOR SELECT USING (true);
CREATE POLICY "Admin gerencia template materias" ON public.template_materias FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 2. Seed dos templates

-- Helper function para inserir matérias de um template
DO $$
DECLARE
  v_template_id UUID;
BEGIN

-- ========================
-- 1. POLÍCIA MILITAR (PM)
-- ========================
INSERT INTO public.concurso_templates (nome, orgao_pattern) VALUES
  ('Polícia Militar', 'PM|Polícia Militar|Bombeiro Militar|PMERJ|PMESP|PMPR|PMBA|PMMG|PMDF')
RETURNING id INTO v_template_id;

INSERT INTO public.template_materias (template_id, disciplina_nome, materia_nome, ordem) VALUES
-- Português
(v_template_id, 'Português', 'Compreensão e Interpretação de Textos', 1),
(v_template_id, 'Português', 'Fonologia: Fonemas, Encontros Vocálicos e Consonantais', 2),
(v_template_id, 'Português', 'Ortografia: Emprego de Letras e Acentuação Gráfica', 3),
(v_template_id, 'Português', 'Morfologia: Estrutura e Formação de Palavras', 4),
(v_template_id, 'Português', 'Classes de Palavras I: Substantivo, Adjetivo, Artigo, Numeral', 5),
(v_template_id, 'Português', 'Classes de Palavras II: Pronome, Verbo, Advérbio, Preposição', 6),
(v_template_id, 'Português', 'Classes de Palavras III: Conjunção, Interjeição', 7),
(v_template_id, 'Português', 'Sintaxe: Termos da Oração', 8),
(v_template_id, 'Português', 'Sintaxe: Período Composto por Coordenação', 9),
(v_template_id, 'Português', 'Sintaxe: Período Composto por Subordinação', 10),
(v_template_id, 'Português', 'Concordância Verbal e Nominal', 11),
(v_template_id, 'Português', 'Regência Verbal e Nominal', 12),
(v_template_id, 'Português', 'Crase', 13),
(v_template_id, 'Português', 'Colocação Pronominal', 14),
(v_template_id, 'Português', 'Pontuação', 15),
(v_template_id, 'Português', 'Redação Oficial e Documentos', 16),
-- Matemática
(v_template_id, 'Matemática', 'Operações Básicas: Soma, Subtração, Multiplicação, Divisão', 1),
(v_template_id, 'Matemática', 'Conjuntos Numéricos: N, Z, Q, R', 2),
(v_template_id, 'Matemática', 'MMC, MDC e Frações', 3),
(v_template_id, 'Matemática', 'Regra de Três Simples e Composta', 4),
(v_template_id, 'Matemática', 'Porcentagem', 5),
(v_template_id, 'Matemática', 'Juros Simples e Compostos', 6),
(v_template_id, 'Matemática', 'Equações e Inequações do 1º e 2º Grau', 7),
(v_template_id, 'Matemática', 'Sistemas Lineares', 8),
(v_template_id, 'Matemática', 'Geometria Plana: Triângulos, Quadriláteros, Circunferência', 9),
(v_template_id, 'Matemática', 'Geometria Espacial: Cubo, Paralelepípedo, Cilindro, Cone, Esfera', 10),
(v_template_id, 'Matemática', 'Trigonometria', 11),
(v_template_id, 'Matemática', 'Matrizes, Determinantes e Sistemas Lineares', 12),
(v_template_id, 'Matemática', 'Análise Combinatória', 13),
(v_template_id, 'Matemática', 'Probabilidade', 14),
(v_template_id, 'Matemática', 'Estatística: Média, Moda, Mediana, Desvio Padrão', 15),
-- Raciocínio Lógico
(v_template_id, 'Raciocínio Lógico', 'Estruturas Lógicas: Proposições e Conectivos', 1),
(v_template_id, 'Raciocínio Lógico', 'Tabelas-Verdade', 2),
(v_template_id, 'Raciocínio Lógico', 'Tautologia, Contradição e Contingência', 3),
(v_template_id, 'Raciocínio Lógico', 'Equivalência e Negação de Proposições', 4),
(v_template_id, 'Raciocínio Lógico', 'Argumentação Lógica: Premissas e Conclusão', 5),
(v_template_id, 'Raciocínio Lógico', 'Diagramas Lógicos (Conjuntos)', 6),
(v_template_id, 'Raciocínio Lógico', 'Sequências Lógicas (Numéricas e Figuras)', 7),
(v_template_id, 'Raciocínio Lógico', 'Raciocínio Analítico e Crítico', 8),
(v_template_id, 'Raciocínio Lógico', 'Problemas com Verdades e Mentiras', 9),
(v_template_id, 'Raciocínio Lógico', 'Associações Lógicas', 10),
-- Direito Constitucional
(v_template_id, 'Direito Constitucional', 'Fundamentos da República: Soberania, Cidadania, Dignidade', 1),
(v_template_id, 'Direito Constitucional', 'Direitos e Garantias Individuais (Art. 5º)', 2),
(v_template_id, 'Direito Constitucional', 'Direitos Sociais (Art. 6º ao 11º)', 3),
(v_template_id, 'Direito Constitucional', 'Nacionalidade', 4),
(v_template_id, 'Direito Constitucional', 'Direitos Políticos e Partidos Políticos', 5),
(v_template_id, 'Direito Constitucional', 'Organização do Estado: União, Estados, DF, Municípios', 6),
(v_template_id, 'Direito Constitucional', 'Poder Legislativo: Estrutura e Atribuições', 7),
(v_template_id, 'Direito Constitucional', 'Processo Legislativo', 8),
(v_template_id, 'Direito Constitucional', 'Poder Executivo: Presidente, Atribuições, Responsabilidade', 9),
(v_template_id, 'Direito Constitucional', 'Poder Judiciário: Estrutura e Competências', 10),
(v_template_id, 'Direito Constitucional', 'STF e Controle de Constitucionalidade', 11),
(v_template_id, 'Direito Constitucional', 'Administração Pública (Art. 37 ao 41)', 12),
(v_template_id, 'Direito Constitucional', 'Servidores Públicos Militares (Art. 42)', 13),
(v_template_id, 'Direito Constitucional', 'Segurança Pública (Art. 144)', 14),
(v_template_id, 'Direito Constitucional', 'Ordem Social e Tributação', 15),
-- Direito Administrativo
(v_template_id, 'Direito Administrativo', 'Princípios da Administração Pública', 1),
(v_template_id, 'Direito Administrativo', 'Organização Administrativa: Direta e Indireta', 2),
(v_template_id, 'Direito Administrativo', 'Poderes Administrativos: Vinculado, Discricionário, Hierárquico', 3),
(v_template_id, 'Direito Administrativo', 'Atos Administrativos: Requisitos, Atributos e Classificação', 4),
(v_template_id, 'Direito Administrativo', 'Extinção e Anulação dos Atos Administrativos', 5),
(v_template_id, 'Direito Administrativo', 'Licitações (Lei 14.133/2021)', 6),
(v_template_id, 'Direito Administrativo', 'Contratos Administrativos', 7),
(v_template_id, 'Direito Administrativo', 'Servidores Públicos: Cargo, Emprego e Função', 8),
(v_template_id, 'Direito Administrativo', 'Responsabilidade Civil do Estado', 9),
(v_template_id, 'Direito Administrativo', 'Processo Administrativo (Lei 9.784/99)', 10),
(v_template_id, 'Direito Administrativo', 'Intervenção do Estado na Propriedade', 11),
(v_template_id, 'Direito Administrativo', 'Bens Públicos', 12),
(v_template_id, 'Direito Administrativo', 'Controle da Administração Pública', 13),
-- Direito Penal
(v_template_id, 'Direito Penal', 'Princípios do Direito Penal', 1),
(v_template_id, 'Direito Penal', 'Teoria Geral do Crime: Fato Típico, Ilícito, Culpável', 2),
(v_template_id, 'Direito Penal', 'Conduta: Ação e Omissão', 3),
(v_template_id, 'Direito Penal', 'Resultado e Nexo Causal', 4),
(v_template_id, 'Direito Penal', 'Tipicidade: Dolo e Culpa', 5),
(v_template_id, 'Direito Penal', 'Consumação e Tentativa', 6),
(v_template_id, 'Direito Penal', 'Desistência Voluntária e Arrependimento Eficaz', 7),
(v_template_id, 'Direito Penal', 'Ilicitude e Excludentes: Legítima Defesa, Estado de Necessidade', 8),
(v_template_id, 'Direito Penal', 'Culpabilidade e Imputabilidade Penal', 9),
(v_template_id, 'Direito Penal', 'Concurso de Pessoas', 10),
(v_template_id, 'Direito Penal', 'Crimes contra a Pessoa: Homicídio, Lesão Corporal', 11),
(v_template_id, 'Direito Penal', 'Crimes contra o Patrimônio: Roubo, Furto, Latrocínio', 12),
(v_template_id, 'Direito Penal', 'Crimes contra a Administração Pública: Peculato, Corrupção', 13),
(v_template_id, 'Direito Penal', 'Crimes de Trânsito (se pertinente)', 14),
(v_template_id, 'Direito Penal', 'Lei de Drogas (Lei 11.343/2006)', 15),
(v_template_id, 'Direito Penal', 'Lei de Tortura (Lei 9.455/97)', 16),
(v_template_id, 'Direito Penal', 'Crimes de Abuso de Autoridade (Lei 13.869/2019)', 17),
(v_template_id, 'Direito Penal', 'Execução Penal (Lei 7.210/84 - LEP)', 18),
-- Legislação Específica PM
(v_template_id, 'Legislação PM', 'Estatuto dos Policiais Militares', 1),
(v_template_id, 'Direito Penal Militar', 'Código Penal Militar (Decreto-Lei 1.001/69)', 2),
(v_template_id, 'Direito Penal Militar', 'Crimes Militares em Tempo de Paz', 3),
(v_template_id, 'Direito Penal Militar', 'Crimes Militares Próprios e Impróprios', 4),
(v_template_id, 'Direito Penal Militar', 'Processo Penal Militar (CPPM)', 5),
(v_template_id, 'Legislação PM', 'Lei de Organização Básica da PM (Estadual)', 6),
(v_template_id, 'Legislação PM', 'Código Disciplinar Militar Estadual', 7),
(v_template_id, 'Legislação PM', 'Lei de Acesso à Informação no âmbito PM', 8),
(v_template_id, 'Legislação PM', 'Sistema de Proteção Social dos Militares', 9),
(v_template_id, 'Legislação PM', 'Direitos Humanos na Atividade Policial Militar', 10),
-- História e Geografia
(v_template_id, 'História do Brasil', 'Brasil Colônia: Capitanias, Ciclo do Açúcar, Ouro', 1),
(v_template_id, 'História do Brasil', 'Independência e Império', 2),
(v_template_id, 'História do Brasil', 'República Velha e Era Vargas', 3),
(v_template_id, 'História do Brasil', 'Ditadura Militar e Redemocratização', 4),
(v_template_id, 'História do Brasil', 'História da PM no Estado', 5),
(v_template_id, 'Geografia', 'Geografia do Estado: Relevo, Clima, Hidrografia', 1),
(v_template_id, 'Geografia', 'População e Urbanização', 2),
(v_template_id, 'Geografia', 'Economia Estadual: PIB, Setores, Recursos', 3),
(v_template_id, 'Geografia', 'Regionalização e Mesorregiões', 4),
-- Atualidades
(v_template_id, 'Atualidades', 'Política Nacional e Internacional', 1),
(v_template_id, 'Atualidades', 'Economia Brasileira: Inflação, Juros, PIB, Dívida', 2),
(v_template_id, 'Atualidades', 'Meio Ambiente e Sustentabilidade', 3),
(v_template_id, 'Atualidades', 'Segurança Pública: Estatísticas e Políticas', 4),
(v_template_id, 'Atualidades', 'Tecnologia e Inovação no Serviço Público', 5),
(v_template_id, 'Atualidades', 'Saúde Pública e Epidemias', 6),
(v_template_id, 'Atualidades', 'Educação e Desigualdade Social', 7);

-- ========================
-- 2. POLÍCIA CIVIL (PC)
-- ========================
INSERT INTO public.concurso_templates (nome, orgao_pattern) VALUES
  ('Polícia Civil', 'Polícia Civil|PC|PCERJ|PCESP|PCPR|PCBA|PCMG|PCDF|Polícia Judiciária')
RETURNING id INTO v_template_id;

INSERT INTO public.template_materias (template_id, disciplina_nome, materia_nome, ordem) VALUES
-- Português
(v_template_id, 'Português', 'Compreensão e Interpretação de Textos', 1),
(v_template_id, 'Português', 'Fonologia, Ortografia e Acentuação', 2),
(v_template_id, 'Português', 'Morfologia: Classes de Palavras', 3),
(v_template_id, 'Português', 'Sintaxe da Oração e do Período', 4),
(v_template_id, 'Português', 'Concordância, Regência e Crase', 5),
(v_template_id, 'Português', 'Pontuação', 6),
(v_template_id, 'Português', 'Redação Oficial: Manual de Redação Presidencial', 7),
-- Raciocínio Lógico
(v_template_id, 'Raciocínio Lógico', 'Proposições e Conectivos', 1),
(v_template_id, 'Raciocínio Lógico', 'Tabelas-Verdade e Equivalências', 2),
(v_template_id, 'Raciocínio Lógico', 'Argumentação Lógica', 3),
(v_template_id, 'Raciocínio Lógico', 'Diagramas e Conjuntos', 4),
(v_template_id, 'Raciocínio Lógico', 'Sequências e Associações Lógicas', 5),
-- Direito Constitucional
(v_template_id, 'Direito Constitucional', 'Princípios Fundamentais e Poder Constituinte', 1),
(v_template_id, 'Direito Constitucional', 'Direitos e Deveres Individuais e Coletivos (Art. 5º)', 2),
(v_template_id, 'Direito Constitucional', 'Direitos Sociais e Nacionalidade', 3),
(v_template_id, 'Direito Constitucional', 'Organização Político-Administrativa', 4),
(v_template_id, 'Direito Constitucional', 'Administração Pública e Servidores', 5),
(v_template_id, 'Direito Constitucional', 'Poder Judiciário e Funções Essenciais à Justiça', 6),
(v_template_id, 'Direito Constitucional', 'Segurança Pública (Art. 144)', 7),
-- Direito Administrativo
(v_template_id, 'Direito Administrativo', 'Princípios e Poderes Administrativos', 1),
(v_template_id, 'Direito Administrativo', 'Atos Administrativos', 2),
(v_template_id, 'Direito Administrativo', 'Licitações e Contratos', 3),
(v_template_id, 'Direito Administrativo', 'Servidores Públicos', 4),
(v_template_id, 'Direito Administrativo', 'Responsabilidade Civil do Estado', 5),
(v_template_id, 'Direito Administrativo', 'Processo Administrativo', 6),
-- Direito Penal
(v_template_id, 'Direito Penal', 'Princípios Penais e Aplicação da Lei', 1),
(v_template_id, 'Direito Penal', 'Teoria do Crime: Fato Típico, Ilicitude, Culpabilidade', 2),
(v_template_id, 'Direito Penal', 'Crimes contra a Pessoa', 3),
(v_template_id, 'Direito Penal', 'Crimes contra o Patrimônio', 4),
(v_template_id, 'Direito Penal', 'Crimes contra a Administração Pública', 5),
(v_template_id, 'Direito Penal', 'Crimes contra a Dignidade Sexual', 6),
(v_template_id, 'Direito Penal', 'Crimes de Tráfico de Drogas (Lei 11.343/2006)', 7),
(v_template_id, 'Direito Penal', 'Crimes de Abuso de Autoridade', 8),
(v_template_id, 'Direito Penal', 'Crimes de Tortura e Racismo', 9),
(v_template_id, 'Direito Penal', 'Leis Penais Extravagantes: Maria da Penha, ECA', 10),
-- Direito Processual Penal
(v_template_id, 'Direito Processual Penal', 'Princípios Processuais Penais', 1),
(v_template_id, 'Direito Processual Penal', 'Inquérito Policial', 2),
(v_template_id, 'Direito Processual Penal', 'Ação Penal e Denúncia', 3),
(v_template_id, 'Direito Processual Penal', 'Provas no Processo Penal', 4),
(v_template_id, 'Direito Processual Penal', 'Prisões: Temporária, Preventiva, Flagrante', 5),
(v_template_id, 'Direito Processual Penal', 'Liberdade Provisória e Fiança', 6),
(v_template_id, 'Direito Processual Penal', 'Procedimentos: Comum, Tribunal do Júri', 7),
(v_template_id, 'Direito Processual Penal', 'Recursos Processuais Penais', 8),
(v_template_id, 'Direito Processual Penal', 'Nulidades e Habeas Corpus', 9),
-- Legislação Extravagante
(v_template_id, 'Legislação Extravagante', 'Estatuto do Desarmamento (Lei 10.826/2003)', 1),
(v_template_id, 'Legislação Extravagante', 'Lei de Drogas (Lei 11.343/2006)', 2),
(v_template_id, 'Legislação Extravagante', 'Lei Maria da Penha (Lei 11.340/2006)', 3),
(v_template_id, 'Legislação Extravagante', 'Lei de Tortura (Lei 9.455/97)', 4),
(v_template_id, 'Legislação Extravagante', 'Crimes de Trânsito (Lei 9.503/97)', 5),
(v_template_id, 'Legislação Extravagante', 'ECA - Atos Infracionais', 6),
-- Criminologia e Medicina Legal
(v_template_id, 'Criminologia', 'Escolas Criminológicas: Clássica, Positiva, Crítica', 1),
(v_template_id, 'Criminologia', 'Teorias da Criminalidade', 2),
(v_template_id, 'Criminologia', 'Vitimologia', 3),
(v_template_id, 'Criminologia', 'Prevenção Criminal e Políticas de Segurança', 4),
(v_template_id, 'Medicina Legal', 'Tanatologia: Morte, Autópsia, Cronotanatognose', 1),
(v_template_id, 'Medicina Legal', 'Traumatologia: Lesões, Instrumentos, Perícias', 2),
(v_template_id, 'Medicina Legal', 'Asfixiologia Forense', 3),
(v_template_id, 'Medicina Legal', 'Sexologia Forense', 4),
(v_template_id, 'Medicina Legal', 'Psicopatologia Forense', 5),
(v_template_id, 'Medicina Legal', 'Documentoscopia e Balística', 6),
-- Informática
(v_template_id, 'Informática', 'Hardware e Periféricos', 1),
(v_template_id, 'Informática', 'Sistemas Operacionais: Windows e Linux', 2),
(v_template_id, 'Informática', 'Pacote Office: Word, Excel, PowerPoint', 3),
(v_template_id, 'Informática', 'Internet e Redes', 4),
(v_template_id, 'Informática', 'Segurança da Informação e Crimes Cibernéticos', 5);

-- ========================
-- 3. POLÍCIA FEDERAL (PF)
-- ========================
INSERT INTO public.concurso_templates (nome, orgao_pattern) VALUES
  ('Polícia Federal', 'Polícia Federal|PF|Departamento de Polícia Federal|DPF')
RETURNING id INTO v_template_id;

INSERT INTO public.template_materias (template_id, disciplina_nome, materia_nome, ordem) VALUES
(v_template_id, 'Português', 'Interpretação Textual e Redação', 1),
(v_template_id, 'Português', 'Gramática Normativa Completa', 2),
(v_template_id, 'Raciocínio Lógico', 'Raciocínio Lógico-Matemático', 1),
(v_template_id, 'Raciocínio Lógico', 'Estruturas Lógicas', 2),
(v_template_id, 'Informática', 'Noções de Informática: Hardware e Software', 1),
(v_template_id, 'Informática', 'Sistemas Operacionais', 2),
(v_template_id, 'Informática', 'Redes e Internet', 3),
(v_template_id, 'Informática', 'Segurança Cibernética e Criptografia', 4),
(v_template_id, 'Informática', 'Banco de Dados e SQL', 5),
(v_template_id, 'Direito Constitucional', 'Constituição Federal: Título I ao III', 1),
(v_template_id, 'Direito Constitucional', 'Direitos e Garantias (Art. 5º)', 2),
(v_template_id, 'Direito Constitucional', 'Organização do Estado e Administração Pública', 3),
(v_template_id, 'Direito Constitucional', 'Poder Judiciário e STF', 4),
(v_template_id, 'Direito Constitucional', 'Segurança Pública (Art. 144)', 5),
(v_template_id, 'Direito Administrativo', 'Atos e Contratos Administrativos', 1),
(v_template_id, 'Direito Administrativo', 'Licitações e Pregão Eletrônico', 2),
(v_template_id, 'Direito Administrativo', 'Servidores Públicos e Regime Disciplinar', 3),
(v_template_id, 'Direito Administrativo', 'Responsabilidade Civil do Estado', 4),
(v_template_id, 'Direito Penal', 'Parte Geral do CP', 1),
(v_template_id, 'Direito Penal', 'Crimes contra o Patrimônio e Pessoa', 2),
(v_template_id, 'Direito Penal', 'Crimes contra a Administração Pública', 3),
(v_template_id, 'Direito Penal', 'Crimes Federais: Tráfico, Lavagem, Contrabando', 4),
(v_template_id, 'Direito Penal', 'Lei de Drogas e Crimes Conexos', 5),
(v_template_id, 'Direito Processual Penal', 'Inquérito Policial Federal', 1),
(v_template_id, 'Direito Processual Penal', 'Provas e Perícias Criminais', 2),
(v_template_id, 'Direito Processual Penal', 'Prisões e Medidas Cautelares', 3),
(v_template_id, 'Direito Processual Penal', 'Cooperação Internacional Penal', 4),
(v_template_id, 'Direito Processual Penal', 'Tribunal do Júri e Recursos', 5),
(v_template_id, 'Legislação Especial', 'Lei de Imigração (Lei 13.445/2017)', 1),
(v_template_id, 'Legislação Especial', 'Lei de Lavagem de Dinheiro (Lei 9.613/98)', 2),
(v_template_id, 'Legislação Especial', 'Lei de Improbidade Administrativa', 3),
(v_template_id, 'Legislação Especial', 'Organizações Criminosas (Lei 12.850/2013)', 4),
(v_template_id, 'Legislação Especial', 'Estatuto do Desarmamento', 5),
(v_template_id, 'Direitos Humanos', 'Declaração Universal dos Direitos Humanos', 1),
(v_template_id, 'Direitos Humanos', 'Pacto de São José da Costa Rica', 2),
(v_template_id, 'Direitos Humanos', 'Convenção contra Tortura e Tráfico de Pessoas', 3),
(v_template_id, 'Contabilidade', 'Princípios Contábeis e Demonstrações Financeiras', 1),
(v_template_id, 'Contabilidade', 'Análise de Balanços e Custos', 2),
(v_template_id, 'Contabilidade', 'Perícia Contábil e Fraudes', 3);

-- ========================
-- 4. PRF
-- ========================
INSERT INTO public.concurso_templates (nome, orgao_pattern) VALUES
  ('Polícia Rodoviária Federal', 'PRF|Polícia Rodoviária Federal|Departamento de Polícia Rodoviária')
RETURNING id INTO v_template_id;

INSERT INTO public.template_materias (template_id, disciplina_nome, materia_nome, ordem) VALUES
(v_template_id, 'Português', 'Compreensão e Interpretação de Textos', 1),
(v_template_id, 'Português', 'Gramática e Redação', 2),
(v_template_id, 'Matemática', 'Matemática Básica e Raciocínio', 1),
(v_template_id, 'Matemática', 'Probabilidade e Estatística', 2),
(v_template_id, 'Direito Constitucional', 'Direitos Fundamentais e Organização do Estado', 1),
(v_template_id, 'Direito Constitucional', 'Segurança Pública (Art. 144)', 2),
(v_template_id, 'Direito Administrativo', 'Regime Jurídico e Poderes Administrativos', 1),
(v_template_id, 'Direito Administrativo', 'Servidores Públicos', 2),
(v_template_id, 'Direito Penal', 'Crimes em Espécie, Drogas, Embriaguez', 1),
(v_template_id, 'Direito Processual Penal', 'Flagrante e Prisões', 1),
(v_template_id, 'Direitos Humanos', 'Direitos Humanos na Atividade Policial', 1),
(v_template_id, 'Legislação de Trânsito', 'CTB - Código de Trânsito Brasileiro (Lei 9.503/97)', 1),
(v_template_id, 'Legislação de Trânsito', 'Infrações, Penalidades e Recursos', 2),
(v_template_id, 'Legislação de Trânsito', 'Sinalização e Engenharia de Tráfego', 3),
(v_template_id, 'Legislação de Trânsito', 'Acidentes de Trânsito: Perícia e Atendimento', 4),
(v_template_id, 'Legislação de Trânsito', 'Transporte de Cargas e Passageiros', 5),
(v_template_id, 'Legislação de Trânsito', 'Habilitação e Documentação Veicular', 6),
(v_template_id, 'Física', 'Mecânica: Velocidade, Aceleração, Forças', 1),
(v_template_id, 'Física', 'Leis de Newton e Aplicações', 2),
(v_template_id, 'Física', 'Trabalho, Energia e Potência', 3),
(v_template_id, 'Física', 'Termodinâmica e Ondulatória (Radar)', 4),
(v_template_id, 'Informática', 'Sistemas e Redes', 1),
(v_template_id, 'Informática', 'Banco de Dados e Segurança', 2),
(v_template_id, 'Atualidades', 'Políticas de Transporte e Mobilidade', 1);

-- ========================
-- 5. INSS
-- ========================
INSERT INTO public.concurso_templates (nome, orgao_pattern) VALUES
  ('INSS', 'INSS|Instituto Nacional do Seguro Social|Previdência Social')
RETURNING id INTO v_template_id;

INSERT INTO public.template_materias (template_id, disciplina_nome, materia_nome, ordem) VALUES
(v_template_id, 'Português', 'Interpretação de Textos e Redação Oficial', 1),
(v_template_id, 'Português', 'Gramática Aplicada', 2),
(v_template_id, 'Raciocínio Lógico', 'Raciocínio Lógico e Matemático', 1),
(v_template_id, 'Raciocínio Lógico', 'Probabilidade e Análise Combinatória', 2),
(v_template_id, 'Direito Constitucional', 'Direitos Sociais (Art. 6º e 7º)', 1),
(v_template_id, 'Direito Constitucional', 'Seguridade Social (Art. 194 ao 204)', 2),
(v_template_id, 'Direito Constitucional', 'Ordem Social', 3),
(v_template_id, 'Direito Administrativo', 'Servidores Públicos (Lei 8.112/90)', 1),
(v_template_id, 'Direito Administrativo', 'Licitações e Contratos', 2),
(v_template_id, 'Direito Administrativo', 'Processo Administrativo Federal', 3),
(v_template_id, 'Direito Previdenciário', 'Regime Geral de Previdência Social (RGPS)', 1),
(v_template_id, 'Direito Previdenciário', 'Segurados: Empregado, Contribuinte Individual, Facultativo', 2),
(v_template_id, 'Direito Previdenciário', 'Empregador Doméstico e Segurado Especial', 3),
(v_template_id, 'Direito Previdenciário', 'Carência e Salário de Contribuição', 4),
(v_template_id, 'Direito Previdenciário', 'Aposentadoria por Idade e Tempo de Contribuição', 5),
(v_template_id, 'Direito Previdenciário', 'Aposentadoria por Invalidez e Auxílio-Doença', 6),
(v_template_id, 'Direito Previdenciário', 'Aposentadoria Especial', 7),
(v_template_id, 'Direito Previdenciário', 'Pensão por Morte e Auxílio-Reclusão', 8),
(v_template_id, 'Direito Previdenciário', 'Salário-Maternidade, Auxílio-Acidente', 9),
(v_template_id, 'Direito Previdenciário', 'Benefício de Prestação Continuada (BPC/LOAS)', 10),
(v_template_id, 'Direito Previdenciário', 'Revisão de Benefícios e Decadência', 11),
(v_template_id, 'Direito Previdenciário', 'Processo Administrativo Previdenciário', 12),
(v_template_id, 'Direito Previdenciário', 'Contribuições Sociais: Empresa e Segurado', 13),
(v_template_id, 'Direito Previdenciário', 'Planejamento Previdenciário', 14),
(v_template_id, 'Noções de Serviço Social', 'Política Nacional de Assistência Social (PNAS/SUAS)', 1),
(v_template_id, 'Noções de Serviço Social', 'Trabalho Social com Famílias', 2),
(v_template_id, 'Noções de Serviço Social', 'Atendimento ao Público e Acessibilidade', 3);

-- ========================
-- 6. TRT / JUSTIÇA DO TRABALHO
-- ========================
INSERT INTO public.concurso_templates (nome, orgao_pattern) VALUES
  ('Justiça do Trabalho', 'TRT|Tribunal Regional do Trabalho|TST|Justiça do Trabalho')
RETURNING id INTO v_template_id;

INSERT INTO public.template_materias (template_id, disciplina_nome, materia_nome, ordem) VALUES
(v_template_id, 'Português', 'Gramática e Redação Oficial', 1),
(v_template_id, 'Português', 'Interpretação de Textos Jurídicos', 2),
(v_template_id, 'Raciocínio Lógico', 'Raciocínio Lógico-Matemático', 1),
(v_template_id, 'Direito Constitucional', 'Organização do Poder Judiciário', 1),
(v_template_id, 'Direito Constitucional', 'Direitos Sociais e Liberdades Públicas', 2),
(v_template_id, 'Direito do Trabalho', 'Princípios do Direito do Trabalho', 1),
(v_template_id, 'Direito do Trabalho', 'Relação de Trabalho e Relação de Emprego', 2),
(v_template_id, 'Direito do Trabalho', 'Contrato Individual de Trabalho', 3),
(v_template_id, 'Direito do Trabalho', 'Remuneração e Salário', 4),
(v_template_id, 'Direito do Trabalho', 'Jornada de Trabalho e Descanso', 5),
(v_template_id, 'Direito do Trabalho', 'Férias e 13º Salário', 6),
(v_template_id, 'Direito do Trabalho', 'Rescisão Contratual e Verbas Rescisórias', 7),
(v_template_id, 'Direito do Trabalho', 'Estabilidade e Garantia de Emprego', 8),
(v_template_id, 'Direito do Trabalho', 'Terceirização (Lei 6.019/74 com alterações)', 9),
(v_template_id, 'Direito do Trabalho', 'Trabalho da Mulher e do Menor', 10),
(v_template_id, 'Direito do Trabalho', 'Direito Coletivo do Trabalho e Sindical', 11),
(v_template_id, 'Direito do Trabalho', 'Greve (Lei 7.783/89)', 12),
(v_template_id, 'Direito Processual do Trabalho', 'Organização da Justiça do Trabalho', 1),
(v_template_id, 'Direito Processual do Trabalho', 'Ação Trabalhista e Petição Inicial', 2),
(v_template_id, 'Direito Processual do Trabalho', 'Provas no Processo do Trabalho', 3),
(v_template_id, 'Direito Processual do Trabalho', 'Recursos Trabalhistas', 4),
(v_template_id, 'Direito Processual do Trabalho', 'Execução Trabalhista', 5),
(v_template_id, 'Direito Processual do Trabalho', 'Dissídios Coletivos', 6),
(v_template_id, 'Direito Processual do Trabalho', 'Comissões de Conciliação Prévia', 7),
(v_template_id, 'Noções de Administração', 'Gestão Pública e Planejamento', 1),
(v_template_id, 'Noções de Administração', 'Arquivologia e Protocolo', 2);

-- ========================
-- 7. TSE / JUSTIÇA ELEITORAL
-- ========================
INSERT INTO public.concurso_templates (nome, orgao_pattern) VALUES
  ('Justiça Eleitoral', 'TSE|Tribunal Superior Eleitoral|TRE|Justiça Eleitoral')
RETURNING id INTO v_template_id;

INSERT INTO public.template_materias (template_id, disciplina_nome, materia_nome, ordem) VALUES
(v_template_id, 'Português', 'Gramática e Interpretação', 1),
(v_template_id, 'Português', 'Redação Oficial', 2),
(v_template_id, 'Raciocínio Lógico', 'Raciocínio Lógico-Matemático', 1),
(v_template_id, 'Direito Constitucional', 'Direitos Políticos (Art. 14 ao 17)', 1),
(v_template_id, 'Direito Constitucional', 'Poder Judiciário e Justiça Eleitoral', 2),
(v_template_id, 'Direito Eleitoral', 'Código Eleitoral (Lei 4.737/65)', 1),
(v_template_id, 'Direito Eleitoral', 'Alistamento Eleitoral e Domicílio', 2),
(v_template_id, 'Direito Eleitoral', 'Sistemas Eleitorais: Majoritário e Proporcional', 3),
(v_template_id, 'Direito Eleitoral', 'Convenções e Coligações Partidárias', 4),
(v_template_id, 'Direito Eleitoral', 'Registro de Candidaturas e Impugnações', 5),
(v_template_id, 'Direito Eleitoral', 'Propaganda Eleitoral', 6),
(v_template_id, 'Direito Eleitoral', 'Pesquisas Eleitorais e Direito de Resposta', 7),
(v_template_id, 'Direito Eleitoral', 'Votação, Apuração e Totalização', 8),
(v_template_id, 'Direito Eleitoral', 'Prestação de Contas Eleitorais', 9),
(v_template_id, 'Direito Eleitoral', 'Crimes Eleitorais (Lei 4.737/65)', 10),
(v_template_id, 'Direito Eleitoral', 'Propaganda Irregular e Abuso de Poder', 11),
(v_template_id, 'Direito Eleitoral', 'Recursos Eleitorais e Ação de Impugnação', 12),
(v_template_id, 'Direito Eleitoral', 'Fidelidade Partidária e Perda de Mandato', 13),
(v_template_id, 'Direito Eleitoral', 'Urna Eletrônica e Voto Impresso', 14),
(v_template_id, 'Noções de Informática', 'Sistemas Eleitorais e Urna Eletrônica', 1),
(v_template_id, 'Noções de Informática', 'Segurança de Dados Eleitorais', 2);

-- ========================
-- 8. RECEITA FEDERAL (RFB)
-- ========================
INSERT INTO public.concurso_templates (nome, orgao_pattern) VALUES
  ('Receita Federal', 'Receita Federal|RFB|Secretaria da Receita Federal|Ministério da Fazenda')
RETURNING id INTO v_template_id;

INSERT INTO public.template_materias (template_id, disciplina_nome, materia_nome, ordem) VALUES
(v_template_id, 'Português', 'Gramática e Compreensão de Textos', 1),
(v_template_id, 'Português', 'Redação Oficial e Técnica', 2),
(v_template_id, 'Raciocínio Lógico', 'Raciocínio Lógico e Quantitativo', 1),
(v_template_id, 'Matemática Financeira', 'Juros Simples e Compostos', 1),
(v_template_id, 'Matemática Financeira', 'Descontos e Taxas Equivalentes', 2),
(v_template_id, 'Matemática Financeira', 'Fluxo de Caixa e VPL', 3),
(v_template_id, 'Matemática Financeira', 'Sistemas de Amortização: SAC, Price', 4),
(v_template_id, 'Direito Constitucional', 'Ordem Tributária (Art. 145 ao 162)', 1),
(v_template_id, 'Direito Constitucional', 'Limitações ao Poder de Tributar', 2),
(v_template_id, 'Direito Tributário', 'Sistema Tributário Nacional (CTN - Lei 5.172/66)', 1),
(v_template_id, 'Direito Tributário', 'Competência Tributária: União, Estados, DF, Municípios', 2),
(v_template_id, 'Direito Tributário', 'Impostos Federais: IR, IPI, IOF, ITR, Cofins, CSLL', 3),
(v_template_id, 'Direito Tributário', 'Contribuições Sociais e de Intervenção', 4),
(v_template_id, 'Direito Tributário', 'Obrigação e Crédito Tributário', 5),
(v_template_id, 'Direito Tributário', 'Lançamento Tributário: Modalidades', 6),
(v_template_id, 'Direito Tributário', 'Suspensão, Extinção e Exclusão do Crédito', 7),
(v_template_id, 'Direito Tributário', 'Imunidades e Isenções Tributárias', 8),
(v_template_id, 'Direito Tributário', 'Processo Administrativo Tributário', 9),
(v_template_id, 'Direito Tributário', 'Execução Fiscal (Lei 6.830/80)', 10),
(v_template_id, 'Direito Tributário', 'Planejamento Tributário e Elisão', 11),
(v_template_id, 'Direito Aduaneiro', 'Importação e Exportação', 1),
(v_template_id, 'Direito Aduaneiro', 'Regimes Aduaneiros Especiais', 2),
(v_template_id, 'Direito Aduaneiro', 'Tributos na Importação: II, IPI, ICMS', 3),
(v_template_id, 'Direito Aduaneiro', 'Infrações e Penalidades Aduaneiras', 4),
(v_template_id, 'Contabilidade', 'Estrutura das Demonstrações Contábeis', 1),
(v_template_id, 'Contabilidade', 'Balanço Patrimonial e DRE', 2),
(v_template_id, 'Contabilidade', 'Apuração do Lucro Real e Presumido', 3),
(v_template_id, 'Contabilidade', 'Contabilidade Tributária e ECD/ECF', 4),
(v_template_id, 'Comércio Internacional', 'Mercosul e Acordos Internacionais', 1),
(v_template_id, 'Comércio Internacional', 'Incoterms e Logística Internacional', 2);

-- ========================
-- 9. BACEN
-- ========================
INSERT INTO public.concurso_templates (nome, orgao_pattern) VALUES
  ('Banco Central', 'BACEN|Banco Central do Brasil|BCB')
RETURNING id INTO v_template_id;

INSERT INTO public.template_materias (template_id, disciplina_nome, materia_nome, ordem) VALUES
(v_template_id, 'Português', 'Gramática e Redação Técnica', 1),
(v_template_id, 'Raciocínio Lógico', 'Raciocínio Lógico e Estatística', 1),
(v_template_id, 'Economia', 'Microeconomia: Oferta, Demanda, Equilíbrio', 1),
(v_template_id, 'Economia', 'Macroeconomia: PIB, Inflação, Desemprego', 2),
(v_template_id, 'Economia', 'Política Monetária e Instrumentos', 3),
(v_template_id, 'Economia', 'Taxa Selic e Mercado de Títulos', 4),
(v_template_id, 'Economia', 'Câmbio e Balanço de Pagamentos', 5),
(v_template_id, 'Economia', 'Sistema Financeiro Nacional (SFN)', 6),
(v_template_id, 'Economia', 'Instituições Financeiras e Bancos', 7),
(v_template_id, 'Economia', 'Matemática Financeira e Derivativos', 8),
(v_template_id, 'Economia', 'Contabilidade Monetária e Fluxos Financeiros', 9),
(v_template_id, 'Direito Bancário', 'Lei 4.595/64 (Sistema Financeiro)', 1),
(v_template_id, 'Direito Bancário', 'Resoluções CMN e Circulares BCB', 2),
(v_template_id, 'Direito Bancário', 'Basileia I, II, III: Regulação Bancária', 3),
(v_template_id, 'Direito Bancário', 'Prevenção à Lavagem de Dinheiro', 4),
(v_template_id, 'Direito Bancário', 'Contratos Bancários e Operações Financeiras', 5),
(v_template_id, 'Direito Bancário', 'Recuperação de Crédito e Execução', 6),
(v_template_id, 'Finanças', 'Mercado de Capitais e Bolsa de Valores', 1),
(v_template_id, 'Finanças', 'Análise de Investimentos e Risco', 2),
(v_template_id, 'Finanças', 'Derivativos: Futuros, Opções, Swaps', 3),
(v_template_id, 'Finanças', 'Regulação de Valores Mobiliários (CVM)', 4),
(v_template_id, 'Inglês', 'Textos Técnicos em Economia e Finanças', 1);

-- ========================
-- 10. CVM
-- ========================
INSERT INTO public.concurso_templates (nome, orgao_pattern) VALUES
  ('CVM', 'CVM|Comissão de Valores Mobiliários|Mercado de Capitais')
RETURNING id INTO v_template_id;

INSERT INTO public.template_materias (template_id, disciplina_nome, materia_nome, ordem) VALUES
(v_template_id, 'Português', 'Gramática e Redação Técnica', 1),
(v_template_id, 'Economia', 'Mercado de Capitais e Bolsa', 1),
(v_template_id, 'Economia', 'Derivativos e Renda Fixa', 2),
(v_template_id, 'Direito Societário', 'Lei das S.A. (Lei 6.404/76)', 1),
(v_template_id, 'Direito Societário', 'Assembleias, Conselho e Administração', 2),
(v_template_id, 'Direito Societário', 'Valores Mobiliários: Ações, Debêntures, Bônus', 3),
(v_template_id, 'Direito Societário', 'Ofertas Públicas e IPO', 4),
(v_template_id, 'Regulação CVM', 'Lei 6.385/76 e Instruções CVM', 1),
(v_template_id, 'Regulação CVM', 'Fundos de Investimento', 2),
(v_template_id, 'Regulação CVM', 'Auditoria Independente', 3),
(v_template_id, 'Regulação CVM', 'Informações Periódicas e Fatos Relevantes', 4),
(v_template_id, 'Regulação CVM', 'Penalidades e Processos Administrativos CVM', 5);

-- ========================
-- 11. CGU / TCU (CONTROLE)
-- ========================
INSERT INTO public.concurso_templates (nome, orgao_pattern) VALUES
  ('Controle e Transparência', 'CGU|Controladoria|TCU|Tribunal de Contas|Controle Interno')
RETURNING id INTO v_template_id;

INSERT INTO public.template_materias (template_id, disciplina_nome, materia_nome, ordem) VALUES
(v_template_id, 'Português', 'Gramática e Redação Oficial', 1),
(v_template_id, 'Raciocínio Lógico', 'Raciocínio Analítico', 1),
(v_template_id, 'Direito Constitucional', 'Controle Externo e Tribunais de Contas (Art. 70-75)', 1),
(v_template_id, 'Direito Constitucional', 'Fiscalização Contábil, Financeira e Orçamentária', 2),
(v_template_id, 'Direito Administrativo', 'Licitações, Contratos e Convênios', 1),
(v_template_id, 'Direito Administrativo', 'Improbidade Administrativa (Lei 8.429/92)', 2),
(v_template_id, 'Direito Administrativo', 'Responsabilização de Agentes Públicos', 3),
(v_template_id, 'Auditoria', 'Normas de Auditoria (NBC TA)', 1),
(v_template_id, 'Auditoria', 'Auditoria Governamental e Operacional', 2),
(v_template_id, 'Auditoria', 'Amostragem e Evidências de Auditoria', 3),
(v_template_id, 'Auditoria', 'Relatórios de Auditoria', 4),
(v_template_id, 'Controle Interno', 'Controles Internos e COSO', 1),
(v_template_id, 'Controle Interno', 'Gestão de Riscos (ISO 31.000)', 2),
(v_template_id, 'Controle Interno', 'Ouvidoria e Transparência Pública', 3),
(v_template_id, 'Administração Pública', 'Governança Pública (Decreto 9.203/2017)', 1),
(v_template_id, 'Administração Pública', 'Gestão por Resultados e Planejamento Estratégico', 2),
(v_template_id, 'Administração Pública', 'Lei de Acesso à Informação (Lei 12.527/2011)', 3),
(v_template_id, 'Administração Pública', 'Lei Anticorrupção (Lei 12.846/2013)', 4),
(v_template_id, 'Administração Pública', 'Código de Conduta da Administração Federal', 5);

-- ========================
-- 12. MINISTÉRIO PÚBLICO
-- ========================
INSERT INTO public.concurso_templates (nome, orgao_pattern) VALUES
  ('Ministério Público', 'MP|Ministério Público|MPF|MPE|MP Estadual|Procuradoria')
RETURNING id INTO v_template_id;

INSERT INTO public.template_materias (template_id, disciplina_nome, materia_nome, ordem) VALUES
(v_template_id, 'Português', 'Gramática e Redação Jurídica', 1),
(v_template_id, 'Direito Constitucional', 'Ministério Público (Art. 127 ao 130-A)', 1),
(v_template_id, 'Direito Constitucional', 'Funções Essenciais à Justiça', 2),
(v_template_id, 'Direito Constitucional', 'Controle de Constitucionalidade', 3),
(v_template_id, 'Direito Administrativo', 'Atos e Contratos Administrativos', 1),
(v_template_id, 'Direito Administrativo', 'Licitações e Improbidade', 2),
(v_template_id, 'Direito Penal', 'Crimes contra a Administração', 1),
(v_template_id, 'Direito Penal', 'Crimes de Responsabilidade', 2),
(v_template_id, 'Direito Processual Penal', 'Ação Penal Pública e Privada', 1),
(v_template_id, 'Direito Processual Penal', 'Tribunal do Júri e MP', 2),
(v_template_id, 'Direitos Difusos e Coletivos', 'Ação Civil Pública (Lei 7.347/85)', 1),
(v_template_id, 'Direitos Difusos e Coletivos', 'Tutela do Meio Ambiente', 2),
(v_template_id, 'Direitos Difusos e Coletivos', 'Tutela do Consumidor (CDC)', 3),
(v_template_id, 'Direitos Difusos e Coletivos', 'Tutela da Criança, do Idoso e Pessoa com Deficiência', 4),
(v_template_id, 'Direitos Difusos e Coletivos', 'Inquérito Civil e Termo de Ajustamento', 5),
(v_template_id, 'Direito Civil', 'Parte Geral e Obrigações', 1),
(v_template_id, 'Direito Civil', 'Responsabilidade Civil', 2),
(v_template_id, 'Direito Civil', 'Família e Sucessões', 3);

-- ========================
-- 13. DEFENSORIA PÚBLICA
-- ========================
INSERT INTO public.concurso_templates (nome, orgao_pattern) VALUES
  ('Defensoria Pública', 'Defensoria|DPE|DPU|Defensoria Pública')
RETURNING id INTO v_template_id;

INSERT INTO public.template_materias (template_id, disciplina_nome, materia_nome, ordem) VALUES
(v_template_id, 'Português', 'Gramática e Redação', 1),
(v_template_id, 'Direito Constitucional', 'Defensoria Pública (Art. 134 e LC 80/94)', 1),
(v_template_id, 'Direito Constitucional', 'Direitos e Garantias', 2),
(v_template_id, 'Direito Processual Civil', 'Assistência Judiciária Gratuita', 1),
(v_template_id, 'Direito Processual Civil', 'Processo de Conhecimento e Execução', 2),
(v_template_id, 'Direito Penal', 'Garantias Penais e Execução Penal', 1),
(v_template_id, 'Direito Processual Penal', 'Defesa no Processo Penal', 1),
(v_template_id, 'Direitos Humanos', 'Sistema Interamericano de Direitos Humanos', 1),
(v_template_id, 'Direitos Humanos', 'Direitos das Minorias e Populações Vulneráveis', 2),
(v_template_id, 'Estatuto da Criança', 'ECA: Medidas Protetivas e Socioeducativas', 1),
(v_template_id, 'Estatuto do Idoso', 'Direitos da Pessoa Idosa', 1),
(v_template_id, 'Estatuto da Pessoa com Deficiência', 'Lei 13.146/2015 (LBI)', 1),
(v_template_id, 'Direito do Consumidor', 'CDC: Direitos Básicos e Práticas Abusivas', 1),
(v_template_id, 'Direito do Consumidor', 'Responsabilidade do Fornecedor', 2);

-- ========================
-- 14. CÂMARA / SENADO
-- ========================
INSERT INTO public.concurso_templates (nome, orgao_pattern) VALUES
  ('Poder Legislativo', 'Câmara|Câmara dos Deputados|Senado|Senado Federal|Congresso|ALESP|ALERJ')
RETURNING id INTO v_template_id;

INSERT INTO public.template_materias (template_id, disciplina_nome, materia_nome, ordem) VALUES
(v_template_id, 'Português', 'Redação Oficial e Gramática', 1),
(v_template_id, 'Direito Constitucional', 'Poder Legislativo (Art. 44 ao 75)', 1),
(v_template_id, 'Direito Constitucional', 'Processo Legislativo', 2),
(v_template_id, 'Direito Constitucional', 'Comissões Parlamentares (CPI)', 3),
(v_template_id, 'Direito Constitucional', 'Fiscalização Contábil e Financeira', 4),
(v_template_id, 'Direito Constitucional', 'Imunidades Parlamentares', 5),
(v_template_id, 'Regimento Interno', 'Regimento da Câmara dos Deputados', 1),
(v_template_id, 'Regimento Interno', 'Regimento do Senado Federal', 2),
(v_template_id, 'Regimento Interno', 'Processo de Elaboração Legislativa', 3),
(v_template_id, 'Regimento Interno', 'Proposições: PL, PEC, MPV, Requerimentos', 4),
(v_template_id, 'Regimento Interno', 'Ordem do Dia e Votações', 5),
(v_template_id, 'Noções de Orçamento', 'LOA, LDO, PPA', 1),
(v_template_id, 'Noções de Orçamento', 'Emendas Parlamentares Individuais e Coletivas', 2);

-- ========================
-- 15. SAÚDE / SUS
-- ========================
INSERT INTO public.concurso_templates (nome, orgao_pattern) VALUES
  ('SUS e Saúde Pública', 'SUS|Saúde|Ministério da Saúde|ANVISA|FIOCRUZ|Hospital|Secretaria de Saúde')
RETURNING id INTO v_template_id;

INSERT INTO public.template_materias (template_id, disciplina_nome, materia_nome, ordem) VALUES
(v_template_id, 'Português', 'Compreensão de Textos Técnicos', 1),
(v_template_id, 'Políticas de Saúde', 'Constituição Federal e Saúde (Art. 196 ao 200)', 1),
(v_template_id, 'Políticas de Saúde', 'Lei 8.080/90 (SUS: Organização e Funcionamento)', 2),
(v_template_id, 'Políticas de Saúde', 'Lei 8.142/90 (Participação Social e Controle)', 3),
(v_template_id, 'Políticas de Saúde', 'Pacto pela Saúde e Redes de Atenção', 4),
(v_template_id, 'Políticas de Saúde', 'Programas Nacionais: ESF, NASF, Programa Farmácia Popular', 5),
(v_template_id, 'Políticas de Saúde', 'Vigilância Sanitária e Epidemiológica', 6),
(v_template_id, 'Epidemiologia', 'Indicadores de Saúde: Mortalidade, Morbidade', 1),
(v_template_id, 'Epidemiologia', 'Doenças Infecciosas e Parasitárias', 2),
(v_template_id, 'Epidemiologia', 'Doenças Crônicas e Agravos não Transmissíveis', 3),
(v_template_id, 'Epidemiologia', 'Imunização e Calendário Vacinal', 4),
(v_template_id, 'Epidemiologia', 'Saúde do Trabalhador e Vigilância Ambiental', 5),
(v_template_id, 'Saúde Coletiva', 'Promoção, Prevenção e Recuperação', 1),
(v_template_id, 'Saúde Coletiva', 'Educação em Saúde', 2),
(v_template_id, 'Saúde Coletiva', 'Humanização do SUS (PNH)', 3),
(v_template_id, 'Bioética', 'Ética nos Serviços de Saúde', 1),
(v_template_id, 'Bioética', 'Privacidade, Autonomia e Consentimento', 2);

-- ========================
-- 16. PETROBRAS / ESTATAIS
-- ========================
INSERT INTO public.concurso_templates (nome, orgao_pattern) VALUES
  ('Petrobras e Estatais', 'Petrobras|Petróleo|Eletrobras|Correios|Banco do Brasil|CEF|INFRAERO|Estatal')
RETURNING id INTO v_template_id;

INSERT INTO public.template_materias (template_id, disciplina_nome, materia_nome, ordem) VALUES
(v_template_id, 'Português', 'Gramática e Interpretação', 1),
(v_template_id, 'Português', 'Redação Técnica Empresarial', 2),
(v_template_id, 'Matemática', 'Matemática Básica e Financeira', 1),
(v_template_id, 'Raciocínio Lógico', 'Raciocínio Analítico', 1),
(v_template_id, 'Informática', 'Sistemas Corporativos e Pacote Office', 1),
(v_template_id, 'Informática', 'Segurança da Informação', 2),
(v_template_id, 'Conhecimentos Específicos', 'Engenharia, Logística, Geologia', 1),
(v_template_id, 'Conhecimentos Específicos', 'Refino, Exploração e Produção', 2),
(v_template_id, 'Conhecimentos Específicos', 'Segurança Industrial e Meio Ambiente', 3),
(v_template_id, 'Noções de Direito', 'Direito Administrativo para Estatais', 1),
(v_template_id, 'Noções de Direito', 'Lei das Estatais (Lei 13.303/2016)', 2),
(v_template_id, 'Noções de Direito', 'Licitações e Contratos nas Estatais', 3),
(v_template_id, 'Língua Estrangeira', 'Inglês Técnico para Petróleo e Gás', 1);

-- ========================
-- 17. DIPLOMACIA (MRE)
-- ========================
INSERT INTO public.concurso_templates (nome, orgao_pattern) VALUES
  ('Diplomacia e Relações Internacionais', 'Diplomacia|MRE|Itamaraty|Relações Internacionais|Instituto Rio Branco')
RETURNING id INTO v_template_id;

INSERT INTO public.template_materias (template_id, disciplina_nome, materia_nome, ordem) VALUES
(v_template_id, 'Português', 'Gramática e Redação Diplomática', 1),
(v_template_id, 'Português', 'Literatura Brasileira', 2),
(v_template_id, 'Inglês', 'Compreensão e Tradução de Textos', 1),
(v_template_id, 'Inglês', 'Conversação e Argumentação', 2),
(v_template_id, 'Francês ou Espanhol', 'Compreensão e Tradução', 1),
(v_template_id, 'História do Brasil', 'Período Colonial e Império', 1),
(v_template_id, 'História do Brasil', 'República e Política Externa Brasileira', 2),
(v_template_id, 'História Mundial', 'História Geral: Antiga, Medieval, Moderna', 1),
(v_template_id, 'História Mundial', 'História Contemporânea: Guerras, Descolonização', 2),
(v_template_id, 'Geografia', 'Geografia do Brasil e Geopolítica', 1),
(v_template_id, 'Política Internacional', 'Organizações Internacionais: ONU, OEA, OTAN', 1),
(v_template_id, 'Política Internacional', 'Direito Internacional Público', 2),
(v_template_id, 'Política Internacional', 'Economia Internacional e Comércio', 3),
(v_template_id, 'Política Internacional', 'Meio Ambiente e Direitos Humanos Globais', 4),
(v_template_id, 'Noções de Direito', 'Direito Internacional Privado', 1),
(v_template_id, 'Noções de Direito', 'Direito do Mar e Tratados Internacionais', 2);

-- ========================
-- 18. ABIN
-- ========================
INSERT INTO public.concurso_templates (nome, orgao_pattern) VALUES
  ('ABIN e Inteligência', 'ABIN|Agência Brasileira de Inteligência|Inteligência|GSI|Gabinete de Segurança')
RETURNING id INTO v_template_id;

INSERT INTO public.template_materias (template_id, disciplina_nome, materia_nome, ordem) VALUES
(v_template_id, 'Português', 'Gramática e Redação', 1),
(v_template_id, 'Raciocínio Lógico', 'Raciocínio Analítico e Estatístico', 1),
(v_template_id, 'Direito Constitucional', 'Defesa do Estado e Segurança (Art. 136-144)', 1),
(v_template_id, 'Inteligência', 'Doutrina Nacional de Inteligência', 1),
(v_template_id, 'Inteligência', 'Ciclo de Inteligência e Produção de Conhecimento', 2),
(v_template_id, 'Inteligência', 'Contrainteligência e Segurança Orgânica', 3),
(v_template_id, 'Inteligência', 'Análise de Dados e Informações', 4),
(v_template_id, 'Inteligência', 'Sistemas de Inteligência no Brasil (SISBIN)', 5),
(v_template_id, 'Inteligência', 'Proteção do Conhecimento e Sigilo', 6),
(v_template_id, 'Informática', 'Segurança da Informação e Criptografia', 1),
(v_template_id, 'Informática', 'Análise de Redes e Dados', 2),
(v_template_id, 'Informática', 'Inteligência Artificial e Big Data', 3),
(v_template_id, 'Inglês', 'Tradução de Documentos Técnicos', 1);

-- ========================
-- 19. POLÍCIA PENAL
-- ========================
INSERT INTO public.concurso_templates (nome, orgao_pattern) VALUES
  ('Polícia Penal', 'Polícia Penal|Polícia Penitenciária|Agente Penitenciário|SAP|Secretaria de Administração Penitenciária')
RETURNING id INTO v_template_id;

INSERT INTO public.template_materias (template_id, disciplina_nome, materia_nome, ordem) VALUES
(v_template_id, 'Português', 'Compreensão e Gramática', 1),
(v_template_id, 'Direito Constitucional', 'Direitos e Garantias Individuais', 1),
(v_template_id, 'Direito Constitucional', 'Segurança Pública', 2),
(v_template_id, 'Direito Penal', 'Teoria do Crime e Penas', 1),
(v_template_id, 'Direito Penal', 'Crimes contra a Administração Pública', 2),
(v_template_id, 'Execução Penal', 'LEP (Lei 7.210/84) - Direitos e Deveres do Preso', 1),
(v_template_id, 'Execução Penal', 'Regimes: Fechado, Semiaberto, Aberto', 2),
(v_template_id, 'Execução Penal', 'Trabalho, Remição e Educação Prisional', 3),
(v_template_id, 'Execução Penal', 'Saúde no Sistema Prisional', 4),
(v_template_id, 'Execução Penal', 'Faltas Disciplinares e Regime Disciplinar Diferenciado (RDD)', 5),
(v_template_id, 'Execução Penal', 'Progressão de Regime e Livramento Condicional', 6),
(v_template_id, 'Execução Penal', 'Monitoramento Eletrônico e Saídas Temporárias', 7),
(v_template_id, 'Criminologia', 'Teorias Criminológicas e Prevenção', 1),
(v_template_id, 'Criminologia', 'Ressocialização e Reincidência', 2),
(v_template_id, 'Direitos Humanos', 'Sistema Prisional e Direitos Humanos', 1);

-- ========================
-- 20. CORPO DE BOMBEIROS
-- ========================
INSERT INTO public.concurso_templates (nome, orgao_pattern) VALUES
  ('Corpo de Bombeiros', 'Bombeiro|Corpo de Bombeiros|CBM|Defesa Civil')
RETURNING id INTO v_template_id;

INSERT INTO public.template_materias (template_id, disciplina_nome, materia_nome, ordem) VALUES
(v_template_id, 'Português', 'Gramática e Interpretação', 1),
(v_template_id, 'Matemática', 'Matemática Básica', 1),
(v_template_id, 'Raciocínio Lógico', 'Raciocínio Lógico-Matemático', 1),
(v_template_id, 'Direito Constitucional', 'Segurança Pública e Defesa Civil', 1),
(v_template_id, 'Noções de Combate a Incêndio', 'Teoria do Fogo e Triângulo do Fogo', 1),
(v_template_id, 'Noções de Combate a Incêndio', 'Classes de Incêndio e Agentes Extintores', 2),
(v_template_id, 'Noções de Combate a Incêndio', 'Equipamentos de Combate a Incêndio (EPI/EPC)', 3),
(v_template_id, 'Noções de Combate a Incêndio', 'Ventilação e Resfriamento', 4),
(v_template_id, 'Noções de Combate a Incêndio', 'Incêndio Estrutural e Florestal', 5),
(v_template_id, 'Noções de Combate a Incêndio', 'Produtos Perigosos (Hazmat)', 6),
(v_template_id, 'Atendimento Pré-Hospitalar', 'APH: Suporte Básico de Vida (SBV)', 1),
(v_template_id, 'Atendimento Pré-Hospitalar', 'Trauma, Hemorragias e Fraturas', 2),
(v_template_id, 'Atendimento Pré-Hospitalar', 'Politraumatismo e Imobilização', 3),
(v_template_id, 'Atendimento Pré-Hospitalar', 'Parada Cardiorrespiratória e RCP', 4),
(v_template_id, 'Atendimento Pré-Hospitalar', 'Queimaduras, Afogamento e Choque Elétrico', 5),
(v_template_id, 'Resgate e Salvamento', 'Resgate Veicular e Desencarceramento', 1),
(v_template_id, 'Resgate e Salvamento', 'Resgate em Altura e Cordas', 2),
(v_template_id, 'Resgate e Salvamento', 'Busca e Salvamento em Estruturas Colapsadas', 3),
(v_template_id, 'Resgate e Salvamento', 'Salvamento Aquático', 4),
(v_template_id, 'Resgate e Salvamento', 'Salvamento em Espaços Confinados', 5),
(v_template_id, 'Defesa Civil', 'Gerenciamento de Desastres', 1),
(v_template_id, 'Defesa Civil', 'Desastres Naturais: Enchentes, Deslizamentos, Secas', 2),
(v_template_id, 'Defesa Civil', 'Planos de Contingência e Proteção Civil', 3);

-- ========================
-- 21. PREFEITURA / CÂMARA MUNICIPAL
-- ========================
INSERT INTO public.concurso_templates (nome, orgao_pattern) VALUES
  ('Prefeitura e Administração Municipal', 'Prefeitura|Câmara Municipal|PM|Municipal|Secretaria Municipal')
RETURNING id INTO v_template_id;

INSERT INTO public.template_materias (template_id, disciplina_nome, materia_nome, ordem) VALUES
(v_template_id, 'Português', 'Gramática e Interpretação', 1),
(v_template_id, 'Português', 'Redação Oficial Municipal', 2),
(v_template_id, 'Matemática', 'Matemática Básica e Raciocínio', 1),
(v_template_id, 'Noções de Direito', 'Lei Orgânica do Município', 1),
(v_template_id, 'Noções de Direito', 'Regimento Interno da Câmara', 2),
(v_template_id, 'Noções de Direito', 'Estatuto dos Servidores Municipais', 3),
(v_template_id, 'Noções de Direito', 'Licitações na Administração Municipal', 4),
(v_template_id, 'Conhecimentos Locais', 'História e Geografia do Município', 1),
(v_template_id, 'Conhecimentos Locais', 'Turismo e Economia Local', 2),
(v_template_id, 'Conhecimentos Locais', 'Estrutura Administrativa Municipal', 3),
(v_template_id, 'Informática', 'Windows, Pacote Office, Internet', 1);

-- ========================
-- 22. BANCO DO BRASIL
-- ========================
INSERT INTO public.concurso_templates (nome, orgao_pattern) VALUES
  ('Banco do Brasil', 'Banco do Brasil|BB|BB Tecnologia')
RETURNING id INTO v_template_id;

INSERT INTO public.template_materias (template_id, disciplina_nome, materia_nome, ordem) VALUES
(v_template_id, 'Português', 'Gramática e Compreensão de Textos', 1),
(v_template_id, 'Matemática', 'Matemática Financeira', 1),
(v_template_id, 'Matemática', 'Probabilidade e Estatística', 2),
(v_template_id, 'Inglês', 'Textos Bancários e Financeiros', 1),
(v_template_id, 'Conhecimentos Bancários', 'Sistema Financeiro Nacional', 1),
(v_template_id, 'Conhecimentos Bancários', 'Mercado de Capitais e Câmbio', 2),
(v_template_id, 'Conhecimentos Bancários', 'Produtos Bancários: Contas, CDB, LCI, LCA, Poupança', 3),
(v_template_id, 'Conhecimentos Bancários', 'Crédito Rural e Agronegócio BB', 4),
(v_template_id, 'Conhecimentos Bancários', 'Cartões de Crédito e Débito', 5),
(v_template_id, 'Conhecimentos Bancários', 'Seguros e Capitalização', 6),
(v_template_id, 'Conhecimentos Bancários', 'Fundos de Investimento e Previdência', 7),
(v_template_id, 'Conhecimentos Bancários', 'Crédito Imobiliário e Consignado', 8),
(v_template_id, 'Conhecimentos Bancários', 'Open Banking, Pix e Inovação Digital', 9),
(v_template_id, 'Conhecimentos Bancários', 'Agronegócio e Sustentabilidade BB', 10),
(v_template_id, 'Vendas e Negociação', 'Atendimento e Pós-Vendas', 1),
(v_template_id, 'Vendas e Negociação', 'Ética e Compliance Bancário', 2);

-- ========================
-- 23. CAIXA ECONÔMICA FEDERAL
-- ========================
INSERT INTO public.concurso_templates (nome, orgao_pattern) VALUES
  ('Caixa Econômica Federal', 'Caixa|Caixa Econômica|CEF')
RETURNING id INTO v_template_id;

INSERT INTO public.template_materias (template_id, disciplina_nome, materia_nome, ordem) VALUES
(v_template_id, 'Português', 'Gramática e Interpretação', 1),
(v_template_id, 'Matemática', 'Matemática Financeira', 1),
(v_template_id, 'Matemática', 'Probabilidade e Estatística', 2),
(v_template_id, 'Conhecimentos Bancários', 'SFN e Mercado de Capitais', 1),
(v_template_id, 'Conhecimentos Bancários', 'Produtos Caixa: FGTS, PIS, PASEP, Seguro Desemprego', 2),
(v_template_id, 'Conhecimentos Bancários', 'Habitação: Minha Casa Minha Vida, SBPE, FGTS', 3),
(v_template_id, 'Conhecimentos Bancários', 'Programas Sociais: Bolsa Família, Auxílio Emergencial', 4),
(v_template_id, 'Conhecimentos Bancários', 'Lotéricas e Serviços Caixa', 5),
(v_template_id, 'Conhecimentos Bancários', 'Crédito Consignado e Imobiliário', 6),
(v_template_id, 'Conhecimentos Bancários', 'Poupança, Loterias e Títulos', 7),
(v_template_id, 'Noções de Direito', 'Direito do Consumidor (CDC)', 1);

END $$;
