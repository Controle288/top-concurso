import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function usePdfs() {
  return useQuery<any[]>({
    queryKey: ['pdfs'],
    queryFn: async () => {
      const { data } = await supabase.from('pdfs').select('*').order('created_at', { ascending: false })
      return data ?? []
    },
  })
}
