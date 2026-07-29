import { useSupabaseQuery } from './index'
import { supabase } from '@/lib/supabase'
import type { Questao } from '@/types'

const PAGE_SIZE = 20

export interface QuestaoFilters {
  banca?: string
  ano?: string
  disciplina?: string
  concurso?: string
  nivel?: string
  search?: string
  page?: number
}

export function useQuestoes(filters: QuestaoFilters = {}) {
  const { banca, ano, disciplina, concurso, nivel, search, page = 0 } = filters

  return useSupabaseQuery<Questao[]>(
    ['questoes', filters],
    async () => {
      let query = supabase
        .from('questoes')
        .select('*, bancas(nome), disciplinas(nome), concursos(titulo)')
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

      if (banca) query = query.eq('banca_id', banca)
      if (ano) query = query.eq('ano', parseInt(ano))
      if (disciplina) query = query.eq('disciplina_id', disciplina)
      if (concurso) query = query.eq('concurso_id', concurso)
      if (nivel) query = query.eq('nivel', nivel)
      if (search) query = query.ilike('enunciado', `%${search}%`)

      const { data } = await query
      return data ?? []
    },
  )
}

export function useQuestoesCount(filters: QuestaoFilters = {}) {
  const { banca, ano, disciplina, concurso, nivel, search } = filters

  return useSupabaseQuery<number>(
    ['questoes', 'count', filters],
    async () => {
      let query = supabase
        .from('questoes')
        .select('*', { count: 'exact', head: true })

      if (banca) query = query.eq('banca_id', banca)
      if (ano) query = query.eq('ano', parseInt(ano))
      if (disciplina) query = query.eq('disciplina_id', disciplina)
      if (concurso) query = query.eq('concurso_id', concurso)
      if (nivel) query = query.eq('nivel', nivel)
      if (search) query = query.ilike('enunciado', `%${search}%`)

      const { count } = await query
      return count ?? 0
    },
  )
}

export function useBancas() {
  return useSupabaseQuery(
    ['bancas'],
    async () => {
      const { data } = await supabase.from('bancas').select('id, nome, sigla')
      return data ?? []
    },
  )
}

export function useDisciplinas() {
  return useSupabaseQuery(
    ['disciplinas'],
    async () => {
      const { data } = await supabase.from('disciplinas').select('id, nome')
      return data ?? []
    },
  )
}

export function useFiltrosConcursos() {
  return useSupabaseQuery(
    ['filtros_concursos'],
    async () => {
      const { data } = await supabase.from('concursos').select('id, titulo')
      return data ?? []
    },
  )
}

export function useAnosDisponiveis() {
  return useSupabaseQuery<number[]>(
    ['anos_disponiveis'],
    async () => {
      const { data } = await supabase.from('questoes').select('ano').not('ano', 'is', null).order('ano', { ascending: false })
      return [...new Set(data?.map(a => a.ano) ?? [])].filter(Boolean) as number[]
    },
  )
}
