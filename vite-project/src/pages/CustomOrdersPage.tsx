import React, { useState } from 'react';
import { Plus, Send, AlertTriangle } from 'lucide-react';
import type { CustomOrder } from '@/types';
import { PayOSMockModal } from '@/components/shared/PayOSMockModal';

interface CustomOrdersPageProps {
  customOrders: CustomOrder[];
  onAddRequestClick: () => void;
  onBuyerAcceptQuote: (orderId: string, paymentType: 'DEPOSIT' | 'FULL') => void;
  onBuyerCompleteCustom: (orderId: string) => void;
  onBuyerSendMessage: (orderId: string, text: string) => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  REQUESTED: { label: 'Đã đăng — Chờ Maker nhận', color: '#ff9f0a', bg: 'rgba(255, 159, 10, 0.1)', icon: '🟡' },
  PICKED: { label: 'Maker đã nhận — Đang trao đổi', color: '#007aff', bg: 'rgba(0, 122, 255, 0.1)', icon: '🔵' },
  QUOTED: { label: 'Đã nhận báo giá — Chờ bạn duyệt', color: '#ff6b00', bg: 'rgba(255, 107, 0, 0.1)', icon: '🟠' },
  ACCEPTED: { label: 'Đã thanh toán — Đang in', color: 'var(--primary)', bg: 'rgba(57, 255, 20, 0.1)', icon: '🟢' },
  PRINTING: { label: 'Maker tải ảnh Proof — Chờ nghiệm thu', color: '#af52de', bg: 'rgba(175, 82, 222, 0.1)', icon: '📸' },
  COMPLETED: { label: 'Hoàn tất', color: '#34c759', bg: 'rgba(52, 199, 89, 0.1)', icon: '✅' },
  CANCELLED: { label: 'Đã hủy', color: '#ff3b30', bg: 'rgba(255, 59, 48, 0.1)', icon: '❌' },
};

const FLOW_STEPS = [
  { step: 1, label: 'Tạo yêu cầu', desc: 'Mô tả chi tiết sản phẩm cần in' },
  { step: 2, label: 'Maker nhận đơn', desc: 'Nhà in xem xét và nhận yêu cầu' },
  { step: 3, label: 'Nhận báo giá', desc: 'Maker gửi giá, bạn duyệt & thanh toán' },
  { step: 4, label: 'In & Nghiệm thu', desc: 'Maker in, tải ảnh proof, bạn nghiệm thu' },
];

export const CustomOrdersPage: React.FC<CustomOrdersPageProps> = ({
  customOrders,
  onAddRequestClick,
  onBuyerAcceptQuote,
  onBuyerCompleteCustom,
  onBuyerSendMessage,
}) => {
  const [chatInputs, setChatInputs] = useState<Record<string, string>>({});

  // Custom Payment States
  const [selectedQuoteOrder, setSelectedQuoteOrder] = useState<string>('');
  const [showPayOS, setShowPayOS] = useState<boolean>(false);
  const [payOSAmount, setPayOSAmount] = useState<number>(0);
  const [paymentTypeToProcess, setPaymentTypeToProcess] = useState<'DEPOSIT' | 'FULL' | null>(null);
  const [orderIdToProcess, setOrderIdToProcess] = useState<string>('');
  const [showConfirmWarning, setShowConfirmWarning] = useState<boolean>(false);

  const handleSendChat = (orderId: string) => {
    const text = chatInputs[orderId]?.trim();
    if (!text) return;
    onBuyerSendMessage(orderId, text);
    setChatInputs(prev => ({ ...prev, [orderId]: '' }));
  };

  // Filter: only show orders belonging to the current buyer (buyerId 201)
  const myOrders = customOrders.filter(o => o.buyerId === 201);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">Đặt in 3D theo yêu cầu</h1>
          <p className="page-subtitle">Tạo yêu cầu in ấn riêng và theo dõi tiến trình từ Nhà in</p>
        </div>
        <button className="btn btn-primary" onClick={onAddRequestClick}>
          <Plus size={16} /> Tạo yêu cầu mới
        </button>
      </div>

      {/* Flow Infographic */}
      <div className="flow-steps-container">
        {FLOW_STEPS.map((fs, idx) => (
          <React.Fragment key={fs.step}>
            <div className="flow-step-item">
              <div className="flow-step-number">{fs.step}</div>
              <div className="flow-step-label">{fs.label}</div>
              <div className="flow-step-desc">{fs.desc}</div>
            </div>
            {idx < FLOW_STEPS.length - 1 && (
              <div className="flow-step-arrow">{"→"}</div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Orders List */}
      <div className="glass-card">
        <h2>Yêu cầu in ấn của bạn ({myOrders.length})</h2>
        <div style={{ marginTop: '16px' }}>
          {myOrders.length === 0 ? (
            <div style={{ padding: '48px 32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Bạn chưa có yêu cầu in ấn nào. Bấm "Tạo yêu cầu mới" để bắt đầu!
            </div>
          ) : (
            myOrders.map((co) => {
              const statusCfg = STATUS_CONFIG[co.status] || STATUS_CONFIG.REQUESTED;
              return (
                <div key={co.id} className="request-card">
                  {/* Header */}
                  <div className="request-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontWeight: 'bold', color: 'var(--primary)', fontSize: '15px' }}>
                        {co.id}
                      </span>
                      <span className="status-badge" style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}>
                        {statusCfg.icon} {statusCfg.label}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {co.date}
                      </span>
                    </div>
                    {co.makerName && (
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Nhà in: <strong style={{ color: 'var(--primary)' }}>{co.makerName}</strong>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="request-card-body">
                    <div className="request-card-details">
                      <p style={{ fontSize: '14px', marginBottom: '12px' }}>
                        <strong>Mô tả:</strong> {co.requirements}
                      </p>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {co.category && (
                          <span>📁 Danh mục: <strong>{co.category}</strong></span>
                        )}
                        {co.material && (
                          <span>🧪 Vật liệu: <strong>{co.material}</strong></span>
                        )}
                        {co.quantity && (
                          <span>📦 Số lượng: <strong>{co.quantity}</strong></span>
                        )}
                        {co.attachmentUrl && (
                          <span>📎 File: <a href={`#${co.attachmentUrl}`} style={{ color: 'var(--primary)' }}>{co.attachmentUrl}</a></span>
                        )}
                      </div>
                    </div>

                    {/* Quote & Actions */}
                    <div className="request-card-actions">
                      {co.quotedPrice ? (
                        <div style={{ fontSize: '14px', marginBottom: '8px', lineHeight: '1.5' }}>
                          <div>
                            Báo giá:{' '}
                            <strong style={{ color: 'var(--primary)', fontSize: '20px', fontFamily: 'var(--mono)' }}>
                              {co.quotedPrice.toLocaleString()}đ
                            </strong>
                          </div>
                          {co.depositPercentage && co.depositAmount && (
                            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                              • Yêu cầu cọc: <strong>{co.depositPercentage}%</strong> (tương đương <strong>{co.depositAmount.toLocaleString()}đ</strong>)
                              {co.paymentType && (
                                <span> | Đã chọn: <strong style={{ color: 'var(--primary)' }}>{co.paymentType === 'DEPOSIT' ? 'Thanh toán cọc' : 'Thanh toán 100%'}</strong></span>
                              )}
                            </div>
                          )}
                        </div>
                      ) : co.status === 'REQUESTED' ? (
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Đang chờ Nhà in nhận đơn...
                        </div>
                      ) : co.status === 'PICKED' ? (
                        <div style={{ fontSize: '12px', color: '#007aff', fontWeight: '500' }}>
                          Maker đang xem xét và sẽ gửi báo giá sớm
                        </div>
                      ) : null}

                      {co.status === 'QUOTED' && (
                        selectedQuoteOrder !== co.id ? (
                          <button className="btn btn-primary" onClick={() => setSelectedQuoteOrder(co.id)}>
                            Chấp nhận báo giá
                          </button>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Chọn hình thức thanh toán bắt buộc cọc trước:</div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                className="btn btn-primary"
                                style={{ padding: '6px 12px', fontSize: '11px', backgroundColor: 'var(--primary)', color: '#000', borderColor: 'var(--primary)' }}
                                onClick={() => {
                                  setOrderIdToProcess(co.id);
                                  setPaymentTypeToProcess('DEPOSIT');
                                  setPayOSAmount(co.depositAmount || 0);
                                  setShowConfirmWarning(true);
                                }}
                              >
                                Cọc trước {co.depositPercentage}% ({co.depositAmount?.toLocaleString()}đ)
                              </button>
                              <button
                                className="btn btn-secondary"
                                style={{ padding: '6px 12px', fontSize: '11px' }}
                                onClick={() => {
                                  setOrderIdToProcess(co.id);
                                  setPaymentTypeToProcess('FULL');
                                  setPayOSAmount(co.quotedPrice || 0);
                                  setShowConfirmWarning(true);
                                }}
                              >
                                Thanh toán 100% ({co.quotedPrice?.toLocaleString()}đ)
                              </button>
                              <button
                                className="btn"
                                style={{ padding: '6px 10px', fontSize: '11px', color: '#ff3b30', background: 'none', border: 'none' }}
                                onClick={() => setSelectedQuoteOrder('')}
                              >
                                Hủy
                              </button>
                            </div>
                          </div>
                        )
                      )}

                      {/* Print Proof */}
                      {co.printProofImage && (
                        <div style={{ marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                          <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '8px' }}>
                            📸 Bằng chứng in ấn (Print Proof):
                          </div>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <img
                              src={co.printProofImage}
                              alt="Print Proof"
                              style={{ width: '100px', height: '75px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }}
                            />
                            <div>
                              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>
                                <strong>Ghi chú:</strong> {co.printProofNote}
                              </p>
                              {co.status === 'PRINTING' && (
                                <button
                                  className="btn btn-primary"
                                  style={{ padding: '6px 14px', fontSize: '12px' }}
                                  onClick={() => onBuyerCompleteCustom(co.id)}
                                >
                                  ✅ Nghiệm thu & Hoàn tất
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Chat / Messages (shown for PICKED, QUOTED, ACCEPTED, PRINTING) */}
                  {co.messages && co.messages.length > 0 && co.status !== 'REQUESTED' && co.status !== 'COMPLETED' && (
                    <div className="chat-box">
                      <div className="chat-box-header">💬 Trao đổi với Nhà in</div>
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
      </div>

      {/* PayOS Mock Modal */}
      {showPayOS && (
        <PayOSMockModal
          amount={payOSAmount}
          onSuccess={() => {
            setShowPayOS(false);
            if (onBuyerAcceptQuote && orderIdToProcess && paymentTypeToProcess) {
              onBuyerAcceptQuote(orderIdToProcess, paymentTypeToProcess);
            }
            setSelectedQuoteOrder('');
            setPaymentTypeToProcess(null);
            setOrderIdToProcess('');
          }}
          onCancel={() => {
            setShowPayOS(false);
            setPaymentTypeToProcess(null);
            setOrderIdToProcess('');
          }}
        />
      )}

      {/* Warning confirmation modal */}
      {showConfirmWarning && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '400px', padding: '32px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: '#ff9f0a' }}>
              <AlertTriangle size={48} />
            </div>
            <h3 style={{ marginBottom: '12px', color: '#ff9f0a' }}>Xác nhận thanh toán đơn in Custom</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
              Bạn đang thực hiện thanh toán **{paymentTypeToProcess === 'DEPOSIT' ? 'Tiền cọc' : '100% giá trị'}** đơn hàng in theo yêu cầu. <br/>
              Số tiền giao dịch: <strong style={{ color: 'var(--primary)', fontSize: '16px', fontFamily: 'var(--mono)' }}>{payOSAmount.toLocaleString()}đ</strong>.<br/><br/>
              *Lưu ý: Đối với đơn in Custom, sau khi chấp nhận thanh toán, Maker sẽ bắt đầu thực hiện in. Số tiền cọc sẽ không được hoàn trả nếu bạn hủy đơn vô lý.*
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1 }} 
                onClick={() => {
                  setShowConfirmWarning(false);
                  setPaymentTypeToProcess(null);
                  setOrderIdToProcess('');
                }}
              >
                Hủy bỏ
              </button>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, backgroundColor: '#ff9f0a', borderColor: '#ff9f0a', color: '#000' }} 
                onClick={() => {
                  setShowConfirmWarning(false);
                  setShowPayOS(true);
                }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
