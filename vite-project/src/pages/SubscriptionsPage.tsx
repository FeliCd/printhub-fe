import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Sparkles } from 'lucide-react';

export const SubscriptionsPage: React.FC = () => {
  const {
    buyerPoints,
    subscriptionPlans,
    userSubscriptions,
    handleBuySubscription,
  } = useApp();

  // Filter Customer plans
  const displayedPlans = subscriptionPlans.filter((p) => p.type === 'CUSTOMER' && p.isActive);
  const activeSub = userSubscriptions.find((s) => s.isActive && s.planType === 'CUSTOMER');

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles className="logo-accent" size={30} />
            Gói Hội Viên B2C & Mã Giảm Giá Đặt Thước
          </h1>
          <p className="page-subtitle">
            Dùng điểm thưởng học tập hoặc đăng ký gói VIP để nhận miễn phí vận chuyển và giảm 10%-20% bộ thước kẻ in 3D
          </p>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '10px 16px', borderRadius: '8px', textAlign: 'right' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Điểm thưởng tích lũy:</span>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary)', fontFamily: 'var(--mono)' }}>
            {buyerPoints} điểm
          </div>
        </div>
      </div>

      {activeSub && (
        <div style={{ background: 'rgba(57, 255, 20, 0.1)', border: '1px solid #39FF14', padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#39FF14', fontWeight: 'bold', textTransform: 'uppercase' }}>Gói VIP Đang Kích Hoạt</span>
            <h3 style={{ margin: '4px 0', fontSize: '18px', color: '#FFF' }}>{activeSub.planName}</h3>
          </div>
          <span className="info-tag tag-approved">Đang áp dụng giảm giá giỏ hàng</span>
        </div>
      )}

      {/* Grid of Plans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {displayedPlans.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: 'var(--surface)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <span className="info-tag tag-approved" style={{ marginBottom: '12px' }}>
                {plan.price === 0 ? 'ĐỔI BẰNG ĐIỂM' : 'VIP TIỀN MẶT'}
              </span>
              <h3 style={{ fontSize: '18px', margin: '8px 0' }}>{plan.name}</h3>

              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)', fontFamily: 'var(--mono)', margin: '12px 0' }}>
                {plan.price === 0 ? `${plan.requiredPoints} ĐIỂM` : `${plan.price.toLocaleString()}đ / tháng`}
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', minHeight: '60px' }}>
                {plan.benefits}
              </p>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px', marginTop: '16px' }}
              onClick={() => handleBuySubscription(plan.id, plan.price === 0 ? 'POINTS' : 'WALLET')}
            >
              {plan.price === 0 ? 'Đổi Điểm Ngay' : 'Đăng Ký Gói VIP'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
