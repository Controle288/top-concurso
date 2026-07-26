import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Pdf } from '@/types';
import { Search, FileText, Headphones, BookOpen, X, ChevronRight, Download, ExternalLink, FileCheck } from 'lucide-react';

export default function PdfLibrary() {
  const [pdfs, setPdfs] = useState<Pdf[]>([]);
  const [filter, setFilter] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPdf, setSelectedPdf] = useState<Pdf | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('pdfs').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setPdfs(data);
      setLoading(false);
    });
  }, []);

  const filteredPdfs = pdfs.filter(p => {
    const matchesFilter = filter === 'Todos' || p.tipo === filter;
    const matchesSearch = p.titulo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-5 p-4 pb-24 select-none">
      <div className="space-y-1">
        <span className="text-orange-500 text-xs font-bold uppercase tracking-wider block">BIBLIOTECA</span>
        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-orange-500" />
          Materiais de Estudo
        </h2>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text" value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar materiais..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-xs text-zinc-300 focus:outline-none focus:border-orange-500/50 placeholder-zinc-500 transition-all"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        {(['Todos', 'PDF', 'Audio', 'Resumo', 'Lei Seca'] as const).map((type) => (
          <button key={type} onClick={() => setFilter(type)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-extrabold transition-all border ${
              filter === type ? 'bg-orange-500 border-orange-500 text-black shadow-md' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}>
            {type === 'Todos' ? 'Todos' : type === 'Audio' ? 'Áudios' : type === 'Lei Seca' ? 'Leis Secas' : `${type}s`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="text-center text-zinc-500 py-8">Carregando...</p>
        ) : filteredPdfs.length > 0 ? (
          filteredPdfs.map((pdf) => (
            <div key={pdf.id} onClick={() => setSelectedPdf(pdf)}
              className="group bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-zinc-700/80 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                  pdf.tipo === 'Audio' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                  pdf.tipo === 'PDF' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                  pdf.tipo === 'Resumo' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                  'bg-blue-500/10 border-blue-500/20 text-blue-400'
                }`}>
                  {pdf.tipo === 'Audio' ? <Headphones className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 font-mono">{pdf.tipo}</span>
                  <h3 className="text-sm font-bold text-zinc-100 group-hover:text-orange-500 transition-colors line-clamp-1">{pdf.titulo}</h3>
                  {pdf.size_or_duration && <p className="text-xs text-zinc-400 font-mono">{pdf.size_or_duration}</p>}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-orange-500 transition-colors" />
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-500 text-sm font-semibold">Nenhum material encontrado.</p>
            <p className="text-xs text-zinc-500 mt-1">Tente buscar por termos como "Controle" ou "Crase".</p>
          </div>
        )}
      </div>

      {selectedPdf && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-zinc-950 border-t border-zinc-800 w-full max-w-md max-h-[85vh] rounded-t-[32px] overflow-hidden flex flex-col animate-slide-up shadow-2xl">
            <div className="p-5 border-b border-zinc-900 flex justify-between items-start">
              <div className="space-y-1">
                <span className="bg-orange-500/10 text-orange-400 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-orange-500/10">{selectedPdf.tipo}</span>
                <h3 className="text-md font-bold text-white mt-1.5 leading-snug">{selectedPdf.titulo}</h3>
                {selectedPdf.size_or_duration && <p className="text-xs text-zinc-500 font-mono">{selectedPdf.size_or_duration}</p>}
              </div>
              <button onClick={() => setSelectedPdf(null)} className="bg-zinc-900 border border-zinc-800 p-2 rounded-full text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 space-y-4 text-zinc-300 text-sm leading-relaxed">
              <div className="p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/60 text-xs text-orange-400/90 leading-relaxed font-semibold flex gap-2">
                <FileCheck className="w-5 h-5 shrink-0 text-orange-500" />
                <span>Conteúdo disponível para leitura e download.</span>
              </div>
              {selectedPdf.descricao && (
                <p className="font-normal text-zinc-300">{selectedPdf.descricao}</p>
              )}
            </div>
            <div className="p-4 border-t border-zinc-900 bg-zinc-950 flex gap-3">
              <a href={selectedPdf.url} target="_blank" rel="noopener noreferrer"
                className="flex-1 bg-orange-500 text-black font-extrabold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-all">
                <Download className="w-4 h-4" /> Abrir Material
              </a>
              <button onClick={() => { navigator.clipboard?.writeText(selectedPdf.url); setSelectedPdf(null); }}
                className="px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-xl flex items-center justify-center">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
