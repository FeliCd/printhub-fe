import React, { useState, useMemo } from 'react';
import { Trash2, Gift, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { PayOSMockModal } from '../components/shared/PayOSMockModal';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    handleRemoveFromCart, 
    handleUpdateCartQuantity, 
    handleCheckout,
    userSubscriptions,
    buyerPoints,
    setBuyerPoints
  } = useApp();

  const [showPayOS, setShowPayOS] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [methodToConfirm, setMethodToConfirm] = useState<'PAYOS' | 'BANK_TRANSFER' | null>(null);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);
  
  // Check active subscription discount
  const activeSub = userSubscriptions.find(sub => sub.isActive && sub.planType === 'CUSTOMER');
  let discountPercentage = 0;
  if (activeSub) {
    if (activeSub.planId.includes('gold-cash')) discountPercentage = 0.15;
    else if (activeSub.planId.includes('premium-cash')) discountPercentage = 0.20;
    else if (activeSub.planId.includes('gold')) discountPercentage = 0.07;
    else if (activeSub.planId.includes('premium')) discountPercentage = 0.10;
  }

  const subDiscount = Math.round(subtotal * discountPercentage);
  let totalAfterSub = subtotal - subDiscount;
  
  // Apply points
  let pointsDiscount = 0;
  if (usePoints) {
    // 1 point = 1000 VND discount
    const maxPointsUsable = Math.floor(totalAfterSub / 1000);
    const pointsToUse = Math.min(buyerPoints, maxPointsUsable);
    pointsDiscount = pointsToUse * 1000;
  }

  const finalTotal = totalAfterSub - pointsDiscount;

  if (cart.length === 0) {
    return (
      <div style={{ padding: '64px 24px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Giỏ hàng</h1>
        <div style={{ padding: '48px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <ShoppingBag size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Giỏ hàng của bạn đang trống.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>Giỏ hàng của bạn</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
        {/* Cart Items List */}
        <div>
          <div style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', padding: '24px' }}>
            {cart.map((item) => (
              <div
                key={item.product.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: '24px',
                  marginBottom: '24px'
                }}
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{item.product.name}</h3>
                  {(item.selectedColor || item.selectedMaterial) && (
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      Cấu hình: {item.selectedColor} | Nhựa {item.selectedMaterial}
                    </div>
                  )}
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '16px', color: 'var(--primary)', fontWeight: 'bold' }}>
                    {item.product.price.toLocaleString()}đ
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--background)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                    <button
                      className="btn"
                      style={{ padding: '8px 12px', border: 'none', background: 'transparent' }}
                      onClick={() => handleUpdateCartQuantity(item.product.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span style={{ padding: '0 12px', fontWeight: '500' }}>{item.quantity}</span>
                    <button
                      className="btn"
                      style={{ padding: '8px 12px', border: 'none', background: 'transparent' }}
                      onClick={() => handleUpdateCartQuantity(item.product.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn"
                    style={{ padding: '8px', color: '#ff3b30', background: 'rgba(255, 59, 48, 0.1)' }}
                    onClick={() => handleRemoveFromCart(item.product.id)}
                    title="Xóa sản phẩm"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary & Checkout */}
        <div>
          <div style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', padding: '24px', position: 'sticky', top: '24px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Tóm tắt đơn hàng</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-secondary)' }}>
              <span>Tạm tính ({cart.length} sản phẩm):</span>
              <span>{subtotal.toLocaleString()}đ</span>
            </div>

            {activeSub && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#34c759' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Gift size={16} /> Ưu đãi hội viên ({discountPercentage * 100}%):
                </span>
                <span>-{subDiscount.toLocaleString()}đ</span>
              </div>
            )}

            {buyerPoints > 0 && (
              <div style={{ padding: '16px', background: 'rgba(175, 82, 222, 0.05)', borderRadius: '8px', border: '1px dashed rgba(175, 82, 222, 0.3)', marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                  <input 
                    type="checkbox" 
                    checked={usePoints} 
                    onChange={(e) => setUsePoints(e.target.checked)} 
                    style={{ width: '18px', height: '18px', accentColor: '#af52de' }}
                  />
                  <span style={{ fontSize: '14px' }}>
                    Dùng điểm thưởng <br/>
                    <small style={{ color: 'var(--text-secondary)' }}>Bạn có {buyerPoints.toLocaleString()} điểm (Tương đương {(buyerPoints * 1000).toLocaleString()}đ)</small>
                  </span>
                </label>
              </div>
            )}

            {usePoints && pointsDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#af52de' }}>
                <span>Trừ điểm thưởng:</span>
                <span>-{pointsDiscount.toLocaleString()}đ</span>
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--border)', margin: '16px 0' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Tổng cộng:</span>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)' }}>
                {finalTotal.toLocaleString()}đ
              </span>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '12px', padding: '16px', fontSize: '16px', backgroundColor: '#111', color: '#fff', borderColor: '#111' }}
              onClick={() => {
                setMethodToConfirm('PAYOS');
                setShowConfirm(true);
              }}
            >
              Thanh toán qua PayOS
            </button>
            <button
              className="btn btn-secondary"
              style={{ width: '100%', padding: '16px', fontSize: '16px' }}
              onClick={() => {
                setMethodToConfirm('BANK_TRANSFER');
                setShowConfirm(true);
              }}
            >
              Chuyển khoản (VNPay)
            </button>

            <div style={{ marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
              <ShieldCheck size={24} style={{ flexShrink: 0 }} />
              <div>
                Thanh toán an toàn. Tiền của bạn được PrintHub giữ an toàn cho đến khi nhận được sản phẩm.
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPayOS && (
        <PayOSMockModal
          amount={finalTotal}
          onSuccess={() => {
            setShowPayOS(false);
            if (usePoints && pointsDiscount > 0) setBuyerPoints(prev => prev - (pointsDiscount/1000));
            handleCheckout('PAYOS');
          }}
          onCancel={() => setShowPayOS(false)}
        />
      )}

      {showConfirm && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '400px', padding: '32px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '16px', color: '#ff3b30' }}>⚠️ Cảnh báo thanh toán</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
              Bạn đang thực hiện đặt hàng và thanh toán số tiền <strong>{finalTotal.toLocaleString()}đ</strong>. <br/><br/>
              Vui lòng xác nhận rằng thông tin đơn hàng và địa chỉ giao nhận của bạn đã chính xác. Sau khi xác nhận, bạn sẽ chuyển sang cổng thanh toán.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1 }} 
                onClick={() => {
                  setShowConfirm(false);
                  setMethodToConfirm(null);
                }}
              >
                Hủy bỏ
              </button>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, backgroundColor: '#ff3b30', borderColor: '#ff3b30', color: '#fff' }} 
                onClick={() => {
                  setShowConfirm(false);
                  if (methodToConfirm === 'PAYOS') {
                    setShowPayOS(true);
                  } else if (methodToConfirm === 'BANK_TRANSFER') {
                    if (usePoints && pointsDiscount > 0) setBuyerPoints(prev => prev - (pointsDiscount/1000));
                    handleCheckout('BANK_TRANSFER');
                  }
                  setMethodToConfirm(null);
                }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
