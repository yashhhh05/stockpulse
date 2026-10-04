import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext.tsx';

interface InventoryMovementsViewProps {
  onOpenMovement: (type: 'in' | 'out' | 'adjust' | 'transfer') => void;
  onOpenScanner: () => void;
}

export const InventoryMovementsView: React.FC<InventoryMovementsViewProps> = ({
  onOpenMovement,
  onOpenScanner
}) => {
  const { activities, isSocketConnected } = useInventory();
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = activities.filter(a => {
    if (filterType === 'all') return true;
    return a.type === filterType;
  });

  return (
    <div className="flex flex-col w-full space-y-4 pb-24 md:pb-8 max-w-5xl mx-auto px-4 md:px-6 pt-2">
      {/* Top Header & Fast Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Warehouse Movements
            </h1>
            <span className="flex h-2.5 w-2.5 relative">
              {isSocketConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isSocketConnected ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Real-time authoritative ledger synchronized via Socket.IO
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenScanner}
            className="py-2.5 px-3.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px]">barcode_scanner</span>
            <span>Scan Tag</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenMovement('in')}
            className="py-2.5 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_box</span>
            <span>Record Movement</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {['all', 'in', 'out', 'adjust', 'alert'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilterType(t)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
              filterType === t
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t === 'in' ? 'Stock In' : t === 'out' ? 'Stock Out' : t === 'adjust' ? 'Adjustments' : t === 'alert' ? 'Threshold Alerts' : 'All Events'}
          </button>
        ))}
      </div>

      {/* Movements Table / Cards */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-2 shadow-sm divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No movements recorded for this filter.
          </div>
        ) : (
          filtered.map(act => (
            <div key={act.id} className="p-4 flex items-start gap-3.5 hover:bg-slate-50/70 transition-colors rounded-2xl">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                  act.type === 'in'
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                    : act.type === 'out'
                    ? 'bg-indigo-50 border-indigo-100 text-indigo-600'
                    : act.type === 'alert'
                    ? 'bg-rose-50 border-rose-100 text-rose-600'
                    : 'bg-purple-50 border-purple-100 text-purple-600'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {act.type === 'in' ? 'archive' : act.type === 'out' ? 'unarchive' : act.type === 'alert' ? 'warning' : 'edit_note'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs md:text-sm font-bold text-slate-900 truncate">{act.title}</h4>
                  <span className="text-[11px] font-medium text-slate-400 shrink-0">{act.timestamp}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{act.details}</p>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-600">{act.user}</span>
                  <span>•</span>
                  <span>{act.role}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
