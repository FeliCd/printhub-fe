import React, { useState } from 'react';
import type { Dispute } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { Image, ThumbsUp, ThumbsDown, Check, X, FileText, Send } from 'lucide-react';

interface DisputesPageProps {
  disputes: Dispute[];
  userRole: 'BUYER' | 'MAKER' | 'ADMIN';
  onAddDisputeClick: () => void;
  onResolveDispute: (id: string, amount: number, type: 'FULL' | 'PARTIAL' | 'NONE') => void;
}

export const DisputesPage: React.FC<DisputesPageProps> = ({
  disputes,
  userRole,
  onAddDisputeClick,
  onResolveDispute,
}) => {
  const { orders, customOrders, handleMakerSubmitEvidence } = useApp();
  const [activeTab, setActiveTab] = useState<'OPEN' | 'RESOLVED'>('OPEN');

  const displayedDisputes = disputes.filter(d => 
    activeTab === 'OPEN' ? d.status === 'OPEN' : d.status === 'RESOLVED'
  );

  // Helper to find the actual amount of the order associated with the dispute
  const getOrderAmount = (orderId: string): number => {
    // Check normal orders
    const normalOrder = orders.find(o => o.id === orderId);
    if (normalOrder) return normalOrder.totalAmount;
    
    // Check custom orders
    const customOrder = customOrders.find(o => o.id === orderId);
    if (customOrder) return customOrder.quotedPrice || 0;
    
    return 450000; // default fallback amount
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">Khiếu nại & Tranh chấp đơn hàng</h1>
          <p className="page-subtitle">Giải quyết khiếu nại sản phẩm lỗi, yêu cầu hoàn tiền và đính kèm bằng chứng đối chứng</p>
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
            Khách hàng đã mở khiếu nại đối với đơn hàng in của bạn. Vui lòng đối thoại ôn hòa và cung cấp hình ảnh/bằng chứng đối chứng bên dưới để bảo vệ quyền lợi của mình trước Admin.
          </div>
        ) : (
          <div>
            <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Quản trị viên xử lý tranh chấp (Admin Zone)
            </strong>
            Bạn là trọng tài phân xử các tranh chấp. Hãy xem xét bằng chứng hình ảnh được gắn nhãn cụ thể của cả 2 bên (Khách hàng vs Nhà in) và đưa ra phán quyết hoàn tiền thỏa đáng hoặc từ chối khiếu nại.
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
        <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>
          {activeTab === 'OPEN' ? 'Hồ sơ tranh chấp đang mở' : 'Lịch sử giải quyết tranh chấp'}
        </h2>
        
        <div style={{ marginTop: '16px' }}>
          {displayedDisputes.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Không có hồ sơ tranh chấp nào ở trạng thái này.
            </div>
          ) : (
            displayedDisputes.map((disp) => {
              const orderAmount = getOrderAmount(disp.orderId);
              const halfAmount = Math.round(orderAmount / 2);
              
              return (
                <div
                  key={disp.id}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    padding: '24px 0',
                    display: 'grid',
                    gridTemplateColumns: '1fr 320px',
                    gap: '32px',
                  }}
                >
                  {/* Left Column: Dispute Info & Evidence Images */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontWeight: 'bold', color: '#ff3b30', fontSize: '16px' }}>
                        {disp.id}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Ngày khiếu nại: {disp.date}
                      </span>
                      <span 
                        className="info-tag" 
                        style={{ 
                          fontSize: '10px',
                          backgroundColor: disp.status === 'OPEN' ? 'rgba(255, 59, 48, 0.1)' : 'rgba(57, 255, 20, 0.1)',
                          color: disp.status === 'OPEN' ? '#ff3b30' : 'var(--primary)',
                          borderRadius: '12px',
                          padding: '2px 8px'
                        }}
                      >
                        {disp.status === 'OPEN' ? 'ĐANG MỞ' : 'ĐẠ GIẢI QUYẾT'}
                      </span>
                    </div>

                    <p style={{ fontSize: '14px', marginBottom: '8px' }}>
                      <strong>Mã đơn hàng:</strong> <code style={{ fontFamily: 'var(--mono)', color: 'var(--primary)' }}>{disp.orderId}</code> (Giá trị đơn: <strong>{orderAmount.toLocaleString()}đ</strong>)
                    </p>
                    <p style={{ fontSize: '14px', marginBottom: '16px', lineHeight: '1.4' }}>
                      <strong>Lý do khiếu nại:</strong> {disp.reason}
                    </p>

                    {/* Double-sided Evidence Display */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '16px', 
                      marginBottom: '20px',
                      flexWrap: 'wrap'
                    }}>
                      {/* Buyer Evidence */}
                      <div style={{ 
                        flex: '1 1 240px', 
                        backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                        padding: '12px', 
                        borderRadius: '10px', 
                        border: '1px solid var(--border)' 
                      }}>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#007aff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Image size={14} /> Bằng chứng từ Khách mua (Buyer)
                        </div>
                        {disp.evidenceUrl ? (
                          <div>
                            <img
                              src={disp.evidenceUrl}
                              alt="Buyer Dispute Evidence"
                              style={{ 
                                width: '100%', 
                                height: '140px', 
                                objectFit: 'cover', 
                                borderRadius: '6px', 
                                cursor: 'zoom-in',
                                border: '1px solid rgba(255,255,255,0.1)' 
                              }}
                              onClick={() => window.open(disp.evidenceUrl, '_blank')}
                            />
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'center' }}>
                              (Click để xem ảnh kích thước đầy đủ)
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '140px', color: 'var(--text-muted)', fontSize: '12px', fontStyle: 'italic' }}>
                            Không đính kèm hình ảnh bằng chứng
                          </div>
                        )}
                      </div>

                      {/* Maker Evidence */}
                      <div style={{ 
                        flex: '1 1 240px', 
                        backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                        padding: '12px', 
                        borderRadius: '10px', 
                        border: '1px solid var(--border)' 
                      }}>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#ff9f0a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Image size={14} /> Bằng chứng từ Nhà in (Maker)
                        </div>
                        {disp.makerEvidenceUrl ? (
                          <div>
                            <img
                              src={disp.makerEvidenceUrl}
                              alt="Maker Dispute Evidence"
                              style={{ 
                                width: '100%', 
                                height: '140px', 
                                objectFit: 'cover', 
                                borderRadius: '6px', 
                                cursor: 'zoom-in',
                                border: '1px solid rgba(255,255,255,0.1)' 
                              }}
                              onClick={() => window.open(disp.makerEvidenceUrl, '_blank')}
                            />
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'center' }}>
                              (Click để xem ảnh kích thước đầy đủ)
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '140px', color: 'var(--text-muted)', fontSize: '12px', fontStyle: 'italic', padding: '10px', textAlign: 'center' }}>
                            <span>Chưa cung cấp hình ảnh đối chứng</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dialogue History */}
                    <div
                      style={{
                        background: 'var(--bg-secondary)',
                        padding: '14px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <div style={{ fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FileText size={14} style={{ color: 'var(--primary)' }} />
                        Lịch sử đối thoại & Nhật ký xử lý:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {disp.messages.map((m, idx) => (
                          <div key={idx} style={{ paddingBottom: '4px', borderBottom: idx < disp.messages.length - 1 ? '1px solid rgba(255,255,255,0.02)' : 'none' }}>
                            <span style={{ 
                              color: m.sender === 'ADMIN' ? 'var(--primary)' : m.sender === 'BUYER' ? '#007aff' : '#ff9f0a', 
                              fontWeight: 'bold',
                              marginRight: '6px'
                            }}>
                              {m.sender}:
                            </span>
                            <span style={{ color: '#fff' }}>{m.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions Block */}
                  <div
                    style={{
                      borderLeft: '1px solid var(--border)',
                      paddingLeft: '32px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      justifyContent: 'center',
                    }}
                  >
                    {disp.status === 'OPEN' ? (
                      userRole === 'ADMIN' ? (
                        <>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                            Hành động giải quyết khiếu nại
                          </div>
                          
                          {/* FULL REFUND */}
                          <button 
                            className="btn btn-primary" 
                            onClick={() => {
                              if (confirm(`Xác nhận phán quyết HOÀN TIỀN 100% (${orderAmount.toLocaleString()}đ) cho Người mua?`)) {
                                onResolveDispute(disp.id, orderAmount, 'FULL');
                              }
                            }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px' }}
                          >
                            <ThumbsUp size={14} /> Hoàn tiền 100% ({orderAmount.toLocaleString()}đ)
                          </button>

                          {/* PARTIAL REFUND */}
                          <button
                            className="btn btn-secondary"
                            onClick={() => {
                              if (confirm(`Xác nhận phán quyết HOÀN TIỀN 50% (${halfAmount.toLocaleString()}đ) cho Người mua?`)) {
                                onResolveDispute(disp.id, halfAmount, 'PARTIAL');
                              }
                            }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderColor: '#ff9f0a', color: '#ff9f0a', backgroundColor: 'rgba(255,159,10,0.03)' }}
                          >
                            <ThumbsUp size={14} /> Hoàn tiền 50% ({halfAmount.toLocaleString()}đ)
                          </button>

                          {/* NO REFUND (MAKER CORRECT) */}
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              if (confirm(`Xác nhận phán quyết BÁC BỎ khiếu nại (Không hoàn tiền, Maker làm đúng)?`)) {
                                onResolveDispute(disp.id, 0, 'NONE');
                              }
                            }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', backgroundColor: 'rgba(255,59,48,0.15)', borderColor: '#ff3b30', color: '#ff3b30' }}
                          >
                            <ThumbsDown size={14} /> Bác bỏ (Không hoàn tiền)
                          </button>
                        </>
                      ) : userRole === 'MAKER' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div style={{ color: '#ff9f0a', fontWeight: 'bold', fontSize: '13px', textAlign: 'center', lineHeight: '1.4' }}>
                            ⚠️ BỊ KHIẾU NẠI ĐƠN HÀNG!
                          </div>
                          
                          {/* Maker evidence upload form */}
                          {!disp.makerEvidenceUrl ? (
                            <div style={{ backgroundColor: 'rgba(255,159,10,0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,159,10,0.2)' }}>
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#ff9f0a', marginBottom: '6px', textTransform: 'uppercase' }}>
                                Cung cấp bằng chứng đối chứng
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Dán link ảnh bằng chứng sản phẩm in đúng chuẩn vào đây..."
                                id={`maker-ev-input-${disp.id}`}
                                style={{ fontSize: '11px', padding: '6px 10px', marginBottom: '8px' }}
                              />
                              <button
                                className="btn btn-secondary"
                                style={{ width: '100%', fontSize: '11px', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', borderColor: '#ff9f0a', color: '#ff9f0a' }}
                                onClick={() => {
                                  const input = document.getElementById(`maker-ev-input-${disp.id}`) as HTMLInputElement;
                                  if (input && input.value.trim()) {
                                    handleMakerSubmitEvidence(disp.id, input.value.trim());
                                  } else {
                                    alert('Vui lòng điền link ảnh bằng chứng hợp lệ!');
                                  }
                                }}
                              >
                                <Send size={10} /> Gửi bằng chứng đối chứng
                              </button>
                            </div>
                          ) : (
                            <div style={{ color: 'var(--primary)', fontSize: '12px', fontStyle: 'italic', textAlign: 'center' }}>
                              ✓ Đã tải lên bằng chứng đối chứng. Đang đợi Admin phê duyệt.
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '13px', textAlign: 'center' }}>
                          Đang đợi Admin kiểm duyệt tranh chấp
                        </div>
                      )
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          color: disp.refundType === 'NONE' ? '#ff3b30' : 'var(--primary)', 
                          fontWeight: 'bold', 
                          fontSize: '14px', 
                          marginBottom: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}>
                          {disp.refundType === 'NONE' ? <X size={16} /> : <Check size={16} />}
                          {disp.refundType === 'NONE' ? 'BÁC BỎ KHIẾU NẠI' : 'ĐÃ HOÀN TIỀN'}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                          {disp.refundType === 'NONE' ? (
                            'Quyết định: Không hoàn tiền'
                          ) : (
                            <>
                              Hoàn: <strong>{disp.refundAmount?.toLocaleString()}đ</strong> ({disp.refundType === 'FULL' ? '100%' : '50%'})
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
