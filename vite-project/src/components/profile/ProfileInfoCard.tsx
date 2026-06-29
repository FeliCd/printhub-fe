import React from 'react';
import { User } from 'lucide-react';
import type { Order } from '@/types';
import { useApp } from '@/contexts/AppContext';

interface ProfileInfoCardProps {
  currentUser: any;
  makerProfile: {
    status: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
    equipmentInfo: string;
    bio: string;
    portfolioUrl: string;
    trustScore: number;
  };
  orders: Order[];
}

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
  currentUser,
  makerProfile,
  orders,
}) => {
  const { buyerPoints, userSubscriptions } = useApp();
  const ownedSubs = userSubscriptions.filter(s => s.userId === 'user-buyer-1' && s.isActive);

  return currentUser?.role === 'MAKER' ? (
    <div className="glass-card" style={{ marginBottom: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <User size={18} className="text-muted" />
        <h2 style={{ margin: 0 }}>Hồ sơ Nhà in (Maker Profile)</h2>
      </div>
      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: 'var(--bg-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '24px',
            }}
          >
            M
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>DragonCreator3D</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Điểm tín nhiệm:{' '}
              <strong style={{ color: 'var(--primary)' }}>{makerProfile.trustScore}/100</strong>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Thông tin thiết bị in</label>
          <input type="text" className="form-control" readOnly value={makerProfile.equipmentInfo} />
        </div>

        <div className="form-group">
          <label>Tiểu sử / Giới thiệu</label>
          <textarea
            className="form-control"
            readOnly
            value={makerProfile.bio}
            style={{ height: '80px', resize: 'none' }}
          />
        </div>

        <div className="form-group">
          <label>Trang cá nhân / Portfolio URL</label>
          <input type="text" className="form-control" readOnly value={makerProfile.portfolioUrl} />
        </div>
      </div>
    </div>
  ) : (
    <div className="glass-card" style={{ marginBottom: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <User size={18} className="text-muted" />
        <h2 style={{ margin: 0 }}>Hồ sơ Khách hàng (Buyer Profile)</h2>
      </div>
      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#007aff',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '24px',
            }}
          >
            B
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{currentUser?.name || 'Nguyễn Văn Anh'}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
              Trạng thái gói:{' '}
              <strong style={{ color: '#ffcc00', backgroundColor: 'rgba(255, 204, 0, 0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>
                Đang dùng {ownedSubs.length} gói ưu đãi
              </strong>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Loại tài khoản bảo mật</label>
          <input type="text" className="form-control" readOnly value="Tài khoản mua hàng cá nhân" />
        </div>

        <div className="form-group">
          <label>Đơn hàng đã hoàn thành</label>
          <input type="text" className="form-control" readOnly value={`${orders.filter(o => o.status === 'COMPLETED').length} đơn hàng`} />
        </div>

        <div className="form-group">
          <label>Điểm thưởng tích lũy</label>
          <input type="text" className="form-control" readOnly value={`${buyerPoints.toLocaleString()} điểm`} />
        </div>

        <div className="form-group">
          <label>Các ưu đãi đang hoạt động</label>
          <input type="text" className="form-control" readOnly value={
            ownedSubs.map(s => s.planName).join(', ') || 'Chưa sở hữu gói ưu đãi nào'
          } />
        </div>
      </div>
    </div>
  );
};

