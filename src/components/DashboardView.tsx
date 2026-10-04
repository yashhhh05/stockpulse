import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useInventory } from '../context/InventoryContext.tsx';

interface DashboardViewProps {
  onOpenStockMovement: (type: 'in' | 'out' | 'adjust' | 'transfer') => void;
  onOpenScanner: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenFacilityModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenStockMovement,
  onOpenScanner,
  onNavigateTab,
  onOpenFacilityModal
}) => {
  const { user, facility } = useAuth();
  const { stats, activities, onlineStaff, isSocketConnected } = useInventory();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'in':
        return { icon: 'archive', bg: 'bg-emerald-50 border-emerald-100', text: 'text-emerald-600' };
      case 'out':
        return { icon: 'unarchive', bg: 'bg-indigo-50 border-indigo-100/70', text: 'text-indigo-600' };
      case 'alert':
        return { icon: 'warning', bg: 'bg-rose-50 border-rose-100', text: 'text-rose-600' };
      default:
        return { icon: 'edit_note', bg: 'bg-purple-50 border-purple-100', text: 'text-purple-600' };
    }
  };

  const getGreetingName = () => {
    if (!user) return 'Sarah';
    const parts = user.name.split(' ');
    return parts[0] || 'Sarah';
  };

  return (
    <div className="flex flex-col w-full space-y-4 pb-24 md:pb-8 max-w-5xl mx-auto px-4 md:px-6 pt-2">
      {/* Greeting & Facility Context */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100/80 border border-slate-200/60 text-slate-600 text-[11px] font-medium">
              <span className="material-symbols-outlined text-[13px] text-indigo-600">schedule</span>
              Shift A • Synchronized
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mt-1.5">
              Good morning, {getGreetingName()}!
            </h1>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_12px_rgba(15,23,42,0.04)] flex items-center justify-center text-indigo-600">
            <span className="material-symbols-outlined text-[26px]">account_circle</span>
          </div>
        </div>

        {/* Active Warehouse & Role Row */}
        <div className="flex items-center justify-between bg-white border border-slate-200/70 p-3 rounded-2xl shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
          <div className="flex items-center space-x-3 min-w-0">
            <span className="w-9 h-9 rounded-xl bg-indigo-50/70 border border-indigo-100/50 flex items-center justify-center text-indigo-600 shrink-0">
              <span className="material-symbols-outlined text-[20px]">domain</span>
            </span>
            <div className="truncate">
              <p className="text-[11px] font-medium text-slate-500 leading-tight">Active Facility</p>
              <p className="text-[13px] font-semibold text-slate-800 truncate">{facility}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenFacilityModal}
            aria-label="Change Facility"
            className="flex items-center gap-1 bg-slate-50 border border-slate-200/70 px-3 py-1.5 rounded-full text-slate-700 shrink-0 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer active:scale-95"
          >
            <span className="text-[12px] font-semibold">Switch</span>
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div>
        <div className="grid grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => onOpenStockMovement('in')}
            className="py-3 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex flex-col items-center justify-center shadow-[0_4px_14px_rgba(79,70,229,0.22)] active:scale-95 transition-all text-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px] mb-1">add_box</span>
            <span className="text-[12px] font-medium whitespace-nowrap">Stock In</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenStockMovement('out')}
            className="py-3 px-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl flex flex-col items-center justify-center shadow-[0_2px_8px_rgba(15,23,42,0.03)] active:scale-95 transition-all text-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px] mb-1 text-slate-600">indeterminate_check_box</span>
            <span className="text-[12px] font-medium whitespace-nowrap">Stock Out</span>
          </button>

          <button
            type="button"
            onClick={onOpenScanner}
            className="py-3 px-2 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 border border-indigo-100/70 rounded-2xl flex flex-col items-center justify-center shadow-[0_2px_8px_rgba(79,70,229,0.06)] active:scale-95 transition-all text-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px] mb-1 text-indigo-600">barcode_scanner</span>
            <span className="text-[12px] font-medium whitespace-nowrap">Scan SKU</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenStockMovement('transfer')}
            className="py-3 px-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl flex flex-col items-center justify-center shadow-[0_2px_8px_rgba(15,23,42,0.03)] active:scale-95 transition-all text-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px] mb-1 text-slate-600">move_up</span>
            <span className="text-[12px] font-medium whitespace-nowrap">Transfer</span>
          </button>
        </div>
      </div>

      {/* KPI 2x2 Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Total Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white border border-slate-200/70 p-4 rounded-3xl shadow-[0_3px_14px_rgba(15,23,42,0.03)] flex flex-col justify-between relative cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50/80 border border-indigo-100/60 flex items-center justify-center text-indigo-600">
              <span className="material-symbols-outlined text-[20px]">category</span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100/70">
              +12 wk
            </span>
          </div>
          <div>
            <span className="text-[12px] font-medium text-slate-500">Total Products</span>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-0.5 tracking-tight">
              {stats?.totalProducts.toLocaleString() || '1,428'}
            </h3>
            <p className="text-[11px] text-slate-500 truncate mt-0.5 font-normal">catalog items live</p>
          </div>
        </div>

        {/* Metric 2: Total Stock Count */}
        <div className="bg-white border border-slate-200/70 p-4 rounded-3xl shadow-[0_3px_14px_rgba(15,23,42,0.03)] flex flex-col justify-between relative">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
              <span className="material-symbols-outlined text-[20px]">warehouse</span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
              98.4%
            </span>
          </div>
          <div>
            <span className="text-[12px] font-medium text-slate-500">Total Stock Units</span>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-0.5 tracking-tight">
              {stats?.totalStockUnits.toLocaleString() || '48,920'}
            </h3>
            <p className="text-[11px] text-emerald-600 truncate mt-0.5 font-medium">Capacities nominal</p>
          </div>
        </div>

        {/* Metric 3: Low Stock Warning */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white border border-slate-200/70 p-4 rounded-3xl shadow-[0_3px_14px_rgba(15,23,42,0.03)] flex flex-col justify-between relative cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-100/80 flex items-center justify-center text-amber-700">
              <span className="material-symbols-outlined text-[20px]">notification_important</span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Alert
            </span>
          </div>
          <div>
            <span className="text-[12px] font-medium text-slate-500">Low Stock SKU</span>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-0.5 tracking-tight">
              {stats?.lowStockCount || 14} Items
            </h3>
            <p className="text-[11px] text-amber-600 truncate mt-0.5 font-medium">Needs reorder soon</p>
          </div>
        </div>

        {/* Metric 4: Out of Stock */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white border border-slate-200/70 p-4 rounded-3xl shadow-[0_3px_14px_rgba(15,23,42,0.03)] flex flex-col justify-between relative cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
              Critical
            </span>
          </div>
          <div>
            <span className="text-[12px] font-medium text-slate-500">Depleted</span>
            <h3 className="text-xl md:text-2xl font-bold text-rose-600 mt-0.5 tracking-tight">
              {stats?.depletedCount || 3} Items
            </h3>
            <p className="text-[11px] text-rose-600 truncate mt-0.5 font-medium">Reorders stalled</p>
          </div>
        </div>
      </div>

      {/* Visual Inventory Breakdown Card */}
      <div>
        <div className="bg-white border border-slate-200/70 p-5 rounded-3xl shadow-[0_3px_14px_rgba(15,23,42,0.03)] space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-indigo-600">pie_chart</span>
              <span className="text-[15px] font-bold text-slate-900">Inventory Health</span>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('reports')}
              className="text-indigo-600 font-semibold text-[12px] flex items-center gap-0.5 hover:text-indigo-800 transition-colors cursor-pointer"
            >
              Procurement
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          {/* Segmented Pill Progress Bar */}
          <div className="w-full h-3 rounded-full bg-slate-100 p-0.5 flex overflow-hidden gap-1">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${stats?.health.inStockPercent || 86}%` }}
              title={`In Stock: ${stats?.health.inStockPercent || 86}%`}
            ></div>
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${stats?.health.lowStockPercent || 11}%` }}
              title={`Low Stock: ${stats?.health.lowStockPercent || 11}%`}
            ></div>
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${stats?.health.depletedPercent || 3}%` }}
              title={`Depleted: ${stats?.health.depletedPercent || 3}%`}
            ></div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="flex items-center gap-2 bg-slate-50/70 p-2.5 rounded-2xl border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              <div className="truncate">
                <p className="text-[11px] font-medium text-slate-500 leading-tight">In Stock</p>
                <p className="text-[13px] font-bold text-slate-900">{stats?.health.inStockPercent || 86}%</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-50/70 p-2.5 rounded-2xl border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0"></span>
              <div className="truncate">
                <p className="text-[11px] font-medium text-slate-500 leading-tight">Low Stock</p>
                <p className="text-[13px] font-bold text-slate-900">{stats?.health.lowStockPercent || 11}%</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-50/70 p-2.5 rounded-2xl border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
              <div className="truncate">
                <p className="text-[11px] font-medium text-slate-500 leading-tight">Depleted</p>
                <p className="text-[13px] font-bold text-slate-900">{stats?.health.depletedPercent || 3}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Activity Feed */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
            <span>Live Operational Log</span>
            <span className="flex h-2 w-2 relative">
              {isSocketConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isSocketConnected ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
            </span>
          </h2>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100/90 px-2.5 py-0.5 rounded-full border border-slate-200/50">
            Austin Node
          </span>
        </div>

        <div className="bg-white border border-slate-200/70 rounded-3xl shadow-[0_3px_14px_rgba(15,23,42,0.03)] p-1.5 divide-y divide-slate-100">
          {activities.slice(0, 5).map(act => {
            const style = getActivityIcon(act.type);
            return (
              <div key={act.id} className="p-3 flex items-start gap-3 rounded-2xl hover:bg-slate-50/70 transition-colors">
                <div className={`w-9 h-9 rounded-2xl ${style.bg} border flex items-center justify-center ${style.text} shrink-0 mt-0.5`}>
                  <span className="material-symbols-outlined text-[19px]">{style.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-[13px] font-semibold truncate ${act.type === 'alert' ? 'text-rose-600' : 'text-slate-900'}`}>
                      {act.title}
                    </p>
                    <span className="text-[11px] font-medium text-slate-500 shrink-0">{act.timestamp}</span>
                  </div>
                  <p className="text-[12px] text-slate-500 mt-0.5">{act.details}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Warehouse Personnel On Duty */}
      <div>
        <div className="bg-white border border-slate-200/70 p-4 rounded-3xl shadow-[0_3px_14px_rgba(15,23,42,0.03)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5 overflow-hidden">
              <img
                alt="Mike R."
                className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-2xs"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              />
              <img
                alt="Elena V."
                className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-2xs"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
              />
              <img
                alt="Alex C."
                className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-2xs"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
              />
              <img
                alt="David K."
                className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-2xs"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
              />
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-900 leading-tight">
                {onlineStaff.length || 4} Staff Active
              </p>
              <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                All stations linked
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Team view"
            className="w-9 h-9 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[19px]">group</span>
          </button>
        </div>
      </div>

      {/* Reports & Deep Telemetry Fast Link */}
      <div>
        <button
          type="button"
          onClick={() => onNavigateTab('reports')}
          className="w-full py-3.5 px-4 rounded-2xl bg-white border border-slate-200/70 text-indigo-700 flex items-center justify-between shadow-[0_2px_10px_rgba(15,23,42,0.03)] hover:bg-slate-50 active:scale-[0.99] transition-all cursor-pointer text-left"
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px] text-indigo-600">query_stats</span>
            <span className="text-[13px] font-semibold text-slate-800">View full reports & telemetry</span>
          </div>
          <span className="material-symbols-outlined text-[18px] text-slate-400">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
