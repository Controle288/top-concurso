import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/AuthContext'
import { MessageSquare, Send, User, Trash2 } from 'lucide-react'

interface Comment {
  id: string
  questao_id: string
  user_id: string
  autor_nome?: string
  conteudo: string
  created_at: string
}

interface QuestionCommentsProps {
  questaoId: string
}

export default function QuestionComments({ questaoId }: QuestionCommentsProps) {
  const { profile } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    loadComments()
  }, [questaoId])

  const loadComments = async () => {
    const { data } = await supabase
      .from('questao_comentarios')
      .select('*')
      .eq('questao_id', questaoId)
      .order('created_at', { ascending: true })
    if (data) setComments(data)
    setLoading(false)
  }

  const handleSend = async () => {
    if (!newComment.trim() || !profile?.id) return
    setSending(true)
    const { data } = await supabase.from('questao_comentarios').insert({
      questao_id: questaoId,
      user_id: profile.id,
      autor_nome: profile.nome,
      conteudo: newComment.trim(),
    }).select().single()

    if (data) {
      setComments(prev => [...prev, data])
      setNewComment('')
    }
    setSending(false)
  }

  const handleDelete = async (commentId: string, userId: string) => {
    if (profile?.id !== userId && profile?.role !== 'admin') return
    await supabase.from('questao_comentarios').delete().eq('id', commentId)
    setComments(prev => prev.filter(c => c.id !== commentId))
  }

  return (
    <div className="bg-zinc-900/60 rounded-2xl p-4 border border-zinc-800/80 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-4 h-4 text-orange-500" />
        <span className="text-sm font-bold text-zinc-200">Comentários ({comments.length})</span>
      </div>

      {/* New Comment */}
      {profile && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Discuta esta questão..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600"
          />
          <button onClick={handleSend} disabled={sending || !newComment.trim()}
            className="bg-orange-500 text-black p-2.5 rounded-xl hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all">
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2].map(i => <div key={i} className="skeleton h-12 w-full" />)}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-xs text-zinc-600 text-center py-3">Nenhum comentário ainda. Seja o primeiro!</p>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {comments.map(c => (
            <div key={c.id} className="bg-zinc-950/50 rounded-xl p-3">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <User className="w-3 h-3 text-zinc-500" />
                  <span className="text-[11px] font-bold text-zinc-300">{c.autor_nome || 'Anônimo'}</span>
                  <span className="text-[9px] text-zinc-600">
                    {new Date(c.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {(profile?.id === c.user_id || profile?.role === 'admin') && (
                  <button onClick={() => handleDelete(c.id, c.user_id)} className="text-zinc-600 hover:text-red-400 p-0.5">
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{c.conteudo}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
