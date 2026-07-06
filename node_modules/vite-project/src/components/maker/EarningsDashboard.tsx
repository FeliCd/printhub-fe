import React from 'react';
import { Calendar } from 'lucide-react';
import type { CustomOrder, Order } from '@/types';

interface EarningsDashboardProps {
  grossEarnings: number;
  platformFee: number;
  netEarnings: number;
  completedCustoms: CustomOrder[];
  completedCatalogSales: Order[];
}

export const EarningsDashboard: React.FC<EarningsDashboardProps> = ({
  grossEarnings,
  platformFee,
  netEarnings,
  completedCustoms,
  completedCatalogSales,
}) => {
  return (
    <div>
      {/* Dashboard Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Tổng doanh thu gộp (Gross)</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--mono)' }}>
            {grossEarnings.toLocaleString()}đ
          </div>
        </div>
        
        <div className="glass-card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Phí sàn tự động khấu trừ (5%)</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--mono)', color: '#ff3b30' }}>
            {platformFee.toLocaleString()}đ
          </div>
        </div>

        <div className="glass-card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Thực nhận về ví (95% Net)</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--mono)', color: 'var(--primary)' }}>
            {netEarnings.toLocaleString()}đ
          </div>
        </div>
      </div>

      {/* Earnings ledger list */}
      <div className="glass-card">
        <h2>Lịch sử nhận thanh toán (Payout Ledger)</h2>
        <div style={{ marginTop: '16px' }} className="app-table-container">
          <table className="app-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Thời gian</th>
                <th>Loại đơn</th>
                <th>Giá trị gộp</th>
                <th>Phí sàn (5%)</th>
                <th>Thu nhập ròng (95%)</th>
              </tr>
            </thead>
            <tbody>
              {/* Completed custom prints */}
              {completedCustoms.map((co) => {
                const price = co.quotedPrice || 0;
                const fee = Math.round(price * 0.05);
                const net = price - fee;
                return (
                  <tr key={co.id}>
                    <td style={{ fontFamily: 'var(--mono)', fontWeight: 'bold' }}>{co.id}</td>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={12} className="text-muted" />{co.date}</div></td>
                    <td>🎨 Đơn in ấn riêng</td>
                    <td>{price.toLocaleString()}đ</td>
                    <td style={{ color: '#ff3b30' }}>-{fee.toLocaleString()}đ</td>
                    <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+{net.toLocaleString()}đ</td>
                  </tr>
                );
              })}

              {/* Completed catalog sales */}
              {completedCatalogSales.map((o) => {
                const price = o.totalAmount;
                const fee = Math.round(price * 0.05);
                const net = price - fee;
                return (
                  <tr key={o.id}>
                    <td style={{ fontFamily: 'var(--mono)', fontWeight: 'bold' }}>{o.id}</td>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={12} className="text-muted" />{o.date}</div></td>
                    <td>📦 Đơn Catalog</td>
                    <td>{price.toLocaleString()}đ</td>
                    <td style={{ color: '#ff3b30' }}>-{fee.toLocaleString()}đ</td>
                    <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+{net.toLocaleString()}đ</td>
                  </tr>
                );
              })}

              {completedCustoms.length === 0 && completedCatalogSales.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    Chưa có khoản thu nhập nào được ghi nhận. Hãy hoàn tất đơn hàng để nhận tiền!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
