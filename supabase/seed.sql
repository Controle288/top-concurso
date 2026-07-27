-- =====================================================
-- TOP CONCURSO - Dados de Exemplo
-- =====================================================

-- Garante constraints únicas para usar ON CONFLICT (ignora se já existirem)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'concursos_titulo_key') THEN
    ALTER TABLE public.concursos ADD CONSTRAINT concursos_titulo_key UNIQUE (titulo);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'noticias_titulo_key') THEN
    ALTER TABLE public.noticias ADD CONSTRAINT noticias_titulo_key UNIQUE (titulo);
  END IF;
END $$;

-- Bancas
INSERT INTO public.bancas (nome, sigla) VALUES
('Fundação Getúlio Vargas', 'FGV'),
('FCC', 'FCC'),
('Cebraspe', 'Cebraspe'),
('Vunesp', 'Vunesp'),
('IBFC', 'IBFC')
ON CONFLICT (nome) DO NOTHING;

-- Concursos
INSERT INTO public.concursos (titulo, orgao, banca_id, vagas, inscritos_estimados, data_prova, status, nivel, salario) VALUES
('Senado Federal - Consultor Legislativo', 'Senado Federal', (SELECT id FROM public.bancas WHERE sigla='FGV'), 10, 15000, '2026-09-15', 'aberto', 'superior', 25000.00),
('TRT 2ª Região - Analista Judiciário', 'TRT-SP', (SELECT id FROM public.bancas WHERE sigla='FCC'), 50, 80000, '2026-11-20', 'aberto', 'superior', 15000.00),
('Polícia Federal - Agente', 'Polícia Federal', (SELECT id FROM public.bancas WHERE sigla='Cebraspe'), 1000, 300000, '2027-02-10', 'previsto', 'superior', 12000.00),
('TSE Unificado - Técnico Judiciário', 'TSE', (SELECT id FROM public.bancas WHERE sigla='FGV'), 200, 250000, '2026-08-05', 'aberto', 'medio', 8500.00),
('Receita Federal - Auditor Fiscal', 'Receita Federal', (SELECT id FROM public.bancas WHERE sigla='Cebraspe'), 100, 120000, '2027-05-15', 'previsto', 'superior', 22000.00)
ON CONFLICT (titulo) DO NOTHING;

-- Disciplinas
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'Senado%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'Senado%')),
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'Senado%')),
('Raciocínio Lógico', (SELECT id FROM public.concursos WHERE titulo LIKE 'Senado%')),
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 2ª%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 2ª%')),
-- Polícia Federal
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Federal%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Federal%')),
('Direito Penal', (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Federal%')),
('Direito Processual Penal', (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Federal%')),
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Federal%')),
('Raciocínio Lógico', (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Federal%')),
-- TSE Unificado
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'TSE%')),
('Direito Eleitoral', (SELECT id FROM public.concursos WHERE titulo LIKE 'TSE%')),
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'TSE%')),
('Raciocínio Lógico', (SELECT id FROM public.concursos WHERE titulo LIKE 'TSE%')),
('Noções de Informática', (SELECT id FROM public.concursos WHERE titulo LIKE 'TSE%')),
-- Receita Federal
('Direito Tributário', (SELECT id FROM public.concursos WHERE titulo LIKE 'Receita%')),
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'Receita%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'Receita%')),
('Contabilidade Geral', (SELECT id FROM public.concursos WHERE titulo LIKE 'Receita%')),
('Auditoria', (SELECT id FROM public.concursos WHERE titulo LIKE 'Receita%')),
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'Receita%')),
('Raciocínio Lógico', (SELECT id FROM public.concursos WHERE titulo LIKE 'Receita%'))
ON CONFLICT (nome, concurso_id) DO NOTHING;

-- Notícias
INSERT INTO public.noticias (titulo, conteudo, tipo) VALUES
('Edital do TSE Unificado publicado!', 'O Tribunal Superior Eleitoral publicou edital com 200 vagas para técnico judiciário. Provas serão em agosto de 2026.', 'edital'),
('STF julga nova súmula vinculante', 'O Supremo Tribunal Federal aprovou nova súmula sobre Direito Administrativo. Matéria pode cair em diversos concursos.', 'noticia'),
('Dica de estudo: como revisar Direito Constitucional', 'Reserve 30 minutos toda semana para revisar controle de constitucionalidade. É o tema mais cobrado pela FGV.', 'dica')
ON CONFLICT (titulo) DO NOTHING;

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
  (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 2ª%'),
  (SELECT id FROM public.disciplinas WHERE nome='Direito Administrativo' AND concurso_id=(SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 2ª%')),
  2024, 'superior'
),
(
  'Assinale a alternativa em que o emprego do sinal indicativo de crase está inteiramente correto:',
  '[{"key":"A","text":"O delegado dirigiu-se à ela com profundo respeito antes de iniciar o depoimento oficial."},{"key":"B","text":"A equipe de perícia ficou frente à frente com os vestígios da atividade cibernética criminosa."},{"key":"C","text":"Os relatórios de inteligência foram entregues diretamente à direção do departamento."},{"key":"D","text":"Todos os agentes foram instruídos à comparecer ao treinamento tático na próxima segunda-feira."},{"key":"E","text":"O candidato demonstrou conhecimento técnico à partir das leituras recomendadas no edital."}]',
  'C', 'Na alternativa C, ocorre crase legítima ("entregues à [preposição] + a [artigo] direção").',
  (SELECT id FROM public.bancas WHERE sigla='Cebraspe'),
  (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Federal%'),
  (SELECT id FROM public.disciplinas WHERE nome='Língua Portuguesa' AND concurso_id=(SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Federal%')),
  2025, 'superior'
),
-- TSE Unificado - Direito Eleitoral
(
  'Nos termos do Código Eleitoral, configuram-se como condições de elegibilidade, EXCETO:',
  '[{"key":"A","text":"Nacionalidade brasileira."},{"key":"B","text":"Pleno exercício dos direitos políticos."},{"key":"C","text":"Alistamento eleitoral."},{"key":"D","text":"Idade mínima de 21 anos para Deputado Federal."},{"key":"E","text":"Domicílio eleitoral na circunscrição."}]',
  'D', 'A idade mínima para Deputado Federal é 21 anos (CF, art. 14, § 3º, VI, "c"). A alternativa D descreve idade INCORRETA, pois a questão pede o EXCETO.',
  (SELECT id FROM public.bancas WHERE sigla='FGV'),
  (SELECT id FROM public.concursos WHERE titulo LIKE 'TSE%'),
  (SELECT id FROM public.disciplinas WHERE nome='Direito Eleitoral' AND concurso_id=(SELECT id FROM public.concursos WHERE titulo LIKE 'TSE%')),
  2025, 'medio'
),
(
  'Compete à Justiça Eleitoral processar e julgar:',
  '[{"key":"A","text":"Crimes eleitorais e crimes comuns conexos."},{"key":"B","text":"Mandado de segurança em matéria eleitoral."},{"key":"C","text":"Ações de investigação judicial eleitoral."},{"key":"D","text":"Habeas corpus em matéria eleitoral."},{"key":"E","text":"Todas as alternativas estão corretas."}]',
  'E', 'A Justiça Eleitoral tem competência para julgar todos os itens listados: crimes eleitorais e conexos (art. 35, II, CE); MS (art. 35, XXXV, CF); AIJE (LC 64/90); HC (Súmula 3, TSE).',
  (SELECT id FROM public.bancas WHERE sigla='FGV'),
  (SELECT id FROM public.concursos WHERE titulo LIKE 'TSE%'),
  (SELECT id FROM public.disciplinas WHERE nome='Direito Eleitoral' AND concurso_id=(SELECT id FROM public.concursos WHERE titulo LIKE 'TSE%')),
  2025, 'medio'
),
-- Receita Federal - Direito Tributário
(
  'Assinale a alternativa que apresenta tributo de competência estadual:',
  '[{"key":"A","text":"Imposto sobre Produtos Industrializados (IPI)."},{"key":"B","text":"Imposto sobre Circulação de Mercadorias e Serviços (ICMS)."},{"key":"C","text":"Imposto sobre a Propriedade Territorial Rural (ITR)."},{"key":"D","text":"Imposto sobre Operações Financeiras (IOF)."},{"key":"E","text":"Contribuição para o Financiamento da Seguridade Social (COFINS)."}]',
  'B', 'O ICMS é imposto de competência estadual (art. 155, II, CF). IPI, IOF e COFINS são federais; ITR é federal (pode ser fiscalizado por Municípios).',
  (SELECT id FROM public.bancas WHERE sigla='Cebraspe'),
  (SELECT id FROM public.concursos WHERE titulo LIKE 'Receita%'),
  (SELECT id FROM public.disciplinas WHERE nome='Direito Tributário' AND concurso_id=(SELECT id FROM public.concursos WHERE titulo LIKE 'Receita%')),
  2026, 'superior'
),
(
  'O princípio constitucional tributário que veda à União, Estados e Municípios cobrar tributos no mesmo exercício financeiro em que a lei foi publicada é o princípio da:',
  '[{"key":"A","text":"Irretroatividade."},{"key":"B","text":"Anterioridade anual."},{"key":"C","text":"Legalidade estrita."},{"key":"D","text":"Capacidade contributiva."},{"key":"E","text":"Nao confisco."}]',
  'B', 'A anterioridade anual (art. 150, III, "b", CF) veda a cobrança de tributos no mesmo exercício financeiro em que a lei foi publicada. Diferencia-se da irretroatividade (fato gerador anterior à lei).',
  (SELECT id FROM public.bancas WHERE sigla='Cebraspe'),
  (SELECT id FROM public.concursos WHERE titulo LIKE 'Receita%'),
  (SELECT id FROM public.disciplinas WHERE nome='Direito Tributário' AND concurso_id=(SELECT id FROM public.concursos WHERE titulo LIKE 'Receita%')),
  2026, 'superior'
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
  (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 2ª%'),
  (SELECT id FROM public.disciplinas WHERE nome='Direito Administrativo' AND concurso_id=(SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 2ª%')),
  'Análise detalhada das modalidades de licitação com mnemônicos exclusivos.',
  '#', '4.8 MB • 35 págs'
),
(
  'Esquema Mental: Crase sem Mistério',
  'Resumo',
  NULL, NULL,
  'Infográfico completo sobre casos obrigatórios, proibitivos e facultativos da crase.',
  '#', '1.2 MB • 4 págs'
),
-- Polícia Federal
(
  'Resumo: Direito Penal para PF',
  'Resumo',
  (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Federal%'),
  (SELECT id FROM public.disciplinas WHERE nome='Direito Penal' AND concurso_id=(SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Federal%')),
  'Mapa mental dos crimes contra a Administração Pública (arts. 312 a 359-H do CP).',
  '#', '2.2 MB • 14 págs'
),
(
  'Lei Seca: Código de Processo Penal',
  'Lei Seca',
  (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Federal%'),
  (SELECT id FROM public.disciplinas WHERE nome='Direito Processual Penal' AND concurso_id=(SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Federal%')),
  'Arts. 1º a 250 do CPP com anotações para concursos policiais.',
  '#', '4.0 MB • 32 págs'
),
-- TSE Unificado
(
  'PDF Interativo: Direito Eleitoral para TSE',
  'PDF',
  (SELECT id FROM public.concursos WHERE titulo LIKE 'TSE%'),
  (SELECT id FROM public.disciplinas WHERE nome='Direito Eleitoral' AND concurso_id=(SELECT id FROM public.concursos WHERE titulo LIKE 'TSE%')),
  'Material completo com questões comentadas sobre inelegibilidades e propaganda eleitoral.',
  '#', '3.5 MB • 28 págs'
),
(
  'Resumo: Noções de Informática para TSE',
  'Resumo',
  (SELECT id FROM public.concursos WHERE titulo LIKE 'TSE%'),
  (SELECT id FROM public.disciplinas WHERE nome='Noções de Informática' AND concurso_id=(SELECT id FROM public.concursos WHERE titulo LIKE 'TSE%')),
  'Excel, Word, Google Sheets e conceitos de segurança da informação.',
  '#', '1.5 MB • 10 págs'
),
-- Receita Federal
(
  'Guia: Direito Tributário para Auditor Fiscal',
  'PDF',
  (SELECT id FROM public.concursos WHERE titulo LIKE 'Receita%'),
  (SELECT id FROM public.disciplinas WHERE nome='Direito Tributário' AND concurso_id=(SELECT id FROM public.concursos WHERE titulo LIKE 'Receita%')),
  'Sistema Tributário Nacional completo: impostos, taxas, contribuições e princípios.',
  '#', '5.0 MB • 42 págs'
),
(
  'Áudio-Aula: Contabilidade Geral para Receita Federal',
  'Audio',
  (SELECT id FROM public.concursos WHERE titulo LIKE 'Receita%'),
  (SELECT id FROM public.disciplinas WHERE nome='Contabilidade Geral' AND concurso_id=(SELECT id FROM public.concursos WHERE titulo LIKE 'Receita%')),
  'Narração comentada dos princípios contábeis, balanço patrimonial e DRE.',
  '#', '30 min • MP3'
);

-- =====================================================
-- QUESTÕES ADICIONAIS (DO block)
-- =====================================================

DO $$
DECLARE
  v_senado_id uuid; v_trt_id uuid; v_pf_id uuid; v_tse_id uuid; v_rec_id uuid;
  v_senado_dadm uuid; v_senado_dport uuid; v_senado_dlog uuid;
  v_trt_dcon uuid;
  v_pf_dcon uuid; v_pf_dadm uuid; v_pf_dpen uuid; v_pf_dppenal uuid; v_pf_dport uuid; v_pf_dlog uuid;
  v_tse_dcon uuid; v_tse_dport uuid; v_tse_dlog uuid; v_tse_dinfo uuid;
  v_rec_dtrib uuid; v_rec_dcon uuid; v_rec_dadm uuid; v_rec_dcont uuid; v_rec_daudit uuid; v_rec_dport uuid; v_rec_dlog uuid;
  v_fgv uuid; v_fcc uuid; v_cebraspe uuid;
BEGIN
  v_senado_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'Senado%');
  v_trt_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 2ª%');
  v_pf_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Federal%');
  v_tse_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'TSE%');
  v_rec_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'Receita%');
  v_fgv := (SELECT id FROM public.bancas WHERE sigla='FGV');
  v_fcc := (SELECT id FROM public.bancas WHERE sigla='FCC');
  v_cebraspe := (SELECT id FROM public.bancas WHERE sigla='Cebraspe');
  v_senado_dadm := (SELECT id FROM public.disciplinas WHERE nome='Direito Administrativo' AND concurso_id=v_senado_id);
  v_senado_dport := (SELECT id FROM public.disciplinas WHERE nome='Língua Portuguesa' AND concurso_id=v_senado_id);
  v_senado_dlog := (SELECT id FROM public.disciplinas WHERE nome='Raciocínio Lógico' AND concurso_id=v_senado_id);
  v_trt_dcon := (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=v_trt_id);
  v_pf_dcon := (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=v_pf_id);
  v_pf_dadm := (SELECT id FROM public.disciplinas WHERE nome='Direito Administrativo' AND concurso_id=v_pf_id);
  v_pf_dpen := (SELECT id FROM public.disciplinas WHERE nome='Direito Penal' AND concurso_id=v_pf_id);
  v_pf_dppenal := (SELECT id FROM public.disciplinas WHERE nome='Direito Processual Penal' AND concurso_id=v_pf_id);
  v_pf_dport := (SELECT id FROM public.disciplinas WHERE nome='Língua Portuguesa' AND concurso_id=v_pf_id);
  v_pf_dlog := (SELECT id FROM public.disciplinas WHERE nome='Raciocínio Lógico' AND concurso_id=v_pf_id);
  v_tse_dcon := (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=v_tse_id);
  v_tse_dport := (SELECT id FROM public.disciplinas WHERE nome='Língua Portuguesa' AND concurso_id=v_tse_id);
  v_tse_dlog := (SELECT id FROM public.disciplinas WHERE nome='Raciocínio Lógico' AND concurso_id=v_tse_id);
  v_tse_dinfo := (SELECT id FROM public.disciplinas WHERE nome='Noções de Informática' AND concurso_id=v_tse_id);
  v_rec_dcon := (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=v_rec_id);
  v_rec_dadm := (SELECT id FROM public.disciplinas WHERE nome='Direito Administrativo' AND concurso_id=v_rec_id);
  v_rec_dcont := (SELECT id FROM public.disciplinas WHERE nome='Contabilidade Geral' AND concurso_id=v_rec_id);
  v_rec_daudit := (SELECT id FROM public.disciplinas WHERE nome='Auditoria' AND concurso_id=v_rec_id);
  v_rec_dport := (SELECT id FROM public.disciplinas WHERE nome='Língua Portuguesa' AND concurso_id=v_rec_id);
  v_rec_dlog := (SELECT id FROM public.disciplinas WHERE nome='Raciocínio Lógico' AND concurso_id=v_rec_id);
  v_rec_dtrib := (SELECT id FROM public.disciplinas WHERE nome='Direito Tributário' AND concurso_id=v_rec_id);

  -- ========================
  -- SENADO
  -- ========================

  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'No tocante aos atos administrativos, a Administração Pública pode anular seus próprios atos quando eivados de vícios que os tornem ilegais. Essa prerrogativa decorre do poder:',
    '[{"key":"A","text":"Hierárquico."},{"key":"B","text":"Disciplinar."},{"key":"C","text":"De polícia."},{"key":"D","text":"Autotutela."},{"key":"E","text":"Regulamentar."}]',
    'D', 'O poder de autotutela permite à Administração anular seus próprios atos ilegais (Súmula 473 STF).',
    v_fgv, v_senado_id, v_senado_dadm, 2023, 'superior'
  ),
  (
    'Assinale a alternativa que apresenta requisito válido de validade do ato administrativo:',
    '[{"key":"A","text":"Subjetividade do agente."},{"key":"B","text":"Motivo discricionário sem previsão legal."},{"key":"C","text":"Competência do agente público."},{"key":"D","text":"Forma livre em qualquer hipótese."},{"key":"E","text":"Finalidade pessoal do administrador."}]',
    'C', 'A competência é um dos requisitos de validade do ato administrativo (Art. 2º da Lei 4.717/65), juntamente com forma, motivo, finalidade e objeto.',
    v_fgv, v_senado_id, v_senado_dadm, 2025, 'superior'
  ),
  (
    'Em relação ao uso dos porquês, assinale a alternativa correta:',
    '[{"key":"A","text":"Não sei por que ela faltou."},{"key":"B","text":"Ela não veio por que estava doente."},{"key":"C","text":"O caminho por que passei é bonito."},{"key":"D","text":"Por que você não vem?"},{"key":"E","text":"Eis o motivo por que não fui."}]',
    'D', '"Por que" separado sem acento é usado em perguntas diretas ou indiretas (por qual motivo). Na alternativa D, trata-se de pergunta direta.',
    v_fgv, v_senado_id, v_senado_dport, 2022, 'superior'
  ),
  (
    'Assinale a alternativa em que ocorre corretamente a concordância verbal:',
    '[{"key":"A","text":"Fazem cinco anos que não o vejo."},{"key":"B","text":"Houveram muitos candidatos na prova."},{"key":"C","text":"Existiam diversas razões para a escolha."},{"key":"D","text":"Devem haver novas soluções."},{"key":"E","text":"Tratam-se de questões importantes."}]',
    'C', '"Existir" é verbo pessoal e concorda com o sujeito ("diversas razões"). "Fazer" com tempo decorrido é impessoal. "Haver" com sentido de existir é impessoal.',
    v_fgv, v_senado_id, v_senado_dport, 2024, 'superior'
  ),
  (
    'Considere a sequência: 2, 6, 18, 54, ... O próximo termo é:',
    '[{"key":"A","text":"108"},{"key":"B","text":"162"},{"key":"C","text":"150"},{"key":"D","text":"144"},{"key":"E","text":"172"}]',
    'B', 'Trata-se de uma progressão geométrica de razão 3 (cada termo é o anterior multiplicado por 3). 54 x 3 = 162.',
    v_fgv, v_senado_id, v_senado_dlog, 2024, 'superior'
  ),
  (
    'Se todo A é B e nenhum B é C, pode-se concluir que:',
    '[{"key":"A","text":"Todo A é C."},{"key":"B","text":"Nenhum A é C."},{"key":"C","text":"Algum A é C."},{"key":"D","text":"Todo C é A."},{"key":"E","text":"Algum B não é A."}]',
    'B', 'Se A está contido em B e B não intersecta C, então A também não intersecta C. Logo, nenhum A é C.',
    v_fgv, v_senado_id, v_senado_dlog, 2026, 'superior'
  );

  -- ========================
  -- TRT
  -- ========================

  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'A Constituição Federal assegura que ninguém será obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de lei. Esse princípio é o da:',
    '[{"key":"A","text":"Isonomia."},{"key":"B","text":"Legalidade."},{"key":"C","text":"Dignidade da pessoa humana."},{"key":"D","text":"Ampla defesa."},{"key":"E","text":"Contraditório."}]',
    'B', 'O princípio da legalidade está previsto no art. 5º, II, da CF/88: "ninguém será obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de lei."',
    v_fcc, v_trt_id, v_trt_dcon, 2023, 'superior'
  ),
  (
    'São direitos sociais previstos no art. 6º da Constituição Federal, EXCETO:',
    '[{"key":"A","text":"Educação."},{"key":"B","text":"Saúde."},{"key":"C","text":"Propriedade."},{"key":"D","text":"Moradia."},{"key":"E","text":"Previdência social."}]',
    'C', 'A propriedade é um direito individual (art. 5º, XXII, CF), não um direito social. Os direitos sociais estão no art. 6º da CF.',
    v_fcc, v_trt_id, v_trt_dcon, 2025, 'superior'
  );

  -- ========================
  -- POLÍCIA FEDERAL
  -- ========================

  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'A Administração Pública direta e indireta de qualquer dos Poderes da União, dos Estados, do Distrito Federal e dos Municípios obedecerá ao princípio da:',
    '[{"key":"A","text":"Eficiência, legalidade, impessoalidade, moralidade e publicidade."},{"key":"B","text":"Legalidade, finalidade, razoabilidade e proporcionalidade."},{"key":"C","text":"Impessoalidade, moralidade, eficiência e supremacia do interesse público."},{"key":"D","text":"Legalidade, impessoalidade, moralidade, publicidade e eficiência."},{"key":"E","text":"Continuidade, legalidade, eficiência e publicidade."}]',
    'D', 'Art. 37, caput, da CF/88: "A administração pública direta e indireta obedecerá aos princípios de legalidade, impessoalidade, moralidade, publicidade e eficiência."',
    v_cebraspe, v_pf_id, v_pf_dcon, 2022, 'superior'
  ),
  (
    'Assinale a alternativa que apresenta corretamente os requisitos do ato administrativo vinculado:',
    '[{"key":"A","text":"Competência, finalidade, forma, motivo e objeto."},{"key":"B","text":"Competência, conveniência, oportunidade e forma."},{"key":"C","text":"Finalidade, discricionariedade, motivo e objeto."},{"key":"D","text":"Motivo, mérito, competência e forma."},{"key":"E","text":"Objeto, conveniência, oportunidade e finalidade."}]',
    'A', 'Os requisitos do ato administrativo são: competência, finalidade, forma, motivo e objeto (Lei 4.717/65, art. 2º).',
    v_cebraspe, v_pf_id, v_pf_dadm, 2024, 'superior'
  ),
  (
    'O crime de peculato ocorre quando o funcionário público:',
    '[{"key":"A","text":"Revela fato sigiloso de que tem ciência em razão do cargo."},{"key":"B","text":"Apropria-se de dinheiro, valor ou bem móvel de que tem a posse em razão do cargo."},{"key":"C","text":"Retarda ato de ofício para satisfazer interesse pessoal."},{"key":"D","text":"Exige vantagem indevida para praticar ato de ofício."},{"key":"E","text":"Descumpre prazo legal sem justificativa."}]',
    'B', 'O peculato (art. 312, CP) consiste em o funcionário público apropriar-se de dinheiro, valor ou qualquer outro bem móvel de que tem a posse em razão do cargo.',
    v_cebraspe, v_pf_id, v_pf_dpen, 2023, 'superior'
  ),
  (
    'É característica do inquérito policial:',
    '[{"key":"A","text":"O contraditório e a ampla defesa são obrigatórios."},{"key":"B","text":"É um procedimento sigiloso e inquisitivo."},{"key":"C","text":"A autoridade policial pode arquivá-lo sumariamente."},{"key":"D","text":"O indiciado não pode requerer nenhuma diligência."},{"key":"E","text":"O juiz participa ativamente da fase investigatória."}]',
    'B', 'O inquérito policial é sigiloso (art. 20, CPP) e inquisitivo, não havendo contraditório nem ampla defesa. O arquivamento cabe ao juiz (art. 28, CPP).',
    v_cebraspe, v_pf_id, v_pf_dppenal, 2023, 'superior'
  ),
  (
    'Assinale a alternativa correta quanto ao uso da crase:',
    '[{"key":"A","text":"Fui à pé até a delegacia."},{"key":"B","text":"O inquérito foi encaminhado à autoridade competente."},{"key":"C","text":"O delegado referiu-se àquele documento."},{"key":"D","text":"Compareceram à uma reunião especial."},{"key":"E","text":"O projétil atingiu à parede."}]',
    'B', 'Ocorre crase na fusão da preposição "a" com o artigo "a" ("à autoridade"). Nas demais: A) "a pé" (advérbio); C) "àquele" = prep + pronome; D) "a uma" (artigo indefinido); E) verbo transitivo indireto.',
    v_cebraspe, v_pf_id, v_pf_dport, 2022, 'superior'
  ),
  (
    'Considere a proposição: "Se o suspeito é culpado, então a impressão digital está na arma." A negação lógica dessa proposição é:',
    '[{"key":"A","text":"O suspeito não é culpado e a impressão digital não está na arma."},{"key":"B","text":"O suspeito é culpado e a impressão digital não está na arma."},{"key":"C","text":"Se o suspeito não é culpado, então a impressão digital está na arma."},{"key":"D","text":"O suspeito não é culpado ou a impressão digital não está na arma."},{"key":"E","text":"Se a impressão digital não está na arma, então o suspeito não é culpado."}]',
    'B', 'A negação de uma condicional "P → Q" é "P e ¬Q" (mantém o antecedente e nega o consequente).',
    v_cebraspe, v_pf_id, v_pf_dlog, 2025, 'superior'
  );

  -- ========================
  -- TSE UNIFICADO
  -- ========================

  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'A cidadania é um direito fundamental que se expressa, no plano constitucional, pelo:',
    '[{"key":"A","text":"Direito de propriedade."},{"key":"B","text":"Direito ao voto e à participação política."},{"key":"C","text":"Direito à educação básica."},{"key":"D","text":"Direito de reunião pacífica."},{"key":"E","text":"Direito à herança."}]',
    'B', 'A cidadania manifesta-se pelo alistamento eleitoral, pelo voto direto e secreto e pela participação popular (art. 14, CF/88).',
    v_fgv, v_tse_id, v_tse_dcon, 2024, 'medio'
  ),
  (
    'Assinale a alternativa que apresenta interpretação de texto correta: "Embora o edital tenha sido publicado, as provas foram adiadas." A oração destacada expressa ideia de:',
    '[{"key":"A","text":"Causa."},{"key":"B","text":"Consequência."},{"key":"C","text":"Concessão."},{"key":"D","text":"Condição."},{"key":"E","text":"Finalidade."}]',
    'C', '"Embora" é conjunção concessiva, indicando uma ideia contrária que não impede a realização do fato principal.',
    v_fgv, v_tse_id, v_tse_dport, 2024, 'medio'
  ),
  (
    'Se João é técnico judiciário, então ele trabalha no TSE. João não trabalha no TSE. Logo:',
    '[{"key":"A","text":"João é técnico judiciário."},{"key":"B","text":"João não é técnico judiciário."},{"key":"C","text":"João trabalha no TSE e é técnico."},{"key":"D","text":"João pode ser técnico judiciário."},{"key":"E","text":"Nada se pode concluir."}]',
    'B', 'Pelo modus tollens: se P → Q e ¬Q, então ¬P. "João é técnico judiciário → trabalha no TSE" + "João não trabalha no TSE" → "João não é técnico judiciário".',
    v_fgv, v_tse_id, v_tse_dlog, 2025, 'medio'
  ),
  (
    'No Microsoft Excel, a fórmula =SOMA(A1:A5) tem como resultado:',
    '[{"key":"A","text":"A média dos valores de A1 a A5."},{"key":"B","text":"A soma dos valores de A1 e A5 apenas."},{"key":"C","text":"O maior valor entre A1 e A5."},{"key":"D","text":"A soma dos valores de A1 até A5."},{"key":"E","text":"O total de células preenchidas de A1 a A5."}]',
    'D', 'A função =SOMA(A1:A5) retorna a soma de todos os valores contidos no intervalo de A1 até A5.',
    v_fgv, v_tse_id, v_tse_dinfo, 2025, 'medio'
  ),
  (
    'Sobre segurança da informação, assinale a alternativa correta:',
    '[{"key":"A","text":"Firewall é um antivírus que protege contra todos os malwares."},{"key":"B","text":"A criptografia garante a integridade e a confidencialidade dos dados."},{"key":"C","text":"Backup é opcional em sistemas críticos."},{"key":"D","text":"Senhas fortes dispensam a autenticação em dois fatores."},{"key":"E","text":"Phishing é uma técnica de ataque físico a servidores."}]',
    'B', 'A criptografia transforma dados legíveis em ilegíveis, garantindo confidencialidade, e também pode assegurar integridade (hash).',
    v_fgv, v_tse_id, v_tse_dinfo, 2026, 'medio'
  );

  -- ========================
  -- RECEITA FEDERAL
  -- ========================

  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'A União, os Estados, o Distrito Federal e os Municípios poderão instituir impostos sobre:',
    '[{"key":"A","text":"O patrimônio, a renda e os serviços de qualquer natureza."},{"key":"B","text":"O patrimônio e a renda, exclusivamente."},{"key":"C","text":"A renda, os serviços e o consumo, observada a competência de cada ente."},{"key":"D","text":"O patrimônio, a renda, o consumo e a produção, conforme repartição constitucional."},{"key":"E","text":"Qualquer manifestação de riqueza, sem limitação."}]',
    'D', 'A CF/88 reparte competências tributárias: impostos sobre patrimônio (IPVA, IPTU, ITR), renda (IR), consumo (ICMS, IPI, ISS) e produção (IOF).',
    v_cebraspe, v_rec_id, v_rec_dcon, 2023, 'superior'
  ),
  (
    'No âmbito do poder de polícia administrativa, a Administração pode:',
    '[{"key":"A","text":"Aplicar sanções penais aos infratores."},{"key":"B","text":"Limitar o exercício de direitos individuais em prol do interesse coletivo."},{"key":"C","text":"Legislar sobre matéria tributária."},{"key":"D","text":"Declarar a inconstitucionalidade de leis."},{"key":"E","text":"Julgar crimes contra a Administração Pública."}]',
    'B', 'O poder de polícia é a atividade estatal que condiciona o exercício de direitos individuais ao bem-estar coletivo (art. 78, CTN).',
    v_cebraspe, v_rec_id, v_rec_dadm, 2024, 'superior'
  ),
  (
    'No Balanço Patrimonial, o Passivo Exigível representa:',
    '[{"key":"A","text":"Os bens e direitos da entidade."},{"key":"B","text":"As obrigações da entidade com terceiros."},{"key":"C","text":"O patrimônio líquido da entidade."},{"key":"D","text":"As receitas e despesas do período."},{"key":"E","text":"O lucro acumulado do exercício."}]',
    'B', 'O Passivo Exigível (Passivo Circulante + Passivo Não Circulante) representa todas as obrigações da entidade com terceiros.',
    v_cebraspe, v_rec_id, v_rec_dcont, 2025, 'superior'
  ),
  (
    'A auditoria independente tem como objetivo principal:',
    '[{"key":"A","text":"Apurar fraudes e erros contábeis."},{"key":"B","text":"Emitir opinião sobre as demonstrações contábeis."},{"key":"C","text":"Elaborar as demonstrações financeiras da entidade."},{"key":"D","text":"Realizar a contabilidade da empresa auditada."},{"key":"E","text":"Garantir a lucratividade do negócio."}]',
    'B', 'O objetivo da auditoria independente é emitir uma opinião sobre se as demonstrações contábeis estão elaboradas em conformidade com a estrutura de relatório financeiro (NBC TA 200).',
    v_cebraspe, v_rec_id, v_rec_daudit, 2023, 'superior'
  ),
  (
    'Em relação aos controles internos, assinale a alternativa correta:',
    '[{"key":"A","text":"Controles internos dispensam a segregação de funções."},{"key":"B","text":"O ambiente de controle é a base do sistema de controle interno."},{"key":"C","text":"A auditoria interna substitui a necessidade de controles internos."},{"key":"D","text":"Controles internos só se aplicam a empresas de capital aberto."},{"key":"E","text":"O COSO não é utilizado no Brasil como referência de controle interno."}]',
    'B', 'O ambiente de controle é o fundamento do controle interno (COSO), abrangendo integridade, valores éticos e estrutura de governança.',
    v_cebraspe, v_rec_id, v_rec_daudit, 2025, 'superior'
  ),
  (
    'Assinale a alternativa em que a regência verbal está de acordo com a norma culta:',
    '[{"key":"A","text":"O auditor assistiu o relatório completo."},{"key":"B","text":"A Receita Federal procedeu a fiscalização."},{"key":"C","text":"O contribuinte respondeu ao fiscal."},{"key":"D","text":"O parecer implicou em mudanças no processo."},{"key":"E","text":"A lei visa a cobrança de tributos."}]',
    'C', '"Responder" no sentido de dar resposta é verbo transitivo indireto: responder A algo/alguém. "Assistir" com sentido de ver exige "a". "Proceder" exige "a". "Implicar" no sentido de acarretar é VTD.',
    v_cebraspe, v_rec_id, v_rec_dport, 2024, 'superior'
  ),
  (
    'Uma pesquisa indica que a média de tempo para conclusão de uma auditoria fiscal é de 45 dias, com desvio padrão de 10 dias. Assumindo distribuição normal, o percentual de auditorias concluídas entre 35 e 55 dias é de aproximadamente:',
    '[{"key":"A","text":"34%"},{"key":"B","text":"47.5%"},{"key":"C","text":"68%"},{"key":"D","text":"95%"},{"key":"E","text":"99.7%"}]',
    'C', 'Em uma distribuição normal, aproximadamente 68% dos dados estão dentro de ±1 desvio padrão da média. 35 = 45-10 e 55 = 45+10, ou seja, ±1σ.',
    v_cebraspe, v_rec_id, v_rec_dlog, 2024, 'superior'
  );
END $$;
