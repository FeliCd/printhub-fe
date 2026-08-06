import React, { useState, useMemo } from 'react';
import { Trash2, ShieldAlert, ShoppingBag, Lock, Loader2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { PayOSMockModal } from '../components/shared/PayOSMockModal';
import { paymentService, orderService } from '../services';

export const CartPage: React.FC = () => {
  const {
    cart,
    addresses,
    handleAddAddress,
    handleRemoveFromCart,
    handleUpdateCartQuantity,
    handleCheckout,
    userSubscriptions,
  } = useApp();

  const [showPayOS, setShowPayOS] = useState(false);
  const [showDepositFrictionPopup, setShowDepositFrictionPopup] = useState(false);
  const [isDepositAgreed, setIsDepositAgreed] = useState(false);
  const [loadingPayOS, setLoadingPayOS] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'DEPOSIT_50' | 'FULL_100' | 'COD'>('DEPOSIT_50');

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);
  const hasCustomEngravedRuler = useMemo(() => cart.some((item) => item.engravingText || item.product.isCustomizable), [cart]);

  // Sync default payment mode if cart changes
  React.useEffect(() => {
    if (hasCustomEngravedRuler) {
      setPaymentMode('DEPOSIT_50');
    } else {
      setPaymentMode('FULL_100');
    }
  }, [hasCustomEngravedRuler]);


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

  const shippingFee = activeSub ? 0 : 25000;
  const finalTotal = Math.max(0, totalAfterSub + shippingFee);
  const requiredDeposit = hasCustomEngravedRuler ? Math.round(finalTotal * 0.5) : 0;

  const handleTriggerCheckoutPayOS = async () => {
    if (hasCustomEngravedRuler && !isDepositAgreed) {
      setShowDepositFrictionPopup(true);
      return;
    }

    setLoadingPayOS(true);

    try {
      // 1. Khởi tạo đơn hàng trên Backend để lấy Order ID
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0] || { name: 'Khách hàng', phone: '0987654321', addressLine: '123 Nguyễn Trãi', province: 'TP.HCM' };
      const orderPayload = {
        recipientName: defaultAddr.name,
        phone: defaultAddr.phone,
        address: defaultAddr.addressLine || '123 Nguyễn Trãi',
        province: defaultAddr.province || 'TP.HCM',
        paymentMethod: 'PAYOS',
        items: cart.map(c => ({

          productId: c.product.id,
          quantity: c.quantity,
        }))
      };

      let orderId = '';
      try {
        const orderRes = await orderService.createOrder(orderPayload);
        const orderList = Array.isArray(orderRes?.result) ? orderRes.result : (Array.isArray(orderRes) ? orderRes : [orderRes?.result || orderRes]);
        orderId = orderList[0]?.id || orderList[0]?.orderId || orderRes?.result?.id || orderRes?.id;
        console.log('Order created successfully with ID:', orderId);
      } catch (e) {
        console.warn('Backend order creation offline/failed, trying fallback order ID:', e);
      }

      if (!orderId) {
        // Fallback random UUID if backend order creation was offline
        orderId = '550e8400-e29b-41d4-a716-446655440000';
      }

      // 2. Gọi API Backend sinh Link PayOS
      const isDeposit = paymentMode === 'DEPOSIT_50' && hasCustomEngravedRuler;
      const targetAmount = isDeposit ? requiredDeposit : finalTotal;

      const payosRes = await paymentService.createPayOSPaymentUrl({
        orderId,
        orderType: 'ORDER',
        description: isDeposit ? `Dat coc don hang ${orderId.substring(0, 8)}` : `Thanh toan don hang ${orderId.substring(0, 8)}`,
        customAmount: targetAmount,
        paymentOption: isDeposit ? 'DEPOSIT' : 'FULL'
      });


      const checkoutUrl = payosRes?.result?.paymentLinkUrl 
        || payosRes?.result?.checkoutUrl 
        || payosRes?.paymentLinkUrl 
        || payosRes?.checkoutUrl 
        || payosRes?.data?.paymentLinkUrl 
        || payosRes?.data?.checkoutUrl;

      if (checkoutUrl) {
        // Chuyển hướng sang Cổng Thanh Toán PayOS chính thức ngay lập tức
        console.log('Redirecting to PayOS checkout:', checkoutUrl);
        window.location.href = checkoutUrl;
        return;
      }


      // Nếu không có checkoutUrl trả về, mở Mock Modal dự phòng
      setShowPayOS(true);
    } catch (err: any) {
      console.warn('Backend PayOS link creation failed, fallback to PayOS Mock Modal:', err);
      setShowPayOS(true);
    } finally {
      setLoadingPayOS(false);
    }
  };

  const handleConfirmPayOSPayment = () => {
    setShowPayOS(false);
    handleCheckout('PAYOS');
  };

  const handleConfirmCODPayment = () => {
    if (hasCustomEngravedRuler) {
      alert('Sản phẩm có khắc tên riêng bắt buộc đặt cọc trước qua PayOS để xưởng bắt đầu in 3D!');
      return;
    }
    handleCheckout('COD');
  };

  if (cart.length === 0) {
    return (
      <div style={{ padding: '64px 24px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Giỏ hàng Bộ Thước Kẻ</h1>
        <div style={{ padding: '48px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <ShoppingBag size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Giỏ hàng của bạn chưa có bộ thước kẻ nào.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '26px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ShoppingBag size={28} className="logo-accent" />
        Giỏ hàng & Đặt cọc Bộ Thước Kẻ 3D
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px' }}>
        {/* Left: Cart Items List */}
        <div>
          <div style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', padding: '24px' }}>
            {cart.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  borderBottom: idx === cart.length - 1 ? 'none' : '1px solid var(--border)',
                  paddingBottom: '20px',
                  marginBottom: '20px'
                }}
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#FFF' }}>{item.product.name}</h3>

                  {/* Engraving & Color Details */}
                  <div style={{ background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', marginBottom: '8px' }}>
                    <div style={{ color: '#39FF14', fontWeight: 'bold' }}>
                      ✨ Khắc tên: {item.engravingText || 'Mặc định (Không khắc tên)'}
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      Màu nhựa: {item.selectedColor || 'Neon Green'} | Công thức: {item.subjectFormula || 'Toán 12'}
                    </div>
                  </div>

                  <div style={{ fontFamily: 'var(--mono)', fontSize: '15px', color: 'var(--primary)', fontWeight: 'bold' }}>
                    {item.product.price.toLocaleString()}đ x {item.quantity} = {(item.product.price * item.quantity).toLocaleString()}đ
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--background)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                    <button
                      className="btn"
                      style={{ padding: '6px 10px', border: 'none', background: 'transparent' }}
                      onClick={() => handleUpdateCartQuantity(item.product.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span style={{ padding: '0 8px', fontSize: '14px', fontFamily: 'var(--mono)' }}>{item.quantity}</span>
                    <button
                      className="btn"
                      style={{ padding: '6px 10px', border: 'none', background: 'transparent' }}
                      onClick={() => handleUpdateCartQuantity(item.product.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn"
                    style={{ color: '#ff3b30', padding: '8px' }}
                    onClick={() => handleRemoveFromCart(item.product.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Order Summary & PayOS Deposit Trigger */}
        <div>
          <div style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Tóm tắt đơn hàng</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tạm tính ({cart.length} sản phẩm):</span>
              <span style={{ fontFamily: 'var(--mono)' }}>{subtotal.toLocaleString()}đ</span>
            </div>

            {subDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#39FF14' }}>
                <span>Ưu đãi VIP (Giảm {discountPercentage * 100}%):</span>
                <span style={{ fontFamily: 'var(--mono)' }}>-{subDiscount.toLocaleString()}đ</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Phí vận chuyển giao tận nơi:</span>
              <span style={{ fontFamily: 'var(--mono)' }}>{shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString()}đ`}</span>
            </div>

            {/* Shipping Address Selection Panel */}
            <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#FFF', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>📍 Địa chỉ nhận hàng:</span>
              </div>
              {addresses && addresses.length > 0 ? (
                <select
                  className="input"
                  style={{ width: '100%', fontSize: '12px', padding: '6px 10px', marginBottom: '8px' }}
                  onChange={(e) => {
                    const selected = addresses.find(a => a.id === Number(e.target.value));
                    if (selected) {
                      // Selected saved address
                    }
                  }}
                >
                  {addresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.name} ({addr.phone}) - {addr.addressLine}, {addr.province} {addr.isDefault ? '[Mặc định]' : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Chưa có địa chỉ lưu sẵn. Bạn có thể thêm địa chỉ mới bên dưới.
                </div>
              )}

              {/* Add New Address Form Modal/Toggle */}
              <button
                type="button"
                onClick={() => {
                  const line = prompt('Nhập địa chỉ nhận hàng (Ví dụ: 123 Nguyễn Văn Cừ, Q.5, TP.HCM):');
                  const phone = prompt('Nhập số điện thoại nhận hàng:');
                  if (line && phone) {
                    handleAddAddress({
                      name: 'Địa chỉ giao hàng',
                      phone: phone,
                      addressLine: line,
                      province: 'TP.HCM',
                      isDefault: false
                    });
                    alert('Đã thêm địa chỉ giao hàng thành công!');
                  }
                }}
                style={{ fontSize: '11px', color: '#39FF14', background: 'transparent', border: '1px border-dashed #39FF14', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', width: '100%', textAlign: 'center' }}
              >
                + Thêm địa chỉ nhận hàng mới
              </button>
            </div>

            {/* Custom Engraving Deposit Alert */}
            {hasCustomEngravedRuler && (
              <div style={{ background: 'rgba(255, 64, 129, 0.1)', border: '1px solid #FF4081', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '12px' }}>
                <div style={{ color: '#FF4081', fontWeight: 'bold', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldAlert size={16} /> Yêu cầu Đặt cọc PayOS (50%):
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  Sản phẩm khắc tên riêng cần thanh toán giữ cọc tối thiểu <strong style={{ color: '#FFF' }}>{requiredDeposit.toLocaleString()}đ</strong> để xưởng bắt đầu in 3D.
                </div>
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Tổng cộng:</span>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)', fontFamily: 'var(--mono)' }}>
                {finalTotal.toLocaleString()}đ
              </span>
            </div>

            {/* Payment Method Selector */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '10px', color: 'var(--text-primary)' }}>
                Chọn Phương Thức Thanh Toán:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {hasCustomEngravedRuler && (
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: paymentMode === 'DEPOSIT_50' ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: paymentMode === 'DEPOSIT_50' ? 'rgba(34, 197, 94, 0.08)' : 'var(--bg-secondary)',
                    cursor: 'pointer'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="radio"
                        name="paymentMode"
                        checked={paymentMode === 'DEPOSIT_50'}
                        onChange={() => setPaymentMode('DEPOSIT_50')}
                      />
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Đặt Cọc 50% qua PayOS</span>
                    </div>
                    <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '13px' }}>
                      {requiredDeposit.toLocaleString()}đ
                    </span>
                  </label>
                )}

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: paymentMode === 'FULL_100' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: paymentMode === 'FULL_100' ? 'rgba(34, 197, 94, 0.08)' : 'var(--bg-secondary)',
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="radio"
                      name="paymentMode"
                      checked={paymentMode === 'FULL_100'}
                      onChange={() => setPaymentMode('FULL_100')}
                    />
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>Trả Trước 100% qua PayOS</span>
                  </div>
                  <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '13px' }}>
                    {finalTotal.toLocaleString()}đ
                  </span>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: paymentMode === 'COD' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: paymentMode === 'COD' ? 'rgba(34, 197, 94, 0.08)' : 'var(--bg-secondary)',
                  opacity: hasCustomEngravedRuler ? 0.5 : 1,
                  cursor: hasCustomEngravedRuler ? 'not-allowed' : 'pointer'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="radio"
                      name="paymentMode"
                      disabled={hasCustomEngravedRuler}
                      checked={paymentMode === 'COD'}
                      onChange={() => setPaymentMode('COD')}
                    />
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>Thanh Toán Khi Nhận Hàng (COD)</span>
                  </div>
                  {hasCustomEngravedRuler && (
                    <span style={{ fontSize: '10px', color: '#FF4081', fontStyle: 'italic' }}>Khắc tên: Không hỗ trợ COD</span>
                  )}
                </label>
              </div>
            </div>

            {/* PayOS Deposit Checkbox Consent */}
            {hasCustomEngravedRuler && paymentMode === 'DEPOSIT_50' && (
              <div style={{ marginTop: '14px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <input
                    type="checkbox"
                    checked={isDepositAgreed}
                    onChange={(e) => setIsDepositAgreed(e.target.checked)}
                    style={{ marginTop: '2px' }}
                  />
                  <span>
                    <strong>Tôi đồng ý thanh toán giữ cọc và hiểu rõ</strong> sẽ mất tiền cọc sản phẩm thô nếu tự ý hủy/bom đơn sản phẩm khắc tên riêng.
                  </span>
                </label>
              </div>
            )}

            {/* Dynamic Submit CTAs */}
            <div style={{ marginTop: '20px' }}>
              {paymentMode === 'COD' ? (
                <button
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: 'bold' }}
                  onClick={handleConfirmCODPayment}
                >
                  Xác Nhận Đặt Hàng COD ({finalTotal.toLocaleString()}đ)
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  disabled={loadingPayOS}
                  style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                  onClick={handleTriggerCheckoutPayOS}
                >
                  {loadingPayOS ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Đang khởi tạo link PayOS...
                    </>
                  ) : (
                    <>
                      <Lock size={18} /> {paymentMode === 'DEPOSIT_50' ? `Thanh Toán Cọc 50% qua PayOS (${requiredDeposit.toLocaleString()}đ)` : `Thanh Toán 100% qua PayOS (${finalTotal.toLocaleString()}đ)`}
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Deposit Friction Modal */}
      {showDepositFrictionPopup && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px', padding: '24px', textAlign: 'center' }}>
            <ShieldAlert size={48} style={{ color: '#FF4081', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#FFF' }}>Xác Nhận Cam Kết Đặt Cọc</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Thước kẻ in 3D có khắc tên riêng là sản phẩm cá nhân hóa không thể bán lại cho người khác. Vui lòng tích chọn cam kết mất cọc nếu tự ý hủy đơn trước khi quét mã VietQR PayOS.
            </p>
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
              onClick={() => {
                setIsDepositAgreed(true);
                setShowDepositFrictionPopup(false);
                setShowPayOS(true);
              }}
            >
              Tôi Đã Hiểu & Tiếp Tục Đặt Cọc
            </button>
          </div>
        </div>
      )}

      {/* PayOS QR Modal */}
      {showPayOS && (
        <PayOSMockModal
          amount={requiredDeposit > 0 ? requiredDeposit : finalTotal}
          onCancel={() => setShowPayOS(false)}
          onSuccess={handleConfirmPayOSPayment}
        />
      )}
    </div>
  );
};
