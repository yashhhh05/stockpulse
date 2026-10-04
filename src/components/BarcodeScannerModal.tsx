import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext.tsx';
import { Product } from '../types/index.ts';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScannedProduct: (product: Product) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onSelectScannedProduct
}) => {
  const { products } = useInventory();
  const [manualCode, setManualCode] = useState('');
  const [scannedResult, setScannedResult] = useState<Product | null>(null);

  if (!isOpen) return null;

  const handleSimulateScan = (product: Product) => {
    setScannedResult(product);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    const found = products.find(
      p => p.sku.toLowerCase() === manualCode.trim().toLowerCase() ||
           p.name.toLowerCase().includes(manualCode.trim().toLowerCase())
    );
    if (found) {
      setScannedResult(found);
    } else {
      alert(`No product matching code "${manualCode}" found.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-center items-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-400 text-xl">barcode_scanner</span>
            <div>
              <h2 className="text-sm font-bold">Optical SKU Scanner</h2>
              <p className="text-[10px] text-slate-400">Zebra TC57 Peripherals Emulated</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Viewfinder simulation */}
        <div className="relative bg-slate-950 h-56 flex items-center justify-center overflow-hidden">
          {/* Target Reticle corners */}
          <div className="absolute w-56 h-36 border-2 border-indigo-400/50 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
            <div className="flex justify-between">
              <span className="w-3 h-3 border-t-2 border-l-2 border-indigo-400"></span>
              <span className="w-3 h-3 border-t-2 border-r-2 border-indigo-400"></span>
            </div>
            {/* Animated Laser line */}
            <div className="w-full h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse"></div>
            <div className="flex justify-between">
              <span className="w-3 h-3 border-b-2 border-l-2 border-indigo-400"></span>
              <span className="w-3 h-3 border-b-2 border-r-2 border-indigo-400"></span>
            </div>
          </div>

          <div className="text-center px-4 z-10 text-slate-400 text-xs">
            <span className="material-symbols-outlined text-3xl text-indigo-400 animate-bounce">center_focus_strong</span>
            <p className="mt-1 font-mono text-[11px] text-slate-300">Align barcode or select SKU below</p>
          </div>
        </div>

        {/* Scanned Match Result or Quick Triggers */}
        <div className="p-5 flex flex-col gap-4">
          {scannedResult ? (
            <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                  Target SKU Identified
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Matched
                </span>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={scannedResult.imageUrl}
                  alt={scannedResult.name}
                  className="w-12 h-12 rounded-xl object-cover border border-indigo-100"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{scannedResult.name}</h4>
                  <p className="text-[11px] font-mono text-slate-500">{scannedResult.sku}</p>
                  <p className="text-xs font-bold text-indigo-700 mt-0.5">
                    Stock: {scannedResult.stock} {scannedResult.unit} (${scannedResult.price})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onSelectScannedProduct(scannedResult);
                    onClose();
                  }}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  Inspect & Adjust
                </button>
                <button
                  type="button"
                  onClick={() => setScannedResult(null)}
                  className="py-2 px-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-medium cursor-pointer"
                >
                  Scan Next
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Rapid Test Scan Buttons */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Rapid Barcode Trigger:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {products.slice(0, 4).map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSimulateScan(p)}
                      className="p-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-colors cursor-pointer group"
                    >
                      <p className="text-[11px] font-mono font-bold text-slate-800 group-hover:text-indigo-600 truncate">
                        {p.sku}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">{p.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual input */}
              <form onSubmit={handleManualSearch} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Enter SKU manually..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900 cursor-pointer"
                >
                  Lookup
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
