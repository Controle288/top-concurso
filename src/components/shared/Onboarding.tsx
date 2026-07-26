import { useState } from 'react'
import { Sparkles, BookOpen, Play, HelpCircle, Brain, Crown, ChevronRight, Check } from 'lucide-react'

const slides = [
  {
    icon: Sparkles,
    title: 'Bem-vindo ao Top Concurso!',
    desc: 'Sua plataforma completa para estudar e passar em concursos públicos.',
    color: 'text-orange-500',
  },
  {
    icon: BookOpen,
    title: 'Materiais Completos',
    desc: 'Acesse PDFs, videoaulas, resumos e lei seca organizados por concurso.',
    color: 'text-blue-400',
  },
  {
    icon: HelpCircle,
    title: 'Questões Comentadas',
    desc: 'Resolva questões de provas anteriores com fundamentação comentada.',
    color: 'text-emerald-400',
  },
  {
    icon: Brain,
    title: 'Revisão Espaçada',
    desc: 'Crie flashcards e revise no melhor momento usando o sistema de repetição espaçada.',
    color: 'text-purple-400',
  },
  {
    icon: Crown,
    title: 'Modo Prova Premium',
    desc: 'Desbloqueie o simulado cronometrado e estatísticas avançadas com o Premium.',
    color: 'text-orange-500',
  },
]

interface OnboardingProps {
  onComplete: () => void
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0)
  const slide = slides[step]
  const Icon = slide.icon
  const isLast = step === slides.length - 1

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-orange-500 rounded-full blur-3xl opacity-10" />
          <div className="relative w-24 h-24 bg-zinc-900 border-2 border-orange-500/20 rounded-full flex items-center justify-center">
            <Icon className={`w-12 h-12 ${slide.color}`} />
          </div>
        </div>

        <div className="text-center max-w-sm">
          <h2 className="text-2xl font-black text-white mb-3">{slide.title}</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">{slide.desc}</p>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mb-8">
        {slides.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i === step ? 'bg-orange-500 w-6' : 'bg-zinc-800'
          }`} />
        ))}
      </div>

      {/* Button */}
      <div className="px-8 pb-12">
        <button
          onClick={() => isLast ? onComplete() : setStep(step + 1)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-black font-extrabold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_4px_20px_rgba(249,115,22,0.3)]"
        >
          {isLast ? (
            <>Começar Agora <Check className="w-5 h-5" /></>
          ) : (
            <>Próximo <ChevronRight className="w-5 h-5" /></>
          )}
        </button>
      </div>
    </div>
  )
}
