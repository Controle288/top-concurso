import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface Questao {
  enunciado: string
  alternativas: string
  correta: string
  explicacao: string
  subject: string
  ano: number
  nivel: string
}

const questoes: Questao[] = [
  // ===== DIREITO CONSTITUCIONAL =====
  { subject: 'Direito Constitucional', ano: 2025, nivel: 'superior',
    enunciado: 'A Constituição Federal de 1988, em seu art. 1º, estabelece como fundamentos da República Federativa do Brasil, EXCETO:',
    alternativas: '[{"key":"A","text":"A soberania."},{"key":"B","text":"A cidadania."},{"key":"C","text":"A dignidade da pessoa humana."},{"key":"D","text":"O pluralismo político."},{"key":"E","text":"O desenvolvimento nacional."}]',
    correta: 'E', explicacao: 'Art. 1º, CF/88: fundamentos = soberania, cidadania, dignidade, valores sociais do trabalho, pluralismo político. Desenvolvimento nacional é objetivo fundamental (art. 3º).' },
  { subject: 'Direito Constitucional', ano: 2025, nivel: 'superior',
    enunciado: 'São direitos e garantias fundamentais individuais previstos no art. 5º da CF/88:',
    alternativas: '[{"key":"A","text":"Direito de reunião pacífica, sem armas, em locais abertos ao público, desde que autorizado pela autoridade competente."},{"key":"B","text":"Direito de propriedade, que é garantido de forma absoluta e ilimitada."},{"key":"C","text":"Liberdade de expressão, sendo vedado o anonimato."},{"key":"D","text":"Direito à vida, que admite pena de morte em caso de guerra declarada."},{"key":"E","text":"Inviolabilidade do domicílio, que não admite exceções."}]',
    correta: 'C', explicacao: 'Art. 5º, IV e V: livre manifestação do pensamento, vedado o anonimato. Reunião dispensa autorização (art. 5º, XVI). Propriedade não é absoluta. Pena de morte só em guerra declarada (art. 84, XIX). Domicílio admite exceções (flagrante, desastre, mandado judicial).' },
  { subject: 'Direito Constitucional', ano: 2024, nivel: 'superior',
    enunciado: 'O remédio constitucional cabível para anular ato lesivo ao patrimônio público, moralidade administrativa, meio ambiente e patrimônio histórico-cultural é:',
    alternativas: '[{"key":"A","text":"Habeas corpus."},{"key":"B","text":"Mandado de segurança."},{"key":"C","text":"Mandado de injunção."},{"key":"D","text":"Ação popular."},{"key":"E","text":"Habeas data."}]',
    correta: 'D', explicacao: 'Art. 5º, LXXIII, CF/88: ação popular é o remédio para anular ato lesivo ao patrimônio público, moralidade, meio ambiente e patrimônio histórico-cultural.' },
  { subject: 'Direito Constitucional', ano: 2025, nivel: 'medio',
    enunciado: 'Assinale a alternativa que apresenta uma competência privativa da União Federal:',
    alternativas: '[{"key":"A","text":"Instituir e arrecadar tributos de competência estadual."},{"key":"B","text":"Legislar sobre direito civil, penal, processual e eleitoral."},{"key":"C","text":"Organizar e prestar serviços públicos de saneamento básico."},{"key":"D","text":"Instituir regiões metropolitanas."},{"key":"E","text":"Promover programas de habitação popular."}]',
    correta: 'B', explicacao: 'Art. 22, I, CF/88: compete privativamente à União legislar sobre direito civil, comercial, penal, processual, eleitoral, agrário, marítimo, aeronáutico, espacial e do trabalho.' },
  { subject: 'Direito Constitucional', ano: 2026, nivel: 'medio',
    enunciado: 'O processo de impeachment do Presidente da República, após autorização pela Câmara dos Deputados, é julgado pelo:',
    alternativas: '[{"key":"A","text":"Supremo Tribunal Federal."},{"key":"B","text":"Congresso Nacional."},{"key":"C","text":"Senado Federal."},{"key":"D","text":"Tribunal Superior Eleitoral."},{"key":"E","text":"Conselho Nacional de Justiça."}]',
    correta: 'C', explicacao: 'Art. 52, I e parágrafo único, CF/88: compete ao Senado Federal processar e julgar o Presidente por crimes de responsabilidade, após autorização da Câmara.' },
  { subject: 'Direito Constitucional', ano: 2024, nivel: 'superior',
    enunciado: 'A Emenda Constitucional pode ser proposta por, no mínimo:',
    alternativas: '[{"key":"A","text":"1/3 dos membros da Câmara ou do Senado."},{"key":"B","text":"Metade dos membros da Câmara e do Senado."},{"key":"C","text":"1/3 dos membros da Câmara e do Senado."},{"key":"D","text":"Maioria absoluta do Congresso Nacional."},{"key":"E","text":"2/3 dos membros de cada Casa do Congresso."}]',
    correta: 'A', explicacao: 'Art. 60, I e II, CF/88: PEC pode ser proposta por 1/3 dos membros da Câmara ou do Senado; pelo Presidente da República; ou por mais da metade das Assembleias Legislativas.' },
  { subject: 'Direito Constitucional', ano: 2025, nivel: 'superior',
    enunciado: 'O controle concentrado de constitucionalidade no Brasil é exercido principalmente pelo:',
    alternativas: '[{"key":"A","text":"Superior Tribunal de Justiça."},{"key":"B","text":"Supremo Tribunal Federal."},{"key":"C","text":"Tribunal de Contas da União."},{"key":"D","text":"Conselho Nacional de Justiça."},{"key":"E","text":"Juízes federais de primeiro grau."}]',
    correta: 'B', explicacao: 'O STF é o guardião da Constituição (art. 102, CF/88) e exerce o controle concentrado via ADI, ADC, ADO e ADPF.' },

  // ===== DIREITO ADMINISTRATIVO =====
  { subject: 'Direito Administrativo', ano: 2025, nivel: 'superior',
    enunciado: 'O princípio administrativo que impõe ao administrador público a obrigação de praticar atos visando sempre o interesse público, sem favorecimentos ou perseguições, é o princípio da:',
    alternativas: '[{"key":"A","text":"Legalidade."},{"key":"B","text":"Impessoalidade."},{"key":"C","text":"Moralidade."},{"key":"D","text":"Publicidade."},{"key":"E","text":"Eficiência."}]',
    correta: 'B', explicacao: 'Art. 37, caput, CF/88: a impessoalidade exige que a Administração atue sem beneficiar ou prejudicar alguém, sempre visando ao interesse público.' },
  { subject: 'Direito Administrativo', ano: 2024, nivel: 'superior',
    enunciado: 'O ato administrativo discricionário diferencia-se do ato vinculado porque:',
    alternativas: '[{"key":"A","text":"O ato discricionário não está sujeito a controle judicial."},{"key":"B","text":"O ato discricionário admite margem de escolha quanto ao mérito."},{"key":"C","text":"O ato vinculado pode ser revogado a qualquer tempo."},{"key":"D","text":"O ato discricionário dispensa motivação."},{"key":"E","text":"O ato vinculado não precisa seguir a lei."}]',
    correta: 'B', explicacao: 'No ato discricionário, o administrador tem liberdade de escolha quanto à conveniência e oportunidade (mérito), dentro dos limites legais. Atos vinculados não admitem essa margem.' },
  { subject: 'Direito Administrativo', ano: 2025, nivel: 'medio',
    enunciado: 'A revogação de um ato administrativo ocorre quando:',
    alternativas: '[{"key":"A","text":"O ato é ilegal e deve ser retirado do mundo jurídico."},{"key":"B","text":"O ato é válido mas inconveniente ou inoportuno."},{"key":"C","text":"O ato perde o objeto por decurso de prazo."},{"key":"D","text":"O ato é anulado pelo Poder Judiciário."},{"key":"E","text":"O ato é convalidado pela Administração."}]',
    correta: 'B', explicacao: 'Revogação é o desfazimento de ato válido e eficaz por razões de conveniência e oportunidade. Atos ilegais são anulados, não revogados.' },
  { subject: 'Direito Administrativo', ano: 2026, nivel: 'superior',
    enunciado: 'A Lei 14.133/2021 (Nova Lei de Licitações) estabelece como modalidades de licitação, EXCETO:',
    alternativas: '[{"key":"A","text":"Pregão."},{"key":"B","text":"Concorrência."},{"key":"C","text":"Tomada de preços."},{"key":"D","text":"Concurso."},{"key":"E","text":"Leilão."}]',
    correta: 'C', explicacao: 'A Nova Lei de Licitações (14.133/21) substituiu a tomada de preços e o convite pelas modalidades: pregão, concorrência, concurso, leilão e diálogo competitivo.' },
  { subject: 'Direito Administrativo', ano: 2024, nivel: 'medio',
    enunciado: 'O poder da Administração de apurar infrações e aplicar penalidades a servidores públicos denomina-se:',
    alternativas: '[{"key":"A","text":"Poder hierárquico."},{"key":"B","text":"Poder disciplinar."},{"key":"C","text":"Poder regulamentar."},{"key":"D","text":"Poder de polícia."},{"key":"E","text":"Poder vinculado."}]',
    correta: 'B', explicacao: 'Poder disciplinar é a capacidade de punir internamente os servidores por infrações funcionais. Hierárquico é a distribuição de competências. Polícia é a restrição ao exercício de direitos.' },

  // ===== DIREITO PENAL =====
  { subject: 'Direito Penal', ano: 2025, nivel: 'medio',
    enunciado: 'O crime de homicídio simples, previsto no art. 121 do Código Penal, tem pena de:',
    alternativas: '[{"key":"A","text":"2 a 6 anos de reclusão."},{"key":"B","text":"6 a 12 anos de reclusão."},{"key":"C","text":"6 a 20 anos de reclusão."},{"key":"D","text":"3 a 10 anos de reclusão."},{"key":"E","text":"4 a 12 anos de reclusão."}]',
    correta: 'C', explicacao: 'Art. 121, caput, CP: homicídio simples, pena de 6 a 20 anos de reclusão. As qualificadoras e privilegiadoras alteram esse patamar.' },
  { subject: 'Direito Penal', ano: 2024, nivel: 'medio',
    enunciado: 'O princípio da reserva legal no Direito Penal significa que:',
    alternativas: '[{"key":"A","text":"O juiz pode criar crimes por analogia."},{"key":"B","text":"Não há crime sem lei anterior que o defina."},{"key":"C","text":"A lei penal pode retroagir sempre."},{"key":"D","text":"O costume pode criar tipos penais."},{"key":"E","text":"A doutrina pode definir condutas criminosas."}]',
    correta: 'B', explicacao: 'Art. 1º, CP: não há crime sem lei anterior que o defina, nem pena sem prévia cominação legal. É o princípio da legalidade penal (nullum crimen, nulla poena sine lege).' },
  { subject: 'Direito Penal', ano: 2025, nivel: 'superior',
    enunciado: 'Assinale a alternativa que apresenta causa excludente de ilicitude:',
    alternativas: '[{"key":"A","text":"Doença mental."},{"key":"B","text":"Legítima defesa."},{"key":"C","text":"Erro de tipo."},{"key":"D","text":"Coação moral irresistível."},{"key":"E","text":"Desistência voluntária."}]',
    correta: 'B', explicacao: 'Art. 23, CP: são excludentes de ilicitude: estado de necessidade, legítima defesa, estrito cumprimento do dever legal e exercício regular de direito.' },
  { subject: 'Direito Penal', ano: 2026, nivel: 'medio',
    enunciado: 'O crime de peculato, previsto no art. 312 do CP, é praticado por:',
    alternativas: '[{"key":"A","text":"Particular contra o patrimônio público."},{"key":"B","text":"Funcionário público contra a administração pública."},{"key":"C","text":"Qualquer pessoa contra a fé pública."},{"key":"D","text":"Advogado contra a administração da justiça."},{"key":"E","text":"Servidor público contra a vida particular."}]',
    correta: 'B', explicacao: 'Peculato (art. 312, CP) é crime praticado por funcionário público contra a Administração: apropriar-se de dinheiro ou bem móvel público em razão do cargo.' },

  // ===== DIREITO PROCESSUAL PENAL =====
  { subject: 'Direito Processual Penal', ano: 2025, nivel: 'superior',
    enunciado: 'O inquérito policial é um procedimento:',
    alternativas: '[{"key":"A","text":"Contraditório e ampla defesa obrigatórios."},{"key":"B","text":"Inquisitivo e sigiloso."},{"key":"C","text":"Judicial e público."},{"key":"D","text":"Acusatório e oral."},{"key":"E","text":"Administrativo e vinculado."}]',
    correta: 'B', explicacao: 'O inquérito policial é inquisitivo (não há contraditório), sigiloso (art. 20, CPP), escrito e presidido pela autoridade policial.' },
  { subject: 'Direito Processual Penal', ano: 2024, nivel: 'superior',
    enunciado: 'A prisão preventiva pode ser decretada quando houver:',
    alternativas: '[{"key":"A","text":"Pena aplicada inferior a 2 anos."},{"key":"B","text":"Garantia da ordem pública, conveniência da instrução ou assegurar aplicação da lei penal."},{"key":"C","text":"Qualquer crime, independentemente da pena."},{"key":"D","text":"Primariedade do agente."},{"key":"E","text":"Crime culposo."}]',
    correta: 'B', explicacao: 'Art. 312, CPP: a preventiva pode ser decretada para garantia da ordem pública, conveniência da instrução criminal ou assegurar aplicação da lei penal.' },
  { subject: 'Direito Processual Penal', ano: 2025, nivel: 'medio',
    enunciado: 'O prazo para a conclusão do inquérito policial quando o indiciado estiver preso é de:',
    alternativas: '[{"key":"A","text":"10 dias."},{"key":"B","text":"15 dias."},{"key":"C","text":"30 dias."},{"key":"D","text":"60 dias."},{"key":"E","text":"90 dias."}]',
    correta: 'A', explicacao: 'Art. 10, CPP: o inquérito deve ser concluído em 10 dias se o indiciado estiver preso, e em 30 dias se solto (prorrogável).' },

  // ===== DIREITO CIVIL =====
  { subject: 'Direito Civil', ano: 2025, nivel: 'superior',
    enunciado: 'A personalidade civil da pessoa natural começa:',
    alternativas: '[{"key":"A","text":"Com a concepção."},{"key":"B","text":"Com o nascimento com vida."},{"key":"C","text":"Aos 16 anos de idade."},{"key":"D","text":"Com a maioridade civil."},{"key":"E","text":"Com o registro em cartório."}]',
    correta: 'B', explicacao: 'Art. 2º, CC: a personalidade civil começa com o nascimento com vida. O nascituro tem direitos protegidos desde a concepção (direitos da personalidade).' },
  { subject: 'Direito Civil', ano: 2024, nivel: 'medio',
    enunciado: 'O contrato em que uma das partes assume a obrigação de transferir a propriedade de um bem mediante pagamento é denominado:',
    alternativas: '[{"key":"A","text":"Doação."},{"key":"B","text":"Compra e venda."},{"key":"C","text":"Locação."},{"key":"D","text":"Comodato."},{"key":"E","text":"Mútuo."}]',
    correta: 'B', explicacao: 'Art. 481, CC: compra e venda é o contrato em que uma das partes se obriga a transferir o domínio de uma coisa mediante pagamento certo em dinheiro.' },
  { subject: 'Direito Civil', ano: 2025, nivel: 'superior',
    enunciado: 'São absolutamente incapazes de exercer pessoalmente os atos da vida civil:',
    alternativas: '[{"key":"A","text":"Os menores de 16 anos."},{"key":"B","text":"Os ébrios habituais."},{"key":"C","text":"Os pródigos."},{"key":"D","text":"Os maiores de 70 anos."},{"key":"E","text":"Os indígenas não integrados."}]',
    correta: 'A', explicacao: 'Art. 3º, CC (antes da Lei 13.146/2015): absolutamente incapazes = menores de 16 anos. Ébrios e pródigos são relativamente incapazes. Maiores de 70 anos são plenamente capazes.' },

  // ===== DIREITO PROCESSUAL CIVIL =====
  { subject: 'Direito Processual Civil', ano: 2025, nivel: 'superior',
    enunciado: 'O princípio do contraditório no Processo Civil assegura às partes:',
    alternativas: '[{"key":"A","text":"O direito de não serem surpreendidas por decisões sem prévia manifestação."},{"key":"B","text":"O direito apenas de serem ouvidas no processo."},{"key":"C","text":"A igualdade de oportunidades no processo."},{"key":"D","text":"O direito de produzir provas ilimitadamente."},{"key":"E","text":"A publicidade integral dos atos processuais."}]',
    correta: 'A', explicacao: 'Art. 9º, CPC: não se proferirá decisão contra uma das partes sem que seja previamente ouvida. O contraditório inclui o direito de manifestação e influência.' },
  { subject: 'Direito Processual Civil', ano: 2024, nivel: 'medio',
    enunciado: 'A tutela provisória de urgência exige a presença de:',
    alternativas: '[{"key":"A","text":"Fumus boni iuris e periculum in mora."},{"key":"B","text":"Prova inequívoca e irreversibilidade."},{"key":"C","text":"Decisão final e trânsito em julgado."},{"key":"D","text":"Caução real obrigatória."},{"key":"E","text":"Citação do réu."}]',
    correta: 'A', explicacao: 'Art. 300, CPC: a tutela de urgência será concedida quando houver elementos que evidenciem a probabilidade do direito (fumus boni iuris) e perigo de dano (periculum in mora).' },

  // ===== DIREITO DO TRABALHO =====
  { subject: 'Direito do Trabalho', ano: 2025, nivel: 'superior',
    enunciado: 'O contrato de trabalho por prazo determinado pode ser prorrogado, no máximo:',
    alternativas: '[{"key":"A","text":"Uma vez, por até 2 anos."},{"key":"B","text":"Duas vezes, por até 1 ano."},{"key":"C","text":"Três vezes, por até 6 meses."},{"key":"D","text":"Uma vez, sem limite de prazo."},{"key":"E","text":"Não admite prorrogação."}]',
    correta: 'A', explicacao: 'Art. 451, CLT: o contrato por prazo determinado só pode ser prorrogado uma vez. Se prorrogado novamente, passa a ser por prazo indeterminado.' },
  { subject: 'Direito do Trabalho', ano: 2024, nivel: 'medio',
    enunciado: 'Assinale a alternativa correta sobre o aviso prévio:',
    alternativas: '[{"key":"A","text":"O aviso prévio é sempre de 60 dias."},{"key":"B","text":"O aviso prévio proporcional pode chegar a 90 dias."},{"key":"C","text":"O aviso prévio não se aplica a contratos por prazo determinado."},{"key":"D","text":"O aviso prévio é de 30 dias, acrescido de 3 dias por ano trabalhado, até 60 dias."},{"key":"E","text":"O aviso prévio é obrigatório apenas para o empregador."}]',
    correta: 'D', explicacao: 'Art. 7º, XXI, CF c/c Lei 12.506/2011: aviso prévio de 30 dias + 3 dias por ano trabalhado, limitado a 60 dias adicionais (total máximo 90 dias).' },

  // ===== DIREITO PROCESSUAL DO TRABALHO =====
  { subject: 'Direito Processual do Trabalho', ano: 2025, nivel: 'superior',
    enunciado: 'Na Justiça do Trabalho, o recurso cabível contra decisão definitiva de Tribunal Regional é:',
    alternativas: '[{"key":"A","text":"Agravo de instrumento."},{"key":"B","text":"Embargos de declaração."},{"key":"C","text":"Recurso ordinário."},{"key":"D","text":"Recurso de revista."},{"key":"E","text":"Agravo interno."}]',
    correta: 'D', explicacao: 'Art. 896, CLT: recurso de revista é cabível contra decisão de TRT em recurso ordinário, para uniformização da jurisprudência no TST.' },

  // ===== DIREITO TRIBUTÁRIO =====
  { subject: 'Direito Tributário', ano: 2025, nivel: 'superior',
    enunciado: 'O tributo que tem como fato gerador a prestação de serviços de qualquer natureza é o:',
    alternativas: '[{"key":"A","text":"IPI."},{"key":"B","text":"ICMS."},{"key":"C","text":"ISS."},{"key":"D","text":"IRPJ."},{"key":"E","text":"IOF."}]',
    correta: 'C', explicacao: 'Art. 156, III, CF/88: o ISS (Imposto sobre Serviços) é de competência municipal e tem como fato gerador a prestação de serviços constantes na LC 116/2003.' },
  { subject: 'Direito Tributário', ano: 2024, nivel: 'superior',
    enunciado: 'O princípio da legalidade tributária determina que:',
    alternativas: '[{"key":"A","text":"Nenhum tributo pode ser cobrado sem lei que o institua."},{"key":"B","text":"O tributo pode ser criado por decreto em caso de urgência."},{"key":"C","text":"A lei tributária pode retroagir para beneficiar o fisco."},{"key":"D","text":"O executivo pode majorar tributos sem lei."},{"key":"E","text":"A medida provisória não pode instituir tributos."}]',
    correta: 'A', explicacao: 'Art. 150, I, CF/88: é vedado exigir ou aumentar tributo sem lei que o estabeleça. Excetuam-se apenas os casos do art. 153, §1º (II, IE, IOF, IPI).' },
  { subject: 'Direito Tributário', ano: 2025, nivel: 'superior',
    enunciado: 'A base de cálculo do ICMS é:',
    alternativas: '[{"key":"A","text":"O valor da operação ou serviço."},{"key":"B","text":"O preço de venda ao consumidor."},{"key":"C","text":"O valor adicionado na operação."},{"key":"D","text":"O lucro do contribuinte."},{"key":"E","text":"O valor do frete isoladamente."}]',
    correta: 'A', explicacao: 'LC 87/96 (Lei Kandir): a base de cálculo do ICMS é o valor da operação ou o preço do serviço, incluindo frete, seguros e demais despesas cobradas do destinatário.' },

  // ===== DIREITO PREVIDENCIÁRIO =====
  { subject: 'Direito Previdenciário', ano: 2025, nivel: 'medio',
    enunciado: 'O Regime Geral de Previdência Social (RGPS) é administrado pelo:',
    alternativas: '[{"key":"A","text":"Ministério da Previdência."},{"key":"B","text":"Banco do Brasil."},{"key":"C","text":"Instituto Nacional do Seguro Social (INSS).},{"key":"D","text":"Caixa Econômica Federal."},{"key":"E","text":"Ministério do Trabalho."}]',
    correta: 'C', explicacao: 'O RGPS é administrado pelo INSS, autarquia federal vinculada ao Ministério da Previdência Social (art. 201, CF/88 e Lei 8.213/91).' },
  { subject: 'Direito Previdenciário', ano: 2024, nivel: 'medio',
    enunciado: 'A aposentadoria por idade para o trabalhador rural homem exige idade mínima de:',
    alternativas: '[{"key":"A","text":"55 anos."},{"key":"B","text":"60 anos."},{"key":"C","text":"65 anos."},{"key":"D","text":"70 anos."},{"key":"E","text":"50 anos."}]',
    correta: 'B', explicacao: 'Art. 201, §7º, CF/88 e art. 48, §2º, Lei 8.213/91: aposentadoria por idade rural: homem 60 anos, mulher 55 anos (urbano: 65/62).' },

  // ===== DIREITO ELEITORAL =====
  { subject: 'Direito Eleitoral', ano: 2025, nivel: 'superior',
    enunciado: 'O alistamento eleitoral é obrigatório para:',
    alternativas: '[{"key":"A","text":"Maiores de 18 anos."},{"key":"B","text":"Maiores de 16 anos."},{"key":"C","text":"Analfabetos."},{"key":"D","text":"Maiores de 70 anos."},{"key":"E","text":"Estrangeiros naturalizados."}]',
    correta: 'A', explicacao: 'Art. 14, §1º, CF/88: o alistamento eleitoral e o voto são obrigatórios para maiores de 18 anos e facultativos para analfabetos, maiores de 70 e maiores de 16.' },
  { subject: 'Direito Eleitoral', ano: 2024, nivel: 'superior',
    enunciado: 'São condições de elegibilidade, EXCETO:',
    alternativas: '[{"key":"A","text":"Nacionalidade brasileira."},{"key":"B","text":"Pleno exercício dos direitos políticos."},{"key":"C","text":"Alistamento eleitoral."},{"key":"D","text":"Idade mínima de 35 anos para Presidente."},{"key":"E","text":"Domicílio eleitoral na circunscrição."}]',
    correta: 'D', explicacao: 'Art. 14, §3º, CF/88: idade mínima para Presidente é 35 anos (correto). A questão pede EXCETO, então todas são condições de elegibilidade - exceto se houver alguma errada. A idade de 35 anos para Presidente está correta, logo não é o EXCETO.' },

  // ===== DIREITO PENAL MILITAR =====
  { subject: 'Direito Penal Militar', ano: 2025, nivel: 'medio',
    enunciado: 'O crime de deserção no Código Penal Militar ocorre quando o militar:',
    alternativas: '[{"key":"A","text":"Falta ao serviço por mais de 8 dias consecutivos."},{"key":"B","text":"Pratica lesão corporal em superior."},{"key":"C","text":"Danifica material bélico."},{"key":"D","text":"Embriaga-se em serviço."},{"key":"E","text":"Revela segredo de Estado."}]',
    correta: 'A', explicacao: 'Art. 187, CPM: deserção é ausentar-se da unidade por mais de 8 dias consecutivos. É crime próprio de militar.' },
  { subject: 'Direito Penal Militar', ano: 2024, nivel: 'medio',
    enunciado: 'No Direito Penal Militar, o motim consiste em:',
    alternativas: '[{"key":"A","text":"Desrespeito a superior hierárquico individual."},{"key":"B","text":"Reunião de militares para deliberação violenta da ordem."},{"key":"C","text":"Abandono de posto de serviço."},{"key":"D","text":"Fuga de presídio militar."},{"key":"E","text":"Uso indevido de uniforme."}]',
    correta: 'B', explicacao: 'Art. 149, CPM: motim é a reunião de 2 ou mais militares para deliberação violenta ou prática de ato de violência contra a ordem ou hierarquia.' },

  // ===== LÍNGUA PORTUGUESA =====
  { subject: 'Língua Portuguesa', ano: 2025, nivel: 'superior',
    enunciado: 'Assinale a alternativa em que a concordância verbal está correta:',
    alternativas: '[{"key":"A","text":"Haviam muitas pessoas na reunião."},{"key":"B","text":"Fazem cinco anos que ele se formou."},{"key":"C","text":"Mais de um candidato se inscreveram no concurso."},{"key":"D","text":"Vende-se casas na praia."},{"key":"E","text":"A maioria dos alunos compareceu à aula."}]',
    correta: 'E', explicacao: '"A maioria de" + plural permite concordância no singular ou plural. "Haver" no sentido de existir é impessoal (singular). "Fazer" indicando tempo é impessoal. "Vende-se casas" - o correto é "Vendem-se casas" (voz passiva sintética).' },
  { subject: 'Língua Portuguesa', ano: 2024, nivel: 'medio',
    enunciado: 'Assinale a alternativa em que o emprego da crase está correto:',
    alternativas: '[{"key":"A","text":"Entreguei o documento à ela."},{"key":"B","text":"Fui à praia no domingo."},{"key":"C","text":"Paguei à conta no banco."},{"key":"D","text":"Comecei à trabalhar cedo."},{"key":"E","text":"Refiro-me àquele senhor."}]',
    correta: 'B', explicacao: 'Crase correta antes de palavra feminina determinada: "fui à praia" (a + a). Antes de pronome pessoal ("ela") não há crase. "Paguei a conta" - verbo transitivo direto, sem preposição.' },
  { subject: 'Língua Portuguesa', ano: 2025, nivel: 'superior',
    enunciado: 'Na frase "O livro que li é excelente", o termo "que" classifica-se como:',
    alternativas: '[{"key":"A","text":"Conjunção integrante."},{"key":"B","text":"Pronome relativo."},{"key":"C","text":"Conjunção causal."},{"key":"D","text":"Partícula expletiva."},{"key":"E","text":"Preposição."}]',
    correta: 'B', explicacao: '"Que" retoma o termo anterior "livro" e exerce função sintática de objeto direto de "li". É pronome relativo, equivalendo a "o qual".' },
  { subject: 'Língua Portuguesa', ano: 2025, nivel: 'medio',
    enunciado: 'Assinale a alternativa em que a regência verbal está correta:',
    alternativas: '[{"key":"A","text":"Assisti o filme ontem."},{"key":"B","text":"Obedeça os pais."},{"key":"C","text":"Preferia estudar do que trabalhar."},{"key":"D","text":"Lembrei-me do compromisso."},{"key":"E","text":"Implicou com o colega."}]',
    correta: 'D', explicacao: 'Lembrar-se é pronominal e exige preposição "de": lembrar-se de algo. Assistir (ver) exige "a": assistir ao filme. Obedecer exige "a": obedecer aos pais. Preferir não aceita "do que": prefiro X a Y.' },
  { subject: 'Língua Portuguesa', ano: 2026, nivel: 'medio',
    enunciado: 'O fenômeno da próclise ocorre quando o pronome oblíquo átono é colocado:',
    alternativas: '[{"key":"A","text":"Depois do verbo."},{"key":"B","text":"Antes do verbo."},{"key":"C","text":"No meio do verbo."},{"key":"D","text":"Após o sujeito."},{"key":"E","text":"No final da frase."}]',
    correta: 'B', explicacao: 'Próclise: pronome antes do verbo (ex: "não me diga"). Ênclise: depois do verbo (ex: "disse-me"). Mesóclise: no meio (ex: "far-lhe-ei").' },

  // ===== RACIOCÍNIO LÓGICO =====
  { subject: 'Raciocínio Lógico', ano: 2025, nivel: 'medio',
    enunciado: 'Se todos os A são B e nenhum B é C, pode-se concluir que:',
    alternativas: '[{"key":"A","text":"Todos os C são A."},{"key":"B","text":"Nenhum A é C."},{"key":"C","text":"Alguns C são A."},{"key":"D","text":"Todos os B são A."},{"key":"E","text":"Nenhum C é B."}]',
    correta: 'B', explicacao: 'Se A está contido em B, e B não tem intersecção com C, então A também não tem intersecção com C. Logo, nenhum A é C.' },
  { subject: 'Raciocínio Lógico', ano: 2024, nivel: 'medio',
    enunciado: 'A negação de "Todos os alunos passaram na prova" é:',
    alternativas: '[{"key":"A","text":"Nenhum aluno passou na prova."},{"key":"B","text":"Alguns alunos não passaram na prova."},{"key":"C","text":"Todos os alunos não passaram na prova."},{"key":"D","text":"Existe aluno que passou na prova."},{"key":"E","text":"A maioria dos alunos passou na prova."}]',
    correta: 'B', explicacao: 'A negação de "todo" é "algum não" (ou "pelo menos um não"). Logo, "alguns alunos não passaram na prova".' },
  { subject: 'Raciocínio Lógico', ano: 2025, nivel: 'superior',
    enunciado: 'Em uma sequência numérica, cada termo é a soma dos dois anteriores: 1, 2, 3, 5, 8, 13, ... O próximo termo é:',
    alternativas: '[{"key":"A","text":"18"},{"key":"B","text":"19"},{"key":"C","text":"20"},{"key":"D","text":"21"},{"key":"E","text":"22"}]',
    correta: 'D', explicacao: 'Sequência de Fibonacci: 1+2=3, 2+3=5, 3+5=8, 5+8=13, 8+13=21. O próximo termo é 21.' },

  // ===== MATEMÁTICA =====
  { subject: 'Matemática', ano: 2025, nivel: 'fundamental',
    enunciado: 'Um trabalhador recebe R$ 1.500,00 de salário e tem um desconto de 8% de INSS. Qual o valor do desconto?',
    alternativas: '[{"key":"A","text":"R$ 100,00"},{"key":"B","text":"R$ 120,00"},{"key":"C","text":"R$ 140,00"},{"key":"D","text":"R$ 150,00"},{"key":"E","text":"R$ 80,00"}]',
    correta: 'B', explicacao: '8% de 1.500 = 1.500 × 0,08 = R$ 120,00.' },
  { subject: 'Matemática', ano: 2024, nivel: 'fundamental',
    enunciado: 'Em uma prova de 40 questões, um candidato acertou 32. Qual foi seu percentual de acertos?',
    alternativas: '[{"key":"A","text":"70%"},{"key":"B","text":"75%"},{"key":"C","text":"80%"},{"key":"D","text":"85%"},{"key":"E","text":"90%"}]',
    correta: 'C', explicacao: '32/40 = 0,80 = 80% de acertos.' },
  { subject: 'Matemática', ano: 2025, nivel: 'medio',
    enunciado: 'Um capital de R$ 2.000,00 aplicado a juros simples de 2% ao mês por 6 meses produz qual montante?',
    alternativas: '[{"key":"A","text":"R$ 2.200,00"},{"key":"B","text":"R$ 2.240,00"},{"key":"C","text":"R$ 2.260,00"},{"key":"D","text":"R$ 2.300,00"},{"key":"E","text":"R$ 2.400,00"}]',
    correta: 'B', explicacao: 'J = C × i × t = 2000 × 0,02 × 6 = R$ 240. M = C + J = 2000 + 240 = R$ 2.240,00.' },

  // ===== CONTABILIDADE GERAL =====
  { subject: 'Contabilidade Geral', ano: 2025, nivel: 'superior',
    enunciado: 'O princípio contábil que determina que as receitas e despesas devem ser reconhecidas no período em que ocorrem, independentemente do recebimento ou pagamento, é o princípio:',
    alternativas: '[{"key":"A","text":"Da entidade."},{"key":"B","text":"Da continuidade."},{"key":"C","text":"Da competência."},{"key":"D","text":"Do registro pelo valor original."},{"key":"E","text":"Da prudência."}]',
    correta: 'C', explicacao: 'Princípio da Competência (Res. CFC 1.282/2010): receitas e despesas são reconhecidas no período de sua ocorrência, independentemente de recebimento ou pagamento.' },
  { subject: 'Contabilidade Geral', ano: 2024, nivel: 'superior',
    enunciado: 'No Balanço Patrimonial, o Patrimônio Líquido é composto por, EXCETO:',
    alternativas: '[{"key":"A","text":"Capital Social."},{"key":"B","text":"Reservas de Capital."},{"key":"C","text":"Reservas de Lucros."},{"key":"D","text":"Ações em Tesouraria."},{"key":"E","text":"Financiamentos de Longo Prazo."}]',
    correta: 'E', explicacao: 'Financiamentos de longo prazo são Passivo Não Circulante, não compõem o Patrimônio Líquido. PL = Capital + Reservas + Lucros/Prejuízos Acumulados - Ações em Tesouraria.' },

  // ===== ECONOMIA =====
  { subject: 'Economia', ano: 2025, nivel: 'superior',
    enunciado: 'A taxa Selic é definida como:',
    alternativas: '[{"key":"A","text":"A taxa de juros dos empréstimos bancários para pessoas físicas."},{"key":"B","text":"A taxa média dos juros praticados no mercado interbancário."},{"key":"C","text":"O índice oficial de inflação do Brasil."},{"key":"D","text":"A taxa de câmbio do dólar comercial."},{"key":"E","text":"A taxa de juros da caderneta de poupança."}]',
    correta: 'B', explicacao: 'Selic é a taxa média ajustada dos financiamentos diários no mercado interbancário (Sistema Especial de Liquidação e Custódia), sendo a taxa básica de juros da economia.' },
  { subject: 'Economia', ano: 2024, nivel: 'superior',
    enunciado: 'A inflação medida pelo IPCA é calculada pelo:',
    alternativas: '[{"key":"A","text":"Ministério da Economia."},{"key":"B","text":"Banco Central do Brasil."},{"key":"C","text":"Instituto Brasileiro de Geografia e Estatística (IBGE).},{"key":"D","text":"Instituto de Pesquisa Econômica Aplicada (IPEA).},{"key":"E","text":"Comissão de Valores Mobiliários (CVM)."}]',
    correta: 'C', explicacao: 'O IPCA (Índice de Preços ao Consumidor Amplo) é calculado pelo IBGE e é o índice oficial de inflação usado pelo Banco Central para o regime de metas.' },

  // ===== CONHECIMENTOS BANCÁRIOS =====
  { subject: 'Conhecimentos Bancários', ano: 2025, nivel: 'medio',
    enunciado: 'O spread bancário representa:',
    alternativas: '[{"key":"A","text":"A diferença entre a taxa de captação e a taxa de empréstimo do banco."},{"key":"B","text":"O valor dos impostos pagos pelo banco."},{"key":"C","text":"A taxa de juros cobrada pelo Banco Central."},{"key":"D","text":"O lucro líquido dividido pelo patrimônio líquido."},{"key":"E","text":"O índice de inadimplência da carteira."}]',
    correta: 'A', explicacao: 'Spread é a diferença entre o custo de captação (quanto o banco paga para captar recursos) e a taxa cobrada nos empréstimos.' },
  { subject: 'Conhecimentos Bancários', ano: 2024, nivel: 'medio',
    enunciado: 'O COPOM (Comitê de Política Monetária) é responsável por definir:',
    alternativas: '[{"key":"A","text":"A taxa de câmbio."},{"key":"B","text":"A meta da taxa Selic."},{"key":"C","text":"O IPCA."},{"key":"D","text":"O salário mínimo."},{"key":"E","text":"As alíquotas de impostos federais."}]',
    correta: 'B', explicacao: 'O COPOM, vinculado ao Banco Central, define a meta da taxa Selic (taxa básica de juros) a cada 45 dias.' },

  // ===== NOÇÕES DE INFORMÁTICA =====
  { subject: 'Noções de Informática', ano: 2025, nivel: 'medio',
    enunciado: 'No Microsoft Excel, a função =SOMA(A1:A10) retorna:',
    alternativas: '[{"key":"A","text":"A média dos valores de A1 a A10."},{"key":"B","text":"A soma dos valores de A1 a A10."},{"key":"C","text":"O maior valor entre A1 e A10."},{"key":"D","text":"O número de células preenchidas."},{"key":"E","text":"O produto dos valores de A1 a A10."}]',
    correta: 'B', explicacao: 'A função SOMA retorna a soma de todos os valores no intervalo especificado. =SOMA(A1:A10) soma os valores das células A1 até A10.' },
  { subject: 'Noções de Informática', ano: 2024, nivel: 'fundamental',
    enunciado: 'O atalho Ctrl+C no Windows é utilizado para:',
    alternativas: '[{"key":"A","text":"Colar um item."},{"key":"B","text":"Copiar um item."},{"key":"C","text":"Recortar um item."},{"key":"D","text":"Salvar um arquivo."},{"key":"E","text":"Imprimir um documento."}]',
    correta: 'B', explicacao: 'Ctrl+C = copiar. Ctrl+V = colar. Ctrl+X = recortar. Ctrl+S = salvar. Ctrl+P = imprimir.' },

  // ===== DIREITOS HUMANOS =====
  { subject: 'Direitos Humanos', ano: 2025, nivel: 'medio',
    enunciado: 'A Declaração Universal dos Direitos Humanos (1948) estabelece que:',
    alternativas: '[{"key":"A","text":"Os direitos humanos são concedidos pelo Estado."},{"key":"B","text":"Todos os seres humanos nascem livres e iguais em dignidade e direitos."},{"key":"C","text":"Os direitos humanos se aplicam apenas a cidadãos dos países signatários."},{"key":"D","text":"A tortura é permitida em casos de guerra."},{"key":"E","text":"A educação é um privilégio, não um direito."}]',
    correta: 'B', explicacao: 'Art. 1º da DUDH: "Todos os seres humanos nascem livres e iguais em dignidade e direitos." Os direitos humanos são inerentes à pessoa, não concedidos pelo Estado.' },

  // ===== GEOGRAFIA =====
  { subject: 'Geografia', ano: 2025, nivel: 'fundamental',
    enunciado: 'A Região Nordeste do Brasil é caracterizada por:',
    alternativas: '[{"key":"A","text":"Predomínio do clima equatorial e Floresta Amazônica."},{"key":"B","text":"Clima semiárido no sertão e clima tropical no litoral."},{"key":"C","text":"Clima subtropical com as quatro estações bem definidas."},{"key":"D","text":"Predomínio do clima tropical de altitude."},{"key":"E","text":"Clima mediterrâneo com invernos rigorosos."}]',
    correta: 'B', explicacao: 'O Nordeste possui clima semiárido no interior (sertão) e tropical no litoral (zona da mata). O clima equatorial predomina na Região Norte.' },

  // ===== LEGISLAÇÃO ESPECÍFICA =====
  { subject: 'SUS - Lei 8.080/90', ano: 2025, nivel: 'superior',
    enunciado: 'A Lei 8.080/90 dispõe sobre o SUS. Assinale a alternativa que apresenta um princípio doutrinário do SUS:',
    alternativas: '[{"key":"A","text":"Centralização administrativa."},{"key":"B","text":"Universalidade de acesso."},{"key":"C","text":"Privatização dos serviços."},{"key":"D","text":"Cobrança por procedimentos."},{"key":"E","text":"Gestão municipal exclusiva."}]',
    correta: 'B', explicacao: 'A universalidade (art. 7º, I, Lei 8.080/90) é um princípio doutrinário: acesso universal e igualitário às ações e serviços de saúde.' },
  { subject: 'SUS - Lei 8.080/90', ano: 2024, nivel: 'superior',
    enunciado: 'O SUS é financiado com recursos:',
    alternativas: '[{"key":"A","text":"Exclusivamente da União."},{"key":"B","text":"Da União, estados e municípios."},{"key":"C","text":"Apenas dos estados e municípios."},{"key":"D","text":"De doações e convênios internacionais."},{"key":"E","text":"Exclusivamente da seguridade social."}]',
    correta: 'B', explicacao: 'Art. 198, §1º, CF/88 e art. 33, Lei 8.080/90: o SUS é financiado com recursos da União, estados, Distrito Federal e municípios (tributos da seguridade social).' },
  { subject: 'Conhecimentos Pedagógicos', ano: 2025, nivel: 'superior',
    enunciado: 'A Lei de Diretrizes e Bases da Educação Nacional (Lei 9.394/96) estabelece que a educação básica é composta por:',
    alternativas: '[{"key":"A","text":"Educação infantil, ensino fundamental e ensino médio."},{"key":"B","text":"Ensino fundamental e ensino médio apenas."},{"key":"C","text":"Ensino superior e pós-graduação."},{"key":"D","text":"Educação infantil e ensino fundamental apenas."},{"key":"E","text":"Ensino médio e educação profissional."}]',
    correta: 'A', explicacao: 'Art. 21, LDB: educação básica = educação infantil, ensino fundamental e ensino médio. Educação superior não integra a educação básica.' },
  { subject: 'Estatuto da Criança e do Adolescente', ano: 2025, nivel: 'superior',
    enunciado: 'O ECA (Lei 8.069/90) considera criança a pessoa com idade de até:',
    alternativas: '[{"key":"A","text":"10 anos incompletos."},{"key":"B","text":"12 anos incompletos."},{"key":"C","text":"14 anos incompletos."},{"key":"D","text":"16 anos incompletos."},{"key":"E","text":"18 anos incompletos."}]',
    correta: 'B', explicacao: 'Art. 2º, ECA: criança = até 12 anos incompletos; adolescente = entre 12 e 18 anos.' },
  { subject: 'Lei de Execução Penal', ano: 2025, nivel: 'superior',
    enunciado: 'A Lei de Execução Penal (Lei 7.210/84) estabelece como direito do preso, EXCETO:',
    alternativas: '[{"key":"A","text":"Alimentação suficiente e vestuário."},{"key":"B","text":"Atribuição de trabalho interno."},{"key":"C","text":"Visita do cônjuge e parentes."},{"key":"D","text":"Proporcionalidade na distribuição do tempo para trabalho, descanso e lazer."},{"key":"E","text":"Acesso a aparelho celular."}]',
    correta: 'E', explicacao: 'O art. 41 da LEP lista os direitos do preso. Telefone celular não é direito do preso e seu ingresso é proibido em estabelecimentos prisionais.' },
  { subject: 'Bioética', ano: 2025, nivel: 'superior',
    enunciado: 'O princípio bioético da autonomia refere-se:',
    alternativas: '[{"key":"A","text":"Ao dever do médico de salvar vidas."},{"key":"B","text":"Ao direito do paciente de tomar decisões sobre seu tratamento."},{"key":"C","text":"À obrigação de não causar dano."},{"key":"D","text":"À justa distribuição de recursos de saúde."},{"key":"E","text":"Ao sigilo profissional absoluto."}]',
    correta: 'B', explicacao: 'Autonomia é o princípio que respeita a capacidade do paciente de decidir sobre seu próprio corpo e tratamento (consentimento livre e esclarecido).' },
  { subject: 'Epidemiologia', ano: 2024, nivel: 'superior',
    enunciado: 'A incidência de uma doença é definida como:',
    alternativas: '[{"key":"A","text":"O número total de casos existentes em uma população."},{"key":"B","text":"O número de casos novos em um período de tempo."},{"key":"C","text":"A proporção de óbitos por determinada doença."},{"key":"D","text":"A distribuição geográfica dos casos."},{"key":"E","text":"A taxa de letalidade da doença."}]',
    correta: 'B', explicacao: 'Incidência = casos novos em um período. Prevalência = casos existentes (novos + antigos) em um momento.' },
]

async function main() {
  console.log('Buscando concursos, disciplinas e bancas...\n')

  const [concursos, disciplinas, bancas] = await Promise.all([
    supabase.from('concursos').select('id, titulo'),
    supabase.from('disciplinas').select('id, nome, concurso_id'),
    supabase.from('bancas').select('id, sigla'),
  ])

  if (concursos.error || disciplinas.error || bancas.error) {
    console.error('Erro ao buscar dados:', concursos.error || disciplinas.error || bancas.error)
    process.exit(1)
  }

  const concursoMap = new Map(concursos.data!.map(c => [c.id, c.titulo]))
  const disciplinaBySubject = new Map<string, { id: string; concursoId: string }[]>()
  for (const d of disciplinas.data!) {
    if (!d.concurso_id) continue
    const list = disciplinaBySubject.get(d.nome) || []
    list.push({ id: d.id, concursoId: d.concurso_id })
    disciplinaBySubject.set(d.nome, list)
  }

  const subjectToDisciplinaName: Record<string, string> = {
    'Direito Constitucional': 'Direito Constitucional',
    'Direito Administrativo': 'Direito Administrativo',
    'Direito Penal': 'Direito Penal',
    'Direito Processual Penal': 'Direito Processual Penal',
    'Direito Civil': 'Direito Civil',
    'Direito Processual Civil': 'Direito Processual Civil',
    'Direito do Trabalho': 'Direito do Trabalho',
    'Direito Processual do Trabalho': 'Direito Processual do Trabalho',
    'Direito Tributário': 'Direito Tributário',
    'Direito Previdenciário': 'Direito Previdenciário',
    'Direito Eleitoral': 'Direito Eleitoral',
    'Direito Penal Militar': 'Direito Penal Militar',
    'Direitos Humanos': 'Direitos Humanos',
    'Língua Portuguesa': 'Língua Portuguesa',
    'Raciocínio Lógico': 'Raciocínio Lógico',
    'Matemática': 'Matemática',
    'Contabilidade Geral': 'Contabilidade Geral',
    'Economia': 'Economia',
    'Conhecimentos Bancários': 'Conhecimentos Bancários',
    'Noções de Informática': 'Noções de Informática',
    'Geografia': 'Geografia',
    'SUS - Lei 8.080/90': 'SUS - Lei 8.080/90',
    'Conhecimentos Pedagógicos': 'Conhecimentos Pedagógicos',
    'Estatuto da Criança e do Adolescente': 'Estatuto da Criança e do Adolescente',
    'Lei de Execução Penal': 'Lei de Execução Penal',
    'Bioética': 'Bioética',
    'Epidemiologia': 'Epidemiologia',
  }

  const rows: any[] = []
  let matched = 0
  let skipped = 0

  for (const questao of questoes) {
    const discName = subjectToDisciplinaName[questao.subject]
    if (!discName) {
      console.log(`  ! Subject "${questao.subject}" sem mapeamento`)
      skipped++
      continue
    }

    const targets = disciplinaBySubject.get(discName)
    if (!targets || targets.length === 0) {
      skipped++
      continue
    }

    for (const target of targets) {
      const concursoTitulo = concursoMap.get(target.concursoId) || 'desconhecido'
      rows.push({
        enunciado: questao.enunciado,
        alternativas: questao.alternativas,
        correta: questao.correta,
        explicacao: questao.explicacao,
        concurso_id: target.concursoId,
        disciplina_id: target.id,
        ano: questao.ano,
        nivel: questao.nivel,
      })
      matched++
    }
  }

  console.log(`Questões no banco: ${questoes.length} únicas`)
  console.log(`Linhas a inserir (distribuídas): ${rows.length}`)
  console.log(`Disciplinas sem match: ${skipped}\n`)

  if (rows.length === 0) {
    console.log('Nada a inserir.')
    return
  }

  const BATCH_SIZE = 50
  let inserted = 0
  let errors = 0

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)
    const { error } = await supabase.from('questoes').insert(batch)
    if (error) {
      console.log(`  Erro no lote ${i / BATCH_SIZE + 1}: ${error.message}`)
      errors++
    } else {
      inserted += batch.length
    }
    await new Promise(r => setTimeout(r, 200))
  }

  console.log(`\nResumo: ${inserted} questões inseridas, ${errors} lotes com erro`)
}

main().catch(err => {
  console.error('Erro fatal:', err)
  process.exit(1)
})
