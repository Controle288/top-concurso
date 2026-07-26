import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/AuthContext'
import { redirectToCheckout, createPortalSession } from '@/lib/stripe'
import { Sparkles, Check, Crown, Zap, Gift } from 'lucide-react'
import SectionHeader from '../shared/SectionHeader'

const PLANS = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 'R$ 0',
    period: '',
    description: 'Para começar seus estudos',
    features: [
      'Acesso a PDFs e videoaulas',
      'Questões para praticar',
      'Fórum de discussão',
      'Resumos pessoais',
      'Flashcards (até 20 cards)',
    ],
    highlighted: false,
  },
  {
    id: 'premium_monthly',
    name: 'Premium',
    price: 'R$ 19,90',
    period: '/mês',
    description: 'O máximo da preparação',
    features: [
      'Tudo do Gratuito',
      'Flashcards ilimitados',
      'Simulado com timer (modo prova)',
      'Cronograma automático de estudos',
      'Revisão espaçada completa',
      'Exportar flashcards (CSV/Anki)',
      'Prioridade no suporte',
    ],
    highlighted: true,
    priceId: 'price_premium_monthly',
    trialDays: 7,
  },
  {
    id: 'premium_yearly',
    name: 'Premium Anual',
    price: 'R$ 199,90',
    period: '/ano',
    description: 'Economize R$ 39 comparado ao mensal',
    features: [
      'Tudo do Premium Mensal',
      '2 meses grátis',
      'Acesso prioritário a novos recursos',
      'Badge de assinante VIP',
      'Suporte prioritário 24h',
    ],
    highlighted: false,
    priceId: 'price_premium_yearly',
    popular: true,
    trialDays: 7,
  },
]

export default function Planos() {
  const { profile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState<string | null>(null)

  const handleAssinar = async (plan: typeof PLANS[0]) => {
    if (!plan.priceId) return
    setLoading(plan.id)
    await redirectToCheckout(plan.priceId)
    setLoading(null)
  }

  const handleTrial = async (plan: typeof PLANS[0]) => {
    if (!plan.priceId) return
    setLoading(`trial_${plan.id}`)
    await redirectToCheckout(plan.priceId, { trial_days: plan.trialDays })
    setLoading(null)
  }

  const handleGerenciar = async () => {
    setLoading('manage')
    await createPortalSession()
    await refreshProfile()
    setLoading(null)
  }

  const handleActivateTrial = async () => {
    setLoading('trial')
    const { error } = await supabase.rpc('activate_trial')
    if (!error) {
      await refreshProfile()
    }
    setLoading(null)
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      <SectionHeader icon={Crown} title="Escolha seu Plano" subtitle="Assinatura Premium" />

      {profile?.assinatura_ativa && (
        <div className="card-glass p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20">
              <Crown className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Plano Premium Ativo</p>
              <p className="text-[11px] text-zinc-400">Aproveite todos os recursos exclusivos</p>
            </div>
          </div>
          <button onClick={handleGerenciar} disabled={loading === 'manage'}
            className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold px-4 py-2 rounded-xl hover:bg-zinc-800 transition-all disabled:opacity-50">
            Gerenciar
          </button>
        </div>
      )}

      {!profile?.assinatura_ativa && !profile?.role && (
        <div className="card-glass p-4 flex items-center gap-3 bg-gradient-to-r from-orange-500/5 to-transparent border-orange-500/10">
          <Gift className="w-5 h-5 text-orange-500 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-bold text-orange-300">Teste grátis por 7 dias</p>
            <p className="text-[10px] text-zinc-500">Experimente o Premium sem compromisso. Cancele quando quiser.</p>
          </div>
          <button onClick={handleActivateTrial} disabled={loading === 'trial'}
            className="bg-orange-500 text-black text-xs font-extrabold px-4 py-2 rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50">
            {loading === 'trial' ? 'Ativando...' : 'Ativar Trial'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <div key={plan.id} className={`relative card-glass p-6 flex flex-col ${
            plan.popular ? 'border-orange-500/40 ring-1 ring-orange-500/20' : ''
          }`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-black text-[10px] font-extrabold uppercase tracking-wider px-4 py-1 rounded-full">
                Mais Popular
              </div>
            )}

            <div className="mb-5">
              <h3 className="text-lg font-black text-white">{plan.name}</h3>
              <p className="text-xs text-zinc-500 mt-1">{plan.description}</p>
            </div>

            <div className="mb-5">
              <span className="text-3xl font-black text-white">{plan.price}</span>
              {plan.period && <span className="text-zinc-500 text-sm font-medium ml-1">{plan.period}</span>}
              {plan.trialDays && !profile?.assinatura_ativa && (
                <p className="text-[10px] text-orange-400 font-bold mt-1">7 dias grátis</p>
              )}
            </div>

            <ul className="space-y-3 mb-6 flex-1">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlighted ? 'text-orange-500' : 'text-emerald-500'}`} />
                  <span className="text-xs text-zinc-300">{f}</span>
                </li>
              ))}
            </ul>

            {plan.priceId ? (
              profile?.assinatura_ativa ? (
                <button onClick={handleGerenciar} disabled={loading === 'manage'}
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-extrabold py-3 rounded-xl hover:bg-zinc-800 transition-all text-sm disabled:opacity-50">
                  Gerenciar Assinatura
                </button>
              ) : (
                <div className="space-y-2">
                  <button onClick={() => handleAssinar(plan)} disabled={loading === plan.id}
                    className={`w-full font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm disabled:opacity-50 ${
                      plan.highlighted
                        ? 'bg-orange-500 text-black hover:bg-orange-600 shadow-[0_4px_20px_rgba(249,115,22,0.3)]'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                    }`}>
                    {loading === plan.id ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <><Zap className="w-4 h-4" /> Assinar Agora</>
                    )}
                  </button>
                  {plan.trialDays && (
                    <button onClick={() => handleTrial(plan)} disabled={loading === `trial_${plan.id}`}
                      className="w-full text-xs text-zinc-500 font-bold py-2 hover:text-zinc-300 transition-all">
                      {loading === `trial_${plan.id}` ? '...' : `Testar grátis por ${plan.trialDays} dias`}
                    </button>
                  )}
                </div>
              )
            ) : (
              <div className="text-center text-xs text-zinc-600 font-medium py-3">
                Plano atual
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card-glass-static p-5 text-center">
        <p className="text-xs text-zinc-400 leading-relaxed">
          Ao assinar, você concorda com nossos termos de uso. Pagamento processado com segurança via Stripe.
          Cancele quando quiser. Período de teste sem compromisso.
        </p>
      </div>
    </div>
  )
}
