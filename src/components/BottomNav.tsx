import React from 'react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'products', label: 'Products', icon: 'category' },
    { id: 'inventory', label: 'Inventory', icon: 'warehouse' },
    { id: 'reports', label: 'Reports', icon: 'analytics' },
    { id: 'more', label: 'More', icon: 'more_horiz' }
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-white/95 backdrop-blur-xl border-t border-slate-200/70 shadow-[0_-4px_24px_rgba(15,23,42,0.04)] md:hidden">
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {tabs.map(tab => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-14 h-12 rounded-2xl transition-all cursor-pointer ${
                isActive ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div
                className={`w-8 h-7 rounded-xl flex items-center justify-center transition-colors ${
                  isActive ? 'bg-indigo-50' : 'bg-transparent'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[21px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {tab.icon}
                </span>
              </div>
              <span className={`text-[11px] mt-0.5 leading-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
