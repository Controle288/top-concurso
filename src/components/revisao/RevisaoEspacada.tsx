import { useState, useEffect } from 'react';
import { Brain, RotateCcw, Check, X, Plus, Trash2, Sparkles } from 'lucide-react';

interface FlashCard {
  id: string;
  front: string;
  back: string;
  box: number;
  nextReview: string;
  created_at: string;
}

const BOX_INTERVALS = [0, 1, 3, 7, 14, 30];

export default function RevisaoEspacada() {
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('topconcurso_flashcards');
    if (saved) setCards(JSON.parse(saved));
  }, []);

  const save = (newCards: FlashCard[]) => {
    setCards(newCards);
    localStorage.setItem('topconcurso_flashcards', JSON.stringify(newCards));
  };

  const dueCards = cards
    .filter(c => new Date(c.nextReview) <= new Date())
    .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime());

  const addCard = () => {
    if (!front.trim() || !back.trim()) return;
    const card: FlashCard = {
      id: Date.now().toString(),
      front: front.trim(),
      back: back.trim(),
      box: 0,
      nextReview: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    save([...cards, card]);
    setFront('');
    setBack('');
    setShowForm(false);
  };

  const deleteCard = (id: string) => {
    save(cards.filter(c => c.id !== id));
  };

  const rateCard = (correct: boolean) => {
    const card = dueCards[currentIndex];
    if (!card) return;
    const newBox = correct ? Math.min(card.box + 1, 5) : 0;
    const days = BOX_INTERVALS[newBox];
    const next = new Date();
    next.setDate(next.getDate() + days);
    const updated = cards.map(c =>
      c.id === card.id ? { ...c, box: newBox, nextReview: next.toISOString() } : c
    );
    save(updated);
    setShowAnswer(false);
    if (currentIndex < dueCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const resetCard = (id: string) => {
    const updated = cards.map(c =>
      c.id === id ? { ...c, box: 0, nextReview: new Date().toISOString() } : c
    );
    save(updated);
  };

  const totalCards = cards.length;

  return (
    <div className="flex flex-col gap-5 p-4 pb-24 select-none">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <span className="text-orange-500 text-xs font-bold uppercase tracking-wider block">REVISÃO</span>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Brain className="w-5 h-5 text-orange-500" />
            Flashcards
          </h2>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-orange-500 text-black p-2.5 rounded-full shadow-md hover:bg-orange-600 transition-all">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showForm && (
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 space-y-3">
          <textarea value={front} onChange={(e) => setFront(e.target.value)}
            placeholder="Frente (pergunta/conceito)" rows={2}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600 resize-none" />
          <textarea value={back} onChange={(e) => setBack(e.target.value)}
            placeholder="Verso (resposta)" rows={2}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder-zinc-600 resize-none" />
          <button onClick={addCard} className="w-full bg-orange-500 text-black font-extrabold py-3 rounded-xl hover:bg-orange-600 transition-all">
            Adicionar Card
          </button>
        </div>
      )}

      <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span className="text-xs text-zinc-300 font-semibold">{dueCards.length} cards para revisar hoje</span>
        </div>
        <span className="text-xs text-zinc-500">{totalCards} cards no total</span>
      </div>

      {dueCards.length > 0 && currentIndex < dueCards.length && (
        <div className="space-y-4">
          <div className="text-center text-[10px] text-zinc-500 font-mono font-bold">
            {currentIndex + 1} de {dueCards.length}
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-3xl p-6 min-h-[200px] flex flex-col items-center justify-center text-center cursor-pointer"
            onClick={() => !showAnswer && setShowAnswer(true)}>
            <p className="text-lg font-bold text-white leading-relaxed mb-4">{dueCards[currentIndex].front}</p>
            {showAnswer && (
              <>
                <div className="w-full h-px bg-zinc-800 my-4" />
                <p className="text-md text-zinc-300 leading-relaxed">{dueCards[currentIndex].back}</p>
                <div className="text-[10px] text-zinc-600 mt-3 font-mono">
                  Box {dueCards[currentIndex].box + 1}/6
                </div>
              </>
            )}
            {!showAnswer && (
              <p className="text-xs text-zinc-500 mt-4">Toque para ver a resposta</p>
            )}
          </div>

          {showAnswer && (
            <div className="flex gap-3">
              <button onClick={() => rateCard(false)}
                className="flex-1 bg-red-500/10 border border-red-500/30 text-red-400 font-extrabold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all active:scale-95">
                <X className="w-5 h-5" /> Errei
              </button>
              <button onClick={() => rateCard(true)}
                className="flex-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition-all active:scale-95">
                <Check className="w-5 h-5" /> Acertei
              </button>
            </div>
          )}
        </div>
      )}

      {dueCards.length === 0 && totalCards > 0 && (
        <div className="text-center py-12">
          <Brain className="w-12 h-12 text-emerald-500/50 mx-auto mb-3" />
          <p className="text-zinc-300 text-sm font-bold">Tudo revisado! 🎯</p>
          <p className="text-zinc-500 text-xs mt-1">Nenhum card pendente hoje.</p>
        </div>
      )}

      {totalCards === 0 && (
        <div className="text-center py-12">
          <Brain className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm font-semibold">Nenhum card ainda.</p>
          <p className="text-zinc-500 text-xs mt-1">Crie flashcards com leis, conceitos e súmulas.</p>
        </div>
      )}

      {totalCards > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Todos os Cards</h3>
          {cards.map(card => (
            <div key={card.id} className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-3.5">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-zinc-200 line-clamp-1">{card.front}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">{card.back}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] text-zinc-600 font-mono">Box {card.box + 1}</span>
                    <span className="text-[9px] text-zinc-600 font-mono">
                      Próxima: {new Date(card.nextReview).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => resetCard(card.id)} className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-orange-500">
                    <RotateCcw className="w-3 h-3" />
                  </button>
                  <button onClick={() => deleteCard(card.id)} className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-red-500">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
