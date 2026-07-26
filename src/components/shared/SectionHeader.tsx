import type { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
}

export default function SectionHeader({ icon: Icon, title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div className="w-8 h-8 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/15 shrink-0">
            <Icon className="w-4 h-4 text-orange-500" />
          </div>
        )}
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">{title}</h2>
          {subtitle && <p className="text-[11px] text-zinc-500 font-medium">{subtitle}</p>}
        </div>
      </div>
      {action && (
        <button onClick={action.onClick} className="text-xs text-orange-500 font-bold flex items-center gap-1 hover:gap-1.5 transition-all whitespace-nowrap">
          {action.label}
        </button>
      )}
    </div>
  );
}
