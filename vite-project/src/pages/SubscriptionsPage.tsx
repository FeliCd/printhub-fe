import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { 
  Gift, 
  Wallet, 
  Award, 
  CheckCircle2, 
  Calendar, 
  Zap, 
  Sparkles, 
  RotateCcw, 
  BadgeCheck, 
  Star
} from 'lucide-react';

export const SubscriptionsPage: React.FC = () => {
  const {
    walletBalance,
    buyerPoints,
    subscriptionPlans,
    userSubscriptions,
    handleBuySubscription,
    currentUser
  } = useApp();

  const isMaker = currentUser?.role === 'MAKER';
  const roleType = isMaker ? 'MAKER' : 'CUSTOMER';

  // Filter plans based on logged in user's role
  const displayedPlans = subscriptionPlans.filter(p => p.type === roleType && p.isActive);

  // Filter owned subscriptions for the logged in user
  const activeUserId = isMaker ? 'user-maker-1' : 'user-buyer-1';
  const ownedSubs = userSubscriptions.filter(s => s.userId === activeUserId && s.isActive);

  // Reset helper to clear localStorage for demo debugging
  const handleResetDefaults = () => {
    if (confirm('Bạn có muốn đặt lại dữ liệu Gói hội viên và điểm thưởng về mặc định không?')) {
      localStorage.removeItem('printhub_subscription_plans');
      localStorage.removeItem('printhub_user_subscriptions');
      localStorage.removeItem('printhub_buyer_points');
      localStorage.removeItem('printhub_wallet_balance');
      window.location.reload();
    }
  };

  // Group plans by level (Silver, Gold, Premium) to make it easy to list comparison
  // Points plans end with '-points', Cash plans end with '-cash'
  const levels = [
    { key: 'silver', name: 'Gói Bạc (Silver)', badge: 'Silver' },
    { key: 'gold', name: 'Gói Vàng (Gold)', badge: 'Gold' },
    { key: 'premium', name: 'Gói Bạch Kim (Premium)', badge: 'VIP' }
  ];

  const getBadgeConfig = (planId: string) => {
    if (planId.includes('premium')) {
      return {
        bg: 'rgba(255, 107, 107, 0.1)',
        color: '#ff6b6b',
        border: 'rgba(255, 107, 107, 0.2)',
        accent: '#ff6b6b'
      };
    }
    if (planId.includes('gold')) {
      return {
        bg: 'rgba(255, 204, 0, 0.1)',
        color: '#ffcc00',
        border: 'rgba(255, 204, 0, 0.2)',
        accent: '#ffcc00'
      };
    }
    return {
      bg: 'rgba(0, 122, 255, 0.1)',
      color: '#007aff',
      border: 'rgba(0, 122, 255, 0.2)',
      accent: '#007aff'
    };
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Title Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles style={{ color: 'var(--primary)' }} />
            Đổi & Mua Gói Hội Viên Định Kỳ
          </h1>
          <p className="page-subtitle" style={{ margin: 0 }}>
            Tối ưu hóa quyền lợi bằng cách sử dụng Điểm tích lũy Loyalty hoặc mua trực tiếp bằng Tiền mặt
          </p>
        </div>
        <button 
          onClick={handleResetDefaults}
          className="btn btn-secondary" 
          style={{ 
            fontSize: '12px', 
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            borderColor: 'rgba(255,255,255,0.1)'
          }}
        >
          <RotateCcw size={13} />
          Đặt lại dữ liệu mô phỏng
        </button>
      </div>



      {/* Overview Balances Widget */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Wallet Balance Card */}
        <div className="glass-card" style={{
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          background: 'linear-gradient(135deg, rgba(18, 18, 18, 0.9) 0%, rgba(28, 28, 28, 0.9) 100%)',
          borderLeft: '4px solid var(--primary)',
          borderRadius: '16px',
          marginBottom: 0,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: 'rgba(57, 255, 20, 0.08)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 10px rgba(57, 255, 20, 0.05)'
          }}>
            <Wallet size={26} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>
              Số dư ví điện tử (VNĐ)
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--mono)', marginTop: '4px', color: '#fff' }}>
              {walletBalance.toLocaleString()}đ
            </div>
          </div>
        </div>

        {/* Reward Points Card */}
        <div className="glass-card" style={{
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          background: 'linear-gradient(135deg, rgba(18, 18, 18, 0.9) 0%, rgba(28, 28, 28, 0.9) 100%)',
          borderLeft: '4px solid #af52de',
          borderRadius: '16px',
          marginBottom: 0,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: 'rgba(175, 82, 222, 0.08)',
            color: '#af52de',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 10px rgba(175, 82, 222, 0.05)'
          }}>
            <Award size={26} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>
              Điểm thưởng Loyalty tích lũy
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--mono)', marginTop: '4px', color: '#af52de' }}>
              {buyerPoints.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 'normal', fontFamily: 'var(--sans)' }}>điểm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Owned Subscriptions List */}
      <div className="glass-card" style={{ 
        marginBottom: '40px', 
        borderRadius: '16px',
        padding: '24px',
        background: 'rgba(18, 18, 18, 0.5)',
        border: '1px solid var(--border)'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 18px 0', color: '#fff' }}>
          <CheckCircle2 size={22} style={{ color: 'var(--primary)' }} />
          Gói ưu đãi đang sử dụng ({ownedSubs.length})
        </h2>
        
        {ownedSubs.length === 0 ? (
          <div style={{
            padding: '30px 20px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '12px',
            border: '1px dashed var(--border)',
            fontSize: '14px'
          }}>
            Bạn chưa sở hữu gói ưu đãi hoạt động nào. Hãy nâng cấp hạng bằng điểm tích lũy hoặc mua VIP bằng ví bên dưới!
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px'
          }}>
            {ownedSubs.map((sub) => {
              const cfg = getBadgeConfig(sub.planId);
              // Find matching plan in list
              const matchedPlan = subscriptionPlans.find(p => p.id === sub.planId);
              const isPointsSub = sub.planId.includes('points');

              return (
                <div key={sub.subscriptionId} style={{
                  padding: '20px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: `1px solid ${cfg.border}`,
                  borderRadius: '12px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  {/* Decorative corner tag color */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    backgroundColor: cfg.accent
                  }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#fff' }}>{sub.planName}</h3>
                      <span style={{ 
                        fontSize: '11px', 
                        color: isPointsSub ? 'var(--text-muted)' : '#ffcc00',
                        fontWeight: '600',
                        display: 'block',
                        marginTop: '2px'
                      }}>
                        {isPointsSub ? 'Nâng hạng Loyalty (Miễn phí)' : 'VIP Gold/Silver Trả phí'}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 'bold',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      backgroundColor: cfg.bg,
                      color: cfg.color,
                      border: `1px solid ${cfg.border}`
                    }}>
                      {isPointsSub ? 'Loyalty' : 'VIP'}
                    </span>
                  </div>

                  <div style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    backgroundColor: 'rgba(255,255,255,0.01)',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    borderLeft: `3px solid ${cfg.accent}`,
                    marginBottom: '16px',
                    lineHeight: '1.4'
                  }}>
                    <strong style={{ color: '#fff', display: 'block', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Đặc quyền kích hoạt:</strong>
                    <span>{matchedPlan ? matchedPlan.benefits : 'Đặc quyền gói thành viên'}</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={13} />
                      <span>Ngày bắt đầu: {sub.startDate}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={13} />
                      <span>Hết hạn: <strong style={{ color: '#fff' }}>{sub.endDate}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Side-by-Side Comparison Columns */}
      <h2 style={{ 
        fontSize: '20px', 
        fontWeight: 'bold', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px', 
        marginBottom: '24px',
        color: '#fff'
      }}>
        <Gift size={22} style={{ color: '#af52de' }} />
        So Sánh Các Gói Đặc Quyền Song Song
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
        gap: '32px',
        alignItems: 'start'
      }}>
        {/* Column 1 - Loyalty Upgrade (Neutral Styling) */}
        <div style={{
          backgroundColor: 'rgba(25, 25, 25, 0.4)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          {/* Column Header */}
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '24px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 'bold',
              padding: '4px 12px',
              borderRadius: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              Quy đổi Loyalty
            </span>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', marginTop: '12px', marginBottom: '8px' }}>
              Nâng Hạng Bằng Điểm Thưởng
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
              Dành cho hội viên tích cực tích lũy điểm thưởng từ các đơn hàng. Đổi gói Loyalty miễn phí định kỳ nhận lượng mã giảm giá cơ bản.
            </p>
          </div>

          {/* List of points-based plans */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {levels.map((level) => {
              const roleKey = roleType === 'CUSTOMER' ? 'cust' : 'maker';
              const plan = displayedPlans.find(p => p.id === `plan-${roleKey}-${level.key}-points`);
              if (!plan) return null;
              const isOwned = ownedSubs.some(s => s.planId === plan.id);
              const badgeCfg = getBadgeConfig(plan.id);

              return (
                <div key={plan.id} style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: isOwned ? '2px solid rgba(57, 255, 20, 0.5)' : '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '20px',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}>
                  {isOwned && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(57, 255, 20, 0.1)',
                      color: 'var(--primary)',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      border: '1px solid rgba(57, 255, 20, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <BadgeCheck size={12} /> Đang kích hoạt
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Star size={14} style={{ color: badgeCfg.accent, fill: badgeCfg.accent }} />
                    <h4 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0, color: '#fff' }}>
                      {plan.name}
                    </h4>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: '1.4' }}>
                    {plan.benefits}
                  </p>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderTop: '1px solid var(--border)',
                    paddingTop: '12px',
                    marginTop: '8px'
                  }}>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Điểm quy đổi</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#af52de', fontFamily: 'var(--mono)' }}>
                        {plan.requiredPoints?.toLocaleString()} <span style={{ fontSize: '12px', fontWeight: 'normal', fontFamily: 'var(--sans)' }}>điểm</span>
                      </div>
                    </div>

                    <button
                      disabled={isOwned || buyerPoints < (plan.requiredPoints || 0)}
                      onClick={() => handleBuySubscription(plan.id, 'POINTS')}
                      className="btn"
                      style={{
                        padding: '8px 16px',
                        fontSize: '13px',
                        backgroundColor: isOwned ? 'rgba(57, 255, 20, 0.05)' : 'rgba(255,255,255,0.03)',
                        color: isOwned ? 'var(--primary)' : (buyerPoints < (plan.requiredPoints || 0) ? 'var(--text-muted)' : '#fff'),
                        border: isOwned ? '1px solid rgba(57, 255, 20, 0.2)' : '1px solid var(--border)',
                        cursor: (isOwned || buyerPoints < (plan.requiredPoints || 0)) ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Award size={14} />
                      {isOwned ? 'Đã đổi' : (buyerPoints < (plan.requiredPoints || 0) ? 'Chưa đủ điểm' : 'Đổi gói ngay')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2 - Buy VIP Cash (Vibrant Highlighted Styling) */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(20, 30, 20, 0.4) 0%, rgba(15, 15, 25, 0.4) 100%)',
          border: '2px solid var(--primary)',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 0 35px rgba(57, 255, 20, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative'
        }}>
          {/* Ribbon Label */}
          <div style={{
            position: 'absolute',
            top: '-14px',
            right: '24px',
            backgroundColor: 'var(--primary)',
            color: 'var(--bg-primary)',
            fontSize: '11px',
            fontWeight: 'bold',
            padding: '4px 14px',
            borderRadius: '20px',
            boxShadow: '0 4px 12px rgba(57, 255, 20, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            <Zap size={12} style={{ fill: 'currentColor' }} />
            Mã giảm giá X2 - Tiết kiệm nhất
          </div>

          {/* Column Header */}
          <div style={{ borderBottom: '1px solid rgba(57, 255, 20, 0.2)', paddingBottom: '20px', marginBottom: '24px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 'bold',
              padding: '4px 12px',
              borderRadius: '20px',
              backgroundColor: 'rgba(57, 255, 20, 0.1)',
              color: 'var(--primary)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              border: '1px solid rgba(57, 255, 20, 0.2)'
            }}>
              Thuê bao VIP hàng tháng
            </span>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', marginTop: '12px', marginBottom: '8px' }}>
              Mua Gói VIP Bằng Tiền Mặt
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
              Đầu tư chi phí hàng tháng để mở khóa tối đa lượng Voucher ưu đãi sâu nhất, giảm sâu phí dịch vụ và vận chuyển để thúc đẩy hiệu quả.
            </p>
          </div>

          {/* List of cash-based plans */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {levels.map((level) => {
              const roleKey = roleType === 'CUSTOMER' ? 'cust' : 'maker';
              const plan = displayedPlans.find(p => p.id === `plan-${roleKey}-${level.key}-cash`);
              if (!plan) return null;
              const isOwned = ownedSubs.some(s => s.planId === plan.id);

              return (
                <div key={plan.id} style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: isOwned ? '2px solid rgba(57, 255, 20, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  position: 'relative',
                  transition: 'transform 0.2s',
                  cursor: 'default'
                }}>
                  {isOwned && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(57, 255, 20, 0.1)',
                      color: 'var(--primary)',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      border: '1px solid rgba(57, 255, 20, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <BadgeCheck size={12} /> Đang hoạt động
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Zap size={14} style={{ color: 'var(--primary)', fill: 'var(--primary)' }} />
                    <h4 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0, color: '#fff' }}>
                      {plan.name}
                    </h4>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: '1.4' }}>
                    {plan.benefits}
                  </p>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderTop: '1px solid var(--border)',
                    paddingTop: '12px',
                    marginTop: '8px'
                  }}>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Giá thuê bao</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary)', fontFamily: 'var(--mono)' }}>
                        {plan.price.toLocaleString()}đ<span style={{ fontSize: '12px', fontWeight: 'normal', fontFamily: 'var(--sans)', color: 'var(--text-muted)' }}>/tháng</span>
                      </div>
                    </div>

                    <button
                      disabled={isOwned}
                      onClick={() => handleBuySubscription(plan.id, 'WALLET')}
                      className="btn btn-primary"
                      style={{
                        padding: '8px 16px',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: isOwned ? 'none' : '0 4px 12px rgba(57, 255, 20, 0.2)',
                        opacity: isOwned ? 0.6 : 1,
                        cursor: isOwned ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <Wallet size={14} />
                      {isOwned ? 'Đã đăng ký' : 'Mua gói ngay'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
