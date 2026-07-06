import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, Upload, Send, ShoppingBag, Sparkles } from 'lucide-react';
import type { Order, CustomOrder } from '@/types';

interface MakerUnifiedOrdersListProps {
  orders: Order[];
  customOrders: CustomOrder[];
  onMakerQuote: (orderId: string, price: number, depositPercentage: number) => void;
  onMakerUploadProof: (orderId: string, img: string, note: string) => void;
  onMakerSendMessage: (orderId: string, text: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status'], trackingNumber?: string) => void;
}

const CATALOG_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  PENDING: { label: 'Chờ xử lý', color: '#ff9f0a', bg: 'rgba(255, 159, 10, 0.1)', icon: '🟡' },
  PROCESSING: { label: 'Đang in / Chuẩn bị', color: '#007aff', bg: 'rgba(0, 122, 255, 0.1)', icon: '🔵' },
  SHIPPED: { label: 'Đang giao hàng', color: '#af52de', bg: 'rgba(175, 82, 222, 0.1)', icon: '🟣' },
  COMPLETED: { label: 'Hoàn thành', color: '#34c759', bg: 'rgba(52, 199, 89, 0.1)', icon: '✅' },
};

const CATALOG_STEPS = [
  { id: 'PENDING', label: 'Chờ xử lý', icon: <Clock size={14} /> },
  { id: 'PROCESSING', label: 'Đang chuẩn bị', icon: <Package size={14} /> },
  { id: 'SHIPPED', label: 'Đang giao hàng', icon: <Truck size={14} /> },
  { id: 'COMPLETED', label: 'Hoàn thành', icon: <CheckCircle size={14} /> },
];

const CUSTOM_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  REQUESTED: { label: 'Chờ nhận', color: '#ff9f0a', bg: 'rgba(255, 159, 10, 0.1)', icon: '🟡' },
  PICKED: { label: 'Đã nhận — Đang trao đổi', color: '#007aff', bg: 'rgba(0, 122, 255, 0.1)', icon: '🔵' },
  QUOTED: { label: 'Đã gửi báo giá — Chờ khách duyệt', color: '#ff6b00', bg: 'rgba(255, 107, 0, 0.1)', icon: '🟠' },
  ACCEPTED: { label: 'Khách đã thanh toán — Bắt đầu in', color: 'var(--primary)', bg: 'rgba(57, 255, 20, 0.1)', icon: '🟢' },
  PRINTING: { label: 'Đã tải Proof — Chờ nghiệm thu', color: '#af52de', bg: 'rgba(175, 82, 222, 0.1)', icon: '📸' },
  COMPLETED: { label: 'Hoàn tất', color: '#34c759', bg: 'rgba(52, 199, 89, 0.1)', icon: '✅' },
};

export const MakerUnifiedOrdersList: React.FC<MakerUnifiedOrdersListProps> = ({
  orders,
  customOrders,
  onMakerQuote,
  onMakerUploadProof,
  onMakerSendMessage,
  onUpdateOrderStatus,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'CATALOG' | 'CUSTOM'>('ALL');
  const [chatInputs, setChatInputs] = useState<Record<string, string>>({});
  const [quoteInputs, setQuoteInputs] = useState<Record<string, string>>({});
  const [depositInputs, setDepositInputs] = useState<Record<string, string>>({});
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  // Filter orders for Maker (makerId 101)
  const myCustomOrders = customOrders.filter(o => o.makerId === 101 && o.status !== 'REQUESTED');
  const physicalCatalogOrders = orders.filter(o => o.items.some(item => item.product.type === 'PHYSICAL'));

  // Combine lists
  const unifiedList: Array<
    | { type: 'CATALOG'; id: string; date: string; data: Order }
    | { type: 'CUSTOM'; id: string; date: string; data: CustomOrder }
  > = [];

  if (filter === 'ALL' || filter === 'CATALOG') {
    physicalCatalogOrders.forEach(o => {
      unifiedList.push({ type: 'CATALOG', id: o.id, date: o.date, data: o });
    });
  }

  if (filter === 'ALL' || filter === 'CUSTOM') {
    myCustomOrders.forEach(co => {
      unifiedList.push({ type: 'CUSTOM', id: co.id, date: co.date, data: co });
    });
  }

  // Sort unified list: newest date first, then by id desc
  unifiedList.sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    if (dateCompare !== 0) return dateCompare;
    return b.id.localeCompare(a.id);
  });

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

  const handleShip = (orderId: string) => {
    const tracking = trackingInputs[orderId];
    if (!tracking || tracking.trim() === '') {
      alert('Vui lòng nhập Mã vận đơn trước khi Bàn giao vận chuyển!');
      return;
    }
    onUpdateOrderStatus(orderId, 'SHIPPED', tracking.trim());
  };

  return (
    <div>
      {/* Mini Filter tabs */}
      <div className="tab-nav" style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}>
        <button
          className={`tab-btn ${filter === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilter('ALL')}
          style={{ padding: '6px 12px', fontSize: '12px' }}
        >
          Tất cả yêu cầu thực hiện ({physicalCatalogOrders.length + myCustomOrders.length})
        </button>
        <button
          className={`tab-btn ${filter === 'CATALOG' ? 'active' : ''}`}
          onClick={() => setFilter('CATALOG')}
          style={{ padding: '6px 12px', fontSize: '12px' }}
        >
          Đơn Catalog ({physicalCatalogOrders.length})
        </button>
        <button
          className={`tab-btn ${filter === 'CUSTOM' ? 'active' : ''}`}
          onClick={() => setFilter('CUSTOM')}
          style={{ padding: '6px 12px', fontSize: '12px' }}
        >
          Đơn in Custom ({myCustomOrders.length})
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {unifiedList.length === 0 ? (
          <div className="glass-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Không tìm thấy đơn hàng nào cần thực hiện.
          </div>
        ) : (
          unifiedList.map(item => {
            if (item.type === 'CATALOG') {
              const o = item.data as Order;
              const st = CATALOG_STATUS_CONFIG[o.status] || { label: o.status, color: 'var(--text-secondary)', bg: 'var(--border)', icon: '📦' };
              const currentStepIndex = CATALOG_STEPS.findIndex(s => s.id === o.status);

              return (
                <div
                  key={o.id}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '20px',
                    backgroundColor: 'var(--bg-secondary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                  }}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontWeight: 'bold', fontSize: '15px', color: 'var(--primary)' }}>{o.id}</span>
                      <span className="status-badge" style={{ backgroundColor: 'rgba(57, 255, 20, 0.1)', color: 'var(--primary)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShoppingBag size={12} /> Đơn Catalog
                      </span>
                      <span className="status-badge" style={{ backgroundColor: st.bg, color: st.color, fontSize: '11px' }}>
                        {st.icon} {st.label}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{o.date}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Tổng giá trị: <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>{o.totalAmount.toLocaleString()}đ</strong>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', padding: '0 20px', margin: '4px 0' }}>
                    <div style={{ position: 'absolute', top: '16px', left: '40px', right: '40px', height: '2px', backgroundColor: 'var(--border)', zIndex: 0 }} />
                    {currentStepIndex > 0 && (
                      <div style={{ 
                        position: 'absolute', 
                        top: '16px', 
                        left: '40px', 
                        width: `calc(${(currentStepIndex / (CATALOG_STEPS.length - 1)) * 100}% - 80px)`, 
                        height: '2px', 
                        backgroundColor: 'var(--primary)', 
                        zIndex: 1,
                        transition: 'width 0.3s ease'
                      }} />
                    )}

                    {CATALOG_STEPS.map((step, idx) => {
                      const isActive = idx <= currentStepIndex;
                      return (
                        <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, width: '70px' }}>
                          <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%', 
                            backgroundColor: isActive ? 'var(--primary)' : 'var(--surface)',
                            color: isActive ? '#fff' : 'var(--text-muted)',
                            border: `2px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            marginBottom: '4px'
                          }}>
                            {step.icon}
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: isActive ? 'bold' : 'normal', color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', textAlign: 'center' }}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Details Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 250px', gap: '24px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.6' }}>
                        Người nhận: <strong>{o.shippingAddress?.name}</strong> | SĐT: {o.shippingAddress?.phone} <br />
                        Địa chỉ: {o.shippingAddress?.addressLine}, {o.shippingAddress?.province}
                        {o.trackingNumber && (
                          <div style={{ marginTop: '8px', color: 'var(--primary)', fontWeight: 'bold' }}>
                            Mã vận đơn: {o.trackingNumber}
                          </div>
                        )}
                      </div>

                      {/* Items */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {o.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
                            <span>• <strong>{item.product.name}</strong> (x{item.quantity})</span>
                            {item.selectedColor && (
                              <span style={{ color: 'var(--text-muted)' }}>
                                [Màu: {item.selectedColor} | Nhựa: {item.selectedMaterial}]
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{
                      borderLeft: '1px solid var(--border)',
                      paddingLeft: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      justifyContent: 'center'
                    }}>
                      {o.status === 'PENDING' && (
                        <button 
                          className="btn btn-primary" 
                          style={{ fontSize: '12px', padding: '8px' }}
                          onClick={() => onUpdateOrderStatus(o.id, 'PROCESSING')}
                        >
                          Chấp nhận & Bắt đầu in
                        </button>
                      )}
                      
                      {o.status === 'PROCESSING' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Nhập mã vận đơn..."
                            style={{ fontSize: '12px', padding: '6px' }}
                            value={trackingInputs[o.id] || ''}
                            onChange={e => setTrackingInputs(prev => ({ ...prev, [o.id]: e.target.value }))}
                          />
                          <button 
                            className="btn btn-secondary" 
                            style={{ fontSize: '12px', padding: '8px' }}
                            onClick={() => handleShip(o.id)}
                          >
                            Bàn giao Vận chuyển
                          </button>
                        </div>
                      )}

                      {o.status === 'SHIPPED' && (
                        <button 
                          className="btn btn-primary" 
                          style={{ fontSize: '12px', padding: '8px', backgroundColor: 'var(--primary)', color: 'var(--bg-primary)' }}
                          onClick={() => onUpdateOrderStatus(o.id, 'COMPLETED')}
                        >
                          Hoàn tất giao hàng
                        </button>
                      )}

                      {o.status === 'COMPLETED' && (
                        <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '13px', textAlign: 'center' }}>
                          ✓ Đã thanh toán & Hoàn tất
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            } else {
              // Custom Order
              const co = item.data as CustomOrder;
              const statusCfg = CUSTOM_STATUS_CONFIG[co.status] || CUSTOM_STATUS_CONFIG.PICKED;

              return (
                <div key={co.id} className="request-card" style={{ margin: '0' }}>
                  <div className="request-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontWeight: 'bold', color: 'var(--primary)', fontSize: '15px' }}>{co.id}</span>
                      <span className="status-badge" style={{ backgroundColor: 'rgba(175, 82, 222, 0.1)', color: '#af52de', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Sparkles size={12} /> Đơn Custom
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
                        <strong>Yêu cầu in:</strong> {co.requirements}
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
                        <div>📁 Danh mục: <strong>{co.category || 'Cơ khí'}</strong></div>
                        <div>🧪 Nhựa in: <strong>{co.material || 'PLA'}</strong></div>
                        <div>📦 Số lượng: <strong>{co.quantity || 1}</strong></div>
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

                  {co.messages && co.messages.length > 0 && co.status !== 'COMPLETED' && (
                    <div className="chat-box">
                      <div className="chat-box-header">💬 Trao đổi với khách hàng</div>
                      <div className="chat-messages" style={{ maxHeight: '150px' }}>
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
            }
          })
        )}
      </div>
    </div>
  );
};
