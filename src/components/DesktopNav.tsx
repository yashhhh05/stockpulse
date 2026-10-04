import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useInventory } from '../context/InventoryContext.tsx';

interface DesktopNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenAddProduct: () => void;
  onOpenStockMovement: (type: 'in' | 'out' | 'adjust' | 'transfer') => void;
  onOpenScanner: () => void;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({
  currentTab,
  onTabChange,
  onOpenAddProduct,
  onOpenStockMovement,
  onOpenScanner
}) => {
  const { user } = useAuth();
  const { isSocketConnected } = useInventory();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'products', label: 'Catalog Items', icon: 'category' },
    { id: 'inventory', label: 'Stock Movements', icon: 'warehouse' },
    { id: 'reports', label: 'Reports & Telemetry', icon: 'analytics' }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/80 p-5 shrink-0 min-h-[calc(100vh-4rem)] select-none">
      <div className="flex flex-col gap-1 mb-6">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">
          Navigation
        </span>
        {navItems.map(item => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-medium text-sm transition-all cursor-pointer text-left ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Action Station */}
      <div className="flex flex-col gap-2 mb-6 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/60">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Quick Warehouse Ops
        </span>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <button
            onClick={() => onOpenStockMovement('in')}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-white border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-xl text-xs font-semibold text-slate-700 transition-all cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-indigo-600 text-[16px]">add_box</span>
            <span>Stock In</span>
          </button>
          <button
            onClick={() => onOpenStockMovement('out')}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-white border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-xl text-xs font-semibold text-slate-700 transition-all cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-slate-600 text-[16px]">indeterminate_check_box</span>
            <span>Stock Out</span>
          </button>
          <button
            onClick={onOpenScanner}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 rounded-xl text-xs font-semibold text-indigo-700 transition-all cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-indigo-600 text-[16px]">barcode_scanner</span>
            <span>Scan SKU</span>
          </button>
          <button
            onClick={onOpenAddProduct}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-white border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-xl text-xs font-semibold text-slate-700 transition-all cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-emerald-600 text-[16px]">add</span>
            <span>New SKU</span>
          </button>
        </div>
      </div>

      {/* Socket Status Widget */}
      <div className="mt-auto p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="relative flex h-2.5 w-2.5">
            {isSocketConnected ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            )}
          </span>
          <div className="truncate">
            <p className="text-xs font-bold text-slate-800 truncate">
              {isSocketConnected ? 'Socket.io Live' : 'Reconnecting...'}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {user?.activeStation || 'Station WH-East 04'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
