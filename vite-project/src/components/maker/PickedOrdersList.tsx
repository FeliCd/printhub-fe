import React, { useState } from 'react';
import { Upload, Send } from 'lucide-react';
import type { CustomOrder } from '@/types';

interface PickedOrdersListProps {
  myOrders: CustomOrder[];
  onMakerQuote: (orderId: string, price: number, depositPercentage: number) => void;
  onMakerUploadProof: (orderId: string, img: string, note: string) => void;
  onMakerSendMessage: (orderId: string, text: string) => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  REQUESTED: { label: 'Chờ nhận', color: '#ff9f0a', bg: 'rgba(255, 159, 10, 0.1)', icon: '🟡' },
  PICKED: { label: 'Đã nhận — Đang trao đổi', color: '#007aff', bg: 'rgba(0, 122, 255, 0.1)', icon: '🔵' },
  QUOTED: { label: 'Đã gửi báo giá — Chờ khách duyệt', color: '#ff6b00', bg: 'rgba(255, 107, 0, 0.1)', icon: '🟠' },
  ACCEPTED: { label: 'Khách đã thanh toán — Bắt đầu in', color: 'var(--primary)', bg: 'rgba(57, 255, 20, 0.1)', icon: '🟢' },
  PRINTING: { label: 'Đã tải Proof — Chờ nghiệm thu', color: '#af52de', bg: 'rgba(175, 82, 222, 0.1)', icon: '📸' },
  COMPLETED: { label: 'Hoàn tất', color: '#34c759', bg: 'rgba(52, 199, 89, 0.1)', icon: '✅' },
};

export const PickedOrdersList: React.FC<PickedOrdersListProps> = ({
  myOrders,
  onMakerQuote,
  onMakerUploadProof,
  onMakerSendMessage,
}) => {
  const [chatInputs, setChatInputs] = useState<Record<string, string>>({});
  const [quoteInputs, setQuoteInputs] = useState<Record<string, string>>({});
  const [depositInputs, setDepositInputs] = useState<Record<string, string>>({});

  const handleSendChat = (orderId: string) => {
    const text = chatInputs[orderId]?.trim();
    if (!text) return;
    onMakerSendMessage(orderId, text);
    setChatInputs(prev => ({ ...prev, [orderId]: '' }));
  };

  const handleSubmitQuote = (orderId: string) => {
    const price = parseInt(quoteInputs[orderId]);
    if (!price || price <= 0) return;
    const depPercent = parseInt(depositInputs[orderId]) || 30;
    if (depPercent < 10 || depPercent > 100) {
      alert('Tỷ lệ đặt cọc tối thiểu là 10% và tối đa là 100%');
      return;
    }
    onMakerQuote(orderId, price, depPercent);
    setQuoteInputs(prev => ({ ...prev, [orderId]: '' }));
    setDepositInputs(prev => ({ ...prev, [orderId]: '' }));
  };

  return (
    <div>
      {myOrders.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '48px 32px', color: 'var(--text-muted)' }}>
          Bạn chưa nhận đơn nào. Hãy qua tab "Yêu cầu chờ nhận" để chọn đơn!
        </div>
      ) : (
        myOrders.map((co) => {
          const statusCfg = STATUS_CONFIG[co.status] || STATUS_CONFIG.PICKED;
          return (
            <div key={co.id} className="request-card">
              <div className="request-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontWeight: 'bold', color: 'var(--primary)', fontSize: '15px' }}>
                    {co.id}
                  </span>
                  <span className="status-badge" style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}>
                    {statusCfg.icon} {statusCfg.label}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{co.date}</span>
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
                  
                  {/* Rich parameters */}
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
                    {co.priority && <div>🚨 Ưu tiên: {co.priority}</div>}
                  </div>

                  {co.quotedPrice && (
                    <div style={{ marginTop: '12px', fontSize: '14px', lineHeight: '1.6' }}>
                      <div>
                        Báo giá đã gửi:{' '}
                        <strong style={{ color: 'var(--primary)', fontSize: '18px', fontFamily: 'var(--mono)' }}>
                          {co.quotedPrice.toLocaleString()}đ
                        </strong>
                      </div>
                      {co.depositPercentage && co.depositAmount && (
                        <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                          • Yêu cầu cọc: <strong>{co.depositPercentage}%</strong> (tương đương <strong>{co.depositAmount.toLocaleString()}đ</strong>)
                          {co.paymentType && (
                            <span> | Khách đã chọn: <strong style={{ color: 'var(--primary)' }}>{co.paymentType === 'DEPOSIT' ? 'Thanh toán cọc' : 'Thanh toán 100%'}</strong></span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
 
                {/* Actions */}
                <div className="request-card-actions">
                  {co.status === 'PICKED' && (
                    <div className="quote-input-inline" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>Gửi báo giá & Yêu cầu cọc:</div>
                      
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 2, minWidth: '150px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Tổng báo giá (VND):</span>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Nhập giá (VND)..."
                            value={quoteInputs[co.id] || ''}
                            onChange={(e) => setQuoteInputs(prev => ({ ...prev, [co.id]: e.target.value }))}
                            style={{ width: '100%', marginTop: '4px' }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: '100px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Tỷ lệ cọc (%):</span>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="30"
                            value={depositInputs[co.id] || ''}
                            onChange={(e) => setDepositInputs(prev => ({ ...prev, [co.id]: e.target.value }))}
                            style={{ width: '100%', marginTop: '4px' }}
                          />
                        </div>
                      </div>
 
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--primary)' }}>
                          {quoteInputs[co.id] && (
                            <span>
                              Cọc dự kiến: <strong>{depositInputs[co.id] || '30'}%</strong> (tương đương <strong>{(Math.round(parseInt(quoteInputs[co.id]) * (parseInt(depositInputs[co.id]) || 30) / 100)).toLocaleString()}đ</strong>)
                            </span>
                          )}
                        </div>
                        <button
                          className="btn btn-primary"
                          style={{ padding: '8px 24px', alignSelf: 'flex-end' }}
                          onClick={() => handleSubmitQuote(co.id)}
                        >
                          Gửi báo giá
                        </button>
                      </div>
                    </div>
                  )}

                  {co.status === 'ACCEPTED' && (
                    <button
                      className="btn btn-secondary"
                      style={{ gap: '8px' }}
                      onClick={() =>
                        onMakerUploadProof(
                          co.id,
                          'https://images.unsplash.com/photo-1615840287214-7fe58a8b668f?q=80&w=600&auto=format&fit=cover',
                          'Sản phẩm đã in xong, bề mặt mịn đẹp, kích thước khớp chuẩn. Đóng gói giao hàng.'
                        )
                      }
                    >
                      <Upload size={14} />
                      Tải ảnh nghiệm thu (Proof)
                    </button>
                  )}

                  {co.status === 'PRINTING' && co.printProofImage && (
                    <div style={{ fontSize: '12px', color: '#af52de', fontWeight: '500' }}>
                      📸 Đã tải ảnh Proof — Chờ khách nghiệm thu
                    </div>
                  )}

                  {co.status === 'COMPLETED' && (
                    <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 'bold' }}>
                      ✅ Đã nghiệm thu & Nhận thanh toán
                    </div>
                  )}
                </div>
              </div>

              {/* Chat */}
              {co.messages && co.messages.length > 0 && co.status !== 'COMPLETED' && (
                <div className="chat-box">
                  <div className="chat-box-header">💬 Trao đổi với khách hàng</div>
                  <div className="chat-messages">
                    {co.messages.map((m, idx) => (
                      <div key={idx} className={`chat-msg ${m.sender === 'DragonCreator3D' ? 'chat-msg-maker' : 'chat-msg-buyer'}`}>
                        <span className="chat-sender">{m.sender}:</span> {m.text}
                      </div>
                    ))}
                  </div>
                  {(co.status === 'PICKED' || co.status === 'QUOTED' || co.status === 'ACCEPTED') && (
                    <div className="chat-input-row">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập tin nhắn..."
                        value={chatInputs[co.id] || ''}
                        onChange={(e) => setChatInputs(prev => ({ ...prev, [co.id]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSendChat(co.id); }}
                      />
                      <button className="btn btn-primary" style={{ padding: '8px 12px' }} onClick={() => handleSendChat(co.id)}>
                        <Send size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
