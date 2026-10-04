import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext.tsx';
import { Product } from '../types/index.ts';

interface StockMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  movementType: 'in' | 'out' | 'adjust' | 'transfer';
  targetProduct?: Product | null;
}

export const StockMovementModal: React.FC<StockMovementModalProps> = ({
  isOpen,
  onClose,
  movementType,
  targetProduct
}) => {
  const { products, moveStock } = useInventory();
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('10');
  const [reason, setReason] = useState<string>('');
  const [location, setLocation] = useState<string>('Bay 4 East');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (targetProduct) {
      setSelectedProductId(targetProduct.id);
    } else if (products.length > 0) {
      setSelectedProductId(products[0].id);
    }

    if (movementType === 'in') {
      setReason(`PO #${Math.floor(10000 + Math.random() * 90000)} Receipt`);
      setQuantity('25');
    } else if (movementType === 'out') {
      setReason('Dispatch to fulfillment line A');
      setQuantity('5');
    } else if (movementType === 'transfer') {
      setReason('Internal relocation');
      setLocation('Bay 2 Secondary Racks');
      setQuantity('10');
    } else {
      setReason('Physical inventory recount');
      setQuantity('50');
    }
    setError(null);
  }, [isOpen, targetProduct, movementType, products]);

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.id === selectedProductId) || products[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) {
      setError('Please select a valid product');
      return;
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      setError('Please enter a valid positive quantity');
      return;
    }

    if (movementType === 'out' && currentProduct.stock < qty) {
      setError(`Insufficient inventory! Current stock is only ${currentProduct.stock} ${currentProduct.unit}`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await moveStock(currentProduct.id, {
        type: movementType,
        quantity: qty,
        reason: reason.trim() || undefined,
        location: location.trim() || undefined
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitle = () => {
    switch (movementType) {
      case 'in':
        return 'Stock In (Inbound Receipt)';
      case 'out':
        return 'Stock Out (Dispatched / Pick)';
      case 'transfer':
        return 'Stock Transfer (Relocate)';
      default:
        return 'Inventory Audit Correction';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-center items-end md:items-center p-0 md:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] border-t md:border border-slate-200 animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-3 pb-2 flex flex-col items-center">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-3 md:hidden"></div>
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{getTitle()}</h2>
              <p className="text-xs text-slate-500 mt-0.5">Real-time socket synchronized</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex-1 overflow-y-auto flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Product Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Select Item</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku}) — Available: {p.stock} {p.unit}
                </option>
              ))}
            </select>
          </div>

          {/* Current product quick preview */}
          {currentProduct && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/70 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                <img src={currentProduct.imageUrl} alt={currentProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{currentProduct.name}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                  <span className="font-mono">{currentProduct.sku}</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-700">Current Stock: {currentProduct.stock} {currentProduct.unit}</span>
                </div>
              </div>
            </div>
          )}

          {/* Quantity Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              {movementType === 'adjust' ? 'New Exact Stock Level' : 'Quantity to Move'}
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full h-12 pl-4 pr-16 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
              <span className="absolute right-4 text-xs font-semibold text-slate-400">
                {currentProduct?.unit || 'units'}
              </span>
            </div>
          </div>

          {/* Reason / Reference PO */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Reference / Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. PO #88410 or Order Dispatch"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Location / Bay */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Storage Bay / Station</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bay 4 Dispatched"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 pb-1 flex items-center gap-3 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-sm font-semibold active:scale-95 transition-transform hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-semibold shadow-sm shadow-indigo-500/25 active:scale-95 transition-transform hover:bg-indigo-700 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Syncing...' : 'Commit Movement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
