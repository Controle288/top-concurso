import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, User, Search } from 'lucide-react';
import type { Profile } from '@/types';

export default function AdminUsuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setUsuarios(data);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const toggleAdmin = async (user: Profile) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    await supabase.from('profiles').update({ role: newRole }).eq('id', user.id);
    load();
  };

  const filtered = usuarios.filter(u => u.nome.toLowerCase().includes(searchQuery.toLowerCase()) || u.id.includes(searchQuery));

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/admin')} className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <span className="text-orange-500 text-[10px] font-bold uppercase tracking-wider">Admin</span>
          <h2 className="text-lg font-black text-white flex items-center gap-2"><User className="w-5 h-5 text-orange-500" /> Usuários</h2>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar por nome ou ID..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-xs text-zinc-300 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600" />
      </div>

      {loading ? <p className="text-center text-zinc-500 py-8">Carregando...</p> : filtered.length === 0 ? (
        <p className="text-center text-zinc-500 py-8">Nenhum usuário encontrado.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map(u => (
            <div key={u.id} className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-sm shrink-0">
                    {u.nome.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-zinc-100 truncate">{u.nome}</p>
                    <p className="text-[10px] text-zinc-500 font-mono truncate">{u.id.slice(0, 16)}...</p>
                  </div>
                </div>
                <button onClick={() => toggleAdmin(u)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border transition-all ${
                    u.role === 'admin' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-zinc-700'
                  }`}>
                  <Shield className="w-3 h-3" /> {u.role === 'admin' ? 'Admin' : 'Usuário'}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2 text-[10px] text-zinc-500">
                <span>Conta criada: {new Date(u.created_at).toLocaleDateString('pt-BR')}</span>
                {u.assinatura_ativa && <span className="text-emerald-500 font-bold">• Assinante</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
