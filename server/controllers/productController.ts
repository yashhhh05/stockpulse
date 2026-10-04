import { Request, Response } from 'express';
import { db, Product, ActivityLog } from '../config/db.ts';
import { broadcastStockUpdate, broadcastProductChange } from '../socket/socketHandler.ts';
import { AuthRequest } from '../middleware/authMiddleware.ts';

export const getProducts = (req: Request, res: Response) => {
  const { category, search } = req.query;

  let filtered = [...db.products];

  if (category && typeof category === 'string' && category.toLowerCase() !== 'all') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.supplier.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  res.json(filtered);
};

export const getProductById = (req: Request, res: Response) => {
  const { id } = req.params;
  const product = db.products.find(p => p.id === id || p.sku.toLowerCase() === id.toLowerCase());

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
};

export const createProduct = (req: AuthRequest, res: Response) => {
  const { name, sku, category, price, stock, minThreshold, supplier, unit, imageUrl } = req.body;

  if (!name || !sku) {
    return res.status(400).json({ message: 'Product name and SKU are required' });
  }

  const existing = db.products.find(p => p.sku.toLowerCase() === sku.toLowerCase());
  if (existing) {
    return res.status(400).json({ message: `A product with SKU ${sku} already exists` });
  }

  const newProduct: Product = {
    id: `prod_${Date.now()}`,
    name,
    sku: sku.toUpperCase(),
    category: category || 'Hardware',
    price: Number(price) || 0,
    stock: Number(stock) || 0,
    minThreshold: Number(minThreshold) || 10,
    supplier: supplier || 'Internal Warehouse Store',
    unit: unit || 'units',
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
    lastUpdated: new Date().toISOString()
  };

  db.products.unshift(newProduct);

  const newActivity: ActivityLog = {
    id: `act_${Date.now()}`,
    type: 'in',
    title: `New SKU Added: ${newProduct.name}`,
    details: `Initial stock: ${newProduct.stock} ${newProduct.unit} • Added by ${req.user?.name || 'Manager'}`,
    user: req.user?.name || 'Sarah Jenkins',
    role: req.user?.role || 'Manager',
    timestamp: 'Just now',
    productId: newProduct.id
  };
  db.activities.unshift(newActivity);

  broadcastProductChange('added', newProduct);
  broadcastStockUpdate(newProduct, newActivity);

  res.status(201).json(newProduct);
};

export const updateProduct = (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const index = db.products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const existing = db.products[index];
  const updated: Product = {
    ...existing,
    ...req.body,
    price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : existing.stock,
    minThreshold: req.body.minThreshold !== undefined ? Number(req.body.minThreshold) : existing.minThreshold,
    lastUpdated: new Date().toISOString()
  };

  db.products[index] = updated;

  broadcastProductChange('updated', updated);
  broadcastStockUpdate(updated, {
    id: `act_${Date.now()}`,
    type: 'adjust',
    title: `Product Master Updated: ${updated.sku}`,
    details: `Updated by ${req.user?.name || 'Operations'}`,
    user: req.user?.name || 'Operations',
    role: req.user?.role || 'Staff',
    timestamp: 'Just now',
    productId: updated.id
  });

  res.json(updated);
};

export const deleteProduct = (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const index = db.products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const removed = db.products.splice(index, 1)[0];
  broadcastProductChange('deleted', { id: removed.id, sku: removed.sku });

  res.json({ message: 'Product removed successfully', id: removed.id });
};

export const stockMovement = (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { type, quantity, reason, location } = req.body; // type: 'in' | 'out' | 'adjust' | 'transfer'

  const product = db.products.find(p => p.id === id || p.sku.toLowerCase() === id.toLowerCase());

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const qty = Number(quantity);
  if (isNaN(qty) || qty <= 0) {
    return res.status(400).json({ message: 'Valid positive quantity required' });
  }

  let oldStock = product.stock;
  let newStock = product.stock;

  if (type === 'in') {
    newStock += qty;
    if (product.deactivated && newStock > 0) {
      product.deactivated = false;
      product.statusNotes = undefined;
    }
  } else if (type === 'out') {
    if (product.stock < qty) {
      return res.status(400).json({ message: `Insufficient stock! Currently available: ${product.stock}` });
    }
    newStock -= qty;
  } else if (type === 'adjust') {
    newStock = qty;
  } else if (type === 'transfer') {
    // transfer keeps or modifies depending on location
  }

  product.stock = newStock;
  product.lastUpdated = new Date().toISOString();

  // Create real-time activity record
  let logTitle = '';
  let logDetails = '';

  const userName = req.user?.name || 'Sarah Jenkins';
  const userRole = req.user?.role || 'Manager';

  if (type === 'in') {
    logTitle = `Stock In: +${qty}x ${product.name}`;
    logDetails = reason || `${product.supplier} • PO #${Math.floor(10000 + Math.random() * 90000)}`;
  } else if (type === 'out') {
    logTitle = `Stock Out: -${qty}x ${product.name}`;
    logDetails = reason || `Dispatched by ${userName} (${userRole}) • ${location || 'Bay 4'}`;
  } else if (type === 'adjust') {
    const diff = newStock - oldStock;
    logTitle = `Stock Adjusted: ${product.name}`;
    logDetails = `${diff > 0 ? '+' : ''}${diff} count correction by ${userName} (${userRole})`;
  } else {
    logTitle = `Stock Transfer: ${qty}x ${product.name}`;
    logDetails = `Transferred to ${location || 'Bay 2 East'} by ${userName}`;
  }

  const newActivity: ActivityLog = {
    id: `act_${Date.now()}`,
    type: type === 'in' ? 'in' : type === 'out' ? 'out' : 'adjust',
    title: logTitle,
    details: logDetails,
    user: userName,
    role: userRole,
    timestamp: 'Just now',
    productId: product.id
  };

  db.activities.unshift(newActivity);
  // Keep activities at max 40
  if (db.activities.length > 40) {
    db.activities.pop();
  }

  // Socket.IO instant broadcast!
  broadcastStockUpdate(product, newActivity);

  res.json({
    message: 'Stock updated successfully',
    product,
    activity: newActivity
  });
};

export const quickReorder = (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const product = db.products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const reorderQty = Math.max(product.minThreshold * 2, 20);
  product.stock += reorderQty;
  product.deactivated = false;
  product.statusNotes = undefined;
  product.lastUpdated = new Date().toISOString();

  const activity: ActivityLog = {
    id: `act_${Date.now()}`,
    type: 'in',
    title: `Quick Reorder: +${reorderQty}x ${product.name}`,
    details: `Auto-replenished via ${product.supplier}`,
    user: req.user?.name || 'Sarah Jenkins',
    role: req.user?.role || 'Manager',
    timestamp: 'Just now',
    productId: product.id
  };

  db.activities.unshift(activity);
  broadcastStockUpdate(product, activity);

  res.json({
    message: `Quick reordered ${reorderQty} units successfully`,
    product,
    activity
  });
};
