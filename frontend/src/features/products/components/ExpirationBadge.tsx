import { ExpirationStatus, getStatusLabel } from '@/features/products/types/product';
import { cn } from '@/lib/utils';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

interface ExpirationBadgeProps {
  status: ExpirationStatus;
  daysLeft: number;
  className?: string;
}

export const ExpirationBadge = ({ status, daysLeft, className }: ExpirationBadgeProps) => {
  const Icon = status === 'danger' ? AlertCircle : status === 'warning' ? AlertTriangle : CheckCircle;
  
  const getDaysText = () => {
    if (daysLeft < 0) return `Venció hace ${Math.abs(daysLeft)} días`;
    if (daysLeft === 0) return 'Vence hoy';
    if (daysLeft === 1) return 'Vence mañana';
    if (daysLeft <= 3) return `${daysLeft} días`;
    return `${daysLeft} días`;
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
        status === 'danger' && 'status-danger',
        status === 'warning' && 'status-warning',
        status === 'safe' && 'status-safe',
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{getDaysText()}</span>
    </div>
  );
};
