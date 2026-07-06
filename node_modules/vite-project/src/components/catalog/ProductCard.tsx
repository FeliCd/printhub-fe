import React from 'react';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  userRole: 'BUYER' | 'MAKER' | 'ADMIN';
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  userRole,
  onClick,
}) => {
  const isMyProduct = userRole === 'MAKER' && product.makerName === 'DragonCreator3D';

  return (
    <div 
      className="product-card" 
      onClick={onClick}
      style={{
        border: isMyProduct ? '1px solid rgba(57, 255, 20, 0.4)' : '1px solid var(--border)',
        boxShadow: isMyProduct ? '0 0 10px rgba(57, 255, 20, 0.05)' : 'none'
      }}
    >
      <span className={`product-badge ${product.type === 'DIGITAL' ? 'badge-digital' : 'badge-physical'}`}>
        {product.type === 'DIGITAL' ? 'File 3D (.STL)' : 'Mô hình In'}
      </span>
      {isMyProduct && (
        <span 
          className="product-badge" 
          style={{ 
            right: '12px', 
            left: 'auto', 
            backgroundColor: 'rgba(57, 255, 20, 0.15)', 
            border: '1px solid var(--primary)', 
            color: 'var(--primary)',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: '10px'
          }}
        >
          Mẫu của bạn
        </span>
      )}
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <div className="product-maker" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{product.makerName}</span>
          {isMyProduct && <span style={{ color: 'var(--primary)', fontSize: '10px', fontWeight: 'bold' }}>Quản lý</span>}
        </div>
        <h3 className="product-name">{product.name}</h3>
        {product.type === 'DIGITAL' && (
          <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 'bold' }}>
            Bản quyền: {product.licenseType === 'COMMERCIAL' ? 'Cho phép Thương mại' : 'Chỉ dùng cá nhân'}
          </div>
        )}
        <div className="product-price" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{product.price.toLocaleString()}đ</span>
          {isMyProduct && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'normal' }}>
              Kho: {product.stock}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
