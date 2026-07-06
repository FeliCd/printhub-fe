import React from 'react';
import { ShoppingBag, MessageSquareWarning } from 'lucide-react';
import type { Order } from '@/types';

interface OrderHistoryProps {
  orders: Order[];
  handleTriggerDispute: (orderId: string) => void;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, handleTriggerDispute }) => {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return { text: 'Chờ xử lý', color: '#ff9f0a', bg: 'rgba(255, 159, 10, 0.1)' };
      case 'PROCESSING': return { text: 'Đang in / Chuẩn bị', color: '#007aff', bg: 'rgba(0, 122, 255, 0.1)' };
      case 'SHIPPED': return { text: 'Đang giao hàng', color: '#af52de', bg: 'rgba(175, 82, 222, 0.1)' };
      case 'COMPLETED': return { text: 'Giao thành công', color: 'var(--primary)', bg: 'rgba(57, 255, 20, 0.1)' };
      case 'CANCELLED': return { text: 'Đã hủy', color: '#ff3b30', bg: 'rgba(255, 59, 48, 0.1)' };
      default: return { text: status, color: 'var(--text-primary)', bg: 'var(--border)' };
    }
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <ShoppingBag size={18} className="text-muted" />
        <h2 style={{ margin: 0 }}>Lịch sử đặt mua hàng (Catalog Purchases)</h2>
      </div>
      
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {orders.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Bạn chưa thực hiện bất kỳ giao dịch mua hàng nào trên Catalog.
          </div>
        ) : (
          orders.map((order) => {
            const st = getStatusLabel(order.status);
            return (
              <div 
                key={order.id} 
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '20px',
                  backgroundColor: 'var(--bg-secondary)'
                }}
              >
                {/* Order header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: '12px',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontWeight: 'bold', color: 'var(--primary)' }}>{order.id}</span>
                      <span className="status-badge" style={{ backgroundColor: st.bg, color: st.color, padding: '2px 8px', fontSize: '11px' }}>
                        {st.text}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Ngày đặt: {order.date} | Mã vận đơn: <code style={{ color: 'var(--text-secondary)' }}>{order.trackingNumber}</code>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Tổng thanh toán:</span>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--primary)', fontFamily: 'var(--mono)' }}>
                      {order.totalAmount.toLocaleString()}đ
                    </div>
                  </div>
                </div>

                {/* Order items list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 2px 0', fontSize: '13px' }}>{item.product.name}</h4>
                        <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                          <span>Loại: {item.product.type === 'DIGITAL' ? 'File STL' : 'Mô hình in'}</span>
                          {item.product.type === 'PHYSICAL' && (item.selectedColor || item.selectedMaterial) && (
                            <>
                              <span>|</span>
                              <span>Màu: {item.selectedColor || 'Đen'}</span>
                              <span>|</span>
                              <span>Nhựa: {item.selectedMaterial || 'PLA'}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '12px' }}>
                        <div style={{ fontFamily: 'var(--mono)' }}>{item.product.price.toLocaleString()}đ</div>
                        <div style={{ color: 'var(--text-muted)' }}>x {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dispute actions / details */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--border)',
                  paddingTop: '12px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Phương thức thanh toán: <strong>{order.paymentMethod === 'WALLET' ? 'Ví điện tử' : 'Chuyển khoản / VNPay'}</strong>
                  </div>
                  
                  {/* Only allow disputes for SHIPPED or COMPLETED orders */}
                  {(order.status === 'SHIPPED' || order.status === 'COMPLETED') && (
                    <button 
                      className="btn btn-secondary" 
                      style={{
                        borderColor: '#ff3b30',
                        color: '#ff3b30',
                        fontSize: '12px',
                        padding: '6px 12px',
                        gap: '6px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      onClick={() => handleTriggerDispute(order.id)}
                    >
                      <MessageSquareWarning size={14} />
                      Khiếu nại đơn này
                    </button>
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
