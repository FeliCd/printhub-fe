import React from 'react';
import { X, Trash2 } from 'lucide-react';
import type { CartItem } from '@/types';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
  cart: CartItem[];
  onClose: () => void;
  onRemove: (productId: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  cart,
  onClose,
  onRemove,
}) => {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="modal-overlay" style={{ justifyContent: 'flex-end' }}>
      <div 
        className="modal-content" 
        style={{ 
          margin: 0, 
          height: '100vh', 
          width: '100%', 
          maxWidth: '400px', 
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Giỏ hàng ({cart.length})</h2>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
              Giỏ hàng của bạn đang trống.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--border)'
                  }}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', lineHeight: '1.4' }}>{item.product.name}</h4>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      SL: {item.quantity}
                    </div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--primary)', fontWeight: 'bold' }}>
                      {(item.product.price * item.quantity).toLocaleString()}đ
                    </div>
                  </div>
                  <button
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                    onClick={() => onRemove(item.product.id)}
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: '24px', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '16px', fontWeight: 'bold' }}>
              <span>Tạm tính:</span>
              <span>{total.toLocaleString()}đ</span>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '16px' }}
              onClick={() => {
                onClose();
                navigate('/cart');
              }}
            >
              Xem trang Giỏ Hàng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
