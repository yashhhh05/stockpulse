import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';

interface FacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FacilityModal: React.FC<FacilityModalProps> = ({ isOpen, onClose }) => {
  const { facility, setFacility } = useAuth();

  if (!isOpen) return null;

  const facilities = [
    {
      id: 'Main Hub - Austin (TX-01)',
      name: 'Main Hub - Austin (TX-01)',
      zone: 'Austin Central Operations',
      capacity: '98.4% Nominal',
      activeBays: 18,
      status: 'Online'
    },
    {
      id: 'West Hub - Reno (NV-02)',
      name: 'West Hub - Reno (NV-02)',
      zone: 'Pacific Distribution Bay',
      capacity: '74.2% Available',
      activeBays: 12,
      status: 'Online'
    },
    {
      id: 'North Bay - Chicago (IL-04)',
      name: 'North Bay - Chicago (IL-04)',
      zone: 'Midwest Fulfillment Station',
      capacity: '88.9% High',
      activeBays: 24,
      status: 'Syncing'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-5 border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 text-xl">domain</span>
            <h2 className="text-base font-bold text-slate-900">Switch Active Facility</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {facilities.map(fac => {
            const isSelected = facility === fac.id;
            return (
              <button
                key={fac.id}
                type="button"
                onClick={() => {
                  setFacility(fac.id);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{fac.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                      {fac.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{fac.zone}</p>
                  <p className="text-[11px] font-mono text-slate-600 mt-1">
                    {fac.activeBays} Active Pick Bays • {fac.capacity}
                  </p>
                </div>
                {isSelected && (
                  <span className="material-symbols-outlined text-indigo-600 text-[20px]">check_circle</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
