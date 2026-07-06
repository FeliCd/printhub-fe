import React from 'react';
import type { WalletTransaction } from '@/types';
import { useApp } from '@/contexts/AppContext';

interface WalletPageProps {
  walletTransactions: WalletTransaction[];
  topupAmount: number;
  setTopupAmount: (amount: number) => void;
  onTopup: () => void;
}

export const WalletPage: React.FC<WalletPageProps> = ({
  walletTransactions,
  topupAmount,
  setTopupAmount,
  onTopup,
}) => {
  const { walletBalance, triggerViolation } = useApp();

  return (
    <div>
      <h1 className="page-title">Ví điện tử thành viên</h1>
      <p className="page-subtitle">Quản lý dòng tiền nạp, rút và thanh toán nội bộ dịch vụ thiết kế</p>

      {/* Balance Card */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--surface) 100%)', border: '1px solid var(--border)', marginBottom: '24px' }}>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Số dư ví hiện tại</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: walletBalance >= 0 ? 'var(--primary)' : '#ff3b30', fontFamily: 'monospace' }}>
            {walletBalance.toLocaleString()} VND
          </div>
        </div>
        <div>
          <button 
            className="btn" 
            style={{ 
              backgroundColor: 'rgba(255, 59, 48, 0.1)', 
              color: '#ff3b30', 
              border: '1px solid rgba(255, 59, 48, 0.3)',
              fontWeight: 'bold',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            onClick={() => {
              if (confirm('Bạn có chắc chắn muốn mô phỏng hành vi bùng đơn/hủy đơn vô căn cứ để kích hoạt phạt hành chính và khóa tài khoản?')) {
                triggerViolation();
              }
            }}
          >
            Mô phỏng bùng đơn (Nhận phạt)
          </button>
        </div>
      </div>

      <div className="wallet-grid">
        {/* Left Side: Top up */}
        <div className="glass-card">
          <h2>Nạp tiền vào ví</h2>
          <div style={{ marginTop: '24px' }} className="form-group">
            <label>Số tiền nạp (VND)</label>
            <input
              type="number"
              className="form-control"
              value={topupAmount}
              onChange={(e) => setTopupAmount(parseInt(e.target.value) || 0)}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn btn-primary" onClick={onTopup}>
              Nạp qua cổng VNPay
            </button>
            <button className="btn btn-secondary" onClick={onTopup}>
              Nạp qua ví MoMo
            </button>
          </div>
        </div>

        {/* Right Side: Ledger */}
        <div className="glass-card">
          <h2>Lịch sử giao dịch</h2>
          <div style={{ marginTop: '16px' }} className="app-table-container">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Mã giao dịch</th>
                  <th>Thời gian</th>
                  <th>Mô tả</th>
                  <th>Biến động</th>
                </tr>
              </thead>
              <tbody>
                {walletTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ fontFamily: 'var(--mono)', fontWeight: 'bold' }}>{tx.id}</td>
                    <td>{tx.date}</td>
                    <td>{tx.description}</td>
                    <td
                      style={{
                        fontWeight: 'bold',
                        color: tx.type === 'CREDIT' ? 'var(--primary)' : '#ff3b30',
                      }}
                    >
                      {tx.type === 'CREDIT' ? '+' : '-'}{tx.amount.toLocaleString()}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
