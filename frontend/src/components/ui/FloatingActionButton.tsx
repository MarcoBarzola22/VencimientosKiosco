import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 z-50',
        'w-16 h-16 rounded-full',
        'gradient-primary text-primary-foreground',
        'shadow-fab hover:shadow-fab-hover',
        'flex items-center justify-center',
        'transition-all duration-300 ease-out',
        'hover:scale-110 active:scale-95',
        'focus:outline-none focus:ring-4 focus:ring-primary/30',
        'group'
      )}
      aria-label="Agregar producto"
    >
      {/* Pulse ring animation */}
      <span className="absolute w-full h-full rounded-full bg-primary/30 animate-pulse-ring" />
      
      <Plus className={cn(
        'w-8 h-8 transition-transform duration-200',
        'group-hover:rotate-90'
      )} />
    </button>
  );
};
