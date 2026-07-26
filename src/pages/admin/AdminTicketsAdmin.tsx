import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket as TicketIcon, Send, User, MessageCircle } from 'lucide-react';
import type { Ticket as TicketType, TicketMessage } from '@/types';

interface TicketWithAuthor extends TicketType {
  profiles?: { nome: string } | null
}

interface TicketMessageWithAuthor extends TicketMessage {
  profiles?: { nome: string; role?: string } | null
}

export default function AdminTicketsAdmin() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<TicketWithAuthor[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketWithAuthor | null>(null);
  const [messages, setMessages] = useState<TicketMessageWithAuthor[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadTickets = () => {
    supabase.from('tickets').select('*, profiles!tickets_user_id_fkey(nome)').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setTickets(data as TicketWithAuthor[]);
      setLoading(false);
    });
  };

  useEffect(() => { loadTickets(); }, []);

  const loadMessages = (ticketId: string) => {
    supabase.from('ticket_messages').select('*, profiles!ticket_messages_user_id_fkey(nome, role)').eq('ticket_id', ticketId).order('created_at', { ascending: true }).then(({ data }) => {
      if (data) setMessages(data as TicketMessageWithAuthor[]);
    });
  };

  const openTicket = (t: TicketWithAuthor) => {
    setSelectedTicket(t);
    loadMessages(t.id);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedTicket) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('ticket_messages').insert({ ticket_id: selectedTicket.id, user_id: user.id, mensagem: newMessage });
    if (error) return;
    await supabase.from('tickets').update({ status: 'respondido', updated_at: new Date().toISOString() }).eq('id', selectedTicket.id);
    setNewMessage('');
    loadMessages(selectedTicket.id);
    loadTickets();
  };

  const closeTicket = async (id: string) => {
    await supabase.from('tickets').update({ status: 'fechado', updated_at: new Date().toISOString() }).eq('id', id);
    setSelectedTicket(null);
    loadTickets();
  };

  if (selectedTicket) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedTicket(null)} className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-white truncate">{selectedTicket.assunto}</h2>
          </div>
          {selectedTicket.status !== 'fechado' && (
            <button onClick={() => closeTicket(selectedTicket.id)} className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-xl font-bold uppercase">Fechar</button>
          )}
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 mb-1">
            <User className="w-3 h-3" /> {selectedTicket.profiles?.nome || 'Usuário'}
          </div>
          <p className="text-xs text-zinc-300">{selectedTicket.descricao}</p>
        </div>

        <div className="space-y-3 flex-1">
          {messages.map((m: any) => (
            <div key={m.id} className={`flex ${m.profiles?.role === 'admin' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3.5 ${m.profiles?.role === 'admin' ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-zinc-900/60 border border-zinc-800/60'}`}>
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
            <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Digite sua resposta..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
            <button onClick={handleSend} disabled={!newMessage.trim()} className="bg-orange-500 text-black p-3 rounded-xl disabled:bg-zinc-800 disabled:text-zinc-600 transition-all"><Send className="w-4 h-4" /></button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/admin')} className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <span className="text-orange-500 text-[10px] font-bold uppercase tracking-wider">Admin</span>
          <h2 className="text-lg font-black text-white flex items-center gap-2"><TicketIcon className="w-5 h-5 text-orange-500" /> Tickets</h2>
        </div>
      </div>

      {loading ? <p className="text-center text-zinc-500 py-8">Carregando...</p> : tickets.length === 0 ? (
        <p className="text-center text-zinc-500 py-8">Nenhum ticket recebido.</p>
      ) : (
        <div className="space-y-2">
          {tickets.map(t => (
            <div key={t.id} onClick={() => openTicket(t)} className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 cursor-pointer hover:border-zinc-700/80 transition-all">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-zinc-100">{t.assunto}</h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{t.profiles?.nome || 'Usuário'}</p>
                </div>
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                  t.status === 'aberto' ? 'bg-emerald-500/10 text-emerald-400' :
                  t.status === 'respondido' ? 'bg-orange-500/10 text-orange-400' :
                  'bg-zinc-800 text-zinc-500'
                }`}>
                  {t.status === 'respondido' ? 'Respondido' : t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
