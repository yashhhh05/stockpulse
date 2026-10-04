import React from 'react';
import { useInventory } from '../context/InventoryContext.tsx';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const { activities, clearNotification } = useInventory();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-center items-end md:items-center p-0 md:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl md:rounded-3xl shadow-2xl p-5 border border-slate-200 animate-in slide-in-from-bottom-6 md:zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 text-xl">notifications</span>
            <h2 className="text-base font-bold text-slate-900">Operational Alerts & Logs</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              clearNotification();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="overflow-y-auto divide-y divide-slate-100 flex-1 py-2">
          {activities.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">No alerts or logs recorded.</div>
          ) : (
            activities.map(act => (
              <div key={act.id} className="py-3 flex items-start gap-3">
                <span
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    act.type === 'alert' ? 'bg-rose-500 ring-2 ring-rose-200' : 'bg-indigo-500'
                  }`}
                ></span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 leading-snug">{act.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{act.details}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{act.timestamp} • {act.user}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              clearNotification();
              onClose();
            }}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Dismiss All
          </button>
        </div>
      </div>
    </div>
  );
};
