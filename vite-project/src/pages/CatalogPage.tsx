import React, { useState } from 'react';
import { Plus, Ruler, Sparkles, ShieldCheck } from 'lucide-react';
import type { Product } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { ProductCard } from '@/components/catalog/ProductCard';
import { PromoSlider } from '@/components/catalog/PromoSlider';
import { PromoModal } from '@/components/catalog/PromoModal';

interface CatalogPageProps {
  products: Product[];
  userRole: 'BUYER' | 'ADMIN';
  onAddProductClick: () => void;
  onProductClick: (product: Product) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  products,
  userRole,
  onAddProductClick,
  onProductClick,
}) => {
  const { searchQuery } = useApp();
  const [activePromoModal, setActivePromoModal] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('DEFAULT');

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const searchedProducts = products.filter((p) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query))
    );
  });

  const filteredProducts = searchedProducts.filter((p) => {
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const displayProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'PRICE_ASC') return a.price - b.price;
    if (sortBy === 'PRICE_DESC') return b.price - a.price;
    return 0;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Ruler className="logo-accent" size={32} />
            Sản phẩm
          </h1>
          <p className="page-subtitle">Sản xuất trực tiếp, khắc tên/MSSV riêng, bảo hành 1 đổi 1 trong 1 học kỳ</p>
        </div>
        {userRole === 'ADMIN' && (
          <button className="btn btn-primary" onClick={onAddProductClick} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} />
            Thêm sản phẩm mới
          </button>
        )}
      </div>

      {/* Hero Guarantee Banner */}
      <div
        style={{
          background: 'linear-gradient(90deg, rgba(57, 255, 20, 0.12) 0%, rgba(18, 18, 18, 0.8) 100%)',
          border: '1px solid rgba(57, 255, 20, 0.25)',
          borderRadius: '12px',
          padding: '16px 24px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(57, 255, 20, 0.15)', padding: '12px', borderRadius: '50%', color: '#39FF14' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#FFF' }}>
              Khắc tên/MSSV miễn phí & Bảo hành gãy 1 đổi 1 trong 1 học kỳ!
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
              In bằng nhựa PLA thân thiện môi trường, chống bay màu, không lo cầm nhầm hay thất lạc đồ dùng học tập.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: '20px', color: '#39FF14', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} /> Giữ cọc PayOS an toàn 100%
          </span>
        </div>
      </div>

      {userRole === 'BUYER' && (
        <PromoSlider onCardClick={(type) => setActivePromoModal(type)} />
      )}

      {/* Filter Toolbar */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Phân loại:
          </span>
          <button
            type="button"
            className={`btn ${selectedCategory === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '20px' }}
            onClick={() => setSelectedCategory('ALL')}
          >
            Tất cả bộ thước
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '20px' }}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Sắp xếp:
          </span>
          <select
            className="input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            <option value="DEFAULT">Mặc định</option>
            <option value="PRICE_ASC">Giá tăng dần</option>
            <option value="PRICE_DESC">Giá giảm dần</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {displayProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            userRole={userRole}
            onClick={() => onProductClick(product)}
          />
        ))}
      </div>

      {/* Promo Modal */}
      {activePromoModal && (
        <PromoModal
          activePromoModal={activePromoModal}
          onClose={() => setActivePromoModal(null)}
        />
      )}
    </div>
  );
};
