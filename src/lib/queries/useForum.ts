import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import type { ForumTopic, ForumComment } from '@/types'

export function useForumTopics() {
  return useQuery<ForumTopic[]>({
    queryKey: ['forum_topics'],
    queryFn: async () => {
      const { data } = await supabase.from('forum_topics').select('*, profiles!forum_topics_user_id_fkey(nome)').order('created_at', { ascending: false })
      return data ?? []
    },
  })
}

export function useForumComments(topicId: string) {
  return useQuery<ForumComment[]>({
    queryKey: ['forum_comments', topicId],
    queryFn: async () => {
      const { data } = await supabase.from('forum_comments').select('*, profiles!forum_comments_user_id_fkey(nome)').eq('topic_id', topicId).order('created_at')
      return data ?? []
    },
    enabled: !!topicId,
  })
}

export function useCreateForumTopic() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { titulo: string; descricao: string; user_id: string }) => {
      const { error } = await supabase.from('forum_topics').insert(payload)
      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Tópico criado!')
      queryClient.invalidateQueries({ queryKey: ['forum_topics'] })
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : 'Erro ao criar tópico'),
  })
}

export function useCreateForumComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { topic_id: string; user_id: string; conteudo: string }) => {
      const { error } = await supabase.from('forum_comments').insert(payload)
      if (error) throw error
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['forum_comments', variables.topic_id] })
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : 'Erro ao enviar comentário'),
  })
}

export function useUpdateForumTopicStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('forum_topics').update({ status }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum_topics'] })
    },
  })
}

export function useDeleteForumTopic() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('forum_topics').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Tópico excluído')
      queryClient.invalidateQueries({ queryKey: ['forum_topics'] })
    },
  })
}
