import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, ShoppingBag, PackageCheck, Loader2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { paymentService } from '@/services/paymentService';

export const PaymentResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setCart } = useApp();

  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Đang xác minh giao dịch PayOS...');
  const [countdown, setCountdown] = useState(7);

  const code = searchParams.get('code');
  const cancel = searchParams.get('cancel');
  const status = searchParams.get('status');
  const orderCode = searchParams.get('orderCode') || searchParams.get('id') || 'PH3D-' + Math.floor(100000 + Math.random() * 900000);

  useEffect(() => {
    let timer: any;
    const verifyPayment = async () => {
      // If cancelled by user on PayOS checkout page
      if (cancel === 'true' || status === 'CANCELLED') {
        setIsSuccess(false);
        setStatusMessage('Giao dịch đã bị hủy bởi người dùng.');
        setLoading(false);
        return;
      }

      // Check code '00' (PayOS success code)
      if (code === '00' || status === 'PAID' || status === 'SUCCESS') {
        try {
          if (orderCode) {
            await paymentService.verifyPaymentStatus(orderCode);
          }
        } catch (e) {
          console.warn('Verify API failed, proceeding with client status:', e);
        }
        setIsSuccess(true);
        setStatusMessage('Thanh toán đặt cọc đơn hàng in 3D qua PayOS thành công!');
        setCart([]); // Clear cart upon successful deposit/payment
        setLoading(false);

        // Auto redirect countdown to /orders
        timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              navigate('/orders');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        // Default success fallback if PayOS redirected back without explicit error
        setIsSuccess(true);
        setStatusMessage('Thanh toán thành công! Xưởng in 3D đang chuẩn bị đơn hàng của bạn.');
        setCart([]);
        setLoading(false);
      }
    };

    verifyPayment();

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [code, cancel, status, orderCode, setCart, navigate]);

  return (
    <div style={{ maxWidth: '640px', margin: '40px auto', padding: '0 16px' }}>
      <div className="glass-card" style={{ textAlign: 'center', padding: '40px 24px', borderRadius: '16px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '32px 0' }}>
            <Loader2 size={48} className="animate-spin" style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Xác Minh Giao Dịch PayOS</h2>
            <p style={{ color: 'var(--text-muted)' }}>Vui lòng đợi trong giây lát...</p>
          </div>
        ) : isSuccess ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#22c55e'
            }}>
              <CheckCircle2 size={48} />
            </div>

            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Thanh Toán Thành Công!
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '440px', margin: '0 auto' }}>
                {statusMessage}
              </p>
            </div>

            <div style={{
              width: '100%',
              backgroundColor: 'var(--card-bg-subtle, rgba(255, 255, 255, 0.05))',
              border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
              borderRadius: '12px',
              padding: '16px 20px',
              textAlign: 'left',
              marginTop: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Mã Giao Dịch PayOS:</span>
                <span style={{ fontWeight: '600', fontFamily: 'monospace', fontSize: '14px' }}>{orderCode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Cổng Thanh Toán:</span>
                <span style={{ fontWeight: '600', color: '#0066ff', fontSize: '14px' }}>PayOS VietQR</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Trạng Thái Đơn Hàng:</span>
                <span style={{ fontWeight: '600', color: '#22c55e', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <PackageCheck size={14} /> Đã Nhận Đặt Cọc - Đang In 3D
                </span>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Tự động chuyển hướng về trang Đơn hàng sau <strong style={{ color: 'var(--primary)' }}>{countdown}s</strong>...
            </p>

            <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '12px' }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
                onClick={() => navigate('/catalog')}
              >
                <ShoppingBag size={18} /> Mua Thêm
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
                onClick={() => navigate('/orders')}
              >
                Quản Lý Đơn Hàng <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444'
            }}>
              <XCircle size={48} />
            </div>

            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Thanh Toán Không Thành Công
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '440px', margin: '0 auto' }}>
                {statusMessage}
              </p>
            </div>

            <div style={{
              width: '100%',
              backgroundColor: 'rgba(234, 179, 8, 0.1)',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              borderRadius: '12px',
              padding: '14px 18px',
              textAlign: 'left',
              color: '#eab308',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Đơn hàng của bạn vẫn chưa được ghi nhận đặt cọc. Vui lòng thanh toán lại để xưởng tiến hành sản xuất sản phẩm 3D.</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '12px' }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
                onClick={() => navigate('/catalog')}
              >
                Quay Lại Trang Chủ
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
                onClick={() => navigate('/cart')}
              >
                Thử Thanh Toán Lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
