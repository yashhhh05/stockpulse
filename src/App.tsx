import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { InventoryProvider, useInventory } from './context/InventoryContext.tsx';
import { Header } from './components/Header.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { DesktopNav } from './components/DesktopNav.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { ProductsView } from './components/ProductsView.tsx';
import { InventoryMovementsView } from './components/InventoryMovementsView.tsx';
import { ReportsView } from './components/ReportsView.tsx';
import { MoreMenuView } from './components/MoreMenuView.tsx';
import { AddProductModal } from './components/AddProductModal.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { StockMovementModal } from './components/StockMovementModal.tsx';
import { BarcodeScannerModal } from './components/BarcodeScannerModal.tsx';
import { FacilityModal } from './components/FacilityModal.tsx';
import { NotificationsModal } from './components/NotificationsModal.tsx';
import { UserProfileModal } from './components/UserProfileModal.tsx';
import { LoginScreen } from './components/LoginScreen.tsx';
import { RegisterScreen } from './components/RegisterScreen.tsx';
import { Product } from './types/index.ts';

function MainAppContent() {
  const { isAuthenticated } = useAuth();
  const { recentNotification, clearNotification } = useInventory();

  // Navigation state
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  // Modal dialog states
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isStockMovementOpen, setIsStockMovementOpen] = useState(false);
  const [movementType, setMovementType] = useState<'in' | 'out' | 'adjust' | 'transfer'>('in');
  const [movementTargetProduct, setMovementTargetProduct] = useState<Product | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isFacilityOpen, setIsFacilityOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // If user explicitly logs out or wants to see auth screens
  const [showAuthScreen, setShowAuthScreen] = useState(false);

  // Handlers
  const handleOpenAddProduct = () => {
    setProductToEdit(null);
    setIsAddProductOpen(true);
  };

  const handleEditProduct = (prod: Product) => {
    setProductToEdit(prod);
    setIsAddProductOpen(true);
  };

  const handleOpenMovement = (type: 'in' | 'out' | 'adjust' | 'transfer', prod?: Product) => {
    setMovementType(type);
    setMovementTargetProduct(prod || null);
    setIsStockMovementOpen(true);
  };

  const handleSelectScannedProduct = (prod: Product) => {
    setSelectedProductDetail(prod);
  };

  // If user signed out or clicked login/register
  if (!isAuthenticated || showAuthScreen) {
    if (authView === 'register') {
      return (
        <RegisterScreen
          onSwitchToLogin={() => setAuthView('login')}
          onSuccess={() => setShowAuthScreen(false)}
        />
      );
    }
    return (
      <LoginScreen
        onSwitchToRegister={() => setAuthView('register')}
        onSuccess={() => setShowAuthScreen(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased flex flex-col selection:bg-indigo-100">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onOpenSearch={() => setCurrentTab('products')}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Real-time Socket.io Toast Notification Banner */}
      {recentNotification && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700/80 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate text-emerald-300">{recentNotification.title}</p>
              <p className="text-[11px] text-slate-300 truncate">{recentNotification.details}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={clearNotification}
            className="text-slate-400 hover:text-white p-1 rounded-lg shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Main Responsive Layout: Desktop Sidebar + Content Area */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto pt-16">
        <DesktopNav
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          onOpenAddProduct={handleOpenAddProduct}
          onOpenStockMovement={handleOpenMovement}
          onOpenScanner={() => setIsScannerOpen(true)}
        />

        <main className="flex-1 min-w-0 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              onOpenStockMovement={handleOpenMovement}
              onOpenScanner={() => setIsScannerOpen(true)}
              onNavigateTab={setCurrentTab}
              onOpenFacilityModal={() => setIsFacilityOpen(true)}
            />
          )}

          {currentTab === 'products' && (
            <ProductsView
              onOpenAddProduct={handleOpenAddProduct}
              onOpenScanner={() => setIsScannerOpen(true)}
              onSelectProduct={(p) => setSelectedProductDetail(p)}
              onEditProduct={handleEditProduct}
              onOpenStockMovement={handleOpenMovement}
            />
          )}

          {currentTab === 'inventory' && (
            <InventoryMovementsView
              onOpenMovement={handleOpenMovement}
              onOpenScanner={() => setIsScannerOpen(true)}
            />
          )}

          {currentTab === 'reports' && <ReportsView />}

          {currentTab === 'more' && (
            <MoreMenuView
              onOpenScanner={() => setIsScannerOpen(true)}
              onOpenFacilityModal={() => setIsFacilityOpen(true)}
              onOpenProfile={() => setIsProfileOpen(true)}
              onSwitchToAuth={() => setShowAuthScreen(true)}
            />
          )}
        </main>
      </div>

      {/* Mobile Floating Bottom Bar */}
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Modals & Drawers */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        productToEdit={productToEdit}
      />

      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onEdit={handleEditProduct}
        onOpenMovement={handleOpenMovement}
      />

      <StockMovementModal
        isOpen={isStockMovementOpen}
        onClose={() => setIsStockMovementOpen(false)}
        movementType={movementType}
        targetProduct={movementTargetProduct}
      />

      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSelectScannedProduct={handleSelectScannedProduct}
      />

      <FacilityModal
        isOpen={isFacilityOpen}
        onClose={() => setIsFacilityOpen(false)}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSwitchToAuth={() => setShowAuthScreen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <MainAppContent />
      </InventoryProvider>
    </AuthProvider>
  );
}
