import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Gift, Wallet, Award, CheckCircle2, Calendar } from 'lucide-react';

export const SubscriptionsPage: React.FC = () => {
  const {
    walletBalance,
    buyerPoints,
    subscriptionPlans,
    userSubscriptions,
    handleBuySubscription
  } = useApp();

  // Filter dynamic CUSTOMER plans that are active
  const customerPlans = subscriptionPlans.filter(p => p.type === 'CUSTOMER' && p.isActive);

  // Filter owned subscriptions for user-buyer-1 that are active
  const ownedSubs = userSubscriptions.filter(s => s.userId === 'user-buyer-1' && s.isActive);

  // Helper to render discount type icon/styling based on plan name
  const getBadgeConfig = (name: string) => {
    const upper = name.toUpperCase();
    if (upper.includes('FREESHIP') || upper.includes('VẬN CHUYỂN')) {
      return {
        bg: 'rgba(52, 199, 89, 0.1)',
        color: '#34c759',
        label: 'Vận chuyển',
        accent: '#34c759'
      };
    }
    if (upper.includes('DESIGN') || upper.includes('THIẾT KẾ')) {
      return {
        bg: 'rgba(0, 122, 255, 0.1)',
        color: '#007aff',
        label: 'Thiết kế 3D',
        accent: '#007aff'
      };
    }
    if (upper.includes('CASHBACK') || upper.includes('HOÀN TIỀN')) {
      return {
        bg: 'rgba(175, 82, 222, 0.1)',
        color: '#af52de',
        label: 'Tích điểm',
        accent: '#af52de'
      };
    }
    return {
      bg: 'rgba(255, 159, 10, 0.1)',
      color: '#ff9f0a',
      label: 'Ưu đãi',
      accent: '#ff9f0a'
    };
  };

  return (
    <div style={{ animation: 'modal-fadeIn 0.4s ease-out' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">Gói hội viên & Đổi ưu đãi</h1>
          <p className="page-subtitle">Nâng cấp tài khoản bằng tiền mặt hoặc điểm thưởng tích lũy để nhận đặc quyền tốt nhất</p>
        </div>
      </div>

      {/* Overview Balances */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Wallet Balance Card */}
        <div className="glass-card" style={{
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(34, 34, 34, 0.9) 100%)',
          borderLeft: '4px solid var(--primary)',
          marginBottom: 0
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(57, 255, 20, 0.1)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Wallet size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Số dư ví điện tử
            </div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'var(--mono)', marginTop: '4px' }}>
              {walletBalance.toLocaleString()}đ
            </div>
          </div>
        </div>

        {/* Reward Points Card */}
        <div className="glass-card" style={{
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(34, 34, 34, 0.9) 100%)',
          borderLeft: '4px solid #af52de',
          marginBottom: 0
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(175, 82, 222, 0.1)',
            color: '#af52de',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Điểm thưởng tích lũy
            </div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'var(--mono)', marginTop: '4px', color: '#af52de' }}>
              {buyerPoints.toLocaleString()} điểm
            </div>
          </div>
        </div>
      </div>

      {/* Owned Subscriptions List */}
      <div className="glass-card" style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0' }}>
          <CheckCircle2 size={20} style={{ color: 'var(--primary)' }} />
          Gói ưu đãi đang sở hữu ({ownedSubs.length})
        </h2>
        
        {ownedSubs.length === 0 ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '8px',
            border: '1px dashed var(--border)'
          }}>
            Bạn chưa sở hữu bất kỳ gói ưu đãi hoạt động nào. Hãy đăng ký một gói bên dưới để nhận đặc quyền!
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {ownedSubs.map((sub) => {
              const cfg = getBadgeConfig(sub.planName);
              return (
                <div key={sub.subscriptionId} style={{
                  padding: '16px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Decorative corner tag color */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    backgroundColor: cfg.accent
                  }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0 }}>{sub.planName}</h3>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 'bold',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: cfg.bg,
                      color: cfg.color
                    }}>
                      {cfg.label}
                    </span>
                  </div>

                  {/* Find original plan benefits */}
                  {(() => {
                    const matchedPlan = subscriptionPlans.find(p => p.id === sub.planId);
                    return (
                      <div style={{
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        backgroundColor: 'rgba(255,255,255,0.02)',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        borderLeft: `2px solid ${cfg.accent}`,
                        marginBottom: '12px',
                        fontWeight: '500'
                      }}>
                        Đặc quyền: <span style={{ color: '#fff' }}>{matchedPlan ? matchedPlan.benefits : 'Ưu đãi thành viên'}</span>
                      </div>
                    );
                  })()}

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} />
                      <span>Bắt đầu: {sub.startDate}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} />
                      <span>Hết hạn: <strong style={{ color: '#fff' }}>{sub.endDate}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Subscriptions Grid */}
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Gift size={20} style={{ color: '#af52de' }} />
        Các gói đặc quyền & ưu đãi hiện có
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {customerPlans.map((pkg) => {
          const cfg = getBadgeConfig(pkg.name);
          const isOwned = ownedSubs.some(os => os.planId === pkg.id);
          
          return (
            <div key={pkg.id} className="glass-card" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'between',
              height: '100%',
              marginBottom: 0,
              border: isOwned ? '1px solid rgba(57, 255, 20, 0.3)' : '1px solid var(--border)',
              position: 'relative',
              transition: 'all 0.3s ease',
              padding: '24px'
            }}>
              {/* Highlight if owned */}
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
                  border: '1px solid rgba(57, 255, 20, 0.3)'
                }}>
                  Đang sở hữu
                </div>
              )}

              {/* Package Header */}
              <div>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 'bold',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: cfg.bg,
                  color: cfg.color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {cfg.label}
                </span>
                
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', marginTop: '12px', marginBottom: '8px' }}>
                  {pkg.name}
                </h3>

                {/* Perks list */}
                <div style={{
                  fontSize: '13px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border)',
                  marginBottom: '20px',
                  marginTop: '16px'
                }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Quyền lợi gói:
                  </div>
                  <div style={{ fontWeight: 'bold', color: cfg.accent, lineHeight: '1.4' }}>
                    {pkg.benefits}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Hạn sử dụng: 30 ngày
                  </div>
                </div>
              </div>

              {/* Purchase Options */}
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {pkg.price > 0 && (
                  <button
                    disabled={isOwned}
                    onClick={() => handleBuySubscription(pkg.id, 'WALLET')}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      fontFamily: 'var(--sans)',
                      fontSize: '13px',
                      padding: '10px',
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '6px',
                      opacity: isOwned ? 0.6 : 1,
                      cursor: isOwned ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <span>{isOwned ? 'Đã kích hoạt' : 'Mua bằng ví:'}</span>
                    {!isOwned && <strong style={{ fontFamily: 'var(--mono)' }}>{pkg.price.toLocaleString()}đ</strong>}
                  </button>
                )}

                {pkg.requiredPoints && pkg.requiredPoints > 0 ? (
                  <button
                    disabled={isOwned}
                    onClick={() => handleBuySubscription(pkg.id, 'POINTS')}
                    className="btn btn-secondary"
                    style={{
                      width: '100%',
                      fontFamily: 'var(--sans)',
                      fontSize: '13px',
                      padding: '10px',
                      display: 'flex',
                      justifyContent: 'center',
                      borderColor: '#af52de',
                      color: '#af52de',
                      backgroundColor: 'rgba(175, 82, 222, 0.03)',
                      gap: '6px',
                      opacity: isOwned ? 0.6 : 1,
                      cursor: isOwned ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <span>{isOwned ? 'Đã đổi ưu đãi' : 'Đổi bằng điểm:'}</span>
                    {!isOwned && <strong style={{ fontFamily: 'var(--mono)' }}>{pkg.requiredPoints.toLocaleString()}</strong>}
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
