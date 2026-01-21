import { Product, getExpirationStatus, getDaysUntilExpiration } from '@/features/products/types/product';
import { AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  products: Product[];
}

export const SummaryCard = ({ products }: SummaryCardProps) => {
  const expiringToday = products.filter(p => getDaysUntilExpiration(p.expirationDate) <= 0).length;
  const expiringThisWeek = products.filter(p => {
    const days = getDaysUntilExpiration(p.expirationDate);
    return days > 0 && days <= 7;
  }).length;
  const safeProducts = products.filter(p => getDaysUntilExpiration(p.expirationDate) > 7).length;

  const stats = [
    {
      icon: AlertTriangle,
      label: 'Vencen hoy',
      value: expiringToday,
      colorClass: 'text-status-danger bg-[hsl(var(--status-danger-bg))]',
    },
    {
      icon: Clock,
      label: 'Esta semana',
      value: expiringThisWeek,
      colorClass: 'text-status-warning bg-[hsl(var(--status-warning-bg))]',
    },
    {
      icon: CheckCircle2,
      label: 'OK',
      value: safeProducts,
      colorClass: 'text-status-safe bg-[hsl(var(--status-safe-bg))]',
    },
  ];

  const totalExpiringSoon = expiringToday + expiringThisWeek;

  return (
    <div className="space-y-4">
      {/* Main Alert */}
      <div className={cn(
        'rounded-xl p-4 border',
        totalExpiringSoon > 0 
          ? 'bg-[hsl(var(--status-warning-bg))] border-status-warning/30' 
          : 'bg-[hsl(var(--status-safe-bg))] border-status-safe/30'
      )}>
        <p className={cn(
          'text-lg font-semibold text-center',
          totalExpiringSoon > 0 ? 'text-status-warning' : 'text-status-safe'
        )}>
          {totalExpiringSoon > 0 
            ? `⚠️ ${totalExpiringSoon} producto${totalExpiringSoon > 1 ? 's' : ''} vence${totalExpiringSoon > 1 ? 'n' : ''} esta semana`
            : '✅ No hay productos por vencer pronto'
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={cn(
              'rounded-xl p-3 text-center transition-all duration-200',
              'hover:scale-105 active:scale-95',
              stat.colorClass
            )}
          >
            <stat.icon className="w-5 h-5 mx-auto mb-1" />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
