import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import type { ConcursoTemplate, TemplateMateria } from '@/types'

interface TemplateWithMaterias extends ConcursoTemplate {
  template_materias: TemplateMateria[]
}

export function useTemplates() {
  return useQuery<TemplateWithMaterias[]>({
    queryKey: ['concurso_templates'],
    queryFn: async () => {
      const { data } = await supabase
        .from('concurso_templates')
        .select('*, template_materias(*)')
        .order('nome')
      return (data ?? []) as TemplateWithMaterias[]
    },
  })
}

export function usePopularMaterias() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (concursoId: string) => {
      const { data: concurso, error: concursoError } = await supabase
        .from('concursos')
        .select('titulo, orgao')
        .eq('id', concursoId)
        .single()
      if (concursoError || !concurso) throw new Error('Concurso não encontrado')

      const { data: templates } = await supabase
        .from('concurso_templates')
        .select('*, template_materias(*)')
      if (!templates || templates.length === 0) throw new Error('Nenhum template encontrado')

      const typed = templates as TemplateWithMaterias[]
      const match = typed.find(t =>
        new RegExp(t.orgao_pattern, 'i').test(concurso.orgao)
      )
      if (!match) throw new Error('Nenhum template encontrado para este órgão')

      const materias = match.template_materias ?? []
      if (materias.length === 0) throw new Error('Template vazio')

      const nomesDisciplinas = [...new Set(materias.map(m => m.disciplina_nome))]
      const disciplinasExistentes = new Map<string, string>()

      for (const nome of nomesDisciplinas) {
        const { data: existing } = await supabase
          .from('disciplinas')
          .select('id')
          .eq('concurso_id', concursoId)
          .eq('nome', nome)
          .maybeSingle()

        if (existing) {
          disciplinasExistentes.set(nome, existing.id)
        } else {
          const { data: nova } = await supabase
            .from('disciplinas')
            .insert({ concurso_id: concursoId, nome })
            .select('id')
            .single()
          if (nova) disciplinasExistentes.set(nome, nova.id)
        }
      }

      for (const tm of materias) {
        const disciplinaId = disciplinasExistentes.get(tm.disciplina_nome)
        if (!disciplinaId) continue

        const { data: existing } = await supabase
          .from('materias')
          .select('id')
          .eq('concurso_id', concursoId)
          .eq('disciplina_id', disciplinaId)
          .eq('nome', tm.materia_nome)
          .maybeSingle()

        if (!existing) {
          await supabase.from('materias').insert({
            concurso_id: concursoId,
            disciplina_id: disciplinaId,
            nome: tm.materia_nome,
            ordem: tm.ordem,
          })
        }
      }
    },
    onSuccess: () => {
      toast.success('Matérias importadas com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['materias'] })
      queryClient.invalidateQueries({ queryKey: ['disciplinas'] })
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : 'Erro ao popular matérias'),
  })
}
