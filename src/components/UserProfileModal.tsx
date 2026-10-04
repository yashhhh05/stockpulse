import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../types/index.ts';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToAuth: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onSwitchToAuth
}) => {
  const { user, role, switchRolePreset, logout, facility, pairedScanner } = useAuth();

  if (!isOpen) return null;

  const roles: { id: UserRole; label: string; desc: string }[] = [
    { id: 'admin', label: 'Admin', desc: 'Full Vault Access & System Config' },
    { id: 'manager', label: 'Manager', desc: 'Logistics, Movement & Reorders' },
    { id: 'staff', label: 'Staff', desc: 'Floor Pick/Pack & Barcode Scanning' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-center items-end md:items-center p-0 md:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl md:rounded-3xl shadow-2xl p-5 border border-slate-200 animate-in slide-in-from-bottom-6 md:zoom-in-95 duration-200 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 text-xl">account_circle</span>
            <h2 className="text-base font-bold text-slate-900">User Profile & Terminal</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3.5 p-4 bg-slate-50 border border-slate-200/70 rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <span className="material-symbols-outlined text-2xl">person</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Sarah Jenkins'}</h3>
            <p className="text-xs text-slate-500 truncate">{user?.email || 'sarah.j@stockpulse.io'}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                {role}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">{pairedScanner}</span>
            </div>
          </div>
        </div>

        {/* Switch Role Fast */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Switch Operational Role
          </span>
          <div className="flex flex-col gap-1.5">
            {roles.map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  switchRolePreset(r.id);
                  onClose();
                }}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                  role === r.id
                    ? 'border-indigo-600 bg-indigo-50/70'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-slate-800">{r.label}</p>
                  <p className="text-[10px] text-slate-500">{r.desc}</p>
                </div>
                {role === r.id && (
                  <span className="material-symbols-outlined text-indigo-600 text-[18px]">check</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Facility Info */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-600">
          <p className="font-semibold text-slate-800">Station Details</p>
          <p className="mt-0.5">{facility}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Terminal: Station WH-East 04 • JWT Verified</p>
        </div>

        {/* Logout / Switch User */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              logout();
              onSwitchToAuth();
              onClose();
            }}
            className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Sign Out Terminal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
