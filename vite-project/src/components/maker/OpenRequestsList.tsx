import React from 'react';
import { CheckCircle } from 'lucide-react';
import type { CustomOrder } from '@/types';

interface OpenRequestsListProps {
  openRequests: CustomOrder[];
  onMakerPickRequest: (orderId: string) => void;
}

export const OpenRequestsList: React.FC<OpenRequestsListProps> = ({
  openRequests,
  onMakerPickRequest,
}) => {
  return (
    <div>
      {openRequests.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '48px 32px', color: 'var(--text-muted)' }}>
          Hiện không có yêu cầu in ấn nào chờ nhận. Vui lòng quay lại sau!
        </div>
      ) : (
        openRequests.map((co) => (
          <div key={co.id} className="request-card">
            <div className="request-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--mono)', fontWeight: 'bold', color: '#ff9f0a', fontSize: '15px' }}>
                  {co.id}
                </span>
                <span className="status-badge" style={{ backgroundColor: 'rgba(255, 159, 10, 0.1)', color: '#ff9f0a' }}>
                  🟡 Chờ nhận
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {co.date}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Khách hàng: <strong>{co.buyerName}</strong>
              </div>
            </div>

            <div className="request-card-body">
              <div className="request-card-details">
                <p style={{ fontSize: '14px', marginBottom: '12px' }}>
                  <strong>Yêu cầu:</strong> {co.requirements}
                </p>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                  background: 'var(--bg-secondary)',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  marginBottom: '12px',
                  border: '1px solid var(--border)'
                }}>
                  <div>📁 Danh mục: <strong>{co.category}</strong></div>
                  <div>🧪 Nhựa in: <strong>{co.material}</strong></div>
                  <div>📦 Số lượng: <strong>{co.quantity}</strong></div>
                  <div>⚙ Độ đặc: <strong>{co.infill || '15%'}</strong></div>
                  <div>⚡ Độ phân giải: <strong>{co.resolution || '0.20mm'}</strong></div>
                  <div>🎨 Màu sắc: <strong>{co.color || 'Đen'}</strong></div>
                  <div>✨ Bề mặt: <strong>{co.finish || 'Để mộc'}</strong></div>
                  <div>📏 Kích thước: <strong>{co.sizeScale || '100%'}</strong></div>
                  {co.priority && (
                    <div style={{ 
                      color: co.priority.includes('Hỏa tốc') ? '#ff9f0a' : 'var(--text-secondary)',
                      fontWeight: co.priority.includes('Hỏa tốc') ? 'bold' : 'normal'
                    }}>
                      🚨 Độ ưu tiên: {co.priority}
                    </div>
                  )}
                </div>

                {co.attachmentUrl && (
                  <div style={{ fontSize: '12px' }}>
                    📎 File đính kèm: <a href={`#${co.attachmentUrl}`} style={{ color: 'var(--primary)' }}>{co.attachmentUrl}</a>
                  </div>
                )}
              </div>
              <div className="request-card-actions" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <button
                  className="btn btn-primary"
                  style={{ gap: '8px' }}
                  onClick={() => onMakerPickRequest(co.id)}
                >
                  <CheckCircle size={16} />
                  Nhận đơn này
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
