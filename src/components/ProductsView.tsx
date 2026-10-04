import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext.tsx';
import { Product } from '../types/index.ts';

interface ProductsViewProps {
  onOpenAddProduct: () => void;
  onOpenScanner: () => void;
  onSelectProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onOpenStockMovement: (type: 'in' | 'out' | 'adjust' | 'transfer', product?: Product) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  onOpenAddProduct,
  onOpenScanner,
  onSelectProduct,
  onEditProduct,
  onOpenStockMovement
}) => {
  const {
    products,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    quickReorder,
    updateProduct
  } = useInventory();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All', count: '1,428' },
    { id: 'electronics', label: 'Electronics', count: '412' },
    { id: 'hardware', label: 'Hardware', count: '320' },
    { id: 'packaging', label: 'Packaging', count: '280' },
    { id: 'safety', label: 'Safety Gear', count: '180' },
    { id: 'lubricants', label: 'Lubricants', count: '236' }
  ];

  const handleToggleDeactivated = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    await updateProduct(product.id, {
      deactivated: !product.deactivated,
      statusNotes: product.deactivated ? undefined : 'Item deactivated by warehouse staff.'
    });
  };

  const handleQuickReorder = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    await quickReorder(product.id);
  };

  return (
    <div className="flex flex-col w-full pb-24 md:pb-8 max-w-5xl mx-auto">
      {/* Search & Barcode Scan Bar */}
      <div className="px-4 md:px-6 pt-3 pb-2 bg-[#f8fafc]">
        <div className="flex items-center gap-2.5">
          <div className="flex-1 flex items-center bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)] border border-slate-200/80 rounded-full px-4 py-2.5 gap-2.5">
            <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, SKU or barcode..."
              className="w-full bg-transparent border-none p-0 text-sm md:text-base text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
            <button
              type="button"
              onClick={onOpenScanner}
              aria-label="Scan barcode"
              className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">barcode_scanner</span>
            </button>
          </div>

          <button
            type="button"
            aria-label="Filter options"
            className="h-11 w-11 shrink-0 flex items-center justify-center bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 active:scale-95 rounded-full shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Category Filter Chips */}
      <div className="w-full overflow-x-auto no-scrollbar py-2 px-4 md:px-6 flex items-center gap-2 select-none">
        {categories.map((cat) => {
          const isActive = categoryFilter.toLowerCase() === cat.id.toLowerCase();
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                  : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Action Subheader & Counter */}
      <div className="px-4 md:px-6 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-slate-900 tracking-tight">Catalog Items</span>
          <span className="text-xs font-semibold text-slate-500">
            Filtered {products.length} {products.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenAddProduct}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white rounded-full text-xs md:text-sm font-semibold shadow-sm shadow-indigo-500/25 active:scale-95 transition-all hover:bg-indigo-700 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add Product</span>
        </button>
      </div>

      {/* Product Cards List */}
      <div className="px-4 md:px-6 flex flex-col gap-4 pb-6 mt-1">
        {products.map((product) => {
          const isLowStock = product.stock > 0 && product.stock <= product.minThreshold;
          const isOutOfStock = product.stock === 0;
          const isHealthy = product.stock > product.minThreshold;
          const deficit = product.stock - product.minThreshold;

          return (
            <div
              key={product.id}
              className={`bg-white rounded-3xl p-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)] border border-slate-200/70 flex flex-col gap-3 relative overflow-hidden transition-all hover:shadow-[0_6px_24px_rgba(15,23,42,0.07)] ${
                product.deactivated ? 'opacity-95' : ''
              }`}
            >
              {/* Top Row: Thumbnail + Info + Stock Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3.5 min-w-0">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center p-0.5 border border-slate-100 ${
                      product.deactivated ? 'grayscale' : ''
                    }`}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="text-base font-bold text-slate-900 truncate hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-mono font-medium text-slate-500">{product.sku}</span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-xs font-medium text-slate-500">{product.category}</span>
                    </div>
                    <span className="text-lg font-bold text-indigo-700 mt-1">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Status Chip Pill */}
                {isHealthy && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {product.stock} in Stock
                  </span>
                )}

                {isLowStock && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-xs font-semibold shrink-0">
                    <span className="material-symbols-outlined text-[13px] text-amber-600">warning</span>
                    {product.stock} Low Stock
                  </span>
                )}

                {isOutOfStock && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 text-xs font-semibold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                    0 Out of Stock
                  </span>
                )}
              </div>

              {/* Warning Prompt Banner if deactivated */}
              {product.deactivated && (
                <div className="bg-rose-50/70 border border-rose-100 text-rose-900 rounded-2xl p-3 flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-rose-600 shrink-0">info</span>
                  <span className="text-xs leading-tight flex-1">
                    {product.statusNotes || 'Item deactivated: No replenishment schedule recorded.'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleToggleDeactivated(product, e)}
                    className="px-2.5 py-1 bg-white border border-rose-200 text-rose-800 rounded-full text-xs font-semibold shadow-sm active:scale-95 shrink-0 cursor-pointer"
                  >
                    Enable
                  </button>
                </div>
              )}

              {/* Detail Matrix */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50/80 rounded-2xl p-3 border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[11px] font-medium text-slate-500">Min Stock Threshold</span>
                  <span
                    className={`text-xs font-mono font-bold ${
                      deficit < 0 ? 'text-rose-600' : 'text-slate-800'
                    }`}
                  >
                    {product.minThreshold} {product.unit} {deficit < 0 ? `(Deficit ${deficit})` : ''}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-medium text-slate-500">Supplier Vendor</span>
                  <span className="text-xs font-medium text-slate-800 truncate">{product.supplier}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-0.5 relative">
                {isLowStock ? (
                  <>
                    <button
                      type="button"
                      onClick={(e) => handleQuickReorder(product, e)}
                      className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors active:scale-95 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                      <span>Reorder Quick</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditProduct(product)}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleToggleDeactivated(product, e)}
                      aria-label="Deactivate"
                      className="w-9 h-9 flex items-center justify-center bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl active:scale-95 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">block</span>
                    </button>
                  </>
                ) : isOutOfStock ? (
                  <>
                    <button
                      type="button"
                      onClick={(e) => handleQuickReorder(product, e)}
                      className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors active:scale-95 text-center cursor-pointer"
                    >
                      Order Batch
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditProduct(product)}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">tune</span>
                      <span>Config</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors active:scale-95 text-center truncate cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditProduct(product)}
                      className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      <span>Edit</span>
                    </button>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(activeMenuId === product.id ? null : product.id)}
                        aria-label="More options"
                        className="w-9 h-9 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-xl active:scale-95 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>

                      {activeMenuId === product.id && (
                        <div className="absolute right-0 bottom-full mb-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-30 animate-in fade-in">
                          <button
                            type="button"
                            onClick={() => {
                              onOpenStockMovement('in', product);
                              setActiveMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-xl"
                          >
                            <span className="material-symbols-outlined text-emerald-600 text-[16px]">add_box</span>
                            <span>Stock In</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onOpenStockMovement('out', product);
                              setActiveMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-xl"
                          >
                            <span className="material-symbols-outlined text-rose-600 text-[16px]">indeterminate_check_box</span>
                            <span>Stock Out</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onOpenStockMovement('transfer', product);
                              setActiveMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-xl"
                          >
                            <span className="material-symbols-outlined text-indigo-600 text-[16px]">move_up</span>
                            <span>Transfer</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick FAB for mobile access */}
      <div className="fixed right-4 bottom-20 z-30 md:hidden">
        <button
          type="button"
          onClick={onOpenAddProduct}
          aria-label="Create new product"
          className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 flex items-center justify-center hover:bg-indigo-700 active:scale-90 transition-transform focus:outline-none cursor-pointer"
        >
          <span className="material-symbols-outlined text-[28px]">add</span>
        </button>
      </div>
    </div>
  );
};
