import React, { useState } from 'react';
import { X, ShoppingCart, Lock, Eye } from 'lucide-react';
import type { Product } from '../../types';
import { useApp } from '../../context/AppContext';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, options?: { color?: string; material?: string }) => void;
  onDeleteProduct?: (id: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onDeleteProduct,
}) => {
  const { currentUser } = useApp();
  const isMyProduct = currentUser?.role === 'MAKER' && product.makerName === 'DragonCreator3D';

  // State options for physical items
  const [color, setColor] = useState('Đen');
  const [material, setMaterial] = useState('PLA');

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        <div className="product-detail-layout">
          <div>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', borderRadius: '12px', objectFit: 'cover' }}
            />
          </div>
          <div>
            <span className="info-tag tag-approved" style={{ marginBottom: '12px' }}>
              {product.type === 'DIGITAL' ? 'STL KỸ THUẬT SỐ' : 'MÔ HÌNH VẬT LÝ'}
            </span>
            <h2 style={{ fontSize: '22px', margin: '8px 0' }}>{product.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
              {product.description}
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
                padding: '12px 0',
                marginBottom: '20px',
              }}
            >
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Nhà phân phối</span>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{product.makerName}</div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Giá bán</span>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary)', fontFamily: 'var(--mono)' }}>
                  {product.price.toLocaleString()}đ
                </div>
              </div>
            </div>

            {/* Config options for PHYSICAL products */}
            {product.type === 'PHYSICAL' && currentUser?.role !== 'ADMIN' && (
              <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                {/* Color Selection */}
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                    Chọn màu sắc in:
                  </span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['Đen', 'Trắng', 'Đỏ', 'Xanh lá', 'Xám'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={`btn ${color === c ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '4px' }}
                        onClick={() => setColor(c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Material Selection */}
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                    Chất liệu nhựa in:
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['PLA', 'ABS', 'PETG'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        className={`btn ${material === m ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '4px 12px', fontSize: '12px', borderRadius: '4px' }}
                        onClick={() => setMaterial(m)}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STL details section */}
            {product.type === 'DIGITAL' && (
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    marginBottom: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>
                    Loại bản quyền: <strong>{product.licenseType}</strong>
                  </span>
                  <span>
                    Lượt tải: <strong>{product.downloadCount}</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                    <Lock size={12} className="text-muted" />
                    <span>
                      File thiết kế gốc:{' '}
                      <code style={{ color: 'var(--primary)' }}>{product.originalUrl}</code>
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                    <Eye size={12} className="text-muted" />
                    <span>
                      File đóng dấu mờ: <code>{product.watermarkedUrl}</code>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {currentUser?.role === 'ADMIN' ? (
              <button
                className="btn"
                style={{
                  width: '100%',
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 'bold',
                  padding: '10px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  if (onDeleteProduct) {
                    onDeleteProduct(product.id);
                  }
                  onClose();
                }}
              >
                Gỡ bỏ sản phẩm khỏi sàn
              </button>
            ) : isMyProduct ? (
              <button
                className="btn btn-secondary"
                style={{ width: '100%', cursor: 'not-allowed', color: 'var(--text-muted)', borderColor: 'var(--border)' }}
                disabled
              >
                Bản thiết kế của bạn (Không thể tự mua)
              </button>
            ) : (
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => {
                  onAddToCart(product, product.type === 'PHYSICAL' ? { color, material } : undefined);
                  onClose();
                }}
              >
                <ShoppingCart size={16} /> Thêm vào giỏ hàng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
