import { useNavigate } from 'react-router-dom';
import { Crown, Sparkles, ArrowLeft } from 'lucide-react';
import type { Profile } from '@/types';

interface PremiumGateProps {
  profile?: Profile | null;
  feature: string;
  children: React.ReactNode;
}

export default function PremiumGate({ profile, feature, children }: PremiumGateProps) {
  const navigate = useNavigate();

  if (profile?.assinatura_ativa || profile?.role === 'admin') {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
      <div className="relative">
        <div className="absolute inset-0 bg-orange-500 rounded-full blur-2xl opacity-20" />
        <div className="relative w-20 h-20 bg-zinc-900 border-2 border-orange-500/40 rounded-full flex items-center justify-center">
          <Crown className="w-10 h-10 text-orange-500" />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-black text-white">Recurso Premium</h3>
        <p className="text-sm text-zinc-500 mt-1 max-w-xs mx-auto">
          {feature} é um recurso exclusivo para assinantes Premium.
          Ative agora e desbloqueie todos os recursos.
        </p>
      </div>
      <button onClick={() => navigate('/planos')}
        className="bg-orange-500 text-black font-extrabold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-orange-600 transition-all shadow-[0_4px_20px_rgba(249,115,22,0.3)] active:scale-95">
        <Sparkles className="w-5 h-5" /> Ver Planos
      </button>
      <button onClick={() => navigate(-1)}
        className="text-xs text-zinc-500 font-bold flex items-center gap-1 hover:text-zinc-300 transition-all">
        <ArrowLeft className="w-3 h-3" /> Voltar
      </button>
    </div>
  );
}
