import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import type { Ticket, TicketMessage } from '@/types'

export function useTickets(userId?: string) {
  return useQuery<Ticket[]>({
    queryKey: ['tickets', userId],
    queryFn: async () => {
      let query = supabase.from('tickets').select('*, profiles!tickets_user_id_fkey(nome)').order('created_at', { ascending: false })
      if (userId) query = query.eq('user_id', userId)
      const { data } = await query
      return data ?? []
    },
    enabled: true,
  })
}

export function useTicketMessages(ticketId: string) {
  return useQuery<TicketMessage[]>({
    queryKey: ['ticket_messages', ticketId],
    queryFn: async () => {
      const { data } = await supabase.from('ticket_messages').select('*, profiles!ticket_messages_user_id_fkey(nome, role)').eq('ticket_id', ticketId).order('created_at')
      return data ?? []
    },
    enabled: !!ticketId,
  })
}

export function useCreateTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { user_id: string; assunto: string; descricao: string }) => {
      const { error } = await supabase.from('tickets').insert(payload)
      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Ticket criado!')
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : 'Erro ao criar ticket'),
  })
}

export function useSendTicketMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { ticket_id: string; user_id: string; mensagem: string }) => {
      const { error } = await supabase.from('ticket_messages').insert(payload)
      if (error) throw error
      await supabase.from('tickets').update({ status: 'respondido' }).eq('id', payload.ticket_id)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ticket_messages', variables.ticket_id] })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
  })
}

export function useCloseTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tickets').update({ status: 'fechado' }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Ticket fechado')
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
  })
}
