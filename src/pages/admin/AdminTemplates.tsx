import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Pencil, Trash2, Save, X, BookTemplate, ChevronDown, ChevronUp } from 'lucide-react'
import { useTemplates, useCriarTemplate, useAtualizarTemplate, useDeletarTemplate, useCriarTemplateMateria, useDeletarTemplateMateria } from '@/lib/queries/useTemplates'

export default function AdminTemplates() {
  const navigate = useNavigate()
  const { data: templates = [], isLoading } = useTemplates()
  const criar = useCriarTemplate()
  const atualizar = useAtualizarTemplate()
  const deletar = useDeletarTemplate()
  const criarMateria = useCriarTemplateMateria()
  const deletarMateria = useDeletarTemplateMateria()

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [nome, setNome] = useState('')
  const [orgaoPattern, setOrgaoPattern] = useState('')
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null)
  const [novaDisciplina, setNovaDisciplina] = useState('')
  const [novaMateria, setNovaMateria] = useState('')

  const resetForm = () => {
    setNome('')
    setOrgaoPattern('')
    setEditing(null)
    setShowForm(false)
  }

  const handleSave = () => {
    if (!nome.trim() || !orgaoPattern.trim()) return
    if (editing) {
      atualizar.mutate({ id: editing, nome: nome.trim(), orgao_pattern: orgaoPattern.trim() }, { onSuccess: resetForm })
    } else {
      criar.mutate({ nome: nome.trim(), orgao_pattern: orgaoPattern.trim() }, { onSuccess: resetForm })
    }
  }

  const handleEdit = (t: any) => {
    setNome(t.nome)
    setOrgaoPattern(t.orgao_pattern)
    setEditing(t.id)
    setShowForm(true)
  }

  const handleAddMateria = (templateId: string) => {
    if (!novaDisciplina.trim() || !novaMateria.trim()) return
    const template = templates.find(t => t.id === templateId)
    const maxOrdem = template?.template_materias?.length ?? 0
    criarMateria.mutate(
      { template_id: templateId, disciplina_nome: novaDisciplina.trim(), materia_nome: novaMateria.trim(), ordem: maxOrdem + 1 },
      { onSuccess: () => { setNovaDisciplina(''); setNovaMateria('') } }
    )
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <span className="text-orange-500 text-[10px] font-bold uppercase tracking-wider">Admin</span>
            <h2 className="text-lg font-black text-white flex items-center gap-2"><BookTemplate className="w-5 h-5 text-orange-500" /> Templates</h2>
          </div>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-orange-500 text-black p-2.5 rounded-full shadow-md hover:bg-orange-600 transition-all">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showForm && (
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 space-y-3">
          <input value={nome} onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do template (ex: Polícia Federal)"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
          <input value={orgaoPattern} onChange={(e) => setOrgaoPattern(e.target.value)}
            placeholder="Pattern regex (ex: Polícia Federal|PF|DPF)"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
          <p className="text-[10px] text-zinc-600">Use | para separar variações do nome do órgão</p>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={!nome.trim() || !orgaoPattern.trim()}
              className="flex-1 bg-orange-500 text-black font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-500 transition-all">
              <Save className="w-4 h-4" /> {editing ? 'Atualizar' : 'Criar'}
            </button>
            <button onClick={resetForm} className="px-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center text-zinc-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {isLoading ? <p className="text-center text-zinc-500 py-8">Carregando...</p> : templates.length === 0 ? (
        <p className="text-center text-zinc-500 py-8">Nenhum template cadastrado.</p>
      ) : (
        <div className="space-y-2">
          {templates.map(t => (
            <div key={t.id} className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-zinc-100">{t.nome}</h3>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{t.orgao_pattern}</p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">{t.template_materias?.length || 0} matérias</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => { setExpandedTemplate(expandedTemplate === t.id ? null : t.id) }}
                      className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200">
                      {expandedTemplate === t.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => handleEdit(t)} className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-orange-500"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => { if (confirm(`Excluir template "${t.nome}"?`)) deletar.mutate(t.id) }}
                      className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>

              {expandedTemplate === t.id && (
                <div className="border-t border-zinc-800/60 px-4 py-3 space-y-2">
                  {t.template_materias?.length === 0 ? (
                    <p className="text-xs text-zinc-600 text-center py-2">Nenhuma matéria neste template</p>
                  ) : (
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                      {(t.template_materias || []).sort((a, b) => a.ordem - b.ordem).map(tm => (
                        <div key={tm.id} className="flex items-center justify-between bg-zinc-950/50 rounded-xl px-3 py-2">
                          <div className="flex-1 min-w-0">
                            <span className="text-xs text-zinc-300">{tm.materia_nome}</span>
                            <span className="text-[10px] text-zinc-600 ml-2">{tm.disciplina_nome} • #{tm.ordem}</span>
                          </div>
                          <button onClick={() => { if (confirm(`Excluir "${tm.materia_nome}"?`)) deletarMateria.mutate(tm.id) }}
                            className="p-1 text-zinc-600 hover:text-red-400 shrink-0"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t border-zinc-800/40">
                    <input value={novaDisciplina} onChange={(e) => setNovaDisciplina(e.target.value)}
                      placeholder="Disciplina"
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
                    <input value={novaMateria} onChange={(e) => setNovaMateria(e.target.value)}
                      placeholder="Matéria"
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
                    <button onClick={() => handleAddMateria(t.id)} disabled={!novaDisciplina.trim() || !novaMateria.trim()}
                      className="bg-orange-500 text-black px-3 rounded-xl text-xs font-bold hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all">
                      +</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
