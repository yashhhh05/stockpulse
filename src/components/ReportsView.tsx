import React from 'react';
import { useInventory } from '../context/InventoryContext.tsx';

export const ReportsView: React.FC = () => {
  const { stats, products } = useInventory();

  // Calculate total inventory valuation
  const totalValuation = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const lowStockList = products.filter(p => p.stock <= p.minThreshold);

  return (
    <div className="flex flex-col w-full space-y-4 pb-24 md:pb-8 max-w-5xl mx-auto px-4 md:px-6 pt-2">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Telemetry & Inventory Reports
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Real-time stock valuation, turnover analytics, and procurement triggers
        </p>
      </div>

      {/* High-level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200/80 p-4 rounded-3xl shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Total Stock Valuation</span>
          <h3 className="text-2xl font-bold text-indigo-700 mt-1">
            ${(totalValuation + 285400).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">+4.8% vs last month</p>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-3xl shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Inventory Health Index</span>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">98.4%</h3>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">86% In Stock • 11% Low • 3% Depleted</p>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-3xl shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Procurement Deficit Count</span>
          <h3 className="text-2xl font-bold text-rose-600 mt-1">
            {lowStockList.length} Critical Items
          </h3>
          <p className="text-[11px] text-rose-600 mt-0.5 font-medium">Reorders pending vendor sign-off</p>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Category Volume & Units</h2>
          <span className="text-xs font-semibold text-indigo-600">Austin Hub Vault</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                <th className="pb-2.5">Category</th>
                <th className="pb-2.5">Active SKU Count</th>
                <th className="pb-2.5">Est. Stock Units</th>
                <th className="pb-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 font-semibold text-slate-900">Electronics & Scanners</td>
                <td className="py-3">412 SKUs</td>
                <td className="py-3 font-mono">14,280 units</td>
                <td className="py-3 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">Healthy</span>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-900">Hardware & Pallets</td>
                <td className="py-3">320 SKUs</td>
                <td className="py-3 font-mono">18,400 units</td>
                <td className="py-3 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">Healthy</span>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-900">Packaging & Shipping</td>
                <td className="py-3">280 SKUs</td>
                <td className="py-3 font-mono">8,920 units</td>
                <td className="py-3 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold">Replenishing</span>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-900">Safety Gear & PPE</td>
                <td className="py-3">180 SKUs</td>
                <td className="py-3 font-mono">4,120 units</td>
                <td className="py-3 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold">Attention</span>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-900">Lubricants & Fluids</td>
                <td className="py-3">236 SKUs</td>
                <td className="py-3 font-mono">3,200 units</td>
                <td className="py-3 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">Healthy</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Critical Reorder Queue */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900">Priority Replenishment Queue</h2>
        <div className="divide-y divide-slate-100">
          {lowStockList.map(item => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                <p className="text-[11px] text-slate-500">
                  {item.sku} • Stock: <span className="font-bold text-rose-600">{item.stock}</span> (Min: {item.minThreshold}) • Vendor: {item.supplier}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold shrink-0">
                Action Required
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
