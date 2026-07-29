import { useNoticias } from '@/lib/queries/useNoticias'
import { Newspaper, Megaphone, FileText, AlertTriangle, ExternalLink } from 'lucide-react'

const tipoIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  noticia: Newspaper,
  edital: FileText,
  dica: Megaphone,
  aviso: AlertTriangle,
}

const tipoColor: Record<string, string> = {
  noticia: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  edital: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  dica: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  aviso: 'text-red-400 bg-red-500/10 border-red-500/20',
}

export default function NewsMural() {
  const { data: noticias = [] } = useNoticias()

  if (noticias.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-md font-bold text-white tracking-tight flex items-center gap-2">
        <span className="w-1.5 h-4 bg-orange-500 rounded-full"></span>
        Mural de Notícias
      </h2>
      <div className="space-y-2">
        {noticias.map((n) => {
          const Icon = tipoIcon[n.tipo] || Newspaper;
          return (
            <div key={n.id} className="bg-zinc-900/60 rounded-xl p-3.5 border border-zinc-800/80 flex gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${tipoColor[n.tipo] || tipoColor.noticia}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-zinc-100 line-clamp-1">{n.titulo}</h3>
                <p className="text-xs text-zinc-400 line-clamp-2 mt-0.5">{n.conteudo}</p>
                {n.link_url && (
                  <a href={n.link_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-orange-500 font-bold flex items-center gap-1 mt-1 hover:underline">
                    <ExternalLink className="w-3 h-3" /> Ler mais
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
