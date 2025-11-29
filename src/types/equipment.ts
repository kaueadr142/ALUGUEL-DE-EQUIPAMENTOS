export interface Equipment {
  id: string;
  name: string;
  type: 'computer' | 'server' | 'network' | 'other';
  brand: string;
  model: string;
  dailyRate: number;
  status: 'available' | 'rented' | 'maintenance';
  description?: string;
  specifications?: string;
}

export interface Rental {
  id: string;
  equipmentId: string;
  equipmentName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  dailyRate: number;
  totalValue: number;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}
