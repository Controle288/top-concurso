import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export default function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 bg-zinc-900/60 rounded-2xl flex items-center justify-center border border-zinc-800/50 mb-4">
        <Icon className="w-8 h-8 text-zinc-600" />
      </div>
      <p className="text-sm font-bold text-zinc-500 text-center">{title}</p>
      {description && <p className="text-xs text-zinc-600 text-center mt-1.5 max-w-xs">{description}</p>}
    </div>
  );
}
