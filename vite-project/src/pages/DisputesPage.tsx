import React, { useState } from 'react';
import type { Dispute } from '@/types';
import { ShieldCheck, CheckCircle2, RefreshCw, RotateCcw } from 'lucide-react';

interface DisputesPageProps {
  disputes: Dispute[];
  userRole: 'BUYER' | 'ADMIN';
  onAddDisputeClick: () => void;
  onResolveDispute: (id: string, amount: number, type: 'FULL' | 'PARTIAL' | 'NONE') => void;
}

export const DisputesPage: React.FC<DisputesPageProps> = ({
  disputes,
  userRole,
  onAddDisputeClick,
  onResolveDispute,
}) => {
  const [activeTab, setActiveTab] = useState<'OPEN' | 'RESOLVED'>('OPEN');

  const displayedDisputes = disputes.filter((d) =>
    activeTab === 'OPEN' ? d.status === 'OPEN' : d.status === 'RESOLVED'
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck className="logo-accent" size={32} />
            Yêu Cầu Bảo Hành 1 Đổi 1 & Đổi Trả Thước
          </h1>
          <p className="page-subtitle">Chính sách bảo hành gãy 1 đổi 1 trong 1 học kỳ dành cho sản phẩm thước in 3D chính hãng</p>
        </div>
        {userRole === 'BUYER' && (
          <button className="btn btn-primary" onClick={onAddDisputeClick} style={{ gap: '8px' }}>
            <RefreshCw size={16} /> Gửi Yêu Cầu Bảo Hành Gãy / Đổi Trả
          </button>
        )}
      </div>

      <div
        style={{
          background: 'rgba(57, 255, 20, 0.08)',
          borderLeft: '4px solid #39FF14',
          padding: '16px 20px',
          borderRadius: '0 8px 8px 0',
          marginBottom: '24px',
          fontSize: '13px'
        }}
      >
        <strong style={{ color: '#39FF14', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
          Cam Kết Bảo Hành Số PrintHub 3D
        </strong>
        Nếu thước bị gãy nứt do vận chuyển hoặc qua quá trình học tập trong vòng 1 học kỳ, chụp ảnh mã QR in trên thước và tải lên hệ thống. Xưởng sẽ in mới cây thước tương ứng và giao lại hoàn toàn miễn phí.
      </div>

      {/* Tabs */}
      <div className="tab-nav" style={{ marginBottom: '24px', display: 'flex', gap: '8px' }}>
        <button
          className={`tab-btn ${activeTab === 'OPEN' ? 'active' : ''}`}
          onClick={() => setActiveTab('OPEN')}
        >
          Yêu cầu đang xử lý ({disputes.filter((d) => d.status === 'OPEN').length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'RESOLVED' ? 'active' : ''}`}
          onClick={() => setActiveTab('RESOLVED')}
        >
          Lịch sử đã duyệt ({disputes.filter((d) => d.status === 'RESOLVED').length})
        </button>
      </div>

      {/* List */}
      <div className="glass-card">
        {displayedDisputes.length === 0 ? (
          <div style={{ padding: '48px 32px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Không có yêu cầu bảo hành nào trong mục này.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {displayedDisputes.map((dispute) => (
              <div
                key={dispute.id}
                style={{
                  background: 'var(--bg-secondary)',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '13px', color: 'var(--primary)', fontFamily: 'var(--mono)', fontWeight: 'bold' }}>
                      MÃ YÊU CẦU: {dispute.id} (Đơn hàng: {dispute.orderId})
                    </span>
                    <h3 style={{ margin: '4px 0', fontSize: '15px' }}>{dispute.reason}</h3>
                  </div>
                  <span className="info-tag tag-approved">
                    {dispute.status === 'OPEN' ? '⏳ Chờ Admin duyệt in lại' : '✅ Đã duyệt bảo hành'}
                  </span>
                </div>

                {dispute.evidenceUrl && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Hình ảnh minh chứng thực tế:</div>
                    <img
                      src={dispute.evidenceUrl}
                      alt="Evidence"
                      style={{ maxWidth: '200px', maxHeight: '120px', borderRadius: '6px', border: '1px solid var(--border)' }}
                    />
                  </div>
                )}

                {/* Admin Actions */}
                {userRole === 'ADMIN' && dispute.status === 'OPEN' && (
                  <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '12px' }}>
                    <button
                      className="btn btn-primary"
                      style={{ fontSize: '12px', padding: '8px 16px', gap: '6px' }}
                      onClick={() => onResolveDispute(dispute.id, 0, 'FULL')}
                    >
                      <CheckCircle2 size={16} /> Duyệt In Mới 1 Đổi 1 (Miễn Phí)
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '12px', padding: '8px 16px', gap: '6px', color: '#ff3b30', borderColor: '#ff3b30' }}
                      onClick={() => onResolveDispute(dispute.id, 45000, 'FULL')}
                    >
                      <RotateCcw size={16} /> Hoàn 100% Tiền Đơn Hàng
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
