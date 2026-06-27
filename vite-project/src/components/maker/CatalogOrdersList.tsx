import React from 'react';
import type { Order } from '@/types';

interface CatalogOrdersListProps {
  physicalCatalogOrders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  PENDING: { label: 'Chờ xử lý', color: '#ff9f0a', bg: 'rgba(255, 159, 10, 0.1)', icon: '🟡' },
  PROCESSING: { label: 'Đang in / Chuẩn bị', color: '#007aff', bg: 'rgba(0, 122, 255, 0.1)', icon: '🔵' },
  SHIPPED: { label: 'Đang giao hàng', color: '#af52de', bg: 'rgba(175, 82, 222, 0.1)', icon: '🟣' },
  COMPLETED: { label: 'Hoàn thành', color: '#34c759', bg: 'rgba(52, 199, 89, 0.1)', icon: '✅' },
};

export const CatalogOrdersList: React.FC<CatalogOrdersListProps> = ({
  physicalCatalogOrders,
  onUpdateOrderStatus,
}) => {
  return (
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
  );
};
