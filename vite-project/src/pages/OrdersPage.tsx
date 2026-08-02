import React, { useState } from 'react';
import { Package, Truck, CheckCircle2, Clock, Sparkles, QrCode, ShieldCheck } from 'lucide-react';
import type { Order, CustomOrder } from '@/types';

interface OrdersPageProps {
  orders: Order[];
  customOrders?: CustomOrder[];
  onBuyerAcceptQuote?: (orderId: string, paymentType: 'DEPOSIT' | 'FULL') => void;
  onBuyerCompleteCustom?: (orderId: string) => void;
  onBuyerSendMessage?: (orderId: string, text: string) => void;
}

const B2C_STEPS = [
  { id: 'PENDING_DEPOSIT', label: 'Chờ cọc PayOS', icon: <Clock size={16} /> },
  { id: 'PRINTING', label: 'Xưởng đang in 3D', icon: <Sparkles size={16} /> },
  { id: 'SHIPPED', label: 'Đang giao hàng', icon: <Truck size={16} /> },
  { id: 'COMPLETED', label: 'Hoàn thành / Bảo hành', icon: <CheckCircle2 size={16} /> },
];

export const OrdersPage: React.FC<OrdersPageProps> = ({ orders }) => {
  const [selectedQR, setSelectedQR] = useState<string | null>(null);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Package className="logo-accent" size={30} />
          Đơn Hàng Bộ Thước Kẻ Của Tôi
        </h1>
        <p className="page-subtitle">Theo dõi tiến độ xưởng in 3D, khắc tên cá nhân và mã QR bảo hành số trọn gói</p>
      </div>

      <div className="glass-card">
        {orders.length === 0 ? (
          <div style={{ padding: '48px 32px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Bạn chưa có đơn hàng nào. Hãy khám phá danh mục Bộ Thước Kẻ In 3D để đặt hàng!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((order) => {
              const currentStepIdx = B2C_STEPS.findIndex((s) => s.id === order.status);
              const activeIdx = currentStepIdx === -1 ? 1 : currentStepIdx;

              return (
                <div
                  key={order.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    padding: '20px'
                  }}
                >
                  {/* Order Top Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Mã đơn hàng: </span>
                      <strong style={{ fontFamily: 'var(--mono)', color: 'var(--primary)', fontSize: '15px' }}>{order.id}</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '12px' }}>• Ngày đặt: {order.date}</span>
                    </div>
                    <span className="info-tag tag-approved" style={{ fontSize: '12px' }}>
                      {order.status === 'COMPLETED' ? '✅ Hoàn tất - Đã kích hoạt bảo hành' : '⚙️ Xưởng đang xử lý'}
                    </span>
                  </div>

                  {/* Progress Tracker Bar */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px', background: '#000', padding: '12px', borderRadius: '8px' }}>
                    {B2C_STEPS.map((st, i) => (
                      <div
                        key={st.id}
                        style={{
                          textAlign: 'center',
                          color: i <= activeIdx ? '#39FF14' : 'var(--text-muted)',
                          fontWeight: i <= activeIdx ? 'bold' : 'normal',
                          fontSize: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {st.icon}
                        <span>{st.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Items List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--surface)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <img src={item.product.image} alt={item.product.name} style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{item.product.name}</h4>
                          <div style={{ fontSize: '12px', color: '#39FF14' }}>
                            ✨ Nội dung khắc tên: <strong>{item.engravingText || 'Nguyễn Văn A - SE190182'}</strong>
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            Màu nhựa: {item.selectedColor || 'Neon Green'} | Số lượng: {item.quantity} bộ
                          </div>
                        </div>
                        <div style={{ fontFamily: 'var(--mono)', fontWeight: 'bold', color: 'var(--primary)' }}>
                          {(item.product.price * item.quantity).toLocaleString()}đ
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer & Digital QR Warranty Action */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tổng thanh toán: </span>
                      <strong style={{ fontSize: '18px', color: 'var(--primary)', fontFamily: 'var(--mono)' }}>
                        {order.totalAmount.toLocaleString()}đ
                      </strong>
                    </div>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ fontSize: '12px', gap: '6px', borderColor: '#39FF14', color: '#39FF14' }}
                      onClick={() => setSelectedQR(order.id)}
                    >
                      <QrCode size={16} /> Xem Thẻ Bảo Hành Số (QR Code)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QR Code Digital Warranty Modal */}
      {selectedQR && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px', padding: '24px', textAlign: 'center' }}>
            <ShieldCheck size={40} style={{ color: '#39FF14', margin: '0 auto 8px' }} />
            <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>Mã QR Bảo Hành 1 Đổi 1</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Mã chứng thực sản phẩm chính hãng PrintHub 3D - Thời hạn bảo hành 1 học kỳ
            </p>

            <div style={{ background: '#FFF', padding: '16px', borderRadius: '12px', display: 'inline-block', marginBottom: '16px' }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=PRINTHUB3D-WARRANTY-${selectedQR}`}
                alt="QR Code"
                style={{ width: '160px', height: '160px' }}
              />
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '20px', background: 'var(--bg-secondary)', padding: '8px', borderRadius: '6px' }}>
              Mã bảo hành: <strong style={{ fontFamily: 'var(--mono)', color: '#FFF' }}>WARRANTY-{selectedQR}</strong>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setSelectedQR(null)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
