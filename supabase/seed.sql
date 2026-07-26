-- =====================================================
-- TOP CONCURSO - Dados de Exemplo
-- =====================================================

-- Bancas
INSERT INTO public.bancas (nome, sigla) VALUES
('Fundação Getúlio Vargas', 'FGV'),
('FCC', 'FCC'),
('Cebraspe', 'Cebraspe'),
('Vunesp', 'Vunesp'),
('IBFC', 'IBFC');

-- Concursos
INSERT INTO public.concursos (titulo, orgao, banca_id, vagas, inscritos_estimados, data_prova, status, nivel, salario) VALUES
('Senado Federal - Consultor Legislativo', 'Senado Federal', (SELECT id FROM public.bancas WHERE sigla='FGV'), 10, 15000, '2026-09-15', 'aberto', 'superior', 25000.00),
('TRT 2ª Região - Analista Judiciário', 'TRT-SP', (SELECT id FROM public.bancas WHERE sigla='FCC'), 50, 80000, '2026-11-20', 'aberto', 'superior', 15000.00),
('Polícia Federal - Agente', 'Polícia Federal', (SELECT id FROM public.bancas WHERE sigla='Cebraspe'), 1000, 300000, '2027-02-10', 'previsto', 'superior', 12000.00),
('TSE Unificado - Técnico Judiciário', 'TSE', (SELECT id FROM public.bancas WHERE sigla='FGV'), 200, 250000, '2026-08-05', 'aberto', 'medio', 8500.00),
('Receita Federal - Auditor Fiscal', 'Receita Federal', (SELECT id FROM public.bancas WHERE sigla='Cebraspe'), 100, 120000, '2027-05-15', 'previsto', 'superior', 22000.00);

-- Disciplinas
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'Senado%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'Senado%')),
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'Senado%')),
('Raciocínio Lógico', (SELECT id FROM public.concursos WHERE titulo LIKE 'Senado%')),
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT%'));

-- Notícias
INSERT INTO public.noticias (titulo, conteudo, tipo) VALUES
('Edital do TSE Unificado publicado!', 'O Tribunal Superior Eleitoral publicou edital com 200 vagas para técnico judiciário. Provas serão em agosto de 2026.', 'edital'),
('STF julga nova súmula vinculante', 'O Supremo Tribunal Federal aprovou nova súmula sobre Direito Administrativo. Matéria pode cair em diversos concursos.', 'noticia'),
('Dica de estudo: como revisar Direito Constitucional', 'Reserve 30 minutos toda semana para revisar controle de constitucionalidade. É o tema mais cobrado pela FGV.', 'dica');

-- Questões
INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
(
  'Considere que o Presidente da República editou Medida Provisória dispondo sobre matéria penal, tipificando conduta inédita como crime hediondo. Diante dos limites constitucionais traçados para a edição de medidas provisórias, assinale a afirmativa correta:',
  '[{"key":"A","text":"A Medida Provisória é constitucional, desde que comprovada a relevância e urgência nacional."},{"key":"B","text":"A edição de Medida Provisória sobre matéria penal é expressamente vedada pela Constituição Federal."},{"key":"C","text":"É permitida a criação de tipos penais por Medida Provisória, contanto que a pena cominada não supere 4 anos."},{"key":"D","text":"A matéria penal pode ser tratada por MP, mas sua eficácia fica suspensa até a efetiva conversão em lei pelo Congresso Nacional."},{"key":"E","text":"A Medida Provisória é perfeitamente válida apenas se editada em período de estado de defesa ou estado de sítio."}]',
  'B', 'De acordo com o Art. 62, § 1º, I, "b", da CF/88, é expressamente VEDADA a edição de MPs sobre matéria relativa a direito penal, processual penal e processual civil.',
  (SELECT id FROM public.bancas WHERE sigla='FGV'),
  (SELECT id FROM public.concursos WHERE titulo LIKE 'Senado%'),
  (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=(SELECT id FROM public.concursos WHERE titulo LIKE 'Senado%')),
  2024, 'superior'
),
(
  'O ato administrativo pelo qual a Administração declara a extinção de um ato válido por motivos de conveniência e oportunidade, respeitados os direitos adquiridos e os efeitos já produzidos, denomina-se:',
  '[{"key":"A","text":"Anulação"},{"key":"B","text":"Cassação"},{"key":"C","text":"Revogação"},{"key":"D","text":"Caducidade"},{"key":"E","text":"Contraposição"}]',
  'C', 'A Revogação é a extinção de um ato administrativo legítimo e eficaz por razões de conveniência e oportunidade. Possui efeitos ex nunc e resguarda os direitos adquiridos.',
  (SELECT id FROM public.bancas WHERE sigla='FCC'),
  (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT%'),
  (SELECT id FROM public.disciplinas WHERE nome='Direito Administrativo' AND concurso_id=(SELECT id FROM public.concursos WHERE titulo LIKE 'TRT%')),
  2024, 'superior'
),
(
  'Assinale a alternativa em que o emprego do sinal indicativo de crase está inteiramente correto:',
  '[{"key":"A","text":"O delegado dirigiu-se à ela com profundo respeito antes de iniciar o depoimento oficial."},{"key":"B","text":"A equipe de perícia ficou frente à frente com os vestígios da atividade cibernética criminosa."},{"key":"C","text":"Os relatórios de inteligência foram entregues diretamente à direção do departamento."},{"key":"D","text":"Todos os agentes foram instruídos à comparecer ao treinamento tático na próxima segunda-feira."},{"key":"E","text":"O candidato demonstrou conhecimento técnico à partir das leituras recomendadas no edital."}]',
  'C', 'Na alternativa C, ocorre crase legítima ("entregues à [preposição] + a [artigo] direção").',
  (SELECT id FROM public.bancas WHERE sigla='Cebraspe'),
  (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia%'),
  NULL, 2025, 'superior'
);

-- Aulas (YouTube - vídeos reais brasileiros)
INSERT INTO public.aulas (titulo, descricao, concurso_id, disciplina_id, youtube_url, youtube_id, duracao_minutos, instrutor, thumbnail_url) VALUES
(
  'Controle de Constitucionalidade - Teoria Geral',
  'Aula completa sobre controle de constitucionalidade para concursos públicos.',
  (SELECT id FROM public.concursos WHERE titulo LIKE 'Senado%'),
  (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=(SELECT id FROM public.concursos WHERE titulo LIKE 'Senado%')),
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 52, 'Prof. Aragonê Fernandes',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80'
),
(
  'Atos Administrativos - Elementos e Atributos',
  'Aula sobre os elementos, atributos e classificação dos atos administrativos.',
  (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT%'),
  (SELECT id FROM public.disciplinas WHERE nome='Direito Administrativo' AND concurso_id=(SELECT id FROM public.concursos WHERE titulo LIKE 'TRT%')),
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 45, 'Profª Maria Sylvia',
  'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80'
),
(
  'Crase sem Mistério - Português para Concursos',
  'Aprenda crase de uma vez por todas com regras simples e mnemônicos.',
  (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia%'),
  NULL,
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 38, 'Prof. Elias Santana',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80'
);

-- PDFs
INSERT INTO public.pdfs (titulo, tipo, concurso_id, disciplina_id, descricao, url, size_or_duration) VALUES
(
  'Resumo: Controle Concentrado de Constitucionalidade',
  'PDF',
  (SELECT id FROM public.concursos WHERE titulo LIKE 'Senado%'),
  (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=(SELECT id FROM public.concursos WHERE titulo LIKE 'Senado%')),
  'Material completo sobre ADI, ADC, ADO e ADPF com tabelas comparativas.',
  '#', '2.4 MB • 15 págs'
),
(
  'Áudio-Lei: Artigo 5º da CF/88',
  'Audio',
  (SELECT id FROM public.concursos WHERE titulo LIKE 'Senado%'),
  (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=(SELECT id FROM public.concursos WHERE titulo LIKE 'Senado%')),
  'Leitura pausada e esquematizada de todos os incisos do Artigo 5º.',
  '#', '18 min • MP3'
),
(
  'Lei Seca: Lei 14.133/21 (Nova Lei de Licitações)',
  'Lei Seca',
  (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT%'),
  (SELECT id FROM public.disciplinas WHERE nome='Direito Administrativo' AND concurso_id=(SELECT id FROM public.concursos WHERE titulo LIKE 'TRT%')),
  'Análise detalhada das modalidades de licitação com mnemônicos exclusivos.',
  '#', '4.8 MB • 35 págs'
),
(
  'Esquema Mental: Crase sem Mistério',
  'Resumo',
  NULL, NULL,
  'Infográfico completo sobre casos obrigatórios, proibitivos e facultativos da crase.',
  '#', '1.2 MB • 4 págs'
);
