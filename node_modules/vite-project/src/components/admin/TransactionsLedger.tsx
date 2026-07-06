import React from 'react';
import type { Order, CustomOrder } from '@/types';

interface TransactionsLedgerProps {
  completedStandardOrders: Order[];
  completedCustomOrders: CustomOrder[];
  totalCompletedCount: number;
}

export const TransactionsLedger: React.FC<TransactionsLedgerProps> = ({
  completedStandardOrders,
  completedCustomOrders,
  totalCompletedCount,
}) => {
  return (
    <div className="glass-card" style={{ marginBottom: 0 }}>
      <h2 style={{ fontSize: '15px', marginBottom: '4px' }}>Sổ cái Giao dịch (Transactions Ledger)</h2>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Các đơn hàng catalog và in theo thiết kế đã thanh toán</p>
      
      <div className="app-table-container">
        <table className="app-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Phân loại</th>
              <th>Ngày giao dịch</th>
              <th>Tổng tiền hàng</th>
              <th>Phí sàn (5%)</th>
            </tr>
          </thead>
          <tbody>
            {/* Standard Completed Orders */}
            {completedStandardOrders.map((o) => (
              <tr key={o.id}>
                <td style={{ fontFamily: 'var(--mono)', fontWeight: 'bold' }}>{o.id}</td>
                <td><span className="info-tag tag-approved" style={{ fontSize: '10px' }}>📦 Đơn Catalog</span></td>
                <td>{o.date}</td>
                <td style={{ fontFamily: 'var(--mono)' }}>{o.totalAmount.toLocaleString()}đ</td>
                <td style={{ fontFamily: 'var(--mono)', fontWeight: 'bold', color: 'var(--primary)' }}>
                  +{o.commissionFee.toLocaleString()}đ
                </td>
              </tr>
            ))}
            
            {/* Custom Completed Orders */}
            {completedCustomOrders.map((co) => {
              const gross = co.quotedPrice || 0;
              const comm = Math.round(gross * 0.05);
              return (
                <tr key={co.id}>
                  <td style={{ fontFamily: 'var(--mono)', fontWeight: 'bold' }}>{co.id}</td>
                  <td><span className="info-tag tag-pending" style={{ fontSize: '10px', backgroundColor: 'rgba(175, 82, 222, 0.1)', color: '#af52de' }}>🎨 Thiết kế riêng</span></td>
                  <td>{co.date}</td>
                  <td style={{ fontFamily: 'var(--mono)' }}>{gross.toLocaleString()}đ</td>
                  <td style={{ fontFamily: 'var(--mono)', fontWeight: 'bold', color: 'var(--primary)' }}>
                    +{comm.toLocaleString()}đ
                  </td>
                </tr>
              );
            })}

            {totalCompletedCount === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  Chưa có đơn hàng thành công nào để hiển thị.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
