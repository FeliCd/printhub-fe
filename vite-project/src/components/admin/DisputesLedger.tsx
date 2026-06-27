import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { Dispute } from '@/types';

interface DisputesLedgerProps {
  resolvedDisputes: Dispute[];
}

export const DisputesLedger: React.FC<DisputesLedgerProps> = ({ resolvedDisputes }) => {
  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <AlertCircle size={16} className="text-muted" />
        <h2 style={{ fontSize: '15px', margin: 0 }}>Lịch sử Tranh chấp & Giải quyết khiếu nại (Admin arbitration)</h2>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', paddingLeft: '24px' }}>
        Phán quyết hoàn tiền đã thực hiện bởi Admin đối với các khiếu nại sản phẩm lỗi
      </p>

      <div className="app-table-container" style={{ paddingLeft: '24px' }}>
        <table className="app-table">
          <thead>
            <tr>
              <th>Mã tranh chấp</th>
              <th>Mã đơn hàng</th>
              <th>Ngày xử lý</th>
              <th>Lý do khiếu nại</th>
              <th>Phán quyết Admin</th>
              <th>Số tiền hoàn trả</th>
            </tr>
          </thead>
          <tbody>
            {resolvedDisputes.map((d) => (
              <tr key={d.id}>
                <td style={{ fontFamily: 'var(--mono)', fontWeight: 'bold', color: '#ff3b30' }}>{d.id}</td>
                <td style={{ fontFamily: 'var(--mono)' }}>{d.orderId}</td>
                <td>{d.date}</td>
                <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {d.reason}
                </td>
                <td>
                  <span className="info-tag tag-approved" style={{ fontSize: '10px' }}>
                    {d.refundType === 'FULL' ? 'Hoàn 100%' : 'Hoàn 50%'}
                  </span>
                </td>
                <td style={{ fontFamily: 'var(--mono)', fontWeight: 'bold', color: '#ff3b30' }}>
                  {d.refundAmount?.toLocaleString()}đ
                </td>
              </tr>
            ))}

            {resolvedDisputes.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  Không có lịch sử tranh chấp nào đã giải quyết.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
