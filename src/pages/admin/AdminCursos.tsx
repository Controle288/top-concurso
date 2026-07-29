import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Pencil, Trash2, Save, X, GraduationCap } from 'lucide-react'
import type { Curso } from '@/types'

const categorias = [
  { value: 'idiomas', label: 'Idiomas' }, { value: 'musica', label: 'Música' },
  { value: 'artesanato', label: 'Artesanato' }, { value: 'informatica', label: 'Informática' },
  { value: 'negocios', label: 'Negócios' }, { value: 'saude', label: 'Saúde' }, { value: 'outros', label: 'Outros' },
]

const niveis = [
  { value: 'iniciante', label: 'Iniciante' }, { value: 'intermediario', label: 'Intermediário' }, { value: 'avancado', label: 'Avançado' },
]

export default function AdminCursos() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState({ titulo: '', descricao: '', categoria: 'outros', nivel: 'iniciante', instrutor: '', carga_horaria_minutos: 0, preco: 0, thumbnail_url: '', video_apresentacao: '', ativo: true })

  const { data: cursos = [], isLoading } = useQuery<Curso[]>({
    queryKey: ['cursos'],
    queryFn: async () => {
      const { data } = await supabase.from('cursos').select('*').order('created_at', { ascending: false })
      return data ?? []
    },
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['cursos'] })

  const resetForm = () => {
    setForm({ titulo: '', descricao: '', categoria: 'outros', nivel: 'iniciante', instrutor: '', carga_horaria_minutos: 0, preco: 0, thumbnail_url: '', video_apresentacao: '', ativo: true })
    setEditing(null)
    setShowForm(false)
  }

  const handleSave = async () => {
    if (!form.titulo || !form.instrutor) return
    if (editing) {
      await supabase.from('cursos').update(form).eq('id', editing)
    } else {
      await supabase.from('cursos').insert(form)
    }
    resetForm()
    invalidate()
  }

  const handleEdit = (c: Curso) => {
    setForm({ titulo: c.titulo, descricao: c.descricao || '', categoria: c.categoria, nivel: c.nivel || 'iniciante', instrutor: c.instrutor, carga_horaria_minutos: c.carga_horaria_minutos, preco: c.preco, thumbnail_url: c.thumbnail_url || '', video_apresentacao: c.video_apresentacao || '', ativo: c.ativo })
    setEditing(c.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este curso?')) return
    await supabase.from('cursos').delete().eq('id', id)
    invalidate()
  }

  return (
    <div className="flex flex-col gap-5 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="p-2 rounded-xl hover:bg-zinc-900/60 text-zinc-500 hover:text-zinc-300 transition-all"><ArrowLeft className="w-5 h-5" /></button>
          <div><span className="text-orange-500 text-xs font-bold uppercase tracking-wider block">Admin</span><h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2"><GraduationCap className="w-5 h-5" /> Cursos Livres</h2></div>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition-all"><Plus className="w-4 h-4" /> Novo Curso</button>
      </div>

      {showForm && (
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between"><h3 className="text-sm font-bold text-white">{editing ? 'Editar' : 'Novo'} Curso</h3><button onClick={resetForm} className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-500"><X className="w-4 h-4" /></button></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Título</label><input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50" /></div>
            <div className="space-y-1"><label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Instrutor</label><input value={form.instrutor} onChange={e => setForm({ ...form, instrutor: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50" /></div>
            <div className="space-y-1"><label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Categoria</label><select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50">{categorias.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
            <div className="space-y-1"><label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Nível</label><select value={form.nivel} onChange={e => setForm({ ...form, nivel: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50">{niveis.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}</select></div>
            <div className="space-y-1"><label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Carga Horária (minutos)</label><input type="number" value={form.carga_horaria_minutos} onChange={e => setForm({ ...form, carga_horaria_minutos: Number(e.target.value) })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50" /></div>
            <div className="space-y-1"><label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Preço (0 = grátis)</label><input type="number" step="0.01" value={form.preco} onChange={e => setForm({ ...form, preco: Number(e.target.value) })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50" /></div>
            <div className="md:col-span-2 space-y-1"><label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Descrição</label><textarea value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} rows={3} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50 resize-none" /></div>
            <div className="space-y-1"><label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">URL da Thumbnail</label><input value={form.thumbnail_url} onChange={e => setForm({ ...form, thumbnail_url: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50" /></div>
            <div className="space-y-1"><label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">YouTube ID (apresentação)</label><input value={form.video_apresentacao} onChange={e => setForm({ ...form, video_apresentacao: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50" /></div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition-all"><Save className="w-4 h-4" /> Salvar</button>
            <button onClick={resetForm} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-xl transition-all">Cancelar</button>
          </div>
        </div>
      )}

      <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800/50 text-zinc-500 text-[11px] font-bold uppercase tracking-wider">
                <th className="text-left px-5 py-3">Curso</th><th className="text-left px-5 py-3">Categoria</th><th className="text-left px-5 py-3">Instrutor</th><th className="text-center px-5 py-3">Ativo</th><th className="text-right px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-zinc-600">Carregando...</td></tr>
              ) : cursos.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-zinc-600">Nenhum curso cadastrado</td></tr>
              ) : cursos.map(curso => (
                <tr key={curso.id} className="border-b border-zinc-800/30 text-zinc-300 hover:bg-zinc-900/30">
                  <td className="px-5 py-3 font-medium">{curso.titulo}</td>
                  <td className="px-5 py-3 text-zinc-500">{categorias.find(c => c.value === curso.categoria)?.label || curso.categoria}</td>
                  <td className="px-5 py-3 text-zinc-500">{curso.instrutor}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full ${curso.ativo ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{curso.ativo ? 'Sim' : 'Não'}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleEdit(curso)} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-orange-400"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(curso.id)} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}