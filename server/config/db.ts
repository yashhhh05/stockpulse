export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // hashed/plain for demo
  role: 'admin' | 'manager' | 'staff';
  facility: string;
  activeStation?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: 'Electronics' | 'Hardware' | 'Packaging' | 'Safety Gear' | 'Lubricants' | string;
  price: number;
  stock: number;
  minThreshold: number;
  supplier: string;
  unit: string;
  imageUrl: string;
  deactivated?: boolean;
  statusNotes?: string;
  lastUpdated: string;
}

export interface ActivityLog {
  id: string;
  type: 'in' | 'out' | 'adjust' | 'alert' | 'transfer';
  title: string;
  details: string;
  user: string;
  role: string;
  timestamp: string;
  productId?: string;
}

class Database {
  users: User[] = [
    {
      id: 'usr_admin',
      name: 'Alex Morgan',
      email: 'alex.admin@stockpulse.io',
      password: 'WarehousePass2025!',
      role: 'admin',
      facility: 'Main Hub - Austin (TX-01)',
      activeStation: 'Terminal Alpha-01'
    },
    {
      id: 'usr_manager',
      name: 'Sarah Jenkins',
      email: 'sarah.j@stockpulse.io',
      password: 'WarehousePass2025!',
      role: 'manager',
      facility: 'Main Hub - Austin (TX-01)',
      activeStation: 'Station WH-East 04'
    },
    {
      id: 'usr_staff',
      name: 'Marcus Dock',
      email: 'marcus.dock@stockpulse.io',
      password: 'WarehousePass2025!',
      role: 'staff',
      facility: 'Main Hub - Austin (TX-01)',
      activeStation: 'Zebra TC57 Handheld'
    }
  ];

  products: Product[] = [
    {
      id: 'prod_1',
      name: 'Industrial Barcode Scanner 2D',
      sku: 'SKU-ELEC-9021',
      category: 'Electronics',
      price: 249.00,
      stock: 84,
      minThreshold: 20,
      supplier: 'Apex Global Logistics',
      unit: 'units',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    {
      id: 'prod_2',
      name: 'High-Visibility Safety Vest (L)',
      sku: 'SKU-SFTY-1044',
      category: 'Safety Gear',
      price: 18.50,
      stock: 8,
      minThreshold: 25,
      supplier: 'SafeGuard Pro Supplies',
      unit: 'units',
      imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=400&q=80',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60).toISOString()
    },
    {
      id: 'prod_3',
      name: 'Thermal Labels (1000pk)',
      sku: 'SKU-PCKG-4412',
      category: 'Packaging',
      price: 34.00,
      stock: 0,
      minThreshold: 15,
      supplier: 'PackMatrix Corp',
      unit: 'boxes',
      imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
      deactivated: true,
      statusNotes: 'Item deactivated: No replenishment schedule recorded.',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 120).toISOString()
    },
    {
      id: 'prod_4',
      name: 'Synthetic Hydraulic Fluid 5L',
      sku: 'SKU-LUB-8820',
      category: 'Lubricants',
      price: 52.00,
      stock: 42,
      minThreshold: 10,
      supplier: 'LubriTech Industrial',
      unit: 'units',
      imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 15).toISOString()
    },
    {
      id: 'prod_5',
      name: 'Heavy Duty Wooden Pallets (Pack of 10)',
      sku: 'SKU-HDW-4010',
      category: 'Hardware',
      price: 140.00,
      stock: 120,
      minThreshold: 30,
      supplier: 'TimberCore Logistics',
      unit: 'packs',
      imageUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=400&q=80',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 4).toISOString()
    },
    {
      id: 'prod_6',
      name: 'Corrugated Shipping Box #4',
      sku: 'SKU-PCKG-3302',
      category: 'Packaging',
      price: 1.85,
      stock: 650,
      minThreshold: 200,
      supplier: 'PackMatrix Corp',
      unit: 'boxes',
      imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=400&q=80',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 85).toISOString()
    },
    {
      id: 'prod_7',
      name: 'Industrial Safety Helmet Hard Hat',
      sku: 'SKU-SFTY-5520',
      category: 'Safety Gear',
      price: 28.00,
      stock: 65,
      minThreshold: 20,
      supplier: 'SafeGuard Pro Supplies',
      unit: 'units',
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 200).toISOString()
    },
    {
      id: 'prod_8',
      name: 'Precision Digital Caliper 150mm',
      sku: 'SKU-HDW-9014',
      category: 'Hardware',
      price: 64.00,
      stock: 31,
      minThreshold: 8,
      supplier: 'Apex Global Logistics',
      unit: 'units',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 180).toISOString()
    }
  ];

  activities: ActivityLog[] = [
    {
      id: 'act_1',
      type: 'out',
      title: 'Stock Out: 45x Heavy Duty Pallets',
      details: 'Dispatched by Mike R. (Staff) • Bay 4',
      user: 'Mike R.',
      role: 'Staff',
      timestamp: '4m ago',
      productId: 'prod_5'
    },
    {
      id: 'act_2',
      type: 'in',
      title: 'Stock In: 200x Wireless Scanners',
      details: 'TechSupply Global • PO #88410',
      user: 'Sarah Jenkins',
      role: 'Manager',
      timestamp: '22m ago',
      productId: 'prod_1'
    },
    {
      id: 'act_3',
      type: 'alert',
      title: 'Low Stock Alert: Hydraulic Oil 5L',
      details: 'Qty: 4 remaining • Threshold is 15',
      user: 'System Bot',
      role: 'System',
      timestamp: '1h ago',
      productId: 'prod_4'
    },
    {
      id: 'act_4',
      type: 'adjust',
      title: 'Stock Adjusted: Bolt M8x50',
      details: '-12 count correction by Alex Chen (Manager)',
      user: 'Alex Chen',
      role: 'Manager',
      timestamp: '2h ago'
    }
  ];
}

export const db = new Database();
