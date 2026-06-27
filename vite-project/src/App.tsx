import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';

// Layout Components
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

// Pages
import { LoginPage } from '@/pages/LoginPage';
import { CatalogPage } from '@/pages/CatalogPage';
import { CustomOrdersPage } from '@/pages/CustomOrdersPage';
import { PrintRequestsPage } from '@/pages/PrintRequestsPage';
import { WalletPage } from '@/pages/WalletPage';
import { DisputesPage } from '@/pages/DisputesPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { LandingPage } from '@/pages/LandingPage';
import { CatalogPreviewPage } from '@/pages/CatalogPreviewPage';

// Modals & Drawers
import { ProductDetailModal } from '@/components/shared/ProductDetailModal';
import { NewProductModal } from '@/components/shared/NewProductModal';
import { CartDrawer } from '@/components/shared/CartDrawer';
import { DisputeModal } from '@/components/shared/DisputeModal';
import { CustomOrderModal } from '@/components/shared/CustomOrderModal';
import { PasscodeModal } from '@/components/shared/PasscodeModal';

// App Context
import { useApp } from '@/contexts/AppContext';

export default function App() {
  const {
    isAuthenticated,
    currentUser,
    products,
    cart,
    addresses,
    orders,
    customOrders,
    disputes,
    notifications,
    setNotifications,
    walletBalance,
    walletTransactions,
    makerProfile,
    selectedProduct,
    setSelectedProduct,
    isNewProductModalOpen,
    setIsNewProductModalOpen,
    isCartOpen,
    setIsCartOpen,
    isNotificationOpen,
    setIsNotificationOpen,
    isCustomOrderModalOpen,
    setIsCustomOrderModalOpen,
    isDisputeModalOpen,
    setIsDisputeModalOpen,
    topupAmount,
    setTopupAmount,
    handleAddToCart,
    handleRemoveFromCart,
    handleUpdateCartQuantity,
    handleCheckout,
    handleRequestCustomQuote,
    handleAddProduct,
    handleAddAddress,
    handleSetDefaultAddress,
    handleTopup,
    handleOpenDispute,
    handleMakerPickRequest,
    handleMakerQuote,
    handleMakerSendMessage,
    handleBuyerSendMessage,
    handleBuyerAcceptQuote,
    handleMakerUploadProof,
    handleBuyerCompleteCustom,
    handleResolveDispute,
    handleUpdateOrderStatus,
    handleDeleteProduct,
    handleLogin,
    handleLogout,
    isAllowed,
    walletPasscode,
    isPasscodeModalOpen,
    closePasscodeModal,
    passcodeCallback,
  } = useApp();

  return (
    <HashRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Catalog Preview Page */}
        <Route path="/catalog-preview" element={<CatalogPreviewPage />} />

        {/* Login Page */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage onLogin={handleLogin} />
            ) : (
              <Navigate to="/catalog" replace />
            )
          }
        />

        {/* Authenticated Dashboard Routes */}
        <Route
          path="*"
          element={
            !isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <div className="dashboard-container">
                {/* Sidebar Navigation */}
                <Sidebar
                  userName={currentUser?.name || ''}
                  userRole={currentUser?.role || 'BUYER'}
                  onLogout={handleLogout}
                />

                {/* Main Panel */}
                <main className="main-content">
                  {/* Header bar */}
                  <Header
                    walletBalance={walletBalance}
                    notifications={notifications}
                    setNotifications={setNotifications}
                    isNotificationOpen={isNotificationOpen}
                    setIsNotificationOpen={setIsNotificationOpen}
                    isCartOpen={isCartOpen}
                    setIsCartOpen={setIsCartOpen}
                    cart={cart}
                  />

                  {/* Dynamic Tab Router */}
                  <div className="view-container">
                    <Routes>
                      <Route
                        path="/catalog"
                        element={
                    currentUser?.role === 'ADMIN' ? (
                      <Navigate to="/admin/dashboard" replace />
                    ) : (
                      <CatalogPage
                        products={products}
                        userRole={currentUser?.role || 'BUYER'}
                        onAddProductClick={() => setIsNewProductModalOpen(true)}
                        onProductClick={(p) => setSelectedProduct(p)}
                      />
                    )
                  }
                />
                {isAllowed('/custom') && (
                  <Route
                    path="/custom"
                    element={
                      <CustomOrdersPage
                        customOrders={customOrders}
                        onAddRequestClick={() => setIsCustomOrderModalOpen(true)}
                        onBuyerAcceptQuote={handleBuyerAcceptQuote}
                        onBuyerCompleteCustom={handleBuyerCompleteCustom}
                        onBuyerSendMessage={handleBuyerSendMessage}
                      />
                    }
                  />
                )}
                {isAllowed('/print-requests') && (
                  <Route
                    path="/print-requests"
                    element={
                      <PrintRequestsPage
                        customOrders={customOrders}
                        orders={orders}
                        onMakerPickRequest={handleMakerPickRequest}
                        onMakerQuote={handleMakerQuote}
                        onMakerSendMessage={handleMakerSendMessage}
                        onMakerUploadProof={handleMakerUploadProof}
                        onUpdateOrderStatus={handleUpdateOrderStatus}
                      />
                    }
                  />
                )}
                {isAllowed('/wallet') && (
                  <Route
                    path="/wallet"
                    element={
                      <WalletPage
                        walletTransactions={walletTransactions}
                        topupAmount={topupAmount}
                        setTopupAmount={setTopupAmount}
                        onTopup={handleTopup}
                      />
                    }
                  />
                )}
                {isAllowed('/disputes') && (
                  <Route
                    path="/disputes"
                    element={
                      <DisputesPage
                        disputes={disputes}
                        userRole={currentUser?.role || 'BUYER'}
                        onAddDisputeClick={() => setIsDisputeModalOpen(true)}
                        onResolveDispute={handleResolveDispute}
                      />
                    }
                  />
                )}
                {isAllowed('/admin/dashboard') && (
                  <Route
                    path="/admin/dashboard"
                    element={<AdminDashboardPage />}
                  />
                )}
                {isAllowed('/admin/products') && (
                  <Route
                    path="/admin/products"
                    element={
                      <CatalogPage
                        products={products}
                        userRole="ADMIN"
                        onAddProductClick={() => setIsNewProductModalOpen(true)}
                        onProductClick={(p) => setSelectedProduct(p)}
                      />
                    }
                  />
                )}
                {isAllowed('/admin/disputes') && (
                  <Route
                    path="/admin/disputes"
                    element={
                      <DisputesPage
                        disputes={disputes}
                        userRole="ADMIN"
                        onAddDisputeClick={() => setIsDisputeModalOpen(true)}
                        onResolveDispute={handleResolveDispute}
                      />
                    }
                  />
                )}
                {isAllowed('/profile') && (
                  <Route
                    path="/profile"
                    element={
                      <ProfilePage
                        makerProfile={makerProfile}
                        addresses={addresses}
                        onAddAddress={handleAddAddress}
                        onSetDefaultAddress={handleSetDefaultAddress}
                      />
                    }
                  />
                )}
                      <Route path="*" element={<Navigate to="/catalog" replace />} />
                    </Routes>
                  </div>
                </main>
              </div>
            )
          }
        />
      </Routes>

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      {/* NEW PRODUCT MODAL */}
      {isNewProductModalOpen && (
        <NewProductModal
          onClose={() => setIsNewProductModalOpen(false)}
          onSubmit={handleAddProduct}
        />
      )}

      {/* SHOPPING CART DRAWER / MODAL */}
      {isCartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onRemove={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onCheckout={handleCheckout}
        />
      )}

      {/* DISPUTE CREATION MODAL */}
      {isDisputeModalOpen && (
        <DisputeModal
          onClose={() => setIsDisputeModalOpen(false)}
          onSubmit={handleOpenDispute}
        />
      )}

      {/* CUSTOM ORDER REQUEST MODAL */}
      {isCustomOrderModalOpen && (
        <CustomOrderModal
          onClose={() => setIsCustomOrderModalOpen(false)}
          onSubmit={handleRequestCustomQuote}
        />
      )}

      {/* PASSCODE CONFIRMATION MODAL */}
      <PasscodeModal
        isOpen={isPasscodeModalOpen}
        onClose={closePasscodeModal}
        correctPasscode={walletPasscode}
        onSuccess={passcodeCallback || (() => {})}
      />
    </HashRouter>
  );
}
