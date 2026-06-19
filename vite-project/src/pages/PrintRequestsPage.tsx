import React, { useState } from 'react';
import { Send, CheckCircle, Upload, Calendar } from 'lucide-react';
import type { CustomOrder, Order } from '../types';

interface PrintRequestsPageProps {
  customOrders: CustomOrder[];
  orders: Order[];
  onMakerPickRequest: (orderId: string) => void;
  onMakerQuote: (orderId: string, price: number) => void;
  onMakerSendMessage: (orderId: string, text: string) => void;
  onMakerUploadProof: (orderId: string, img: string, note: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  REQUESTED: { label: 'Chờ nhận', color: '#ff9f0a', bg: 'rgba(255, 159, 10, 0.1)', icon: '🟡' },
  PICKED: { label: 'Đã nhận — Đang trao đổi', color: '#007aff', bg: 'rgba(0, 122, 255, 0.1)', icon: '🔵' },
  QUOTED: { label: 'Đã gửi báo giá — Chờ khách duyệt', color: '#ff6b00', bg: 'rgba(255, 107, 0, 0.1)', icon: '🟠' },
  ACCEPTED: { label: 'Khách đã thanh toán — Bắt đầu in', color: 'var(--primary)', bg: 'rgba(57, 255, 20, 0.1)', icon: '🟢' },
  PRINTING: { label: 'Đã tải Proof — Chờ nghiệm thu', color: '#af52de', bg: 'rgba(175, 82, 222, 0.1)', icon: '📸' },
  COMPLETED: { label: 'Hoàn tất', color: '#34c759', bg: 'rgba(52, 199, 89, 0.1)', icon: '✅' },
};

export const PrintRequestsPage: React.FC<PrintRequestsPageProps> = ({
  customOrders,
  orders,
  onMakerPickRequest,
  onMakerQuote,
  onMakerSendMessage,
  onMakerUploadProof,
  onUpdateOrderStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'OPEN' | 'MINE' | 'CATALOG' | 'EARNINGS'>('OPEN');
  const [chatInputs, setChatInputs] = useState<Record<string, string>>({});
  const [quoteInputs, setQuoteInputs] = useState<Record<string, string>>({});

  const openRequests = customOrders.filter(o => o.status === 'REQUESTED');
  const myOrders = customOrders.filter(o => o.makerId === 101 && o.status !== 'REQUESTED');
  
  // Physical catalog orders
  const physicalCatalogOrders = orders.filter(o => o.items.some(item => item.product.type === 'PHYSICAL'));

  const handleSendChat = (orderId: string) => {
    const text = chatInputs[orderId]?.trim();
    if (!text) return;
    onMakerSendMessage(orderId, text);
    setChatInputs(prev => ({ ...prev, [orderId]: '' }));
  };

  const handleSubmitQuote = (orderId: string) => {
    const price = parseInt(quoteInputs[orderId]);
    if (!price || price <= 0) return;
    onMakerQuote(orderId, price);
    setQuoteInputs(prev => ({ ...prev, [orderId]: '' }));
  };

  // Maker Earnings calculations (Gross, Fee, Net)
  const completedCustoms = customOrders.filter(o => o.makerId === 101 && o.status === 'COMPLETED');
  const customGross = completedCustoms.reduce((sum, o) => sum + (o.quotedPrice || 0), 0);
  
  // Completed catalog sales (we assume this maker fulfills completed physical orders)
  const completedCatalogSales = orders.filter(o => o.status === 'COMPLETED' && o.items.some(item => item.product.type === 'PHYSICAL'));
  const catalogGross = completedCatalogSales.reduce((sum, o) => sum + o.totalAmount, 0);

  const grossEarnings = customGross + catalogGross;
  const platformFee = Math.round(grossEarnings * 0.05);
  const netEarnings = grossEarnings - platformFee;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">Bảng điều khiển Nhà in (Maker Dashboard)</h1>
        <p className="page-subtitle">Nhận đơn hàng in riêng, xử lý đơn đặt mua từ Catalog, và thống kê thu nhập</p>
      </div>

      {/* Maker Info Banner */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(57, 255, 20, 0.08) 0%, rgba(10, 10, 10, 0) 100%)',
        borderLeft: '4px solid var(--primary)',
        padding: '16px 20px',
        borderRadius: '0 8px 8px 0',
        marginBottom: '24px',
        fontSize: '13px',
        lineHeight: '1.5'
      }}>
        {activeTab === 'OPEN' && (
          <div>
            Các yêu cầu thiết kế riêng từ Buyer chưa có Maker nhận. Nhấn <strong>"Nhận đơn này"</strong> để bắt đầu thảo luận.
          </div>
        )}
        {activeTab === 'MINE' && (
          <div>
            Quản lý các yêu cầu đặt in bạn đã nhận. Tiến hành thảo luận {"→"} báo giá {"→"} thực hiện in ấn {"→"} tải ảnh nghiệm thu.
          </div>
        )}
        {activeTab === 'CATALOG' && (
          <div>
            Đơn hàng đặt mua mô hình vật lý in sẵn từ Catalog của bạn. Hãy in, đóng gói và cập nhật tiến trình giao nhận hàng.
          </div>
        )}
        {activeTab === 'EARNINGS' && (
          <div>
            Thống kê tài chính. Thu nhập thực tế nhận về ví sau khi sàn tự động khấu trừ 5% phí hoa hồng trọng tài.
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="tab-nav" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '8px' }}>
        <button
          className={`tab-btn ${activeTab === 'OPEN' ? 'active' : ''}`}
          onClick={() => setActiveTab('OPEN')}
        >
          Yêu cầu chờ nhận ({openRequests.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'MINE' ? 'active' : ''}`}
          onClick={() => setActiveTab('MINE')}
        >
          Đơn thiết kế đã nhận ({myOrders.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'CATALOG' ? 'active' : ''}`}
          onClick={() => setActiveTab('CATALOG')}
        >
          Đơn bán từ Catalog ({physicalCatalogOrders.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'EARNINGS' ? 'active' : ''}`}
          onClick={() => setActiveTab('EARNINGS')}
        >
          Thống kê thu nhập
        </button>
      </div>

      {/* TAB 1: Open Requests */}
      {activeTab === 'OPEN' && (
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
                    
                    {/* Display Rich 3D Printing Parameters */}
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
      )}

      {/* TAB 2: My Picked Custom Orders */}
      {activeTab === 'MINE' && (
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
                        <div style={{ marginTop: '12px', fontSize: '14px' }}>
                          Báo giá đã gửi:{' '}
                          <strong style={{ color: 'var(--primary)', fontSize: '18px', fontFamily: 'var(--mono)' }}>
                            {co.quotedPrice.toLocaleString()}đ
                          </strong>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="request-card-actions">
                      {co.status === 'PICKED' && (
                        <div className="quote-input-inline">
                          <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Gửi báo giá:</div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Nhập giá (VND)..."
                              value={quoteInputs[co.id] || ''}
                              onChange={(e) => setQuoteInputs(prev => ({ ...prev, [co.id]: e.target.value }))}
                              style={{ flex: 1 }}
                            />
                            <button
                              className="btn btn-primary"
                              style={{ padding: '8px 16px', whiteSpace: 'nowrap' }}
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
      )}

      {/* TAB 3: Catalog Sales Order Management */}
      {activeTab === 'CATALOG' && (
        <div className="glass-card">
          <h2>Quản lý đơn hàng từ Catalog ({physicalCatalogOrders.length})</h2>
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {physicalCatalogOrders.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Chưa có đơn đặt hàng mô hình vật lý nào từ Catalog.
              </div>
            ) : (
              physicalCatalogOrders.map((o) => {
                const st = STATUS_CONFIG[o.status] || { label: o.status, color: 'var(--text-secondary)', bg: 'var(--border)', icon: '📦' };
                return (
                  <div 
                    key={o.id}
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '16px',
                      backgroundColor: 'var(--bg-secondary)',
                      display: 'grid',
                      gridTemplateColumns: '1fr 250px',
                      gap: '24px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <span style={{ fontFamily: 'var(--mono)', fontWeight: 'bold' }}>{o.id}</span>
                        <span className="status-badge" style={{ backgroundColor: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{o.date}</span>
                      </div>

                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        Người nhận: <strong>{o.shippingAddress?.name}</strong> | SĐT: {o.shippingAddress?.phone} <br />
                        Địa chỉ: {o.shippingAddress?.addressLine}, {o.shippingAddress?.province}
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
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        Tổng giá trị: <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>{o.totalAmount.toLocaleString()}đ</strong>
                      </div>

                      {o.status === 'PENDING' && (
                        <button 
                          className="btn btn-primary" 
                          style={{ fontSize: '12px', padding: '6px' }}
                          onClick={() => onUpdateOrderStatus(o.id, 'PROCESSING')}
                        >
                          Chấp nhận & Bắt đầu in
                        </button>
                      )}
                      
                      {o.status === 'PROCESSING' && (
                        <button 
                          className="btn btn-secondary" 
                          style={{ fontSize: '12px', padding: '6px' }}
                          onClick={() => onUpdateOrderStatus(o.id, 'SHIPPED')}
                        >
                          Bàn giao Vận chuyển
                        </button>
                      )}

                      {o.status === 'SHIPPED' && (
                        <button 
                          className="btn btn-primary" 
                          style={{ fontSize: '12px', padding: '6px', backgroundColor: 'var(--primary)', color: 'var(--bg-primary)' }}
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
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Earnings Dashboard */}
      {activeTab === 'EARNINGS' && (
        <div>
          {/* Dashboard Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div className="glass-card" style={{ marginBottom: 0 }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Tổng doanh thu gộp (Gross)</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--mono)' }}>
                {grossEarnings.toLocaleString()}đ
              </div>
            </div>
            
            <div className="glass-card" style={{ marginBottom: 0 }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Phí sàn tự động khấu trừ (5%)</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--mono)', color: '#ff3b30' }}>
                {platformFee.toLocaleString()}đ
              </div>
            </div>

            <div className="glass-card" style={{ marginBottom: 0 }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Thực nhận về ví (95% Net)</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--mono)', color: 'var(--primary)' }}>
                {netEarnings.toLocaleString()}đ
              </div>
            </div>
          </div>

          {/* Earnings ledger list */}
          <div className="glass-card">
            <h2>Lịch sử nhận thanh toán (Payout Ledger)</h2>
            <div style={{ marginTop: '16px' }} className="app-table-container">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Thời gian</th>
                    <th>Loại đơn</th>
                    <th>Giá trị gộp</th>
                    <th>Phí sàn (5%)</th>
                    <th>Thu nhập ròng (95%)</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Completed custom prints */}
                  {completedCustoms.map((co) => {
                    const price = co.quotedPrice || 0;
                    const fee = Math.round(price * 0.05);
                    const net = price - fee;
                    return (
                      <tr key={co.id}>
                        <td style={{ fontFamily: 'var(--mono)', fontWeight: 'bold' }}>{co.id}</td>
                        <td><div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={12} className="text-muted" />{co.date}</div></td>
                        <td>🎨 Đơn in ấn riêng</td>
                        <td>{price.toLocaleString()}đ</td>
                        <td style={{ color: '#ff3b30' }}>-{fee.toLocaleString()}đ</td>
                        <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+{net.toLocaleString()}đ</td>
                      </tr>
                    );
                  })}

                  {/* Completed catalog sales */}
                  {completedCatalogSales.map((o) => {
                    const price = o.totalAmount;
                    const fee = Math.round(price * 0.05);
                    const net = price - fee;
                    return (
                      <tr key={o.id}>
                        <td style={{ fontFamily: 'var(--mono)', fontWeight: 'bold' }}>{o.id}</td>
                        <td><div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={12} className="text-muted" />{o.date}</div></td>
                        <td>📦 Đơn Catalog</td>
                        <td>{price.toLocaleString()}đ</td>
                        <td style={{ color: '#ff3b30' }}>-{fee.toLocaleString()}đ</td>
                        <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+{net.toLocaleString()}đ</td>
                      </tr>
                    );
                  })}

                  {completedCustoms.length === 0 && completedCatalogSales.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                        Chưa có khoản thu nhập nào được ghi nhận. Hãy hoàn tất đơn hàng để nhận tiền!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
