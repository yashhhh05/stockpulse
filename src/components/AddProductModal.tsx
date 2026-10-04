import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext.tsx';
import { Product } from '../types/index.ts';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit
}) => {
  const { addProduct, updateProduct } = useInventory();

  const [name, setName] = useState(productToEdit?.name || '');
  const [sku, setSku] = useState(productToEdit?.sku || '');
  const [category, setCategory] = useState(productToEdit?.category || 'Electronics');
  const [price, setPrice] = useState(productToEdit?.price?.toString() || '49.99');
  const [stock, setStock] = useState(productToEdit?.stock?.toString() || '50');
  const [minThreshold, setMinThreshold] = useState(productToEdit?.minThreshold?.toString() || '15');
  const [supplier, setSupplier] = useState(productToEdit?.supplier || 'Apex Global Logistics');
  const [unit, setUnit] = useState(productToEdit?.unit || 'units');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state if productToEdit changes
  React.useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setSku(productToEdit.sku);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price.toString());
      setStock(productToEdit.stock.toString());
      setMinThreshold(productToEdit.minThreshold.toString());
      setSupplier(productToEdit.supplier);
      setUnit(productToEdit.unit);
    } else {
      setName('');
      setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
      setCategory('Electronics');
      setPrice('49.99');
      setStock('50');
      setMinThreshold('15');
      setSupplier('Apex Global Logistics');
      setUnit('units');
    }
    setError(null);
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!sku.trim()) {
      setError('SKU code is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: Partial<Product> = {
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        category,
        price: parseFloat(price) || 0,
        stock: parseInt(stock, 10) || 0,
        minThreshold: parseInt(minThreshold, 10) || 10,
        supplier: supplier.trim() || 'Internal Depot',
        unit: unit || 'units'
      };

      if (productToEdit) {
        await updateProduct(productToEdit.id, payload);
      } else {
        await addProduct(payload);
      }
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-center items-end md:items-center p-0 md:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] border-t md:border border-slate-200 animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handlebar for mobile & Header */}
        <div className="px-5 pt-3 pb-2 flex flex-col items-center">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-3 md:hidden"></div>
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {productToEdit ? 'Edit Catalog Product' : 'Add New Product'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Enter master data & stock levels</p>
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Product Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700">Product Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ergonomic Hand Pallet Truck"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          {/* SKU Code & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">SKU Code</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="SKU-AUTO-100"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              >
                <option value="Electronics">Electronics</option>
                <option value="Packaging">Packaging</option>
                <option value="Hardware">Hardware</option>
                <option value="Safety Gear">Safety Gear</option>
                <option value="Lubricants">Lubricants</option>
              </select>
            </div>
          </div>

          {/* Unit Price, Init Stock, Min Alert */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">Init Stock</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="50"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">Min Alert</label>
              <input
                type="number"
                min="0"
                value={minThreshold}
                onChange={(e) => setMinThreshold(e.target.value)}
                placeholder="10"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Supplier Vendor */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700">Supplier Vendor</label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="Select or type vendor name"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Unit of measure */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700">Unit of Measure</label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g. units, boxes, packs, liters"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 pb-1 flex items-center gap-3 mt-1">
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
              {isSubmitting ? 'Saving...' : productToEdit ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
