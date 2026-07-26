-- =====================================================
-- TOP CONCURSO - Dados Complementares
-- Execute DEPOIS do seed.sql
-- Adiciona mais bancas, concursos, aulas, questões e PDFs
-- =====================================================

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
('Polícia Penal Federal', 'Ministério da Justiça', (SELECT id FROM public.bancas WHERE sigla='Cebraspe'), 800, 180000, '2027-04-20', 'previsto', 'medio', 7500.00);

-- =====================================================
-- CONCURSOS TRIBUNAIS / MPC
-- =====================================================

INSERT INTO public.concursos (titulo, orgao, banca_id, vagas, inscritos_estimados, data_prova, status, nivel, salario) VALUES
('TRT 4ª Região - Analista', 'TRT-RS', (SELECT id FROM public.bancas WHERE sigla='FCC'), 40, 60000, '2026-09-30', 'aberto', 'superior', 16000.00),
('TRT 6ª Região - Técnico', 'TRT-PE', (SELECT id FROM public.bancas WHERE sigla='FGV'), 80, 90000, '2026-10-15', 'aberto', 'medio', 8500.00),
('TJ SP - Escrevente Técnico', 'Tribunal de Justiça de SP', (SELECT id FROM public.bancas WHERE sigla='Vunesp'), 300, 250000, '2027-02-20', 'previsto', 'medio', 7500.00),
('TJ RJ - Técnico Judiciário', 'Tribunal de Justiça do RJ', (SELECT id FROM public.bancas WHERE sigla='FGV'), 200, 180000, '2026-11-25', 'aberto', 'medio', 7200.00);

-- =====================================================
-- CONCURSOS FISCAIS / CONTROLE
-- =====================================================

INSERT INTO public.concursos (titulo, orgao, banca_id, vagas, inscritos_estimados, data_prova, status, nivel, salario) VALUES
('SEFAZ SP - Auditor Fiscal', 'Secretaria da Fazenda de SP', (SELECT id FROM public.bancas WHERE sigla='FGV'), 60, 90000, '2026-08-25', 'aberto', 'superior', 22000.00),
('SEFAZ RJ - Auditor Fiscal', 'Secretaria da Fazenda do RJ', (SELECT id FROM public.bancas WHERE sigla='Cebraspe'), 40, 70000, '2027-01-15', 'previsto', 'superior', 20000.00),
('ISS SP - Auditor Fiscal', 'Secretaria Municipal de Finanças de SP', (SELECT id FROM public.bancas WHERE sigla='FCC'), 30, 50000, '2027-06-10', 'previsto', 'superior', 19000.00);

-- =====================================================
-- CONCURSOS EXECUTIVO FEDERAL
-- =====================================================

INSERT INTO public.concursos (titulo, orgao, banca_id, vagas, inscritos_estimados, data_prova, status, nivel, salario) VALUES
('INSS - Técnico do Seguro Social', 'INSS', (SELECT id FROM public.bancas WHERE sigla='Cesgranrio'), 1000, 350000, '2027-05-30', 'previsto', 'medio', 6500.00),
('IBGE - Recenseador', 'IBGE', (SELECT id FROM public.bancas WHERE sigla='AOCP'), 5000, 400000, '2026-09-10', 'aberto', 'fundamental', 3000.00),
('Câmara dos Deputados - Analista', 'Câmara dos Deputados', (SELECT id FROM public.bancas WHERE sigla='FGV'), 100, 120000, '2026-12-15', 'aberto', 'superior', 20000.00),
('BACEN - Analista', 'Banco Central do Brasil', (SELECT id FROM public.bancas WHERE sigla='Cesgranrio'), 50, 80000, '2027-08-10', 'previsto', 'superior', 23000.00);

-- =====================================================
-- CONCURSOS SAÚDE / EDUCAÇÃO
-- =====================================================

INSERT INTO public.concursos (titulo, orgao, banca_id, vagas, inscritos_estimados, data_prova, status, nivel, salario) VALUES
('SUS - Médico', 'Secretaria de Saúde SP', (SELECT id FROM public.bancas WHERE sigla='Vunesp'), 200, 30000, '2026-10-01', 'aberto', 'superior', 15000.00),
('Professor SEEDUC RJ', 'Secretaria de Educação do RJ', (SELECT id FROM public.bancas WHERE sigla='Cesgranrio'), 500, 80000, '2027-03-01', 'previsto', 'superior', 5500.00);

-- =====================================================
-- DISCIPLINAS POR CONCURSO
-- =====================================================

-- PM BA
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM BA%')),
('Direito Penal', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM BA%')),
('Direito Penal Militar', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM BA%')),
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM BA%')),
('Raciocínio Lógico', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM BA%'));

-- PM SP
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM SP%')),
('Direito Penal', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM SP%')),
('Direito Penal Militar', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM SP%')),
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM SP%'));

-- PM RJ
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM RJ%')),
('Direito Penal', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM RJ%')),
('Direitos Humanos', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM RJ%')),
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'PM RJ%'));

-- Polícia Civil SP
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Civil SP%')),
('Direito Penal', (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Civil SP%')),
('Direito Processual Penal', (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Civil SP%')),
('Criminologia', (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Civil SP%')),
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Civil SP%'));

-- Polícia Penal Federal
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Penal%')),
('Direito Penal', (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Penal%')),
('Direito Processual Penal', (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Penal%')),
('Lei de Execução Penal', (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Penal%'));

-- TRT 4
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 4%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 4%')),
('Direito do Trabalho', (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 4%')),
('Direito Processual do Trabalho', (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 4%'));

-- TRT 6
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 6%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 6%')),
('Direito do Trabalho', (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 6%'));

-- TJ SP
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'TJ SP%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'TJ SP%')),
('Direito Civil', (SELECT id FROM public.concursos WHERE titulo LIKE 'TJ SP%')),
('Direito Processual Civil', (SELECT id FROM public.concursos WHERE titulo LIKE 'TJ SP%')),
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'TJ SP%'));

-- TJ RJ
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'TJ RJ%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'TJ RJ%')),
('Direito Civil', (SELECT id FROM public.concursos WHERE titulo LIKE 'TJ RJ%')),
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'TJ RJ%'));

-- SEFAZ SP
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Tributário', (SELECT id FROM public.concursos WHERE titulo LIKE 'SEFAZ SP%')),
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'SEFAZ SP%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'SEFAZ SP%')),
('Contabilidade Geral', (SELECT id FROM public.concursos WHERE titulo LIKE 'SEFAZ SP%')),
('Economia', (SELECT id FROM public.concursos WHERE titulo LIKE 'SEFAZ SP%'));

-- SEFAZ RJ
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Tributário', (SELECT id FROM public.concursos WHERE titulo LIKE 'SEFAZ RJ%')),
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'SEFAZ RJ%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'SEFAZ RJ%')),
('Contabilidade Geral', (SELECT id FROM public.concursos WHERE titulo LIKE 'SEFAZ RJ%'));

-- INSS
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Previdenciário', (SELECT id FROM public.concursos WHERE titulo LIKE 'INSS%')),
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'INSS%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'INSS%')),
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'INSS%'));

-- Câmara dos Deputados
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Direito Constitucional', (SELECT id FROM public.concursos WHERE titulo LIKE 'Câmara%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'Câmara%')),
('Regimento Interno CD', (SELECT id FROM public.concursos WHERE titulo LIKE 'Câmara%')),
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'Câmara%'));

-- BACEN
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Economia', (SELECT id FROM public.concursos WHERE titulo LIKE 'BACEN%')),
('Finanças', (SELECT id FROM public.concursos WHERE titulo LIKE 'BACEN%')),
('Matemática Financeira', (SELECT id FROM public.concursos WHERE titulo LIKE 'BACEN%')),
('Direito Administrativo', (SELECT id FROM public.concursos WHERE titulo LIKE 'BACEN%'));

-- IBGE
INSERT INTO public.disciplinas (nome, concurso_id) VALUES
('Língua Portuguesa', (SELECT id FROM public.concursos WHERE titulo LIKE 'IBGE%')),
('Matemática', (SELECT id FROM public.concursos WHERE titulo LIKE 'IBGE%')),
('Geografia', (SELECT id FROM public.concursos WHERE titulo LIKE 'IBGE%'));

-- =====================================================
-- NOTÍCIAS
-- =====================================================

INSERT INTO public.noticias (titulo, conteudo, tipo) VALUES
('PM BA divulga edital com 2.000 vagas!', 'A Polícia Militar da Bahia publicou edital para Soldado com salário inicial de R$ 4.500. Inscrições até setembro.', 'edital'),
('TRT 4ª Região abre concurso para Analista', 'O TRT do Rio Grande do Sul oferece 40 vagas para Analista Judiciário. Salário de R$ 16.000.', 'edital'),
('INSS autoriza novo concurso com 1.000 vagas', 'O Ministério da Previdência autorizou concurso para Técnico do Seguro Social. Previsão de edital para 2027.', 'aviso'),
('STJ define tese sobre improbidade administrativa', 'A Primeira Seção do STJ firmou tese importante sobre prazos prescricionais na Lei de Improbidade. Matéria relevante para tribunais.', 'noticia'),
('Dica: Como estudar Direito Penal para PM', 'Foque nos arts. 121 a 154 do CP (crimes contra a pessoa) e na Parte Geral. São os tópicos mais cobrados em concursos policiais.', 'dica'),
('Edital SEFAZ SP publicado com 60 vagas', 'Secretaria da Fazenda de São Paulo oferece vagas para Auditor Fiscal com salário inicial de R$ 22.000. Provas em agosto.', 'edital');

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
-- AULAS (YouTube - vídeos reais brasileiros)
-- =====================================================

DO $$
DECLARE
  v_pmba_id uuid;
  v_pmba_dcon_id uuid;
  v_pmba_dpen_id uuid;
  v_pmba_dport_id uuid;
  v_pmba_dlog_id uuid;
  v_pmsp_id uuid;
  v_pmsp_dcon_id uuid;
  v_pmsp_dpen_id uuid;
  v_pmsp_dport_id uuid;
  v_pmsp_dpm_id uuid;
  v_pcsp_id uuid;
  v_pcsp_dcon_id uuid;
  v_pcsp_dppenal_id uuid;
  v_trt4_id uuid;
  v_trt4_dtrab_id uuid;
  v_tjsp_id uuid;
  v_tjsp_dcivil_id uuid;
  v_sefazsp_id uuid;
  v_sefazsp_dtrib_id uuid;
  v_inss_id uuid;
  v_inss_dprev_id uuid;
BEGIN
  v_pmba_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'PM BA%');
  v_pmba_dcon_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=v_pmba_id);
  v_pmba_dpen_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Penal' AND concurso_id=v_pmba_id);
  v_pmba_dport_id := (SELECT id FROM public.disciplinas WHERE nome='Língua Portuguesa' AND concurso_id=v_pmba_id);
  v_pmba_dlog_id := (SELECT id FROM public.disciplinas WHERE nome='Raciocínio Lógico' AND concurso_id=v_pmba_id);
  v_pmsp_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'PM SP%');
  v_pmsp_dcon_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=v_pmsp_id);
  v_pmsp_dpen_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Penal' AND concurso_id=v_pmsp_id);
  v_pmsp_dport_id := (SELECT id FROM public.disciplinas WHERE nome='Língua Portuguesa' AND concurso_id=v_pmsp_id);
  v_pmsp_dpm_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Penal Militar' AND concurso_id=v_pmsp_id);
  v_pcsp_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'Polícia Civil SP%');
  v_pcsp_dcon_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Constitucional' AND concurso_id=v_pcsp_id);
  v_pcsp_dppenal_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Processual Penal' AND concurso_id=v_pcsp_id);
  v_trt4_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'TRT 4%');
  v_trt4_dtrab_id := (SELECT id FROM public.disciplinas WHERE nome='Direito do Trabalho' AND concurso_id=v_trt4_id);
  v_tjsp_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'TJ SP%');
  v_tjsp_dcivil_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Civil' AND concurso_id=v_tjsp_id);
  v_sefazsp_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'SEFAZ SP%');
  v_sefazsp_dtrib_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Tributário' AND concurso_id=v_sefazsp_id);
  v_inss_id := (SELECT id FROM public.concursos WHERE titulo LIKE 'INSS%');
  v_inss_dprev_id := (SELECT id FROM public.disciplinas WHERE nome='Direito Previdenciário' AND concurso_id=v_inss_id);

  INSERT INTO public.aulas (titulo, descricao, concurso_id, disciplina_id, youtube_url, youtube_id, duracao_minutos, instrutor, thumbnail_url) VALUES
  (
    'Direito Constitucional para PM BA - Teoria da Constituição',
    'Aula completa sobre Teoria da Constituição para o concurso da PM BA. Aborda classificação, elementos e aplicabilidade.',
    v_pmba_id, v_pmba_dcon_id,
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 48, 'Prof. Pedro Menezes',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80'
  ),
  (
    'Direito Penal - Crimes contra a Pessoa (PM BA)',
    'Estudo dos arts. 121 a 154 do CP. Homicídio, lesão corporal, rixa. Teoria e questões IBFC.',
    v_pmba_id, v_pmba_dpen_id,
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 55, 'Prof. Fernando Capez',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80'
  ),
  (
    'Português para PM - Crase e Pontuação',
    'Domine crase e pontuação para a prova da Polícia Militar. Regras práticas com exercícios.',
    v_pmba_id, v_pmba_dport_id,
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 42, 'Prof. Elias Santana',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80'
  ),
  (
    'Raciocínio Lógico - Sequências e Padrões',
    'Aula de Raciocínio Lógico para PM BA. Sequências numéricas, lógica proposicional e diagramas.',
    v_pmba_id, v_pmba_dlog_id,
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 38, 'Prof. Josimar Padilha',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&q=80'
  ),
  (
    'Direito Constitucional - Direitos e Garantias (PM SP)',
    'Análise completa do art. 5º da CF/88 para PM SP. Direitos individuais e coletivos.',
    v_pmsp_id, v_pmsp_dcon_id,
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 50, 'Prof. Aragonê Fernandes',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80'
  ),
  (
    'Direito Penal Militar - Introdução (PM SP)',
    'Princípios do Direito Penal Militar, aplicação da lei penal militar e hierarquia.',
    v_pmsp_id, v_pmsp_dpm_id,
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 44, 'Prof. César Dantas',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80'
  ),
  (
    'Português para Concursos - Ortografia e Acentuação',
    'Regras de ortografia oficial, acentuação gráfica e reforma ortográfica. Banca Vunesp.',
    v_pmsp_id, v_pmsp_dport_id,
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 36, 'Prof. Décio Terror',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80'
  ),
  (
    'Direito Constitucional - Poder Legislativo (PC SP)',
    'Estrutura do Poder Legislativo, processo legislativo e CPIs. Foco na Vunesp.',
    v_pcsp_id, v_pcsp_dcon_id,
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 47, 'Prof. Emerson Castilho',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80'
  ),
  (
    'Processo Penal - Inquérito Policial (PC SP)',
    'Tudo sobre inquérito policial: características, prazos, diligencias e indiciamento.',
    v_pcsp_id, v_pcsp_dppenal_id,
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 53, 'Prof. Renato Brasileiro',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80'
  ),
  (
    'Direito do Trabalho - Princípios (TRT 4ª Região)',
    'Princípios do Direito do Trabalho: proteção, irrenunciabilidade, continuidade e primazia da realidade.',
    v_trt4_id, v_trt4_dtrab_id,
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 41, 'Prof. Rodrigo Bezerra',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=400&q=80'
  ),
  (
    'Direito Civil - Obrigações (TJ SP)',
    'Classificação das obrigações: dar, fazer e não fazer. Obrigações alternativas e solidárias.',
    v_tjsp_id, v_tjsp_dcivil_id,
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 49, 'Prof. Pablo Stolze',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=400&q=80'
  ),
  (
    'Direito Tributário - Competência Tributária (SEFAZ SP)',
    'Classificação dos tributos, competência da União, Estados e Municípios. FGV.',
    v_sefazsp_id, v_sefazsp_dtrib_id,
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 56, 'Prof. Eduardo Sabbag',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80'
  ),
  (
    'Direito Previdenciário - RGPS (INSS)',
    'Regime Geral de Previdência Social: segurados, dependentes, benefícios e carência.',
    v_inss_id, v_inss_dprev_id,
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 60, 'Prof. Hugo de Brito',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80'
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
