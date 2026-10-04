import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useInventory } from '../context/InventoryContext.tsx';
import { UserRole } from '../types/index.ts';

interface HeaderProps {
  currentTab: string;
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenSearch,
  onOpenNotifications,
  onOpenProfile
}) => {
  const { user, switchRolePreset, facility } = useAuth();
  const { isSocketConnected, recentNotification } = useInventory();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const getSubheadText = () => {
    switch (currentTab) {
      case 'products':
        return 'Products';
      case 'inventory':
        return 'Active Warehouse Vault';
      case 'reports':
        return 'Telemetry & Analytics';
      case 'more':
        return 'System & Peripherals';
      default:
        return 'Austin Central Operations';
    }
  };

  const roles: { id: UserRole; label: string; desc: string }[] = [
    { id: 'admin', label: 'Admin', desc: 'Full Vault Access' },
    { id: 'manager', label: 'Manager', desc: 'Logistics & Approval' },
    { id: 'staff', label: 'Staff', desc: 'Floor Scanning' }
  ];

  return (
    <header className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 pt-safe transition-all shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
      <div className="max-w-7xl mx-auto h-16 px-4 md:px-6 flex items-center justify-between gap-3">
        {/* Brand & Station Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative w-10 h-10 rounded-2xl bg-indigo-600 shadow-md shadow-indigo-200/60 flex items-center justify-center p-1.5 shrink-0 transition-transform hover:scale-105">
            <span className="material-symbols-outlined text-white text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              inventory_2
            </span>
            {isSocketConnected && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white"></span>
              </span>
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[15px] tracking-tight text-slate-900 truncate">
                Stock<span className="text-indigo-600">Pulse</span>
              </span>

              {/* Role Dropdown Chip */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  aria-label="Switch role"
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 transition-colors shrink-0 shadow-2xs cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                  <span className="text-[11px] font-semibold leading-none capitalize">
                    {user?.role || 'Manager'}
                  </span>
                  <span className="material-symbols-outlined text-[13px]">
                    {roleMenuOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
                  </span>
                </button>

                {roleMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Switch Role Mode
                      </span>
                    </div>
                    {roles.map(r => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          switchRolePreset(r.id);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                          user?.role === r.id ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-semibold capitalize">{r.label}</p>
                          <p className="text-[10px] text-slate-400">{r.desc}</p>
                        </div>
                        {user?.role === r.id && (
                          <span className="material-symbols-outlined text-indigo-600 text-[16px]">check</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-500 truncate">
              {getSubheadText()}
            </span>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search and filter"
            className="w-10 h-10 flex items-center justify-center rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[21px]">search</span>
          </button>

          <button
            type="button"
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="relative w-10 h-10 flex items-center justify-center rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[21px]">notifications</span>
            {recentNotification && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenProfile}
            aria-label="User profile"
            className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center shadow-sm ring-2 ring-indigo-100">
              <span className="material-symbols-outlined text-white text-[18px]">person</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
