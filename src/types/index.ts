export type UserRole = 'admin' | 'manager' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  facility: string;
  activeStation?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  minThreshold: number;
  supplier: string;
  unit: string;
  imageUrl: string;
  deactivated?: boolean;
  statusNotes?: string;
  lastUpdated: string;
}

export interface ActivityLog {
  id: string;
  type: 'in' | 'out' | 'adjust' | 'alert' | 'transfer';
  title: string;
  details: string;
  user: string;
  role: string;
  timestamp: string;
  productId?: string;
}

export interface WarehouseStats {
  totalProducts: number;
  totalProductsInStore: number;
  totalStockUnits: number;
  lowStockCount: number;
  depletedCount: number;
  activeStaffCount: number;
  health: {
    inStockPercent: number;
    lowStockPercent: number;
    depletedPercent: number;
  };
  categoryCounts: Record<string, number>;
}

export interface StockMovementPayload {
  type: 'in' | 'out' | 'adjust' | 'transfer';
  quantity: number;
  reason?: string;
  location?: string;
}
