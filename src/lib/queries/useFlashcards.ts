import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import type { Flashcard } from '@/types'

export function useFlashcards(userId: string | undefined) {
  return useQuery<Flashcard[]>({
    queryKey: ['flashcards', userId],
    queryFn: async () => {
      const { data } = await supabase.from('flashcards').select('*').eq('user_id', userId!)
      return data ?? []
    },
    enabled: !!userId,
  })
}

export function useSyncFlashcards() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (flashcards: { id?: string; user_id: string; front: string; back: string; box: number; next_review: string }[]) => {
      const { error } = await supabase.from('flashcards').upsert(flashcards, { onConflict: 'id' })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] })
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : 'Erro ao salvar flashcards'),
  })
}
