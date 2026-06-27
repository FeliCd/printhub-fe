import React from 'react';
import { TrendingUp, ShoppingBag, ClipboardCheck, Users } from 'lucide-react';

interface StatsGridProps {
  totalCommission: number;
  totalGross: number;
  totalCompletedCount: number;
  completedStandardOrdersCount: number;
  completedCustomOrdersCount: number;
  productsCount: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  totalCommission,
  totalGross,
  totalCompletedCount,
  completedStandardOrdersCount,
  completedCustomOrdersCount,
  productsCount,
}) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
      marginBottom: '24px'
    }}>
      {/* Metric 1 */}
      <div className="glass-card" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: 0 }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: 'rgba(57, 255, 20, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)'
        }}>
          <TrendingUp size={24} />
        </div>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Doanh thu Sàn (5%)</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'var(--mono)', color: 'var(--primary)' }}>
            {totalCommission.toLocaleString()}đ
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Từ {totalCompletedCount} đơn thành công
          </div>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="glass-card" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: 0 }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: 'rgba(0, 122, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#007aff'
        }}>
          <ShoppingBag size={24} />
        </div>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Tổng giao dịch (Gross)</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'var(--mono)' }}>
            {totalGross.toLocaleString()}đ
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Giá trị thanh toán lưu chuyển
          </div>
        </div>
      </div>

      {/* Metric 3 */}
      <div className="glass-card" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: 0 }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: 'rgba(175, 82, 222, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#af52de'
        }}>
          <ClipboardCheck size={24} />
        </div>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Đơn hàng thành công</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'var(--mono)' }}>
            {totalCompletedCount} <span style={{ fontSize: '13px', fontWeight: 'normal', color: 'var(--text-secondary)' }}>đơn</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {completedStandardOrdersCount} Catalog | {completedCustomOrdersCount} Thiết kế
          </div>
        </div>
      </div>

      {/* Metric 4 */}
      <div className="glass-card" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: 0 }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 159, 10, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ff9f0a'
        }}>
          <Users size={24} />
        </div>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Thành viên & Mẫu in</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'var(--mono)' }}>
            {productsCount} <span style={{ fontSize: '13px', fontWeight: 'normal', color: 'var(--text-secondary)' }}>mẫu</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            12 Người mua | 8 Nhà in
          </div>
        </div>
      </div>
    </div>
  );
};
