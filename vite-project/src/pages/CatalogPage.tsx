import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import type { Product } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { ProductCard } from '@/components/catalog/ProductCard';
import { PromoSlider } from '@/components/catalog/PromoSlider';
import { PromoModal } from '@/components/catalog/PromoModal';

interface CatalogPageProps {
  products: Product[];
  userRole: 'BUYER' | 'MAKER' | 'ADMIN';
  onAddProductClick: () => void;
  onProductClick: (product: Product) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  products,
  userRole,
  onAddProductClick,
  onProductClick,
}) => {
  const { searchQuery, setSearchQuery } = useApp();
  const [filterTab, setFilterTab] = useState<'ALL' | 'MINE'>('ALL');
  const [activePromoModal, setActivePromoModal] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.makerName.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query))
    );
  });

  const displayProducts = filteredProducts.filter((p) => {
    if (userRole === 'MAKER' && filterTab === 'MINE') {
      return p.makerName === 'DragonCreator3D';
    }
    return true;
  });

  return (
    <div>
      {/* Page Header Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">
            {userRole === 'ADMIN' ? 'Quản lý Sản phẩm & Bản thiết kế' : 'Sản phẩm & Bản thiết kế 3D'}
          </h1>
          <p className="page-subtitle">
            {userRole === 'ADMIN'
              ? 'Duyệt và kiểm soát các sản phẩm, tệp tin STL được đăng bán trên sàn giao dịch'
              : 'Khám phá các thiết bị in, mô hình in sẵn và tệp tin STL có bản quyền'}
          </p>
        </div>
        {userRole === 'MAKER' && filterTab === 'ALL' && (
          <button className="btn btn-primary" onClick={onAddProductClick}>
            <Plus size={16} /> Đăng bán sản phẩm
          </button>
        )}
      </div>

      {/* Horizontal Slider for Buyer */}
      {userRole === 'BUYER' && (
        <PromoSlider onCardClick={(type) => setActivePromoModal(type)} />
      )}

      {/* Maker Dashboard Banner */}
      {userRole === 'MAKER' && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(57, 255, 20, 0.08) 0%, rgba(10, 10, 10, 0) 100%)',
          borderLeft: '4px solid var(--primary)',
          padding: '16px 20px',
          borderRadius: '0 8px 8px 0',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(57, 255, 20, 0.1)',
          borderRight: '1px solid rgba(57, 255, 20, 0.05)',
          borderBottom: '1px solid rgba(57, 255, 20, 0.05)'
        }}>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ margin: '0 0 4px 0', color: 'var(--primary)', fontSize: '15px', fontWeight: 'bold' }}>
              Bảng điều khiển Nhà in (Maker Dashboard)
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
              Chào mừng trở lại! Bạn có thể quản lý các mẫu thiết kế của mình hoặc đăng bán sản phẩm mới lên Catalog.
            </p>
          </div>
          {filterTab === 'MINE' && (
            <button className="btn btn-primary" onClick={onAddProductClick}>
              <Plus size={16} /> Đăng bán sản phẩm
            </button>
          )}
        </div>
      )}

      {/* Role Filter Tabs */}
      {userRole === 'MAKER' && (
        <div className="tab-nav" style={{ marginBottom: '24px' }}>
          <button 
            className={`tab-btn ${filterTab === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterTab('ALL')}
          >
            Tất cả sản phẩm
          </button>
          <button 
            className={`tab-btn ${filterTab === 'MINE' ? 'active' : ''}`}
            onClick={() => setFilterTab('MINE')}
          >
            Mẫu thiết kế của tôi ({products.filter(p => p.makerName === 'DragonCreator3D').length})
          </button>
        </div>
      )}

      {/* Grid Cards */}
      {displayProducts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '64px 32px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          marginTop: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)'
          }}>
            <Search size={28} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>Không tìm thấy kết quả</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>
              {filterTab === 'MINE' 
                ? 'Bạn chưa có thiết kế nào khớp với bộ lọc này.' 
                : `Không tìm thấy sản phẩm nào khớp với từ khóa "${searchQuery}"`}
            </p>
          </div>
          {filterTab === 'ALL' && (
            <button className="btn btn-secondary" onClick={() => setSearchQuery('')} style={{ marginTop: '8px' }}>
              Xóa bộ lọc tìm kiếm
            </button>
          )}
        </div>
      ) : (
        <div className="product-grid">
          {displayProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              userRole={userRole}
              onClick={() => onProductClick(p)}
            />
          ))}
        </div>
      )}

      {/* PROMO DETAIL MODAL */}
      {activePromoModal && (
        <PromoModal
          activePromoModal={activePromoModal}
          onClose={() => setActivePromoModal(null)}
        />
      )}
    </div>
  );
};
