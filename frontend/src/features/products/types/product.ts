export interface Product {
  id: string;
  name: string;
  expirationDate: Date;
  quantity?: number;
  category?: string;
}

export type ExpirationStatus = 'danger' | 'warning' | 'safe';

export const getExpirationStatus = (expirationDate: Date): ExpirationStatus => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expDate = new Date(expirationDate);
  expDate.setHours(0, 0, 0, 0);
  
  const diffTime = expDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 0) return 'danger';
  if (diffDays <= 3) return 'warning';
  return 'safe';
};

export const getStatusLabel = (status: ExpirationStatus): string => {
  switch (status) {
    case 'danger': return 'Vence hoy';
    case 'warning': return 'Vence pronto';
    case 'safe': return 'OK';
  }
};

export const getDaysUntilExpiration = (expirationDate: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expDate = new Date(expirationDate);
  expDate.setHours(0, 0, 0, 0);
  
  const diffTime = expDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
