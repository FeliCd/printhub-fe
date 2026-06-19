import React from 'react';
import { X, Trash2 } from 'lucide-react';
import type { CartItem } from '../../types';

interface CartDrawerProps {
  cart: CartItem[];
  onClose: () => void;
  onRemove: (productId: number) => void;
  onUpdateQuantity: (productId: number, qty: number) => void;
  onCheckout: (method: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  cart,
  onClose,
  onRemove,
  onUpdateQuantity,
  onCheckout,
}) => {
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px', padding: '32px' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        <h2>Giỏ hàng của bạn</h2>
        <div style={{ marginTop: '24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
              Giỏ hàng của bạn đang trống.
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  marginBottom: '24px',
                }}
              >
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      borderBottom: '1px solid var(--border)',
                      paddingBottom: '12px',
                    }}
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{item.product.name}</h4>
                      {(item.selectedColor || item.selectedMaterial) && (
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                          Cấu hình: {item.selectedColor} | Nhựa {item.selectedMaterial}
                        </div>
                      )}
                      <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--primary)' }}>
                        {item.product.price.toLocaleString()}đ
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '2px 8px', fontSize: '12px' }}
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '2px 8px', fontSize: '12px' }}
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      style={{ background: 'none', border: 'none', color: '#ff3b30', cursor: 'pointer' }}
                      onClick={() => onRemove(item.product.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                  <span>Tổng tiền hàng:</span>
                  <strong>{total.toLocaleString()}đ</strong>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    marginBottom: '16px',
                  }}
                >
                  <span>Phí sàn PrintHub (5% đã trừ cho Maker):</span>
                  <span>{Math.round(total * 0.05).toLocaleString()}đ</span>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => onCheckout('WALLET')}
                  >
                    Thanh toán bằng Ví điện tử
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => onCheckout('BANK_TRANSFER')}
                  >
                    Chuyển khoản / VNPay
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
