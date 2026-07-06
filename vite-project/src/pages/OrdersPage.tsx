import React from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import type { Order } from '@/types';

interface OrdersPageProps {
  orders: Order[];
}

const STEPS = [
  { id: 'PENDING', label: 'Chờ xử lý', icon: <Clock size={16} /> },
  { id: 'PROCESSING', label: 'Đang chuẩn bị', icon: <Package size={16} /> },
  { id: 'SHIPPED', label: 'Đang giao hàng', icon: <Truck size={16} /> },
  { id: 'COMPLETED', label: 'Hoàn thành', icon: <CheckCircle size={16} /> },
];

export const OrdersPage: React.FC<OrdersPageProps> = ({ orders }) => {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">Đơn hàng của tôi</h1>
        <p className="page-subtitle">Theo dõi tình trạng các đơn hàng bạn đã đặt từ Catalog</p>
      </div>

      <div className="glass-card">
        {orders.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Bạn chưa có đơn hàng nào.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {orders.map(order => {
              // Find current step index
              const currentStepIndex = STEPS.findIndex(s => s.id === order.status);
              const isCancelled = order.status === 'CANCELLED';

              return (
                <div key={order.id} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', backgroundColor: 'var(--bg-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'var(--mono)', color: 'var(--primary)', marginRight: '12px' }}>
                        {order.id}
                      </span>
                      <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Ngày đặt: {order.date}
                      </span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                      Tổng tiền: <span style={{ color: 'var(--primary)' }}>{order.totalAmount.toLocaleString()}đ</span>
                    </div>
                  </div>

                  {/* Timeline */}
                  {!isCancelled ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', position: 'relative' }}>
                      {/* Line background */}
                      <div style={{ position: 'absolute', top: '24px', left: '40px', right: '40px', height: '2px', backgroundColor: 'var(--border)', zIndex: 0 }} />
                      
                      {/* Active Line */}
                      {currentStepIndex > 0 && (
                        <div style={{ 
                          position: 'absolute', 
                          top: '24px', 
                          left: '40px', 
                          width: `calc(${(currentStepIndex / (STEPS.length - 1)) * 100}% - 80px)`, 
                          height: '2px', 
                          backgroundColor: 'var(--primary)', 
                          zIndex: 1,
                          transition: 'width 0.3s ease'
                        }} />
                      )}

                      {STEPS.map((step, idx) => {
                        const isActive = idx <= currentStepIndex;
                        return (
                          <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, width: '80px' }}>
                            <div style={{ 
                              width: '48px', 
                              height: '48px', 
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
                            <div style={{ fontSize: '12px', fontWeight: isActive ? 'bold' : 'normal', color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', textAlign: 'center' }}>
                              {step.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ padding: '16px', backgroundColor: 'rgba(255, 59, 48, 0.1)', color: '#ff3b30', borderRadius: '8px', textAlign: 'center', marginBottom: '24px', fontWeight: 'bold' }}>
                      Đơn hàng đã bị hủy
                    </div>
                  )}

                  {/* Order Details & Tracking */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Sản phẩm</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '12px', fontSize: '13px', alignItems: 'center' }}>
                            <img src={item.product.image} alt={item.product.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                            <div>
                              <div style={{ fontWeight: '500' }}>{item.product.name} x{item.quantity}</div>
                              {(item.selectedColor || item.selectedMaterial) && (
                                <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                                  Màu: {item.selectedColor} | Nhựa: {item.selectedMaterial}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Thông tin vận chuyển</h4>
                      <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                        <div><strong>Người nhận:</strong> {order.shippingAddress?.name}</div>
                        <div><strong>Số điện thoại:</strong> {order.shippingAddress?.phone}</div>
                        <div><strong>Địa chỉ:</strong> {order.shippingAddress?.addressLine}, {order.shippingAddress?.province}</div>
                        {order.trackingNumber && (
                          <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'var(--surface)', borderRadius: '8px', border: '1px dashed var(--primary)' }}>
                            <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Mã vận đơn (Tracking):</div>
                            <div style={{ fontFamily: 'var(--mono)', fontSize: '16px', fontWeight: 'bold', color: 'var(--primary)' }}>{order.trackingNumber}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
