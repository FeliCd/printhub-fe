import React, { useState } from 'react';
import type { Order } from '@/types';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

interface CatalogOrdersListProps {
  physicalCatalogOrders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status'], trackingNumber?: string) => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  PENDING: { label: 'Chờ xử lý', color: '#ff9f0a', bg: 'rgba(255, 159, 10, 0.1)', icon: '🟡' },
  PROCESSING: { label: 'Đang in / Chuẩn bị', color: '#007aff', bg: 'rgba(0, 122, 255, 0.1)', icon: '🔵' },
  SHIPPED: { label: 'Đang giao hàng', color: '#af52de', bg: 'rgba(175, 82, 222, 0.1)', icon: '🟣' },
  COMPLETED: { label: 'Hoàn thành', color: '#34c759', bg: 'rgba(52, 199, 89, 0.1)', icon: '✅' },
};

const STEPS = [
  { id: 'PENDING', label: 'Chờ xử lý', icon: <Clock size={14} /> },
  { id: 'PROCESSING', label: 'Đang chuẩn bị', icon: <Package size={14} /> },
  { id: 'SHIPPED', label: 'Đang giao hàng', icon: <Truck size={14} /> },
  { id: 'COMPLETED', label: 'Hoàn thành', icon: <CheckCircle size={14} /> },
];

export const CatalogOrdersList: React.FC<CatalogOrdersListProps> = ({
  physicalCatalogOrders,
  onUpdateOrderStatus,
}) => {
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  const handleShip = (orderId: string) => {
    const tracking = trackingInputs[orderId];
    if (!tracking || tracking.trim() === '') {
      alert('Vui lòng nhập Mã vận đơn trước khi Bàn giao vận chuyển!');
      return;
    }
    onUpdateOrderStatus(orderId, 'SHIPPED', tracking.trim());
  };

  return (
    <div className="glass-card">
      <h2>Quản lý đơn hàng từ Catalog ({physicalCatalogOrders.length})</h2>
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {physicalCatalogOrders.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Chưa có đơn đặt hàng mô hình vật lý nào từ Catalog.
          </div>
        ) : (
          physicalCatalogOrders.map((o) => {
            const st = STATUS_CONFIG[o.status] || { label: o.status, color: 'var(--text-secondary)', bg: 'var(--border)', icon: '📦' };
            const currentStepIndex = STEPS.findIndex(s => s.id === o.status);

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
                  gap: '20px'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontWeight: 'bold', fontSize: '16px', color: 'var(--primary)' }}>{o.id}</span>
                    <span className="status-badge" style={{ backgroundColor: st.bg, color: st.color }}>
                      {st.icon} {st.label}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{o.date}</span>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    Tổng giá trị: <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>{o.totalAmount.toLocaleString()}đ</strong>
                  </div>
                </div>

                {/* Status Timeline */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', padding: '0 20px', margin: '8px 0' }}>
                  {/* Background line */}
                  <div style={{ position: 'absolute', top: '16px', left: '40px', right: '40px', height: '2px', backgroundColor: 'var(--border)', zIndex: 0 }} />
                  
                  {/* Progress line */}
                  {currentStepIndex > 0 && (
                    <div style={{ 
                      position: 'absolute', 
                      top: '16px', 
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 250px', gap: '24px' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
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
          })
        )}
      </div>
    </div>
  );
};
