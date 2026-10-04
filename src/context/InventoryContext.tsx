import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, ActivityLog, WarehouseStats, StockMovementPayload } from '../types/index.ts';
import { productsAPI, activitiesAPI, statsAPI } from '../services/api.ts';
import { getSocket } from '../services/socket.ts';

interface InventoryContextType {
  products: Product[];
  activities: ActivityLog[];
  stats: WarehouseStats | null;
  isLoading: boolean;
  categoryFilter: string;
  searchQuery: string;
  recentNotification: { title: string; details: string; type: string } | null;
  onlineStaff: Array<{ name: string; role: string; station: string }>;
  isSocketConnected: boolean;
  setCategoryFilter: (cat: string) => void;
  setSearchQuery: (query: string) => void;
  addProduct: (product: Partial<Product>) => Promise<Product>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  moveStock: (id: string, payload: StockMovementPayload) => Promise<void>;
  quickReorder: (id: string) => Promise<void>;
  clearNotification: () => void;
  refreshData: () => Promise<void>;
}

const defaultStats: WarehouseStats = {
  totalProducts: 1428,
  totalProductsInStore: 8,
  totalStockUnits: 48920,
  lowStockCount: 14,
  depletedCount: 3,
  activeStaffCount: 4,
  health: {
    inStockPercent: 86,
    lowStockPercent: 11,
    depletedPercent: 3
  },
  categoryCounts: {
    all: 1428,
    electronics: 412,
    hardware: 320,
    packaging: 280,
    safety: 180,
    lubricants: 236
  }
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<WarehouseStats | null>(defaultStats);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [recentNotification, setRecentNotification] = useState<{ title: string; details: string; type: string } | null>(null);
  const [onlineStaff, setOnlineStaff] = useState<Array<{ name: string; role: string; station: string }>>([
    { name: 'Mike R.', role: 'Staff', station: 'Bay 4 Dispatched' },
    { name: 'Elena V.', role: 'Operations', station: 'Digital Scanner Station' },
    { name: 'Alex C.', role: 'Manager', station: 'Robotic Sorter 2' },
    { name: 'David K.', role: 'Staff', station: 'Shelving Unit B' }
  ]);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);

  const refreshData = useCallback(async () => {
    try {
      const [fetchedProducts, fetchedActivities, fetchedStats] = await Promise.all([
        productsAPI.getAll(categoryFilter, searchQuery),
        activitiesAPI.getAll(),
        statsAPI.get()
      ]);
      setProducts(fetchedProducts);
      setActivities(fetchedActivities);
      setStats(fetchedStats);
    } catch (err) {
      console.warn('Using local inventory store:', err);
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter, searchQuery]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Socket.IO event listeners for real-time inventory updates!
  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => {
      setIsSocketConnected(true);
    };

    const onDisconnect = () => {
      setIsSocketConnected(false);
    };

    const onStockUpdated = (data: { product: Product; activity?: ActivityLog }) => {
      if (!data || !data.product) return;
      setProducts(prev => {
        const idx = prev.findIndex(p => p.id === data.product.id);
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = data.product;
          return next;
        }
        return [data.product, ...prev];
      });

      if (data.activity) {
        setActivities(prev => [data.activity!, ...prev.filter(a => a.id !== data.activity!.id)].slice(0, 30));
        setRecentNotification({
          title: data.activity.title,
          details: data.activity.details,
          type: data.activity.type
        });
      }

      // Refresh aggregate counts
      statsAPI.get().then(s => setStats(s)).catch(() => {});
    };

    const onActivityNew = (activity: ActivityLog) => {
      if (!activity) return;
      setActivities(prev => [activity, ...prev.filter(a => a.id !== activity.id)].slice(0, 30));
    };

    const onProductAdded = (newProd: Product) => {
      setProducts(prev => {
        if (prev.some(p => p.id === newProd.id)) return prev;
        return [newProd, ...prev];
      });
      statsAPI.get().then(s => setStats(s)).catch(() => {});
    };

    const onProductUpdated = (updatedProd: Product) => {
      setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
    };

    const onProductDeleted = (data: { id: string }) => {
      setProducts(prev => prev.filter(p => p.id !== data.id));
      statsAPI.get().then(s => setStats(s)).catch(() => {});
    };

    const onStaffOnline = (staffList: any[]) => {
      if (Array.isArray(staffList) && staffList.length > 0) {
        setOnlineStaff(staffList);
      }
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('stock:updated', onStockUpdated);
    socket.on('activity:new', onActivityNew);
    socket.on('product:added', onProductAdded);
    socket.on('product:updated', onProductUpdated);
    socket.on('product:deleted', onProductDeleted);
    socket.on('staff:online', onStaffOnline);

    setIsSocketConnected(socket.connected);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('stock:updated', onStockUpdated);
      socket.off('activity:new', onActivityNew);
      socket.off('product:added', onProductAdded);
      socket.off('product:updated', onProductUpdated);
      socket.off('product:deleted', onProductDeleted);
      socket.off('staff:online', onStaffOnline);
    };
  }, []);

  const addProduct = async (productData: Partial<Product>): Promise<Product> => {
    const created = await productsAPI.create(productData);
    setProducts(prev => [created, ...prev]);
    return created;
  };

  const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
    const updated = await productsAPI.update(id, productData);
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
    return updated;
  };

  const deleteProduct = async (id: string): Promise<void> => {
    await productsAPI.delete(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const moveStock = async (id: string, payload: StockMovementPayload): Promise<void> => {
    const res = await productsAPI.moveStock(id, payload);
    setProducts(prev => prev.map(p => p.id === id ? res.product : p));
    if (res.activity) {
      setActivities(prev => [res.activity, ...prev]);
    }
  };

  const quickReorder = async (id: string): Promise<void> => {
    const res = await productsAPI.quickReorder(id);
    setProducts(prev => prev.map(p => p.id === id ? res.product : p));
  };

  const clearNotification = () => {
    setRecentNotification(null);
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        activities,
        stats,
        isLoading,
        categoryFilter,
        searchQuery,
        recentNotification,
        onlineStaff,
        isSocketConnected,
        setCategoryFilter,
        setSearchQuery,
        addProduct,
        updateProduct,
        deleteProduct,
        moveStock,
        quickReorder,
        clearNotification,
        refreshData
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
