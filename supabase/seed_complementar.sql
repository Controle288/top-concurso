-- =====================================================
-- TOP CONCURSO - Dados Complementares
-- Execute DEPOIS do seed.sql
-- Adiciona mais bancas, concursos, aulas, questões e PDFs
-- =====================================================

-- Garante constraints únicas (caso seed.sql não tenha rodado)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'concursos_titulo_key') THEN
    ALTER TABLE public.concursos ADD CONSTRAINT concursos_titulo_key UNIQUE (titulo);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'noticias_titulo_key') THEN
    ALTER TABLE public.noticias ADD CONSTRAINT noticias_titulo_key UNIQUE (titulo);
  END IF;
END $$;

-- NOVAS BANCAS
INSERT INTO public.bancas (nome, sigla) VALUES
('Cesgranrio', 'Cesgranrio'),
('Quadrix', 'Quadrix'),
('AOCP', 'AOCP'),
('Consulplan', 'Consulplan'),
('Instituto Acesso', 'Acesso')
ON CONFLICT (sigla) DO NOTHING;

-- =====================================================
-- CONCURSOS POLICIAIS / SEGURANÇA PÚBLICA
-- =====================================================

INSERT INTO public.concursos (titulo, orgao, banca_id, vagas, inscritos_estimados, data_prova, status, nivel, salario) VALUES
('PM BA - Soldado', 'Polícia Militar da Bahia', (SELECT id FROM public.bancas WHERE sigla='IBFC'), 2000, 120000, '2026-10-20', 'aberto', 'medio', 4500.00),
('PM SP - Soldado', 'Polícia Militar de São Paulo', (SELECT id FROM public.bancas WHERE sigla='Vunesp'), 2700, 200000, '2026-12-05', 'aberto', 'medio', 5000.00),
('PM RJ - Soldado', 'Polícia Militar do Rio de Janeiro', (SELECT id FROM public.bancas WHERE sigla='Cesgranrio'), 1500, 150000, '2027-03-15', 'previsto', 'medio', 4200.00),
('Polícia Civil SP - Investigador', 'Polícia Civil de São Paulo', (SELECT id FROM public.bancas WHERE sigla='Vunesp'), 500, 100000, '2026-11-10', 'aberto', 'superior', 9000.00),
('Polícia Penal Federal', 'Ministério da Justiça', (SELECT id FROM public.bancas WHERE sigla='Cebraspe'), 800, 180000, '2027-04-20', 'previsto', 'medio', 7500.00)
ON CONFLICT (titulo) DO NOTHING;

-- =====================================================
-- CONCURSOS TRIBUNAIS / MPC
-- =====================================================

INSERT INTO public.concursos (titulo, orgao, banca_id, vagas, inscritos_estimados, data_prova, status, nivel, salario) VALUES
('TRT 4ª Região - Analista', 'TRT-RS', (SELECT id FROM public.bancas WHERE sigla='FCC'), 40, 60000, '2026-09-30', 'aberto', 'superior', 16000.00),
('TRT 6ª Região - Técnico', 'TRT-PE', (SELECT id FROM public.bancas WHERE sigla='FGV'), 80, 90000, '2026-10-15', 'aberto', 'medio', 8500.00),
('TJ SP - Escrevente Técnico', 'Tribunal de Justiça de SP', (SELECT id FROM public.bancas WHERE sigla='Vunesp'), 300, 250000, '2027-02-20', 'previsto', 'medio', 7500.00),
('TJ RJ - Técnico Judiciário', 'Tribunal de Justiça do RJ', (SELECT id FROM public.bancas WHERE sigla='FGV'), 200, 180000, '2026-11-25', 'aberto', 'medio', 7200.00)
ON CONFLICT (titulo) DO NOTHING;

-- =====================================================
-- CONCURSOS FISCAIS / CONTROLE
-- =====================================================

INSERT INTO public.concursos (titulo, orgao, banca_id, vagas, inscritos_estimados, data_prova, status, nivel, salario) VALUES
('SEFAZ SP - Auditor Fiscal', 'Secretaria da Fazenda de SP', (SELECT id FROM public.bancas WHERE sigla='FGV'), 60, 90000, '2026-08-25', 'aberto', 'superior', 22000.00),
('SEFAZ RJ - Auditor Fiscal', 'Secretaria da Fazenda do RJ', (SELECT id FROM public.bancas WHERE sigla='Cebraspe'), 40, 70000, '2027-01-15', 'previsto', 'superior', 20000.00),
('ISS SP - Auditor Fiscal', 'Secretaria Municipal de Finanças de SP', (SELECT id FROM public.bancas WHERE sigla='FCC'), 30, 50000, '2027-06-10', 'previsto', 'superior', 19000.00)
ON CONFLICT (titulo) DO NOTHING;

-- =====================================================
-- CONCURSOS EXECUTIVO FEDERAL
-- =====================================================

INSERT INTO public.concursos (titulo, orgao, banca_id, vagas, inscritos_estimados, data_prova, status, nivel, salario) VALUES
('INSS - Técnico do Seguro Social', 'INSS', (SELECT id FROM public.bancas WHERE sigla='Cesgranrio'), 1000, 350000, '2027-05-30', 'previsto', 'medio', 6500.00),
('IBGE - Recenseador', 'IBGE', (SELECT id FROM public.bancas WHERE sigla='AOCP'), 5000, 400000, '2026-09-10', 'aberto', 'fundamental', 3000.00),
('Câmara dos Deputados - Analista', 'Câmara dos Deputados', (SELECT id FROM public.bancas WHERE sigla='FGV'), 100, 120000, '2026-12-15', 'aberto', 'superior', 20000.00),
('BACEN - Analista', 'Banco Central do Brasil', (SELECT id FROM public.bancas WHERE sigla='Cesgranrio'), 50, 80000, '2027-08-10', 'previsto', 'superior', 23000.00)
ON CONFLICT (titulo) DO NOTHING;

-- =====================================================
-- CONCURSOS SAÚDE / EDUCAÇÃO
-- =====================================================

INSERT INTO public.concursos (titulo, orgao, banca_id, vagas, inscritos_estimados, data_prova, status, nivel, salario) VALUES
('SUS - Médico', 'Secretaria de Saúde SP', (SELECT id FROM public.bancas WHERE sigla='Vunesp'), 200, 30000, '2026-10-01', 'aberto', 'superior', 15000.00),
('Professor SEEDUC RJ', 'Secretaria de Educação do RJ', (SELECT id FROM public.bancas WHERE sigla='Cesgranrio'), 500, 80000, '2027-03-01', 'previsto', 'superior', 5500.00)
ON CONFLICT (titulo) DO NOTHING;

-- =====================================================
-- DISCIPLINAS POR CONCURSO
-- =====================================================

-- PM BA
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM BA%')),
('Direito Penal', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM BA%')),
('Direito Penal Militar', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM BA%')),
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM BA%')),
('Raciocínio Lógico', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM BA%'))
ON CONFLICT (nome, concurso_id) DO NOTHING;

-- PM SP
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM SP%')),
('Direito Penal', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM SP%')),
('Direito Penal Militar', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM SP%')),
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM SP%'))
ON CONFLICT (nome, concurso_id) DO NOTHING;

-- PM RJ
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM RJ%')),
('Direito Penal', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM RJ%')),
('Direitos Humanos', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM RJ%')),
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM RJ%')) ON CONFLICT (nome, concurso_id) DO NOTHING;

-- Polícia Civil SP
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Civil SP%')),
('Direito Penal', (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Civil SP%')),
('Direito Processual Penal', (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Civil SP%')),
('Criminologia', (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Civil SP%')),
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Civil SP%')) ON CONFLICT (nome, concurso_id) DO NOTHING;

-- Polícia Penal Federal
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Penal%')),
('Direito Penal', (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Penal%')),
('Direito Processual Penal', (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Penal%')),
('Lei de Execução Penal', (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Penal%')) ON CONFLICT (nome, concurso_id) DO NOTHING;

-- TRT 4
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 4%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 4%')),
('Direito do Trabalho', (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 4%')),
('Direito Processual do Trabalho', (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 4%')) ON CONFLICT (nome, concurso_id) DO NOTHING;

-- TRT 6
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 6%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 6%')),
('Direito do Trabalho', (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 6%')) ON CONFLICT (nome, concurso_id) DO NOTHING;

-- TJ SP
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'TJ SP%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'TJ SP%')),
('Direito Civil', (SELECT id FROM public.concursos WHERE titulo LIKE 'TJ SP%')),
('Direito Processual Civil', (SELECT id FROM public.concursos WHERE titulo LIKE 'TJ SP%')),
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'TJ SP%')) ON CONFLICT (nome, concurso_id) DO NOTHING;

-- TJ RJ
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'TJ RJ%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'TJ RJ%')),
('Direito Civil', (SELECT id FROM public.concursos WHERE titulo LIKE 'TJ RJ%')),
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'TJ RJ%')) ON CONFLICT (nome, concurso_id) DO NOTHING;

-- SEFAZ SP
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Tributário', (SELECT id FROM public.concursos WHERE titulo LIKE 'SEFAZ SP%')),
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'SEFAZ SP%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'SEFAZ SP%')),
('Contabilidade Geral', (SELECT id FROM public.concursos WHERE titulo LIKE 'SEFAZ SP%')),
('Economia', (SELECT id FROM public.concursos WHERE titulo LIKE 'SEFAZ SP%')) ON CONFLICT (nome, concurso_id) DO NOTHING;

-- SEFAZ RJ
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Tributário', (SELECT id FROM public.concursos WHERE titulo LIKE 'SEFAZ RJ%')),
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'SEFAZ RJ%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'SEFAZ RJ%')),
('Contabilidade Geral', (SELECT id FROM public.concursos WHERE titulo LIKE 'SEFAZ RJ%')) ON CONFLICT (nome, concurso_id) DO NOTHING;

-- INSS
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Previdenciário', (SELECT id FROM public.concursos WHERE titulo LIKE 'INSS%')),
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'INSS%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'INSS%')),
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'INSS%')) ON CONFLICT (nome, concurso_id) DO NOTHING;

-- Câmara dos Deputados
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'Câmara%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'Câmara%')),
('Regimento Interno CD', (SELECT id FROM public.concursos WHERE titulo LIKE 'Câmara%')),
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'Câmara%')) ON CONFLICT (nome, concurso_id) DO NOTHING;

-- BACEN
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Economia', (SELECT id FROM public.concursos WHERE titulo LIKE 'BACEN%')),
('Finanças', (SELECT id FROM public.concursos WHERE titulo LIKE 'BACEN%')),
('Matemática Financeira', (SELECT id FROM public.concursos WHERE titulo LIKE 'BACEN%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'BACEN%')) ON CONFLICT (nome, concurso_id) DO NOTHING;

-- IBGE
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'IBGE%')),
('Matemática', (SELECT id FROM public.concursos WHERE titulo LIKE 'IBGE%')),
('Geografia', (SELECT id FROM public.concursos WHERE titulo LIKE 'IBGE%'))
ON CONFLICT (nome, concurso_id) DO NOTHING;

-- =====================================================
-- NOTÍCIAS
-- =====================================================

INSERT INTO public.noticias (titulo, conteudo, tipo) VALUES
('PM BA divulga edital com 2.000 vagas!', 'A Polícia Militar da Bahia publicou edital para Soldado com salário inicial de R$ 4.500. Inscrições até setembro.', 'edital'),
('TRT 4ª Região abre concurso para Analista', 'O TRT do Rio Grande do Sul oferece 40 vagas para Analista Judiciário. Salário de R$ 16.000.', 'edital'),
('INSS autoriza novo concurso com 1.000 vagas', 'O Ministério da Previdência autorizou concurso para Técnico do Seguro Social. Previsão de edital para 2027.', 'aviso'),
('STJ define tese sobre improbidade administrativa', 'A Primeira Seção do STJ firmou tese importante sobre prazos prescricionais na Lei de Improbidade. Matéria relevante para tribunais.', 'noticia'),
('Dica: Como estudar Direito Penal para PM', 'Foque nos arts. 121 a 154 do CP (crimes contra a pessoa) e na Parte Geral. São os tópicos mais cobrados em concursos policiais.', 'dica'),
('Edital SEFAZ SP publicado com 60 vagas', 'Secretaria da Fazenda de São Paulo oferece vagas para Auditor Fiscal com salário inicial de R$ 22.000. Provas em agosto.', 'edital') ON CONFLICT (titulo) DO NOTHING;

-- =====================================================
-- QUESTÕES
-- =====================================================

DO $$
DECLARE
  v_pmba_id uuid;
  v_pmba_dcon_id uuid;
  v_pmba_dpen_id uuid;
  v_pmba_dpm_id uuid;
  v_pmba_dport_id uuid;
  v_trt4_id uuid;
  v_trt4_dtrab_id uuid;
  v_sefazsp_id uuid;
  v_sefazsp_dtrib_id uuid;
  v_tjsp_id uuid;
  v_tjsp_dcivil_id uuid;
  v_pcsp_id uuid;
  v_pcsp_dppenal_id uuid;
  v_inss_id uuid;
  v_inss_dprev_id uuid;
  v_ibfc_id uuid;
  v_vunesp_id uuid;
  v_cesgranrio_id uuid;
  v_fcc_id uuid;
  v_fgv_id uuid;
BEGIN
  -- IDs das bancas
  v_ibfc_id := (SELECT id FROM public.bancas WHERE sigla='IBFC');
  v_vunesp_id := (SELECT id FROM public.bancas WHERE sigla='Vunesp');
  v_cesgranrio_id := (SELECT id FROM public.bancas WHERE sigla='Cesgranrio');
  v_fcc_id := (SELECT id FROM public.bancas WHERE sigla='FCC');
  v_fgv_id := (SELECT id FROM public.bancas WHERE sigla='FGV');

  -- IDs dos concursos
  v_pmba_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'PM BA%');
  v_trt4_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 4%');
  v_sefazsp_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'SEFAZ SP%');
  v_tjsp_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'TJ SP%');
  v_pcsp_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Civil SP%');
  v_inss_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'INSS%');

  -- IDs das disciplinas (específicas por concurso)
  v_pmba_dcon_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=v_pmba_id);
  v_pmba_dpen_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Penal' AND concurso_id=v_pmba_id);
  v_pmba_dpm_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Penal Militar' AND concurso_id=v_pmba_id);
  v_pmba_dport_id := (SELECT id FROM public.disciplinas WHERE nome='Língua Portuguesa' AND concurso_id=v_pmba_id);
  v_trt4_dtrab_id := (SELECT id FROM public.disciplinas WHERE nome='Direito do Trabalho' AND concurso_id=v_trt4_id);
  v_sefazsp_dtrib_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Tributário' AND concurso_id=v_sefazsp_id);
  v_tjsp_dcivil_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Civil' AND concurso_id=v_tjsp_id);
  v_pcsp_dppenal_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Processual Penal' AND concurso_id=v_pcsp_id);
  v_inss_dprev_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Previdenciário' AND concurso_id=v_inss_id);

  -- 1. PM BA - Direito Constitucional
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'De acordo com a Constituição Federal de 1988, são poderes da União, independentes e harmônicos entre si:',
    '[{"key":"A","text":"Executivo, Legislativo e Judiciário."},{"key":"B","text":"Executivo, Legislativo e Ministério Público."},{"key":"C","text":"Executivo, Judiciário e Tribunal de Contas."},{"key":"D","text":"Legislativo, Judiciário e Defensoria Pública."},{"key":"E","text":"Executivo, Legislativo e Forças Armadas."}]',
    'A', 'Art. 2º da CF/88: "São Poderes da União, independentes e harmônicos entre si, o Legislativo, o Executivo e o Judiciário."',
    v_ibfc_id, v_pmba_id, v_pmba_dcon_id, 2025, 'medio'
  );

  -- 2. PM BA - Direito Penal
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'Assinale a alternativa que apresenta causa excludente de ilicitude prevista no Código Penal:',
    '[{"key":"A","text":"Coação moral irresistível."},{"key":"B","text":"Erro sobre elemento do tipo."},{"key":"C","text":"Estado de necessidade."},{"key":"D","text":"Arrependimento posterior."},{"key":"E","text":"Desistência voluntária."}]',
    'C', 'O estado de necesidadde é causa excludente de ilicitude (art. 23, I, CP). A coação moral irresistível exclui a culpabilidade. O erro sobre elemento do tipo exclui o dolo.',
    v_ibfc_id, v_pmba_id, v_pmba_dpen_id, 2025, 'medio'
  );

  -- 3. PM BA - Direito Penal Militar
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'O Código Penal Militar define como crime militar o peculato. Assinale a alternativa que descreve corretamente esse crime:',
    '[{"key":"A","text":"Apropriar-se o militar de dinheiro de que tem a posse em razão do cargo."},{"key":"B","text":"Retardar ou deixar de praticar ato de ofício."},{"key":"C","text":"Exigir vantagem indevida para praticar ato de ofício."},{"key":"D","text":"Revelar fato sigiloso de que tem ciência em razão do cargo."},{"key":"E","text":"Insultar superior hierárquico durante o serviço."}]',
    'A', 'O peculato (art. 303, CPM) consiste em o militar apropriar-se de dinheiro, valor ou qualquer outro bem móvel de que tem a posse em razão do cargo.',
    v_ibfc_id, v_pmba_id, v_pmba_dpm_id, 2025, 'medio'
  );

  -- 4. PM BA - Português
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'Assinale a alternativa em que a concordância verbal está CORRETA:',
    '[{"key":"A","text":"Fazem cinco anos que ele ingressou na corporação."},{"key":"B","text":"Haviam muitas pessoas na manifestação."},{"key":"C","text":"Mais de um policial foi homenageado."},{"key":"D","text":"Devem haver novos concursos este ano."},{"key":"E","text":"Trata-se de questões disciplinares graves."}]',
    'C', '"Mais de um" seguido de verbo no singular é a concordância correta. "Fazer" com sentido de tempo decorrido é impessoal (faz). "Haver" com sentido de existir é impessoal (havia).',
    v_ibfc_id, v_pmba_id, v_pmba_dport_id, 2025, 'medio'
  );

  -- 5. TRT 4 - Direito do Trabalho
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'De acordo com a CLT, o período máximo de duração do trabalho normal do empregado é de:',
    '[{"key":"A","text":"6 horas diárias e 36 semanais."},{"key":"B","text":"8 horas diárias e 40 semanais."},{"key":"C","text":"8 horas diárias e 44 semanais."},{"key":"D","text":"10 horas diárias e 48 semanais."},{"key":"E","text":"6 horas diárias e 30 semanais."}]',
    'C', 'Art. 7º, XIII, CF/88 combinado com art. 58 da CLT: duração do trabalho normal é de 8 horas diárias e 44 horas semanais.',
    v_fcc_id, v_trt4_id, v_trt4_dtrab_id, 2024, 'superior'
  );

  -- 6. SEFAZ SP - Direito Tributário
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'O princípio tributário que veda à União, Estados e Municípios exigir tributo em relação a fatos geradores ocorridos antes da vigência da lei que os houver instituído é o princípio da:',
    '[{"key":"A","text":"Irretroatividade."},{"key":"B","text":"Anterioridade."},{"key":"C","text":"Legalidade."},{"key":"D","text":"Isonomia."},{"key":"E","text":"Capacidade contributiva."}]',
    'A', 'O princípio da irretroatividade (art. 150, III, "a", CF) veda a cobrança de tributo sobre fatos geradores ocorridos antes da vigência da lei.',
    v_fgv_id, v_sefazsp_id, v_sefazsp_dtrib_id, 2025, 'superior'
  );

  -- 7. TJ SP - Direito Civil
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'De acordo com o Código Civil, a prescrição ocorre em 10 anos quando a lei não lhe haja fixado prazo menor. Assinale a alternativa que indica o prazo prescricional para a pretensão de cobrança de dívidas líquidas constantes de instrumento público ou particular:',
    '[{"key":"A","text":"1 ano."},{"key":"B","text":"3 anos."},{"key":"C","text":"5 anos."},{"key":"D","text":"8 anos."},{"key":"E","text":"10 anos."}]',
    'C', 'Art. 206, § 5º, I, CC: prescreve em 5 anos a pretensão de cobrança de dívidas líquidas constantes de instrumento público ou particular.',
    v_vunesp_id, v_tjsp_id, v_tjsp_dcivil_id, 2024, 'medio'
  );

  -- 8. PC SP - Processo Penal
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'O inquérito policial é um procedimento administrativo investigatório. Assinale a alternativa correta sobre suas características:',
    '[{"key":"A","text":"É contraditório e ampla defesa são obrigatórios."},{"key":"B","text":"A autoridade policial pode arquivar o inquérito."},{"key":"C","text":"É sigiloso, dispensando contraditório e ampla defesa."},{"key":"D","text":"O indiciado não pode requerer diligências."},{"key":"E","text":"O prazo para conclusão é improrrogável."}]',
    'C', 'O inquérito policial é sigiloso e não há contraditório nem ampla defesa (mero procedimento administrativo). O arquivamento cabe ao juiz, não à autoridade policial.',
    v_vunesp_id, v_pcsp_id, v_pcsp_dppenal_id, 2025, 'superior'
  );

  -- 9. INSS - Direito Previdenciário
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'O Regime Geral de Previdência Social (RGPS) garante aos segurados os seguintes benefícios, EXCETO:',
    '[{"key":"A","text":"Aposentadoria por invalidez."},{"key":"B","text":"Auxílio-doença."},{"key":"C","text":"Salário-família."},{"key":"D","text":"Seguro-desemprego."},{"key":"E","text":"Pensão por morte."}]',
    'D', 'O seguro-desemprego é benefício do FAT (Fundo de Amparo ao Trabalhador), não do RGPS. Os demais são benefícios previdenciários.',
    v_cesgranrio_id, v_inss_id, v_inss_dprev_id, 2024, 'medio'
  );

  -- 10. PM SP - Direito Constitucional (Vunesp)
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'A Constituição Federal, em seu art. 5º, estabelece que "todos são iguais perante a lei". Esse é o princípio da:',
    '[{"key":"A","text":"Legalidade."},{"key":"B","text":"Igualdade."},{"key":"C","text":"Liberdade."},{"key":"D","text":"Dignidade da pessoa humana."},{"key":"E","text":"Devido processo legal."}]',
    'B', 'O caput do art. 5º da CF/88 consagra o princípio da igualdade (isonomia): "Todos são iguais perante a lei, sem distinção de qualquer natureza."',
    v_vunesp_id, (SELECT id FROM public.concursos WHERE titulo LIKE 'PM SP%'),
    (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=(SELECT id FROM public.concursos WHERE titulo LIKE 'PM SP%')),
    2025, 'medio'
  );
END $$;

-- =====================================================
-- PDFs
-- =====================================================

DO $$
DECLARE
  v_pmba_id uuid;
  v_pmba_dcon_id uuid;
  v_pmba_dpen_id uuid;
  v_pmsp_id uuid;
  v_pmsp_dpen_id uuid;
  v_pcsp_id uuid;
  v_pcsp_dcon_id uuid;
  v_trt4_id uuid;
  v_trt4_dtrab_id uuid;
  v_sefazsp_id uuid;
  v_sefazsp_dtrib_id uuid;
  v_inss_id uuid;
  v_inss_dprev_id uuid;
BEGIN
  v_pmba_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'PM BA%');
  v_pmba_dcon_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=v_pmba_id);
  v_pmba_dpen_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Penal' AND concurso_id=v_pmba_id);
  v_pmsp_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'PM SP%');
  v_pmsp_dpen_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Penal' AND concurso_id=v_pmsp_id);
  v_pcsp_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Civil SP%');
  v_pcsp_dcon_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=v_pcsp_id);
  v_trt4_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 4%');
  v_trt4_dtrab_id := (SELECT id FROM public.disciplinas WHERE nome='Direito do Trabalho' AND concurso_id=v_trt4_id);
  v_sefazsp_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'SEFAZ SP%');
  v_sefazsp_dtrib_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Tributário' AND concurso_id=v_sefazsp_id);
  v_inss_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'INSS%');
  v_inss_dprev_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Previdenciário' AND concurso_id=v_inss_id);

  INSERT INTO public.pdfs (titulo, tipo, concurso_id, disciplina_id, descricao, url, size_or_duration) VALUES
  (
    'Resumo: Direito Constitucional para PM BA',
    'Resumo',
    v_pmba_id, v_pmba_dcon_id,
    'Mapa mental completo com os tópicos mais cobrados pela IBFC no concurso da PM BA.',
    '#', '1.8 MB • 12 págs'
  ),
  (
    'Lei Seca: Código Penal - Parte Geral (PM BA)',
    'Lei Seca',
    v_pmba_id, v_pmba_dpen_id,
    'Arts. 1º a 120 do CP com anotações esquematizadas para concursos policiais.',
    '#', '3.2 MB • 28 págs'
  ),
  (
    'Esquema: Inquérito Policial (PC SP)',
    'Resumo',
    v_pcsp_id, v_pcsp_dcon_id,
    'Fluxograma completo do inquérito policial: instauração, prazos, indiciamento e arquivamento.',
    '#', '1.5 MB • 6 págs'
  ),
  (
    'Guia: Direito do Trabalho para TRT',
    'PDF',
    v_trt4_id, v_trt4_dtrab_id,
    'Compilado de jurisprudência sumulada do TST sobre direitos trabalhistas.',
    '#', '5.1 MB • 40 págs'
  ),
  (
    'Áudio-Aula: Princípios Tributários (SEFAZ)',
    'Audio',
    v_sefazsp_id, v_sefazsp_dtrib_id,
    'Narração comentada dos princípios tributários da CF/88 com exemplos práticos.',
    '#', '25 min • MP3'
  ),
  (
    'Resumo: Direito Previdenciário (INSS)',
    'Resumo',
    v_inss_id, v_inss_dprev_id,
    'Tabela comparativa de todos os benefícios do RGPS com requisitos e valores.',
    '#', '2.1 MB • 18 págs'
  ),
  (
    'Lei Seca: Estatuto da PM SP',
    'Lei Seca',
    v_pmsp_id, v_pmsp_dpen_id,
    'Lei Complementar Estadual 1.367/2025 com anotações para Soldado PM SP.',
    '#', '4.5 MB • 35 págs'
  ),
  (
    'PDF Interativo: Sistema Tributário Nacional',
    'PDF',
    v_sefazsp_id, v_sefazsp_dtrib_id,
    'Material completo com exercícios de fixação sobre o Sistema Tributário Nacional.',
    '#', '6.2 MB • 50 págs'
  );
END $$;

-- =====================================================
-- NOVOS CONCURSOS (STJ, MPU, BB, Caixa, Correios)
-- =====================================================

INSERT INTO public.concursos (titulo, orgao, banca_id, vagas, inscritos_estimados, data_prova, status, nivel, salario) VALUES
('STJ - Analista Judiciário', 'STJ', (SELECT id FROM public.bancas WHERE sigla='Cebraspe'), 50, 100000, '2027-06-15', 'previsto', 'superior', 18000.00),
('MPU - Técnico do MPU', 'Ministério Público da União', (SELECT id FROM public.bancas WHERE sigla='FGV'), 200, 200000, '2026-12-01', 'aberto', 'medio', 8500.00),
('Banco do Brasil - Escriturário', 'Banco do Brasil', (SELECT id FROM public.bancas WHERE sigla='Cesgranrio'), 4000, 500000, '2027-04-01', 'previsto', 'medio', 5600.00),
('Caixa Econômica Federal - Técnico Bancário', 'Caixa Econômica Federal', (SELECT id FROM public.bancas WHERE sigla='Cesgranrio'), 3000, 400000, '2027-08-01', 'previsto', 'medio', 5200.00),
('Correios - Carteiro', 'Correios', (SELECT id FROM public.bancas WHERE sigla='IBFC'), 5000, 600000, '2026-11-30', 'aberto', 'fundamental', 2800.00)
ON CONFLICT (titulo) DO NOTHING;

-- =====================================================
-- DISCIPLINAS FALTANTES (ISS SP, SUS, SEEDUC RJ)
-- =====================================================

-- ISS SP
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Tributário', (SELECT id FROM public.concursos WHERE titulo LIKE 'ISS SP%')),
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'ISS SP%')),
('Direito Financeiro', (SELECT id FROM public.concursos WHERE titulo LIKE 'ISS SP%')),
('Contabilidade Geral', (SELECT id FROM public.concursos WHERE titulo LIKE 'ISS SP%')),
('Auditoria', (SELECT id FROM public.concursos WHERE titulo LIKE 'ISS SP%')) ON CONFLICT (nome, concurso_id) DO NOTHING;

-- SUS
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'SUS%')),
('Raciocínio Lógico', (SELECT id FROM public.concursos WHERE titulo LIKE 'SUS%')),
('SUS - Lei 8.080/90', (SELECT id FROM public.concursos WHERE titulo LIKE 'SUS%')),
('Bioética', (SELECT id FROM public.concursos WHERE titulo LIKE 'SUS%')),
('Epidemiologia', (SELECT id FROM public.concursos WHERE titulo LIKE 'SUS%')) ON CONFLICT (nome, concurso_id) DO NOTHING;

-- SEEDUC RJ
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'SEEDUC%')),
('Conhecimentos Pedagógicos', (SELECT id FROM public.concursos WHERE titulo LIKE 'SEEDUC%')),
('Estatuto da Criança e do Adolescente', (SELECT id FROM public.concursos WHERE titulo LIKE 'SEEDUC%')),
('Raciocínio Lógico', (SELECT id FROM public.concursos WHERE titulo LIKE 'SEEDUC%')) ON CONFLICT (nome, concurso_id) DO NOTHING;

-- =====================================================
-- DISCIPLINAS DOS NOVOS CONCURSOS
-- =====================================================

-- STJ
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'STJ%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'STJ%')),
('Regimento Interno STJ', (SELECT id FROM public.concursos WHERE titulo LIKE 'STJ%')),
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'STJ%')) ON CONFLICT (nome, concurso_id) DO NOTHING;

-- MPU
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'MPU%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'MPU%')),
('Direito Processual Penal', (SELECT id FROM public.concursos WHERE titulo LIKE 'MPU%')),
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'MPU%')) ON CONFLICT (nome, concurso_id) DO NOTHING;

-- Banco do Brasil
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'Banco do Brasil%')),
('Matemática', (SELECT id FROM public.concursos WHERE titulo LIKE 'Banco do Brasil%')),
('Atualidades do Mercado Financeiro', (SELECT id FROM public.concursos WHERE titulo LIKE 'Banco do Brasil%')),
('Conhecimentos Bancários', (SELECT id FROM public.concursos WHERE titulo LIKE 'Banco do Brasil%')),
('Noções de Informática', (SELECT id FROM public.concursos WHERE titulo LIKE 'Banco do Brasil%')) ON CONFLICT (nome, concurso_id) DO NOTHING;

-- Caixa
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'Caixa%')),
('Matemática', (SELECT id FROM public.concursos WHERE titulo LIKE 'Caixa%')),
('Conhecimentos Bancários', (SELECT id FROM public.concursos WHERE titulo LIKE 'Caixa%')),
('Noções de Informática', (SELECT id FROM public.concursos WHERE titulo LIKE 'Caixa%')) ON CONFLICT (nome, concurso_id) DO NOTHING;

-- Correios
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'Correios%')),
('Matemática', (SELECT id FROM public.concursos WHERE titulo LIKE 'Correios%')),
('Noções de Informática', (SELECT id FROM public.concursos WHERE titulo LIKE 'Correios%')),
('Código de Conduta Ética', (SELECT id FROM public.concursos WHERE titulo LIKE 'Correios%')) ON CONFLICT (nome, concurso_id) DO NOTHING;

-- =====================================================
-- NOTÍCIAS ADICIONAIS
-- =====================================================

INSERT INTO public.noticias (titulo, conteudo, tipo) VALUES
('STJ autoriza concurso para Analista Judiciário', 'O Superior Tribunal de Justiça autorizou a realização de concurso para Analista Judiciário com 50 vagas e salário de R$ 18.000.', 'edital'),
('Banco do Brasil e Caixa preparam novos concursos', 'BB e Caixa Econômica Federal anunciaram concursos com milhares de vagas para escriturário e técnico bancário em 2027.', 'aviso'),
('Correios abrem inscrições para 5.000 vagas de Carteiro', 'Maior concurso público do ano: Correios oferecem 5.000 vagas para Carteiro com salário de R$ 2.800. Inscrições até novembro.', 'edital'),
('Dica: Como estudar Conhecimentos Bancários', 'Foque em sistema financeiro nacional, produtos bancários, matemática financeira e legislação do BB/Caixa. São os temas mais cobrados.', 'dica'),
('Novo pacote de concursos tribunais previsto para 2027', 'STJ, STF e MPU devem publicar editais em 2027. Prepare-se com antecedência estudando a parte doutrinária de Direito Constitucional e Administrativo.', 'noticia');

-- =====================================================
-- QUESTÕES ADICIONAIS
-- =====================================================

DO $$
DECLARE
  -- Bancas
  v_ibfc uuid; v_vunesp uuid; v_cesgranrio uuid; v_fcc uuid; v_fgv uuid; v_cebraspe uuid; v_aocp uuid;
  -- Concursos
  v_pmrj_id uuid; v_ppenal_id uuid; v_trt6_id uuid; v_tjrj_id uuid; v_sefazrj_id uuid;
  v_iss_id uuid; v_ibge_id uuid; v_camara_id uuid; v_bacen_id uuid;
  v_sus_id uuid; v_seeduc_id uuid;
  v_stj_id uuid; v_mpu_id uuid; v_bb_id uuid; v_caixa_id uuid; v_correios_id uuid;
  v_pmsp_id uuid; v_pcsp_id uuid; v_trt4_id uuid; v_tjsp_id uuid; v_inss_id uuid; v_sefazsp_id uuid;
  -- Disciplinas por concurso
  v_pmrj_dc uuid; v_pmrj_dp uuid; v_pmrj_dh uuid;
  v_ppenal_dc uuid; v_ppenal_dp uuid; v_ppenal_dpp uuid; v_ppenal_lep uuid;
  v_trt6_dt uuid;
  v_tjrj_dciv uuid;
  v_sefazrj_dt uuid; v_sefazrj_cg uuid;
  v_iss_dt uuid; v_iss_cg uuid;
  v_ibge_lp uuid; v_ibge_mat uuid; v_ibge_geo uuid;
  v_camara_dc uuid; v_camara_dadm uuid; v_camara_lp uuid;
  v_bacen_econ uuid; v_bacen_fin uuid; v_bacen_mf uuid;
  v_sus_lei uuid; v_sus_bio uuid;
  v_seeduc_cped uuid; v_seeduc_eca uuid;
  v_stj_dc uuid; v_stj_dadm uuid; v_stj_reg uuid;
  v_mpu_dc uuid; v_mpu_lp uuid;
  v_bb_lp uuid; v_bb_mat uuid; v_bb_cb uuid; v_bb_info uuid;
  v_caixa_lp uuid; v_caixa_cb uuid;
  v_correios_lp uuid; v_correios_mat uuid; v_correios_conduta uuid;
  v_pmsp_dp uuid; v_pmsp_dpm uuid;
  v_pcsp_dc uuid; v_pcsp_crim uuid;
  v_trt4_dadm uuid; v_trt4_dpt uuid;
  v_tjsp_dadm uuid; v_tjsp_dpciv uuid;
  v_inss_dc uuid; v_inss_dadm uuid;
  v_sefazsp_dadm uuid; v_sefazsp_econ uuid;
BEGIN
  v_ibfc := (SELECT id FROM public.bancas WHERE sigla='IBFC');
  v_vunesp := (SELECT id FROM public.bancas WHERE sigla='Vunesp');
  v_cesgranrio := (SELECT id FROM public.bancas WHERE sigla='Cesgranrio');
  v_fcc := (SELECT id FROM public.bancas WHERE sigla='FCC');
  v_fgv := (SELECT id FROM public.bancas WHERE sigla='FGV');
  v_cebraspe := (SELECT id FROM public.bancas WHERE sigla='Cebraspe');
  v_aocp := (SELECT id FROM public.bancas WHERE sigla='AOCP');

  v_pmrj_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'PM RJ%');
  v_ppenal_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Penal%');
  v_trt6_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 6%');
  v_tjrj_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'TJ RJ%');
  v_sefazrj_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'SEFAZ RJ%');
  v_iss_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'ISS SP%');
  v_ibge_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'IBGE%');
  v_camara_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'Câmara%');
  v_bacen_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'BACEN%');
  v_sus_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'SUS%');
  v_seeduc_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'SEEDUC%');
  v_stj_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'STJ%');
  v_mpu_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'MPU%');
  v_bb_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'Banco do Brasil%');
  v_caixa_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'Caixa%');
  v_correios_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'Correios%');
  v_pmsp_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'PM SP%');
  v_pcsp_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Civil SP%');
  v_trt4_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 4%');
  v_tjsp_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'TJ SP%');
  v_inss_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'INSS%');
  v_sefazsp_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'SEFAZ SP%');

  v_pmrj_dc := (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=v_pmrj_id);
  v_pmrj_dp := (SELECT id FROM public.disciplinas WHERE nome='Direito Penal' AND concurso_id=v_pmrj_id);
  v_pmrj_dh := (SELECT id FROM public.disciplinas WHERE nome='Direitos Humanos' AND concurso_id=v_pmrj_id);
  v_ppenal_dc := (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=v_ppenal_id);
  v_ppenal_dp := (SELECT id FROM public.disciplinas WHERE nome='Direito Penal' AND concurso_id=v_ppenal_id);
  v_ppenal_dpp := (SELECT id FROM public.disciplinas WHERE nome='Direito Processual Penal' AND concurso_id=v_ppenal_id);
  v_ppenal_lep := (SELECT id FROM public.disciplinas WHERE nome='Lei de Execução Penal' AND concurso_id=v_ppenal_id);
  v_trt6_dt := (SELECT id FROM public.disciplinas WHERE nome='Direito do Trabalho' AND concurso_id=v_trt6_id);
  v_tjrj_dciv := (SELECT id FROM public.disciplinas WHERE nome='Direito Civil' AND concurso_id=v_tjrj_id);
  v_sefazrj_dt := (SELECT id FROM public.disciplinas WHERE nome='Direito Tributário' AND concurso_id=v_sefazrj_id);
  v_sefazrj_cg := (SELECT id FROM public.disciplinas WHERE nome='Contabilidade Geral' AND concurso_id=v_sefazrj_id);
  v_iss_dt := (SELECT id FROM public.disciplinas WHERE nome='Direito Tributário' AND concurso_id=v_iss_id);
  v_iss_cg := (SELECT id FROM public.disciplinas WHERE nome='Contabilidade Geral' AND concurso_id=v_iss_id);
  v_ibge_lp := (SELECT id FROM public.disciplinas WHERE nome='Língua Portuguesa' AND concurso_id=v_ibge_id);
  v_ibge_mat := (SELECT id FROM public.disciplinas WHERE nome='Matemática' AND concurso_id=v_ibge_id);
  v_ibge_geo := (SELECT id FROM public.disciplinas WHERE nome='Geografia' AND concurso_id=v_ibge_id);
  v_camara_dc := (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=v_camara_id);
  v_camara_dadm := (SELECT id FROM public.disciplinas WHERE nome='Direito Administrativo' AND concurso_id=v_camara_id);
  v_camara_lp := (SELECT id FROM public.disciplinas WHERE nome='Língua Portuguesa' AND concurso_id=v_camara_id);
  v_bacen_econ := (SELECT id FROM public.disciplinas WHERE nome='Economia' AND concurso_id=v_bacen_id);
  v_bacen_fin := (SELECT id FROM public.disciplinas WHERE nome='Finanças' AND concurso_id=v_bacen_id);
  v_bacen_mf := (SELECT id FROM public.disciplinas WHERE nome='Matemática Financeira' AND concurso_id=v_bacen_id);
  v_sus_lei := (SELECT id FROM public.disciplinas WHERE nome='SUS - Lei 8.080/90' AND concurso_id=v_sus_id);
  v_sus_bio := (SELECT id FROM public.disciplinas WHERE nome='Bioética' AND concurso_id=v_sus_id);
  v_seeduc_cped := (SELECT id FROM public.disciplinas WHERE nome='Conhecimentos Pedagógicos' AND concurso_id=v_seeduc_id);
  v_seeduc_eca := (SELECT id FROM public.disciplinas WHERE nome='Estatuto da Criança e do Adolescente' AND concurso_id=v_seeduc_id);
  v_stj_dc := (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=v_stj_id);
  v_stj_dadm := (SELECT id FROM public.disciplinas WHERE nome='Direito Administrativo' AND concurso_id=v_stj_id);
  v_stj_reg := (SELECT id FROM public.disciplinas WHERE nome='Regimento Interno STJ' AND concurso_id=v_stj_id);
  v_mpu_dc := (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=v_mpu_id);
  v_mpu_lp := (SELECT id FROM public.disciplinas WHERE nome='Língua Portuguesa' AND concurso_id=v_mpu_id);
  v_bb_lp := (SELECT id FROM public.disciplinas WHERE nome='Língua Portuguesa' AND concurso_id=v_bb_id);
  v_bb_mat := (SELECT id FROM public.disciplinas WHERE nome='Matemática' AND concurso_id=v_bb_id);
  v_bb_cb := (SELECT id FROM public.disciplinas WHERE nome='Conhecimentos Bancários' AND concurso_id=v_bb_id);
  v_bb_info := (SELECT id FROM public.disciplinas WHERE nome='Noções de Informática' AND concurso_id=v_bb_id);
  v_caixa_lp := (SELECT id FROM public.disciplinas WHERE nome='Língua Portuguesa' AND concurso_id=v_caixa_id);
  v_caixa_cb := (SELECT id FROM public.disciplinas WHERE nome='Conhecimentos Bancários' AND concurso_id=v_caixa_id);
  v_correios_lp := (SELECT id FROM public.disciplinas WHERE nome='Língua Portuguesa' AND concurso_id=v_correios_id);
  v_correios_mat := (SELECT id FROM public.disciplinas WHERE nome='Matemática' AND concurso_id=v_correios_id);
  v_correios_conduta := (SELECT id FROM public.disciplinas WHERE nome='Código de Conduta Ética' AND concurso_id=v_correios_id);
  v_pmsp_dp := (SELECT id FROM public.disciplinas WHERE nome='Direito Penal' AND concurso_id=v_pmsp_id);
  v_pmsp_dpm := (SELECT id FROM public.disciplinas WHERE nome='Direito Penal Militar' AND concurso_id=v_pmsp_id);
  v_pcsp_dc := (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=v_pcsp_id);
  v_pcsp_crim := (SELECT id FROM public.disciplinas WHERE nome='Criminologia' AND concurso_id=v_pcsp_id);
  v_trt4_dadm := (SELECT id FROM public.disciplinas WHERE nome='Direito Administrativo' AND concurso_id=v_trt4_id);
  v_trt4_dpt := (SELECT id FROM public.disciplinas WHERE nome='Direito Processual do Trabalho' AND concurso_id=v_trt4_id);
  v_tjsp_dadm := (SELECT id FROM public.disciplinas WHERE nome='Direito Administrativo' AND concurso_id=v_tjsp_id);
  v_tjsp_dpciv := (SELECT id FROM public.disciplinas WHERE nome='Direito Processual Civil' AND concurso_id=v_tjsp_id);
  v_inss_dc := (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=v_inss_id);
  v_inss_dadm := (SELECT id FROM public.disciplinas WHERE nome='Direito Administrativo' AND concurso_id=v_inss_id);
  v_sefazsp_dadm := (SELECT id FROM public.disciplinas WHERE nome='Direito Administrativo' AND concurso_id=v_sefazsp_id);
  v_sefazsp_econ := (SELECT id FROM public.disciplinas WHERE nome='Economia' AND concurso_id=v_sefazsp_id);

  -- PM RJ - Direito Penal
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'O crime de furto, na sua forma simples, tem pena prevista de reclusão de 1 a 4 anos. Assinale a alternativa que apresenta causa de aumento de pena no crime de furto:',
    '[{"key":"A","text":"Se o agente é primário."},{"key":"B","text":"Se o crime é praticado durante o repouso noturno."},{"key":"C","text":"Se a vítima é maior de 60 anos."},{"key":"D","text":"Se o agente confessa espontaneamente."},{"key":"E","text":"Se há arrependimento posterior."}]',
    'B', 'Art. 155, § 1º, CP: o furto praticado durante o repouso noturno tem causa de aumento de pena. As demais alternativas são circunstâncias atenuantes ou benéficas.',
    v_cesgranrio, v_pmrj_id, v_pmrj_dp, 2025, 'medio'
  );
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'São direitos humanos previstos na Declaração Universal dos Direitos Humanos, EXCETO:',
    '[{"key":"A","text":"Direito à vida, liberdade e segurança pessoal."},{"key":"B","text":"Direito à propriedade."},{"key":"C","text":"Direito ao voto obrigatório."},{"key":"D","text":"Direito à liberdade de pensamento."},{"key":"E","text":"Direito ao trabalho e à educação."}]',
    'C', 'A DUDH prevê o direito de participação política, mas não estabelece o voto obrigatório. No Brasil, o voto obrigatório é previsão constitucional (art. 14, CF).',
    v_cesgranrio, v_pmrj_id, v_pmrj_dh, 2026, 'medio'
  );

  -- Polícia Penal Federal
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'A Lei de Execução Penal (Lei 7.210/84) estabelece que os condenados serão classificados segundo os seus antecedentes e personalidade para orientar a individualização da execução penal. Essa classificação é feita por:',
    '[{"key":"A","text":"Comissão Técnica de Classificação."},{"key":"B","text":"Juiz da execução penal."},{"key":"C","text":"Diretor do presídio."},{"key":"D","text":"Ministério Público."},{"key":"E","text":"Conselho Penitenciário."}]',
    'A', 'Art. 6º da LEP: a classificação dos condenados será feita pela Comissão Técnica de Classificação (CTC), que elabora o programa individualizador da execução.',
    v_cebraspe, v_ppenal_id, v_ppenal_lep, 2025, 'medio'
  );
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'De acordo com o Código Penal, o funcionário público que exige, para si ou para outrem, direta ou indiretamente, ainda que fora da função ou antes de assumi-la, mas em razão dela, vantagem indevida, comete o crime de:',
    '[{"key":"A","text":"Peculato."},{"key":"B","text":"Concussão."},{"key":"C","text":"Corrupção passiva."},{"key":"D","text":"Prevaricação."},{"key":"E","text":"Advocacia administrativa."}]',
    'B', 'A concussão (art. 316, CP) consiste em exigir vantagem indevida em razão da função. Difere da corrupção passiva (art. 317, CP) que é solicitar ou receber.',
    v_cebraspe, v_ppenal_id, v_ppenal_dp, 2024, 'medio'
  );

  -- TRT 6
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'É considerado empregado doméstico aquele que presta serviços de forma contínua, subordinada, onerosa e pessoal a uma família. Assinale a alternativa correta sobre os direitos do empregado doméstico:',
    '[{"key":"A","text":"Não tem direito a FGTS."},{"key":"B","text":"Tem direito a salário mínimo e décimo terceiro."},{"key":"C","text":"A jornada máxima é de 8 horas sem direito a horas extras."},{"key":"D","text":"Não possui direito a férias remuneradas."},{"key":"E","text":"O contrato pode ser verbal sem qualquer formalidade."}]',
    'B', 'A LC 150/2015 garante ao empregado doméstico salário mínimo, décimo terceiro, FGTS obrigatório, férias e controle de jornada com horas extras.',
    v_fgv, v_trt6_id, v_trt6_dt, 2025, 'medio'
  );

  -- TJ RJ
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'No Direito Civil, a prescrição interrompe-se quando:',
    '[{"key":"A","text":"O devedor reconhece a dívida por escrito."},{"key":"B","text":"O credor falece e abre inventário."},{"key":"C","text":"O prazo prescricional chega à metade."},{"key":"D","text":"O devedor se ausenta do país."},{"key":"E","text":"O credor muda de domicílio."}]',
    'A', 'Art. 202, VI, CC: a prescrição interrompe-se pelo reconhecimento da dívida pelo devedor. As demais hipóteses estão no art. 202, I a VI.',
    v_fgv, v_tjrj_id, v_tjrj_dciv, 2024, 'medio'
  );

  -- SEFAZ RJ
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'O ICMS incide sobre operações relativas à circulação de mercadorias. Assinale a alternativa correta sobre a não incidência do ICMS:',
    '[{"key":"A","text":"Operações com livros e jornais."},{"key":"B","text":"Exportação de mercadorias para o exterior."},{"key":"C","text":"Operações com energia elétrica."},{"key":"D","text":"Prestação de serviços de transporte interestadual."},{"key":"E","text":"Circulação de mercadorias entre estabelecimentos do mesmo titular."}]',
    'B', 'A CF/88 (art. 155, § 2º, X, "a") estabelece a não incidência do ICMS sobre operações de exportação. A imunidade de livros é do IPI, não do ICMS.',
    v_cebraspe, v_sefazrj_id, v_sefazrj_dt, 2024, 'superior'
  );
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'No Balanço Patrimonial, o Ativo Circulante compreende:',
    '[{"key":"A","text":"Bens e direitos realizáveis até o final do exercício seguinte."},{"key":"B","text":"Obrigações de curto prazo."},{"key":"C","text":"Investimentos permanentes em outras empresas."},{"key":"D","text":"Bens de uso da entidade."},{"key":"E","text":"O patrimônio líquido da empresa."}]',
    'A', 'O Ativo Circulante inclui bens e direitos realizáveis no curso do exercício social subsequente (Lei 6.404/76, art. 179, I).',
    v_cebraspe, v_sefazrj_id, v_sefazrj_cg, 2025, 'superior'
  );

  -- ISS SP
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'O ISS é um tributo municipal. Assinale a alternativa que indica corretamente sua base de cálculo:',
    '[{"key":"A","text":"O valor da mercadoria vendida."},{"key":"B","text":"O preço do serviço prestado."},{"key":"C","text":"A receita bruta da empresa."},{"key":"D","text":"O lucro operacional."},{"key":"E","text":"O faturamento mensal."}]',
    'B', 'O ISS incide sobre o preço do serviço prestado (LC 116/2003, art. 7º). A base de cálculo é o valor total do serviço, sem deduções.',
    v_fcc, v_iss_id, v_iss_dt, 2026, 'superior'
  );

  -- IBGE
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'Em uma pesquisa, o IBGE coleta dados sobre a população brasileira. O tipo de variável que representa a cor da pele dos entrevistados é classificada como:',
    '[{"key":"A","text":"Quantitativa discreta."},{"key":"B","text":"Quantitativa contínua."},{"key":"C","text":"Qualitativa ordinal."},{"key":"D","text":"Qualitativa nominal."},{"key":"E","text":"Qualitativa binária."}]',
    'D', 'Cor da pele é uma variável qualitativa nominal, pois representa categorias sem ordem natural (branco, preto, pardo, amarelo, indígena).',
    v_aocp, v_ibge_id, v_ibge_mat, 2025, 'fundamental'
  );
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'A Região Norte do Brasil é caracterizada por:',
    '[{"key":"A","text":"Predomínio do clima semiárido."},{"key":"B","text":"Maior densidade demográfica do país."},{"key":"C","text":"Presença da Floresta Amazônica e da Bacia Hidrográfica Amazônica."},{"key":"D","text":"Economia baseada exclusivamente na agropecuária."},{"key":"E","text":"Relevo predominantemente planáltico e seco."}]',
    'C', 'A Região Norte é dominada pela Floresta Amazônica e pela Bacia Amazônica, a maior bacia hidrográfica do mundo.',
    v_aocp, v_ibge_id, v_ibge_geo, 2024, 'fundamental'
  );

  -- Câmara dos Deputados
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'O processo legislativo, conforme a Constituição Federal, compreende a elaboração de:',
    '[{"key":"A","text":"Apenas leis ordinárias e complementares."},{"key":"B","text":"Emendas à Constituição, leis complementares, leis ordinárias, delegadas e medidas provisórias."},{"key":"C","text":"Apenas medidas provisórias e decretos legislativos."},{"key":"D","text":"Leis ordinárias e resoluções do Senado."},{"key":"E","text":"Emendas constitucionais e tratados internacionais."}]',
    'B', 'Art. 59, CF/88: o processo legislativo inclui PEC, LC, LO, LD, MP, DL e Resoluções.',
    v_fgv, v_camara_id, v_camara_dc, 2025, 'superior'
  );

  -- BACEN
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'A taxa Selic é definida como:',
    '[{"key":"A","text":"A taxa de juros cobrada nos empréstimos bancários."},{"key":"B","text":"A taxa média dos juros praticados no mercado interbancário."},{"key":"C","text":"O índice de inflação oficial do Brasil."},{"key":"D","text":"A taxa de câmbio do dólar comercial."},{"key":"E","text":"O rendimento da poupança."}]',
    'B', 'A Selic é a taxa média ajustada dos financiamentos diários no mercado interbancário (Sistema Especial de Liquidação e Custódia), servindo como taxa básica de juros.',
    v_cesgranrio, v_bacen_id, v_bacen_fin, 2025, 'superior'
  );
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'Um capital de R$ 1.000,00 aplicado a juros compostos de 10% ao ano por 2 anos produz qual montante?',
    '[{"key":"A","text":"R$ 1.200,00"},{"key":"B","text":"R$ 1.210,00"},{"key":"C","text":"R$ 1.100,00"},{"key":"D","text":"R$ 1.210,00"},{"key":"E","text":"R$ 1.200,00"}]',
    'B', 'M = C × (1+i)^n = 1000 × (1,10)^2 = 1000 × 1,21 = R$ 1.210,00.',
    v_cesgranrio, v_bacen_id, v_bacen_mf, 2024, 'superior'
  );

  -- SUS
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'A Lei 8.080/90 dispõe sobre o Sistema Único de Saúde. Assinale a alternativa que apresenta um princípio doutrinário do SUS:',
    '[{"key":"A","text":"Centralização administrativa."},{"key":"B","text":"Universalidade de acesso."},{"key":"C","text":"Privatização dos serviços."},{"key":"D","text":"Cobrança por procedimentos."},{"key":"E","text":"Gestão estadual exclusiva."}]',
    'B', 'A universalidade é um dos princípios doutrinários do SUS (art. 7º, I, Lei 8.080/90): acesso universal e igualitário às ações e serviços de saúde.',
    v_vunesp, v_sus_id, v_sus_lei, 2025, 'superior'
  );

  -- SEEDUC RJ
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'O Estatuto da Criança e do Adolescente (Lei 8.069/90) garante à criança e ao adolescente o direito à educação. Assinale a alternativa que NÃO corresponde a uma diretriz do ECA:',
    '[{"key":"A","text":"Igualdade de condições para acesso e permanência na escola."},{"key":"B","text":"Direito de ser respeitado por seus educadores."},{"key":"C","text":"Ensino fundamental obrigatório e gratuito."},{"key":"D","text":"Trabalho noturno a partir de 14 anos."},{"key":"E","text":"Acesso à escola próxima à residência."}]',
    'D', 'O ECA proíbe o trabalho noturno, insalubre ou perigoso a menores de 18 anos. O trabalho é permitido a partir de 14 anos apenas na condição de aprendiz (art. 60 e 67, ECA).',
    v_cesgranrio, v_seeduc_id, v_seeduc_eca, 2025, 'superior'
  );

  -- STJ
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'Compete ao Superior Tribunal de Justiça processar e julgar, originariamente:',
    '[{"key":"A","text":"Ação direta de inconstitucionalidade de lei federal."},{"key":"B","text":"Recurso ordinário contra decisão de Tribunal Regional Federal."},{"key":"C","text":"Habeas corpus contra ato de Ministros de Estado."},{"key":"D","text":"Extradição solicitada por Estado estrangeiro."},{"key":"E","text":"Mandado de segurança contra ato do Presidente da República."}]',
    'C', 'Art. 105, I, "c", CF/88: compete ao STJ julgar HC contra ato de Ministros de Estado. A ADI é do STF. Extradição é do STF. MS contra Presidente é do STF.',
    v_cebraspe, v_stj_id, v_stj_dc, 2026, 'superior'
  );

  -- MPU
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'O Ministério Público é instituição permanente, essencial à função jurisdicional do Estado. Suas funções incluem:',
    '[{"key":"A","text":"Representar a União judicialmente."},{"key":"B","text":"Promover a ação penal pública."},{"key":"C","text":"Defender os interesses do governo."},{"key":"D","text":"Executar as penas criminais."},{"key":"E","text":"Julgar ações penais."}]',
    'B', 'Art. 129, I, CF/88: é função institucional do MP promover, privativamente, a ação penal pública.',
    v_fgv, v_mpu_id, v_mpu_dc, 2026, 'medio'
  );

  -- Banco do Brasil
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'No Microsoft Excel, a função =SE(A1>10;"Aprovado";"Reprovado") retorna:',
    '[{"key":"A","text":"Aprovado se o valor em A1 for maior que 10."},{"key":"B","text":"Reprovado se o valor em A1 for maior que 10."},{"key":"C","text":"Sempre Aprovado, independente do valor."},{"key":"D","text":"Um erro se A1 for negativo."},{"key":"E","text":"O valor de A1 multiplicado por 10."}]',
    'A', 'A função SE testa uma condição lógica. Se verdadeira, retorna o primeiro valor; se falsa, o segundo. =SE(A1>10;"Aprovado";"Reprovado") retorna Aprovado quando A1 > 10.',
    v_cesgranrio, v_bb_id, v_bb_info, 2025, 'medio'
  );
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'O spread bancário representa:',
    '[{"key":"A","text":"A diferença entre a taxa de captação e a taxa de empréstimo do banco."},{"key":"B","text":"O valor total de impostos pagos pelo banco."},{"key":"C","text":"A taxa de juros cobrada pelo Banco Central."},{"key":"D","text":"O lucro líquido do banco dividido pelo patrimônio."},{"key":"E","text":"O índice de inadimplência da carteira de crédito."}]',
    'A', 'O spread bancário é a diferença entre o custo de captação dos recursos e a taxa de juros cobrada nos empréstimos, representando a margem do banco.',
    v_cesgranrio, v_bb_id, v_bb_cb, 2026, 'medio'
  );

  -- Caixa
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'O FGTS é um direito dos trabalhadores brasileiros. Assinale a alternativa correta sobre o FGTS:',
    '[{"key":"A","text":"O empregador deposita 10% do salário em conta vinculada."},{"key":"B","text":"O saque é permitido apenas na demissão sem justa causa."},{"key":"C","text":"O valor depositado rende juros de 3% ao ano mais TR."},{"key":"D","text":"O FGTS substitui o décimo terceiro salário."},{"key":"E","text":"O saque pode ser feito a qualquer momento pelo trabalhador."}]',
    'C', 'O FGTS rende 3% ao ano mais TR. O depósito mensal é de 8% (não 10%). Pode ser sacado em diversas hipóteses (demissão, casa própria, aposentadoria, etc.).',
    v_cesgranrio, v_caixa_id, v_caixa_cb, 2025, 'medio'
  );

  -- Correios
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'Um carteiro percorre 6 km por dia. Se ele trabalha 22 dias por mês, quantos quilômetros percorre em um mês?',
    '[{"key":"A","text":"120 km"},{"key":"B","text":"132 km"},{"key":"C","text":"150 km"},{"key":"D","text":"110 km"},{"key":"E","text":"144 km"}]',
    'B', '6 km/dia × 22 dias/mês = 132 km/mês.',
    v_ibfc, v_correios_id, v_correios_mat, 2025, 'fundamental'
  );
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'De acordo com o Código de Conduta Ética dos Correios, é dever do empregado:',
    '[{"key":"A","text":"Utilizar recursos da empresa para fins pessoais."},{"key":"B","text":"Manter sigilo das informações a que tiver acesso."},{"key":"C","text":"Divulgar dados de clientes para terceiros."},{"key":"D","text":"Aceitar presentes de fornecedores."},{"key":"E","text":"Compartilhar senhas de acesso com colegas."}]',
    'B', 'O sigilo das informações é dever fundamental do empregado público. As demais alternativas violam princípios éticos da administração pública.',
    v_ibfc, v_correios_id, v_correios_conduta, 2025, 'fundamental'
  );

  -- PM SP - extra (+2)
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'No Direito Penal Militar, o crime de deserção ocorre quando o militar:',
    '[{"key":"A","text":"Falta ao serviço por mais de 8 dias consecutivos."},{"key":"B","text":"Danifica equipamento militar por negligência."},{"key":"C","text":"Desrespeita superior hierárquico."},{"key":"D","text":"Embriaga-se durante o serviço."},{"key":"E","text":"Revela segredo militar."}]',
    'A', 'Art. 187, CPM: a deserção consiste em o militar faltar ao serviço por mais de 8 dias consecutivos.',
    v_vunesp, v_pmsp_id, v_pmsp_dpm, 2024, 'medio'
  );
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'O princípio da reserva legal no Direito Penal significa que:',
    '[{"key":"A","text":"O juiz pode criar crimes por analogia."},{"key":"B","text":"Não há crime sem lei anterior que o defina."},{"key":"C","text":"A lei penal pode retroagir sempre."},{"key":"D","text":"O costume pode criar tipos penais."},{"key":"E","text":"A doutrina pode definir condutas criminosas."}]',
    'B', 'Art. 1º, CP: "Não há crime sem lei anterior que o defina. Não há pena sem prévia cominação legal." É o princípio da legalidade/reserva legal.',
    v_vunesp, v_pmsp_id, v_pmsp_dp, 2026, 'medio'
  );

  -- PC SP - extra (+2)
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'A Constituição Federal, em seu art. 144, estabelece que a segurança pública é dever do Estado. A Polícia Civil exerce função de:',
    '[{"key":"A","text":"Polícia ostensiva e preventiva."},{"key":"B","text":"Polícia judiciária e apuração de infrações penais."},{"key":"C","text":"Controle do trânsito urbano."},{"key":"D","text":"Fiscalização de tributos estaduais."},{"key":"E","text":"Defesa civil emergencial."}]',
    'B', 'Art. 144, § 4º, CF/88: à Polícia Civil incumbe a função de polícia judiciária e a apuração de infrações penais, exceto as militares.',
    v_vunesp, v_pcsp_id, v_pcsp_dc, 2025, 'superior'
  );
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'A criminologia como ciência empírica e interdisciplinar tem como objeto de estudo:',
    '[{"key":"A","text":"O crime como fenômeno jurídico-formal."},{"key":"B","text":"O criminoso, a vítima, o controle social e o delito."},{"key":"C","text":"Exclusivamente a pena privativa de liberdade."},{"key":"D","text":"A organização judiciária e processual."},{"key":"E","text":"A dogmática penal e suas normas."}]',
    'B', 'A criminologia estuda o crime, o criminoso, a vítima e o controle social, utilizando método empírico e interdisciplinar (sociologia, psicologia, direito).',
    v_vunesp, v_pcsp_id, v_pcsp_crim, 2024, 'superior'
  );

  -- TRT 4 - extra (+2)
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'O ato administrativo discricionário caracteriza-se por:',
    '[{"key":"A","text":"Não estar sujeito a controle judicial."},{"key":"B","text":"Permitir margem de escolha ao administrador quanto ao mérito."},{"key":"C","text":"Ser vinculado em todos os seus requisitos."},{"key":"D","text":"Dispensar a motivação."},{"key":"E","text":"Poder ser praticado por qualquer agente público."}]',
    'B', 'O ato discricionário permite ao administrador certa liberdade de escolha quanto à conveniência e oportunidade (mérito administrativo), dentro dos limites legais.',
    v_fcc, v_trt4_id, v_trt4_dadm, 2025, 'superior'
  );
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'Na execução trabalhista, o prazo para o empregado ajuizar a ação de execução após o trânsito em julgado da sentença é de:',
    '[{"key":"A","text":"1 ano."},{"key":"B","text":"2 anos."},{"key":"C","text":"5 anos."},{"key":"D","text":"10 anos."},{"key":"E","text":"30 dias."}]',
    'B', 'Art. 11-A, CLT: o prazo prescricional para a execução trabalhista é de 2 anos contados do trânsito em julgado da sentença.',
    v_fcc, v_trt4_id, v_trt4_dpt, 2024, 'superior'
  );

  -- TJ SP - extra (+2)
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'A administração pública pode revogar seus próprios atos quando:',
    '[{"key":"A","text":"Eles forem ilegais."},{"key":"B","text":"A conveniência e oportunidade assim recomendarem."},{"key":"C","text":"Houver erro material na redação."},{"key":"D","text":"O interessado solicitar."},{"key":"E","text":"Houver recurso administrativo pendente."}]',
    'B', 'A revogação é o desfazimento de ato válido e eficaz por razões de conveniência e oportunidade (mérito administrativo). Atos ilegais são anulados.',
    v_vunesp, v_tjsp_id, v_tjsp_dadm, 2024, 'medio'
  );
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'No Processo Civil, o juiz pode conceder tutela provisória de urgência quando:',
    '[{"key":"A","text":"Houver apenas periculum in mora."},{"key":"B","text":"Estiverem presentes elementos que evidenciem a probabilidade do direito e o perigo de dano."},{"key":"C","text":"A parte requerer sem qualquer prova."},{"key":"D","text":"O processo já estiver em fase de execução."},{"key":"E","text":"Houver sentença transitada em julgado."}]',
    'B', 'Art. 300, CPC: a tutela de urgência será concedida quando houver elementos que evidenciem a probabilidade do direito e o perigo de dano ou risco ao resultado útil do processo.',
    v_vunesp, v_tjsp_id, v_tjsp_dpciv, 2025, 'medio'
  );

  -- INSS - extra (+2)
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'São direitos fundamentais previstos no art. 5º da Constituição Federal, EXCETO:',
    '[{"key":"A","text":"Direito à vida."},{"key":"B","text":"Direito à liberdade de expressão."},{"key":"C","text":"Direito ao salário mínimo."},{"key":"D","text":"Direito de propriedade."},{"key":"E","text":"Direito de reunião pacífica."}]',
    'C', 'O direito ao salário mínimo é um direito social (art. 7º, IV, CF), não um direito fundamental individual do art. 5º.',
    v_cesgranrio, v_inss_id, v_inss_dc, 2025, 'medio'
  );
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'O princípio da impessoalidade na Administração Pública significa que:',
    '[{"key":"A","text":"O administrador pode agir conforme sua vontade pessoal."},{"key":"B","text":"Os atos administrativos devem visar ao interesse público, não a interesses pessoais."},{"key":"C","text":"O agente público responde pessoalmente por todos os atos."},{"key":"D","text":"A administração pode tratar os administrados de forma desigual."},{"key":"E","text":"Os bens públicos são de propriedade do governante."}]',
    'B', 'O princípio da impessoalidade (art. 37, CF) exige que a Administração atue sem favorecimentos ou perseguições, sempre visando ao interesse público.',
    v_cesgranrio, v_inss_id, v_inss_dadm, 2024, 'medio'
  );

  -- SEFAZ SP - extra (+2)
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'O poder de polícia da Administração Tributária manifesta-se por meio:',
    '[{"key":"A","text":"Da edição de leis tributárias."},{"key":"B","text":"Da fiscalização e lançamento de tributos."},{"key":"C","text":"Do julgamento de processos administrativos fiscais."},{"key":"D","text":"Da cobrança judicial da dívida ativa."},{"key":"E","text":"Da declaração de inconstitucionalidade de normas."}]',
    'B', 'O poder de polícia fiscal materializa-se na fiscalização e no lançamento tributário (CTN, art. 142), atividades administrativas vinculadas.',
    v_fgv, v_sefazsp_id, v_sefazsp_dadm, 2024, 'superior'
  );
  INSERT INTO public.questoes (enunciado, alternativas, correta, explicacao, banca_id, concurso_id, disciplina_id, ano, nivel) VALUES
  (
    'Em economia, o Produto Interno Bruto (PIB) de um país representa:',
    '[{"key":"A","text":"A soma de todas as exportações do país."},{"key":"B","text":"O valor total de todos os bens e serviços finais produzidos."},{"key":"C","text":"A renda per capita da população."},{"key":"D","text":"O total de impostos arrecadados."},{"key":"E","text":"O saldo da balança comercial."}]',
    'B', 'O PIB é a medida do valor agregado de todos os bens e serviços finais produzidos dentro do território do país em um determinado período.',
    v_fgv, v_sefazsp_id, v_sefazsp_econ, 2025, 'superior'
  );
END $$;

-- =====================================================
-- PDFs ADICIONAIS
-- =====================================================

DO $$
DECLARE
  v_pmrj_id uuid; v_pmrj_dc_id uuid; v_pmrj_dp_id uuid;
  v_ppenal_id uuid; v_ppenal_dc_id uuid; v_ppenal_dpp_id uuid;
  v_trt6_id uuid; v_trt6_dadm_id uuid; v_trt6_dt_id uuid;
  v_tjrj_id uuid; v_tjrj_dciv_id uuid; v_tjrj_dadm_id uuid;
  v_sefazrj_id uuid; v_sefazrj_dt_id uuid;
  v_iss_id uuid; v_iss_dt_id uuid; v_iss_cg_id uuid;
  v_ibge_id uuid; v_ibge_lp_id uuid; v_ibge_mat_id uuid;
  v_camara_id uuid; v_camara_lp_id uuid; v_camara_dadm_id uuid;
  v_bacen_id uuid; v_bacen_econ_id uuid; v_bacen_mf_id uuid;
  v_sus_id uuid; v_sus_lei_id uuid;
  v_seeduc_id uuid; v_seeduc_cped_id uuid;
  v_tjsp_id uuid; v_tjsp_dciv_id uuid;
  v_stj_id uuid; v_stj_dc_id uuid; v_stj_dadm_id uuid;
  v_mpu_id uuid; v_mpu_dc_id uuid; v_mpu_lp_id uuid;
  v_bb_id uuid; v_bb_lp_id uuid; v_bb_cb_id uuid;
  v_caixa_id uuid; v_caixa_lp_id uuid; v_caixa_cb_id uuid;
  v_correios_id uuid; v_correios_lp_id uuid; v_correios_mat_id uuid;
BEGIN
  v_pmrj_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'PM RJ%');
  v_pmrj_dc_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=v_pmrj_id);
  v_pmrj_dp_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Penal' AND concurso_id=v_pmrj_id);
  v_ppenal_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Penal%');
  v_ppenal_dc_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=v_ppenal_id);
  v_ppenal_dpp_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Processual Penal' AND concurso_id=v_ppenal_id);
  v_trt6_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 6%');
  v_trt6_dadm_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Administrativo' AND concurso_id=v_trt6_id);
  v_trt6_dt_id := (SELECT id FROM public.disciplinas WHERE nome='Direito do Trabalho' AND concurso_id=v_trt6_id);
  v_tjrj_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'TJ RJ%');
  v_tjrj_dciv_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Civil' AND concurso_id=v_tjrj_id);
  v_tjrj_dadm_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Administrativo' AND concurso_id=v_tjrj_id);
  v_sefazrj_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'SEFAZ RJ%');
  v_sefazrj_dt_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Tributário' AND concurso_id=v_sefazrj_id);
  v_iss_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'ISS SP%');
  v_iss_dt_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Tributário' AND concurso_id=v_iss_id);
  v_iss_cg_id := (SELECT id FROM public.disciplinas WHERE nome='Contabilidade Geral' AND concurso_id=v_iss_id);
  v_ibge_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'IBGE%');
  v_ibge_lp_id := (SELECT id FROM public.disciplinas WHERE nome='Língua Portuguesa' AND concurso_id=v_ibge_id);
  v_ibge_mat_id := (SELECT id FROM public.disciplinas WHERE nome='Matemática' AND concurso_id=v_ibge_id);
  v_camara_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'Câmara%');
  v_camara_lp_id := (SELECT id FROM public.disciplinas WHERE nome='Língua Portuguesa' AND concurso_id=v_camara_id);
  v_camara_dadm_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Administrativo' AND concurso_id=v_camara_id);
  v_bacen_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'BACEN%');
  v_bacen_econ_id := (SELECT id FROM public.disciplinas WHERE nome='Economia' AND concurso_id=v_bacen_id);
  v_bacen_mf_id := (SELECT id FROM public.disciplinas WHERE nome='Matemática Financeira' AND concurso_id=v_bacen_id);
  v_sus_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'SUS%');
  v_sus_lei_id := (SELECT id FROM public.disciplinas WHERE nome='SUS - Lei 8.080/90' AND concurso_id=v_sus_id);
  v_seeduc_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'SEEDUC%');
  v_seeduc_cped_id := (SELECT id FROM public.disciplinas WHERE nome='Conhecimentos Pedagógicos' AND concurso_id=v_seeduc_id);
  v_tjsp_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'TJ SP%');
  v_tjsp_dciv_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Civil' AND concurso_id=v_tjsp_id);
  v_stj_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'STJ%');
  v_stj_dc_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=v_stj_id);
  v_stj_dadm_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Administrativo' AND concurso_id=v_stj_id);
  v_mpu_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'MPU%');
  v_mpu_dc_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=v_mpu_id);
  v_mpu_lp_id := (SELECT id FROM public.disciplinas WHERE nome='Língua Portuguesa' AND concurso_id=v_mpu_id);
  v_bb_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'Banco do Brasil%');
  v_bb_lp_id := (SELECT id FROM public.disciplinas WHERE nome='Língua Portuguesa' AND concurso_id=v_bb_id);
  v_bb_cb_id := (SELECT id FROM public.disciplinas WHERE nome='Conhecimentos Bancários' AND concurso_id=v_bb_id);
  v_caixa_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'Caixa%');
  v_caixa_lp_id := (SELECT id FROM public.disciplinas WHERE nome='Língua Portuguesa' AND concurso_id=v_caixa_id);
  v_caixa_cb_id := (SELECT id FROM public.disciplinas WHERE nome='Conhecimentos Bancários' AND concurso_id=v_caixa_id);
  v_correios_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'Correios%');
  v_correios_lp_id := (SELECT id FROM public.disciplinas WHERE nome='Língua Portuguesa' AND concurso_id=v_correios_id);
  v_correios_mat_id := (SELECT id FROM public.disciplinas WHERE nome='Matemática' AND concurso_id=v_correios_id);

  INSERT INTO public.pdfs (titulo, tipo, concurso_id, disciplina_id, descricao, url, size_or_duration) VALUES
  -- PM RJ
  (
    'Resumo: Direito Constitucional para PM RJ', 'Resumo',
    v_pmrj_id, v_pmrj_dc_id,
    'Princípios fundamentais, direitos e garantias, organização do Estado. Cesgranrio.',
    '#', '1.6 MB • 10 págs'
  ),
  (
    'Lei Seca: Código Penal - Crimes contra a Pessoa', 'Lei Seca',
    v_pmrj_id, v_pmrj_dp_id,
    'Arts. 121 a 154 do CP com anotações esquematizadas para PM RJ.',
    '#', '2.8 MB • 22 págs'
  ),
  -- Polícia Penal Federal
  (
    'PDF: Lei de Execução Penal Comentada', 'PDF',
    v_ppenal_id, v_ppenal_dpp_id,
    'Arts. 1º a 204 da LEP com jurisprudência e súmulas do STJ.',
    '#', '3.5 MB • 30 págs'
  ),
  (
    'Resumo: Direito Constitucional para Polícia Penal', 'Resumo',
    v_ppenal_id, v_ppenal_dc_id,
    'Controle de constitucionalidade e direitos fundamentais para concursos penitenciários.',
    '#', '1.4 MB • 8 págs'
  ),
  -- TRT 6
  (
    'Áudio-Aula: Direito do Trabalho para TRT', 'Audio',
    v_trt6_id, v_trt6_dt_id,
    'Narração completa dos princípios do Direito do Trabalho e CLT.',
    '#', '22 min • MP3'
  ),
  (
    'Resumo: Direito Administrativo para TRT', 'Resumo',
    v_trt6_id, v_trt6_dadm_id,
    'Atos administrativos, licitações e servidores públicos. FCC/FGV.',
    '#', '1.2 MB • 8 págs'
  ),
  -- TJ RJ
  (
    'PDF: Direito Civil para TJ RJ', 'PDF',
    v_tjrj_id, v_tjrj_dciv_id,
    'Obrigações, contratos e responsabilidade civil. Teoria e questões FGV.',
    '#', '4.2 MB • 35 págs'
  ),
  (
    'Resumo: Direito Administrativo para TJ RJ', 'Resumo',
    v_tjrj_id, v_tjrj_dadm_id,
    'Poderes administrativos, atos e processo administrativo.',
    '#', '1.5 MB • 10 págs'
  ),
  -- SEFAZ RJ
  (
    'PDF: Direito Tributário para SEFAZ RJ', 'PDF',
    v_sefazrj_id, v_sefazrj_dt_id,
    'Competência tributária, impostos estaduais e fiscais. Cebraspe.',
    '#', '4.8 MB • 38 págs'
  ),
  -- ISS SP
  (
    'Guia: ISS para Auditor Fiscal', 'PDF',
    v_iss_id, v_iss_dt_id,
    'LC 116/2003 comentada, lista de serviços e base de cálculo.',
    '#', '3.2 MB • 25 págs'
  ),
  (
    'Áudio-Aula: Contabilidade para ISS', 'Audio',
    v_iss_id, v_iss_cg_id,
    'Princípios contábeis, balanço patrimonial e DRE para concursos fiscais.',
    '#', '20 min • MP3'
  ),
  -- IBGE
  (
    'Resumo: Matemática para IBGE', 'Resumo',
    v_ibge_id, v_ibge_mat_id,
    'Porcentagem, regra de três, média, gráficos e tabelas.',
    '#', '1.0 MB • 6 págs'
  ),
  (
    'PDF: Língua Portuguesa para IBGE', 'PDF',
    v_ibge_id, v_ibge_lp_id,
    'Interpretação de texto, ortografia e concordância.',
    '#', '1.2 MB • 8 págs'
  ),
  -- Câmara dos Deputados
  (
    'Lei Seca: Regimento Interno da Câmara', 'Lei Seca',
    v_camara_id, v_camara_dadm_id,
    'Principais artigos do RICD com anotações para concurso.',
    '#', '3.0 MB • 20 págs'
  ),
  (
    'Resumo: Português para Câmara', 'Resumo',
    v_camara_id, v_camara_lp_id,
    'Crase, regência, concordância e redação oficial.',
    '#', '1.3 MB • 8 págs'
  ),
  -- BACEN
  (
    'PDF: Economia e Finanças para BACEN', 'PDF',
    v_bacen_id, v_bacen_econ_id,
    'Macroeconomia, microeconomia, sistema financeiro nacional e mercado de capitais.',
    '#', '5.5 MB • 45 págs'
  ),
  (
    'Áudio-Aula: Matemática Financeira', 'Audio',
    v_bacen_id, v_bacen_mf_id,
    'Juros compostos, descontos, fluxo de caixa e séries de pagamentos.',
    '#', '28 min • MP3'
  ),
  -- SUS
  (
    'PDF: Lei 8.080/90 para SUS', 'PDF',
    v_sus_id, v_sus_lei_id,
    'Sistema Único de Saúde completo: princípios, diretrizes e organização.',
    '#', '2.5 MB • 18 págs'
  ),
  -- SEEDUC RJ
  (
    'Resumo: Conhecimentos Pedagógicos', 'Resumo',
    v_seeduc_id, v_seeduc_cped_id,
    'Teorias de aprendizagem, didática, LDB e planejamento educacional.',
    '#', '2.0 MB • 14 págs'
  ),
  -- TJ SP
  (
    'PDF: Direito Civil para TJ SP', 'PDF',
    v_tjsp_id, v_tjsp_dciv_id,
    'Parte geral, obrigações, contratos e responsabilidade civil. Vunesp.',
    '#', '4.0 MB • 32 págs'
  ),
  -- STJ
  (
    'Resumo: Direito Constitucional para STJ', 'Resumo',
    v_stj_id, v_stj_dc_id,
    'Controle concentrado e difuso, ADI, ADC, ADO e ADPF. Foco em tribunais.',
    '#', '2.2 MB • 15 págs'
  ),
  (
    'PDF: Direito Administrativo para STJ', 'PDF',
    v_stj_id, v_stj_dadm_id,
    'Servidores públicos, licitações, atos e processo administrativo.',
    '#', '3.8 MB • 28 págs'
  ),
  -- MPU
  (
    'Resumo: Direito Constitucional para MPU', 'Resumo',
    v_mpu_id, v_mpu_dc_id,
    'Ministério Público, funções essenciais à justiça e garantias constitucionais.',
    '#', '1.8 MB • 12 págs'
  ),
  (
    'Áudio-Aula: Português para MPU', 'Audio',
    v_mpu_id, v_mpu_lp_id,
    'Redação oficial, crase, colocação pronominal e regência.',
    '#', '18 min • MP3'
  ),
  -- BB
  (
    'PDF: Conhecimentos Bancários para BB', 'PDF',
    v_bb_id, v_bb_cb_id,
    'Sistema financeiro, produtos bancários, mercado de capitais e legislação.',
    '#', '4.5 MB • 36 págs'
  ),
  (
    'Resumo: Língua Portuguesa para BB', 'Resumo',
    v_bb_id, v_bb_lp_id,
    'Interpretação de texto, gramática, redação oficial e correspondência.',
    '#', '1.5 MB • 10 págs'
  ),
  -- Caixa
  (
    'Lei Seca: Conhecimentos Bancários para Caixa', 'Lei Seca',
    v_caixa_id, v_caixa_cb_id,
    'Lei 4.380/64, LC 26/75, FGTS, PIS, PASEP e produtos Caixa.',
    '#', '3.5 MB • 28 págs'
  ),
  (
    'Áudio-Aula: Língua Portuguesa para Caixa', 'Audio',
    v_caixa_id, v_caixa_lp_id,
    'Narração comentada dos tópicos de português para concursos bancários.',
    '#', '15 min • MP3'
  ),
  -- Correios
  (
    'Resumo: Matemática para Correios', 'Resumo',
    v_correios_id, v_correios_mat_id,
    'Operações básicas, porcentagem, regra de três e sistema métrico.',
    '#', '0.8 MB • 6 págs'
  ),
  (
    'PDF: Língua Portuguesa para Correios', 'PDF',
    v_correios_id, v_correios_lp_id,
    'Compreensão de texto, ortografia e concordância. IBFC.',
    '#', '1.0 MB • 8 págs'
  );
END $$;
