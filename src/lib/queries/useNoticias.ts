import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Noticia } from '@/types'

export function useNoticias() {
  return useQuery<Noticia[]>({
    queryKey: ['noticias'],
    queryFn: async () => {
      const { data } = await supabase.from('noticias').select('*').order('created_at', { ascending: false }).limit(10)
      return data ?? []
    },
  })
}
