import { Product, getExpirationStatus, getDaysUntilExpiration } from '@/features/products/types/product';
import { ExpirationBadge } from './ExpirationBadge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Trash2, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

export const ProductCard = ({ product, onDelete }: ProductCardProps) => {
  const status = getExpirationStatus(product.expirationDate);
  const daysLeft = getDaysUntilExpiration(product.expirationDate);

  return (
    <div
      className={cn(
        'group relative bg-card rounded-lg p-4 shadow-card border border-border',
        'transition-all duration-300 ease-out',
        'hover:scale-[1.02] hover:border-primary/30 hover:shadow-lg',
        'active:scale-[0.98]',
        status === 'danger' && 'border-l-4 border-l-status-danger',
        status === 'warning' && 'border-l-4 border-l-status-warning',
        status === 'safe' && 'border-l-4 border-l-status-safe'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={cn(
            'p-2 rounded-lg transition-colors duration-200',
            'bg-secondary group-hover:bg-primary/10'
          )}>
            <Package className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate text-base">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Vence: {format(product.expirationDate, "d 'de' MMMM, yyyy", { locale: es })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ExpirationBadge status={status} daysLeft={daysLeft} />
          
          <button
            onClick={() => onDelete(product.id)}
            className={cn(
              'p-2 rounded-lg opacity-0 group-hover:opacity-100',
              'bg-destructive/10 text-destructive',
              'hover:bg-destructive/20 active:scale-90',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-destructive/50'
            )}
            aria-label="Eliminar producto"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};