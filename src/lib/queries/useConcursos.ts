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
      const { data } = await supabase.from('concursos').select('*').eq('status', 'aberto').order('data_prova', { ascending: true })
      return data ?? []
    },
  )
}
