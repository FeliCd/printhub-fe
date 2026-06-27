import React, { useState } from 'react';
import type { Dispute } from '@/types';

interface DisputesPageProps {
  disputes: Dispute[];
  userRole: 'BUYER' | 'MAKER' | 'ADMIN';
  onAddDisputeClick: () => void;
  onResolveDispute: (id: string, amount: number, type: 'FULL' | 'PARTIAL') => void;
}

export const DisputesPage: React.FC<DisputesPageProps> = ({
  disputes,
  userRole,
  onAddDisputeClick,
  onResolveDispute,
}) => {
  const [activeTab, setActiveTab] = useState<'OPEN' | 'RESOLVED'>('OPEN');

  const displayedDisputes = disputes.filter(d => 
    activeTab === 'OPEN' ? d.status === 'OPEN' : d.status === 'RESOLVED'
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">Khiếu nại & Tranh chấp đơn hàng</h1>
          <p className="page-subtitle">Giải quyết khiếu nại sản phẩm lỗi, yêu cầu hoàn tiền và đính kèm bằng chứng</p>
        </div>
        {userRole === 'BUYER' && (
          <button className="btn btn-danger" onClick={onAddDisputeClick}>
            Tạo khiếu nại đơn hàng
          </button>
        )}
      </div>

      {/* Disputes Role Banner */}
      <div style={{
        background: 'rgba(255, 59, 48, 0.05)',
        borderLeft: '4px solid #ff3b30',
        padding: '16px 20px',
        borderRadius: '0 8px 8px 0',
        marginBottom: '24px',
        fontSize: '13px',
        lineHeight: '1.5'
      }}>
        {userRole === 'BUYER' ? (
          <div>
            <strong style={{ color: '#ff3b30', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Quy trình khiếu nại cho Khách hàng (Buyer Zone)
            </strong>
            Nếu đơn hàng in 3D bị lỗi (cong vênh, nứt...) hoặc không đúng mô tả, bạn có thể tạo khiếu nại để yêu cầu hoàn trả tiền từ ví (Admin sẽ làm trọng tài giải quyết).
          </div>
        ) : userRole === 'MAKER' ? (
          <div>
            <strong style={{ color: '#ff9f0a', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Quy trình tranh chấp cho Nhà in (Maker Zone)
            </strong>
            Khách hàng đã mở khiếu nại đối với đơn hàng in của bạn. Vui lòng đối thoại ôn hòa, cung cấp thông tin/hình ảnh phản hồi để hỗ trợ Admin đưa ra phán quyết hoàn tiền thỏa đáng.
          </div>
        ) : (
          <div>
            <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Quản trị viên xử lý tranh chấp (Admin Zone)
            </strong>
            Bạn là trọng tài phân xử các tranh chấp. Hãy xem xét bằng chứng hình ảnh và lịch sử trao đổi để phê duyệt hoàn trả một phần hoặc toàn bộ số tiền đơn hàng cho Khách mua.
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="tab-nav" style={{ marginBottom: '24px' }}>
        <button
          className={`tab-btn ${activeTab === 'OPEN' ? 'active' : ''}`}
          onClick={() => setActiveTab('OPEN')}
        >
          Tranh chấp đang xử lý ({disputes.filter(d => d.status === 'OPEN').length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'RESOLVED' ? 'active' : ''}`}
          onClick={() => setActiveTab('RESOLVED')}
        >
          Lịch sử giải quyết ({disputes.filter(d => d.status === 'RESOLVED').length})
        </button>
      </div>

      <div className="glass-card">
        <h2>{activeTab === 'OPEN' ? 'Hồ sơ tranh chấp đang mở' : 'Lịch sử giải quyết tranh chấp'}</h2>
        <div style={{ marginTop: '16px' }}>
          {displayedDisputes.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Không có hồ sơ tranh chấp nào ở trạng thái này.
            </div>
          ) : (
            displayedDisputes.map((disp) => (
              <div
                key={disp.id}
                style={{
                  borderBottom: '1px solid var(--border)',
                  padding: '20px 0',
                  display: 'grid',
                  gridTemplateColumns: '1fr 300px',
                  gap: '24px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontWeight: 'bold', color: '#ff3b30' }}>
                      {disp.id}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Ngày tạo: {disp.date}
                    </span>
                    <span 
                      className="info-tag" 
                      style={{ 
                        fontSize: '10px',
                        backgroundColor: disp.status === 'OPEN' ? 'rgba(255, 59, 48, 0.1)' : 'rgba(57, 255, 20, 0.1)',
                        color: disp.status === 'OPEN' ? '#ff3b30' : 'var(--primary)'
                      }}
                    >
                      {disp.status === 'OPEN' ? 'ĐANG MỞ' : 'ĐÃ GIẢI QUYẾT'}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', marginBottom: '12px' }}>
                    <strong>Đơn hàng:</strong> <code style={{ fontFamily: 'var(--mono)' }}>{disp.orderId}</code>
                  </p>
                  <p style={{ fontSize: '14px', marginBottom: '12px' }}>
                    <strong>Lý do khiếu nại:</strong> {disp.reason}
                  </p>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    Bằng chứng hình ảnh:{' '}
                    <a href={disp.evidenceUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>
                      Xem bằng chứng
                    </a>
                  </div>

                  {/* Message box */}
                  <div
                    style={{
                      background: 'var(--bg-secondary)',
                      padding: '12px',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>
                      Lịch sử đối thoại & Nhật ký xử lý:
                    </div>
                    {disp.messages.map((m, idx) => (
                      <div key={idx} style={{ marginBottom: '4px' }}>
                        <span style={{ 
                          color: m.sender === 'ADMIN' ? 'var(--primary)' : m.sender === 'BUYER' ? '#007aff' : '#ff9f0a', 
                          fontWeight: 'bold' 
                        }}>
                          {m.sender}:
                        </span>{' '}
                        {m.text}
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    borderLeft: '1px solid var(--border)',
                    paddingLeft: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    justifyContent: 'center',
                  }}
                >
                  {disp.status === 'OPEN' ? (
                    userRole === 'ADMIN' ? (
                      <>
                        <button className="btn btn-primary" onClick={() => onResolveDispute(disp.id, 450000, 'FULL')}>
                          Phê duyệt hoàn 100% (VND 450k)
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => onResolveDispute(disp.id, 225000, 'PARTIAL')}
                        >
                          Hoàn một nửa (VND 225k)
                        </button>
                      </>
                    ) : userRole === 'MAKER' ? (
                      <div style={{ color: '#ff9f0a', fontWeight: '500', fontSize: '13px', textAlign: 'center', lineHeight: '1.4' }}>
                        ⚠️ Bị khiếu nại! Vui lòng đối thoại với Khách để làm rõ.
                      </div>
                    ) : (
                      <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '13px' }}>
                        Chờ Admin kiểm duyệt tranh chấp
                      </div>
                    )
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '14px', marginBottom: '6px' }}>
                        ✓ ĐÃ KHÉP LẠI
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                        Số tiền hoàn: <strong>{disp.refundAmount?.toLocaleString()}đ</strong> ({disp.refundType === 'FULL' ? 'Hoàn 100%' : 'Hoàn một phần'})
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
