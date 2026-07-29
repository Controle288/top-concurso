import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

export function useProfiles() {
  return useQuery<Profile[]>({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*')
      return data ?? []
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, nome }: { id: string; nome: string }) => {
      const { error } = await supabase.from('profiles').update({ nome }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Perfil atualizado!')
      queryClient.invalidateQueries({ queryKey: ['profiles'] })
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : 'Erro ao atualizar perfil'),
  })
}

export function useToggleAdmin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: 'user' | 'admin' }) => {
      const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Permissão alterada!')
      queryClient.invalidateQueries({ queryKey: ['profiles'] })
    },
  })
}
