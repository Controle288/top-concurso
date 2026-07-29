import { useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useTickets, useTicketMessages, useCreateTicket, useSendTicketMessage } from '@/lib/queries/useTickets'
import { HelpCircle, Plus, Send, X, ArrowLeft, User, MessageCircle } from 'lucide-react'
import SectionHeader from '../shared/SectionHeader'
import EmptyState from '../shared/EmptyState'
import LoadingSkeleton from '../shared/LoadingSkeleton'

export default function Tickets() {
  const { session } = useAuth()
  const userId = session?.user?.id
  const { data: tickets = [], isLoading } = useTickets(userId)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const { data: messages = [] } = useTicketMessages(selectedTicket?.id || '')
  const createTicket = useCreateTicket()
  const sendMessage = useSendTicketMessage()
  const [showForm, setShowForm] = useState(false)
  const [assunto, setAssunto] = useState('')
  const [descricao, setDescricao] = useState('')
  const [newMessage, setNewMessage] = useState('')

  const openTicket = (ticket: any) => {
    setSelectedTicket(ticket)
  }

  const handleCreateTicket = () => {
    if (!assunto.trim() || !descricao.trim() || !userId) return
    createTicket.mutate({ user_id: userId, assunto: assunto.trim(), descricao: descricao.trim() }, {
      onSuccess: () => {
        setAssunto('')
        setDescricao('')
        setShowForm(false)
      },
    })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket || !userId) return
    sendMessage.mutate({ ticket_id: selectedTicket.id, user_id: userId, mensagem: newMessage.trim() }, {
      onSuccess: () => setNewMessage(''),
    })
  }

  if (selectedTicket) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedTicket(null)} className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-white truncate">{selectedTicket.assunto}</h2>
          </div>
          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
            selectedTicket.status === 'aberto' ? 'bg-emerald-500/10 text-emerald-400' :
            selectedTicket.status === 'respondido' ? 'bg-orange-500/10 text-orange-400' :
            'bg-zinc-800 text-zinc-500'
          }`}>
            {selectedTicket.status === 'respondido' ? 'Respondido' : selectedTicket.status}
          </span>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4">
          <p className="text-xs text-zinc-300 leading-relaxed">{selectedTicket.descricao}</p>
        </div>

        <div className="space-y-3 flex-1">
          {messages.length === 0 && (
            <div className="text-center py-6">
              <MessageCircle className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
              <p className="text-xs text-zinc-500">Aguardando resposta do suporte.</p>
            </div>
          )}
          {messages.map((m: any) => (
            <div key={m.id} className={`flex gap-2.5 ${m.profiles?.role === 'admin' ? 'flex-row-reverse' : ''}`}>
              <div className={`bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-3.5 max-w-[85%] ${m.profiles?.role === 'admin' ? 'bg-orange-500/5 border-orange-500/20' : ''}`}>
                <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 mb-1">
                  <User className="w-2.5 h-2.5" /> {m.profiles?.nome || 'Usuário'}
                </div>
                <p className="text-xs text-zinc-200">{m.mensagem}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedTicket.status !== 'fechado' && (
          <div className="flex gap-2">
            <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
            <button onClick={handleSendMessage} disabled={!newMessage.trim() || sendMessage.isPending}
              className="bg-orange-500 text-black p-3 rounded-xl disabled:bg-zinc-800 disabled:text-zinc-600 transition-all">
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <SectionHeader
        icon={HelpCircle}
        title="Meus Tickets"
        subtitle="Entre em contato com o suporte"
        action={{ label: 'Novo Ticket', onClick: () => { setShowForm(true); setAssunto(''); setDescricao('') } }}
      />

      {showForm && (
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 space-y-3 animate-fadeIn">
          <input value={assunto} onChange={(e) => setAssunto(e.target.value)}
            placeholder="Assunto..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva sua dúvida..." rows={4}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600 resize-none" />
          <div className="flex gap-3">
            <button onClick={handleCreateTicket} disabled={createTicket.isPending} className="flex-1 bg-orange-500 hover:bg-orange-600 text-black font-extrabold py-3 rounded-xl transition-all">Abrir Ticket</button>
            <button onClick={() => setShowForm(false)} className="px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 rounded-xl transition-all"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton variant="list" lines={4} />
      ) : tickets.length === 0 ? (
        <EmptyState icon={HelpCircle} title="Nenhum ticket" description="Crie um ticket para entrar em contato com o suporte." />
      ) : (
        <div className="space-y-2.5">
          {tickets.map((t: any) => (
            <div key={t.id} onClick={() => openTicket(t)} className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 cursor-pointer hover:border-zinc-700/80 transition-all">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-zinc-100 line-clamp-1">{t.assunto}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{t.descricao}</p>
                </div>
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                  t.status === 'aberto' ? 'bg-emerald-500/10 text-emerald-400' :
                  t.status === 'respondido' ? 'bg-orange-500/10 text-orange-400' :
                  'bg-zinc-800 text-zinc-500'
                }`}>
                  {t.status === 'respondido' ? 'Respondido' : t.status}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-[10px] text-zinc-500">
                <MessageCircle className="w-3 h-3" /> {new Date(t.created_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
