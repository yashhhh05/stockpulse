import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useInventory } from '../context/InventoryContext.tsx';

interface MoreMenuViewProps {
  onOpenScanner: () => void;
  onOpenFacilityModal: () => void;
  onOpenProfile: () => void;
  onSwitchToAuth: () => void;
}

export const MoreMenuView: React.FC<MoreMenuViewProps> = ({
  onOpenScanner,
  onOpenFacilityModal,
  onOpenProfile,
  onSwitchToAuth
}) => {
  const { user, pairedScanner, logout } = useAuth();
  const { isSocketConnected, refreshData } = useInventory();

  return (
    <div className="flex flex-col w-full space-y-4 pb-24 md:pb-8 max-w-5xl mx-auto px-4 md:px-6 pt-2">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          System & Settings
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Hardware peripherals, warehouse hubs, security credentials & data sync
        </p>
      </div>

      {/* Hardware Peripheral Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-indigo-600 text-2xl">barcode_scanner</span>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Peripherals & Barcode Scanners</h2>
              <p className="text-xs text-slate-500">{pairedScanner}</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60">
            Linked
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={onOpenScanner}
            className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-indigo-600">center_focus_weak</span>
            <span>Launch Laser Test</span>
          </button>
          <button
            type="button"
            onClick={() => alert('Zebra TC57 calibrating optical sensor... Ready!')}
            className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-600">tune</span>
            <span>Recalibrate Reader</span>
          </button>
        </div>
      </div>

      {/* System Status & Architecture */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-900">MERN Stack Architecture</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Frontend</span>
            <span className="font-bold text-slate-800 block mt-0.5">React 19 + Vite</span>
            <span className="text-[11px] text-emerald-600 font-medium">Axios Interceptors</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Backend</span>
            <span className="font-bold text-slate-800 block mt-0.5">Express Node.js</span>
            <span className="text-[11px] text-emerald-600 font-medium">RESTful API</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Real-time Sync</span>
            <span className="font-bold text-slate-800 block mt-0.5">Socket.IO 4.8</span>
            <span className={`text-[11px] font-medium ${isSocketConnected ? 'text-emerald-600' : 'text-amber-600'}`}>
              {isSocketConnected ? 'Connected & Live' : 'Reconnecting'}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Security</span>
            <span className="font-bold text-slate-800 block mt-0.5">JWT Authorization</span>
            <span className="text-[11px] text-emerald-600 font-medium">RBAC Admin/Mgr/Staff</span>
          </div>
        </div>
      </div>

      {/* Facilities & Hubs */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Warehouse Nodes</h2>
          <button
            type="button"
            onClick={onOpenFacilityModal}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
          >
            Change Hub
          </button>
        </div>
        <p className="text-xs text-slate-500">
          Connected to Austin Central Operations Hub (TX-01). 18 active bays receiving automatic telemetry.
        </p>
      </div>

      {/* Account & Session Controls */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-900">Current Session</h2>
        <div className="flex items-center justify-between text-xs">
          <div>
            <p className="font-bold text-slate-800">{user?.name} ({user?.email})</p>
            <p className="text-slate-500 capitalize">Role: {user?.role}</p>
          </div>
          <button
            type="button"
            onClick={onOpenProfile}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
          >
            Manage
          </button>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => refreshData()}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            Force Sync Server State
          </button>
          <button
            type="button"
            onClick={() => {
              logout();
              onSwitchToAuth();
            }}
            className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};
