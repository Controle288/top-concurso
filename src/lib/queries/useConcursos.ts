import { useSupabaseQuery } from './index'
import { supabase } from '@/lib/supabase'
import type { Concurso } from '@/types'

export function useConcursos() {
  return useSupabaseQuery<Concurso[]>(
    ['concursos'],
    async () => {
      const { data } = await supabase.from('concursos').select('*').order('created_at', { ascending: false })
      return data ?? []
    },
  )
}

export function useConcurso(id: string) {
  return useSupabaseQuery<Concurso | null>(
    ['concurso', id],
    async () => {
      const { data } = await supabase.from('concursos').select('*').eq('id', id).single()
      return data
    },
    { enabled: !!id },
  )
}

export function useConcursosAbertos() {
  return useSupabaseQuery<Concurso[]>(
    ['concursos', 'abertos'],
    async () => {
      const { data } = await supabase.from('concursos').select('*, bancas(nome)').order('data_prova', { ascending: true }).limit(10)
      return data ?? []
    },
  )
}

export function useBancas() {
  return useSupabaseQuery<{ id: string; nome: string }[]>(
    ['bancas'],
    async () => {
      const { data } = await supabase.from('bancas').select('id, nome').order('nome')
      return data ?? []
    },
  )
}

export function useDisciplinas() {
  return useSupabaseQuery<{ id: string; nome: string }[]>(
    ['disciplinas'],
    async () => {
      const { data } = await supabase.from('disciplinas').select('id, nome').order('nome')
      return data ?? []
    },
  )
}

export function useFiltrosConcursos() {
  return useSupabaseQuery<{ id: string; titulo: string }[]>(
    ['concursos_filtros'],
    async () => {
      const { data } = await supabase.from('concursos').select('id, titulo').order('titulo')
      return data ?? []
    },
  )
}

export function useAnosDisponiveis() {
  return useSupabaseQuery<{ ano: number }[]>(
    ['questoes_anos'],
    async () => {
      const { data } = await supabase.from('questoes').select('ano').order('ano', { ascending: false })
      return data ?? []
    },
  )
}
