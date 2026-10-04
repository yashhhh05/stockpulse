import React from 'react';
import { useInventory } from '../context/InventoryContext.tsx';
import { Product } from '../types/index.ts';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onOpenMovement: (type: 'in' | 'out' | 'adjust' | 'transfer', product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onEdit,
  onOpenMovement
}) => {
  const { quickReorder, deleteProduct } = useInventory();

  if (!product) return null;

  const isLowStock = product.stock > 0 && product.stock <= product.minThreshold;
  const isOutOfStock = product.stock === 0;
  const deficit = product.stock - product.minThreshold;

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to remove ${product.name} (${product.sku}) from catalog?`)) {
      await deleteProduct(product.id);
      onClose();
    }
  };

  const handleReorder = async () => {
    await quickReorder(product.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-center items-end md:items-center p-0 md:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] border-t md:border border-slate-200 animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 text-xl">inventory</span>
            <h2 className="text-base font-bold text-slate-900">SKU Inspector</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex flex-col gap-4">
          {/* Main Info */}
          <div className="flex gap-4 items-start">
            <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200/70 overflow-hidden shrink-0">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
                  {product.category}
                </span>
                <span className="text-xs font-mono text-slate-400">{product.sku}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">{product.name}</h3>
              <p className="text-xl font-bold text-indigo-700 mt-1">${product.price.toFixed(2)}</p>
            </div>
          </div>

          {/* Stock Metrics Card */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Inventory State
              </span>
              {isOutOfStock ? (
                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  Out of Stock (0 {product.unit})
                </span>
              ) : isLowStock ? (
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-amber-600">warning</span>
                  Low Stock ({product.stock} {product.unit})
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Healthy ({product.stock} {product.unit})
                </span>
              )}
            </div>

            {/* Threshold progress indicator */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 font-medium mb-1">
                <span>Current: {product.stock} {product.unit}</span>
                <span>Minimum Alert: {product.minThreshold} {product.unit}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOutOfStock ? 'w-0' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(8, (product.stock / (product.minThreshold * 2.5)) * 100))}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Supplier</span>
                <span className="font-semibold text-slate-800 truncate block mt-0.5">{product.supplier}</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Deficit Status</span>
                <span className={`font-semibold block mt-0.5 ${deficit < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {deficit < 0 ? `Deficit of ${Math.abs(deficit)} units` : `+${deficit} buffer`}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Movement Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                onOpenMovement('in', product);
                onClose();
              }}
              className="py-2.5 px-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add_box</span>
              <span>Stock In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenMovement('out', product);
                onClose();
              }}
              className="py-2.5 px-2 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">indeterminate_check_box</span>
              <span>Stock Out</span>
            </button>

            <button
              type="button"
              onClick={handleReorder}
              className="py-2.5 px-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">local_shipping</span>
              <span>Reorder</span>
            </button>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                onEdit(product);
                onClose();
              }}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              <span>Edit Details</span>
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="p-2.5 bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              title="Delete SKU"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
