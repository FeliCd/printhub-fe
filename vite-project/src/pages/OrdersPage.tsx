import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, Sparkles, Send, ShoppingBag, AlertTriangle } from 'lucide-react';
import type { Order, CustomOrder } from '@/types';
import { PayOSMockModal } from '@/components/shared/PayOSMockModal';

interface OrdersPageProps {
  orders: Order[];
  customOrders?: CustomOrder[];
  onBuyerAcceptQuote?: (orderId: string, paymentType: 'DEPOSIT' | 'FULL') => void;
  onBuyerCompleteCustom?: (orderId: string) => void;
  onBuyerSendMessage?: (orderId: string, text: string) => void;
}

const CATALOG_STEPS = [
  { id: 'PENDING', label: 'Chờ xử lý', icon: <Clock size={16} /> },
  { id: 'PROCESSING', label: 'Đang chuẩn bị', icon: <Package size={16} /> },
  { id: 'SHIPPED', label: 'Đang giao hàng', icon: <Truck size={16} /> },
  { id: 'COMPLETED', label: 'Hoàn thành', icon: <CheckCircle size={16} /> },
];

const CUSTOM_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  REQUESTED: { label: 'Đã đăng — Chờ Maker nhận', color: '#ff9f0a', bg: 'rgba(255, 159, 10, 0.1)', icon: '🟡' },
  PICKED: { label: 'Maker đã nhận — Đang trao đổi', color: '#007aff', bg: 'rgba(0, 122, 255, 0.1)', icon: '🔵' },
  QUOTED: { label: 'Đã nhận báo giá — Chờ bạn duyệt', color: '#ff6b00', bg: 'rgba(255, 107, 0, 0.1)', icon: '🟠' },
  ACCEPTED: { label: 'Đã thanh toán — Đang in', color: 'var(--primary)', bg: 'rgba(57, 255, 20, 0.1)', icon: '🟢' },
  PRINTING: { label: 'Maker tải ảnh Proof — Chờ nghiệm thu', color: '#af52de', bg: 'rgba(175, 82, 222, 0.1)', icon: '📸' },
  COMPLETED: { label: 'Hoàn tất', color: '#34c759', bg: 'rgba(52, 199, 89, 0.1)', icon: '✅' },
  CANCELLED: { label: 'Đã hủy', color: '#ff3b30', bg: 'rgba(255, 59, 48, 0.1)', icon: '❌' },
};

const CUSTOM_FLOW_STEPS = [
  { step: 1, label: 'Tạo yêu cầu', desc: 'Mô tả chi tiết sản phẩm' },
  { step: 2, label: 'Maker nhận đơn', desc: 'Nhà in xem & nhận yêu cầu' },
  { step: 3, label: 'Nhận báo giá', desc: 'Duyệt & thanh toán' },
  { step: 4, label: 'In & Nghiệm thu', desc: 'Tải proof & nghiệm thu' },
];

export const OrdersPage: React.FC<OrdersPageProps> = ({
  orders,
  customOrders = [],
  onBuyerAcceptQuote,
  onBuyerCompleteCustom,
  onBuyerSendMessage,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'CATALOG' | 'CUSTOM'>('ALL');
  const [chatInputs, setChatInputs] = useState<Record<string, string>>({});
  
  // Custom Payment States
  const [selectedQuoteOrder, setSelectedQuoteOrder] = useState<string>('');
  const [showPayOS, setShowPayOS] = useState<boolean>(false);
  const [payOSAmount, setPayOSAmount] = useState<number>(0);
  const [paymentTypeToProcess, setPaymentTypeToProcess] = useState<'DEPOSIT' | 'FULL' | null>(null);
  const [orderIdToProcess, setOrderIdToProcess] = useState<string>('');
  const [showConfirmWarning, setShowConfirmWarning] = useState<boolean>(false);

  // Filter custom orders for current Buyer
  const myCustomOrders = customOrders.filter(o => o.buyerId === 201 || o.buyerName === 'Nguyễn Văn Anh');

  // Convert and combine both order types into a single list sorted by date desc
  const unifiedList: Array<
    | { type: 'CATALOG'; id: string; date: string; data: Order }
    | { type: 'CUSTOM'; id: string; date: string; data: CustomOrder }
  > = [];

  if (filter === 'ALL' || filter === 'CATALOG') {
    orders.forEach(o => {
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
    if (!text || !onBuyerSendMessage) return;
    onBuyerSendMessage(orderId, text);
    setChatInputs(prev => ({ ...prev, [orderId]: '' }));
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">Đơn hàng của tôi</h1>
        <p className="page-subtitle">Theo dõi tình trạng đơn hàng Catalog và các đơn đặt in 3D theo yêu cầu</p>
      </div>

      {/* Filter Tabs */}
      <div className="tab-nav" style={{ marginBottom: '24px', display: 'flex', gap: '8px' }}>
        <button
          className={`tab-btn ${filter === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilter('ALL')}
        >
          Tất cả đơn hàng ({orders.length + myCustomOrders.length})
        </button>
        <button
          className={`tab-btn ${filter === 'CATALOG' ? 'active' : ''}`}
          onClick={() => setFilter('CATALOG')}
        >
          Đơn Catalog ({orders.length})
        </button>
        <button
          className={`tab-btn ${filter === 'CUSTOM' ? 'active' : ''}`}
          onClick={() => setFilter('CUSTOM')}
        >
          Đơn đặt in Custom ({myCustomOrders.length})
        </button>
      </div>

      <div className="glass-card">
        {unifiedList.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {unifiedList.map(item => {
              if (item.type === 'CATALOG') {
                const order = item.data as Order;
                const currentStepIndex = CATALOG_STEPS.findIndex(s => s.id === order.status);
                const isCancelled = order.status === 'CANCELLED';

                return (
                  <div
                    key={order.id}
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '24px',
                      backgroundColor: 'var(--bg-secondary)',
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                        borderBottom: '1px solid var(--border)',
                        paddingBottom: '16px',
                        flexWrap: 'wrap',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: 'var(--mono)', color: 'var(--primary)' }}>
                          {order.id}
                        </span>
                        <span className="status-badge" style={{ backgroundColor: 'rgba(57, 255, 20, 0.1)', color: 'var(--primary)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ShoppingBag size={12} /> Đơn Catalog
                        </span>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          Ngày đặt: {order.date}
                        </span>
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 'bold' }}>
                        Tổng tiền: <span style={{ color: 'var(--primary)', fontFamily: 'var(--mono)' }}>{order.totalAmount.toLocaleString()}đ</span>
                      </div>
                    </div>

                    {/* Timeline */}
                    {!isCancelled ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', position: 'relative', padding: '0 10px' }}>
                        {/* Line background */}
                        <div style={{ position: 'absolute', top: '24px', left: '40px', right: '40px', height: '2px', backgroundColor: 'var(--border)', zIndex: 0 }} />
                        
                        {/* Active Line */}
                        {currentStepIndex > 0 && (
                          <div style={{ 
                            position: 'absolute', 
                            top: '24px', 
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
                            <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, width: '85px' }}>
                              <div style={{ 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: '50%', 
                                backgroundColor: isActive ? 'var(--primary)' : 'var(--surface)',
                                color: isActive ? '#fff' : 'var(--text-muted)',
                                border: `2px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                marginBottom: '8px'
                              }}>
                                {step.icon}
                              </div>
                              <div style={{ fontSize: '11px', fontWeight: isActive ? 'bold' : 'normal', color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', textAlign: 'center' }}>
                                {step.label}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ padding: '12px', backgroundColor: 'rgba(255, 59, 48, 0.1)', color: '#ff3b30', borderRadius: '8px', textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', fontSize: '13px' }}>
                        Đơn hàng đã bị hủy
                      </div>
                    )}

                    {/* Order Details & Tracking */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flexWrap: 'wrap' }}>
                      <div>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sản phẩm</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {order.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '12px', fontSize: '13px', alignItems: 'center' }}>
                              <img src={item.product.image} alt={item.product.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                              <div>
                                <div style={{ fontWeight: '500' }}>{item.product.name} x{item.quantity}</div>
                                {(item.selectedColor || item.selectedMaterial) && (
                                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>
                                    Màu: {item.selectedColor} | Nhựa: {item.selectedMaterial}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Thông tin vận chuyển</h4>
                        <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                          <div><strong>Người nhận:</strong> {order.shippingAddress?.name}</div>
                          <div><strong>SĐT:</strong> {order.shippingAddress?.phone}</div>
                          <div><strong>Địa chỉ:</strong> {order.shippingAddress?.addressLine}, {order.shippingAddress?.province}</div>
                          {order.trackingNumber && (
                            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: 'var(--surface)', borderRadius: '8px', border: '1px dashed var(--primary)', display: 'inline-block' }}>
                              <span style={{ color: 'var(--text-secondary)', fontSize: '11px', marginRight: '6px' }}>Mã vận đơn (Tracking):</span>
                              <strong style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--primary)' }}>{order.trackingNumber}</strong>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else {
                // Render Custom Order
                const co = item.data as CustomOrder;
                const statusCfg = CUSTOM_STATUS_CONFIG[co.status] || CUSTOM_STATUS_CONFIG.REQUESTED;
                
                // Determine step for timeline
                let activeStep = 1;
                if (co.status === 'PICKED') activeStep = 2;
                if (co.status === 'QUOTED') activeStep = 3;
                if (co.status === 'ACCEPTED' || co.status === 'PRINTING' || co.status === 'COMPLETED') activeStep = 4;
                if (co.status === 'CANCELLED') activeStep = 0;

                return (
                  <div
                    key={co.id}
                    className="request-card"
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '24px',
                      backgroundColor: 'var(--bg-secondary)',
                      margin: '0',
                    }}
                  >
                    {/* Header */}
                    <div className="request-card-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--mono)', fontWeight: 'bold', color: 'var(--primary)', fontSize: '16px' }}>
                          {co.id}
                        </span>
                        <span className="status-badge" style={{ backgroundColor: 'rgba(175, 82, 222, 0.1)', color: '#af52de', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={12} /> Đơn Custom
                        </span>
                        <span className="status-badge" style={{ backgroundColor: statusCfg.bg, color: statusCfg.color, fontSize: '11px' }}>
                          {statusCfg.icon} {statusCfg.label}
                        </span>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          Ngày đăng: {co.date}
                        </span>
                      </div>
                      {co.makerName && (
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          Nhà in: <strong style={{ color: 'var(--primary)' }}>{co.makerName}</strong>
                        </div>
                      )}
                    </div>

                    {/* Custom Order Details & Timeline */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '20px' }}>
                      <div>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Yêu cầu thiết kế in</h4>
                        <div className="request-card-details" style={{ padding: '0', background: 'none', border: 'none' }}>
                          <p style={{ fontSize: '13px', marginBottom: '12px', lineHeight: '1.6' }}>
                            <strong>Mô tả:</strong> {co.requirements}
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {co.category && <span>📁 Danh mục: <strong>{co.category}</strong></span>}
                            {co.material && <span>🧪 Vật liệu: <strong>{co.material}</strong></span>}
                            {co.quantity && <span>📦 Số lượng: <strong>{co.quantity}</strong></span>}
                            {co.color && <span>🎨 Màu sắc: <strong>{co.color}</strong></span>}
                            {co.infill && <span>⚙ Độ đặc: <strong>{co.infill}</strong></span>}
                            {co.resolution && <span>📐 Độ phân giải: <strong>{co.resolution}</strong></span>}
                            {co.attachmentUrl && (
                              <span>📎 File đính kèm: <a href={`#${co.attachmentUrl}`} style={{ color: 'var(--primary)' }}>{co.attachmentUrl}</a></span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Custom Timeline info */}
                      <div>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tiến trình xử lý</h4>
                        {co.status !== 'CANCELLED' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                            {CUSTOM_FLOW_STEPS.map((step) => {
                              const isStepDone = step.step <= activeStep;
                              return (
                                <div key={step.step} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                  <div style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: isStepDone ? 'var(--primary)' : 'var(--surface)',
                                    color: isStepDone ? '#000' : 'var(--text-muted)',
                                    fontWeight: 'bold',
                                    fontSize: '11px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: `1px solid ${isStepDone ? 'var(--primary)' : 'var(--border)'}`
                                  }}>
                                    {isStepDone ? '✓' : step.step}
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '12px', fontWeight: isStepDone ? 'bold' : 'normal', color: isStepDone ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                      {step.label}
                                    </div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                                      {step.desc}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div style={{ padding: '12px', backgroundColor: 'rgba(255, 59, 48, 0.1)', color: '#ff3b30', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}>
                            Yêu cầu đã bị hủy bỏ
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions and Proof */}
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                          {co.quotedPrice ? (
                            <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
                              <div>
                                Báo giá của Maker:{' '}
                                <strong style={{ color: 'var(--primary)', fontSize: '18px', fontFamily: 'var(--mono)' }}>
                                  {co.quotedPrice.toLocaleString()}đ
                                </strong>
                              </div>
                              {co.depositPercentage && co.depositAmount && (
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                  • Yêu cầu cọc: <strong>{co.depositPercentage}%</strong> (tương đương <strong>{co.depositAmount.toLocaleString()}đ</strong>)
                                  {co.paymentType && (
                                    <span> | Hình thức đã chọn: <strong style={{ color: 'var(--primary)' }}>{co.paymentType === 'DEPOSIT' ? 'Thanh toán cọc' : 'Thanh toán 100%'}</strong></span>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                              {co.status === 'REQUESTED' ? 'Đang chờ các Nhà in nhận đơn...' : 'Maker đang khảo sát thiết kế...'}
                            </div>
                          )}
                        </div>

                        <div>
                          {co.status === 'QUOTED' && onBuyerAcceptQuote && (
                            selectedQuoteOrder !== co.id ? (
                              <button 
                                className="btn btn-primary" 
                                style={{ padding: '8px 20px', fontSize: '13px' }} 
                                onClick={() => setSelectedQuoteOrder(co.id)}
                              >
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
                        </div>
                      </div>

                      {/* Print Proof Display */}
                      {co.printProofImage && (
                        <div style={{ marginTop: '16px', padding: '14px', backgroundColor: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                          <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            📸 Bằng chứng in ấn thực tế (Print Proof) từ Maker:
                          </div>
                          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <img
                              src={co.printProofImage}
                              alt="Print Proof"
                              style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }}
                            />
                            <div>
                              <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: '0 0 10px 0' }}>
                                <strong>Ghi chú từ Maker:</strong> {co.printProofNote || 'Không có ghi chú.'}
                              </p>
                              {co.status === 'PRINTING' && onBuyerCompleteCustom && (
                                <button
                                  className="btn btn-primary"
                                  style={{ padding: '6px 14px', fontSize: '12px' }}
                                  onClick={() => onBuyerCompleteCustom(co.id)}
                                >
                                  Nghiệm thu & Hoàn tất đơn
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Box */}
                    {co.messages && co.messages.length > 0 && co.status !== 'REQUESTED' && co.status !== 'COMPLETED' && (
                      <div className="chat-box" style={{ marginTop: '20px' }}>
                        <div className="chat-box-header">💬 Trao đổi thảo luận cùng Maker</div>
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
                              placeholder="Nhập tin nhắn trao đổi..."
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
            })}
          </div>
        )}
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
