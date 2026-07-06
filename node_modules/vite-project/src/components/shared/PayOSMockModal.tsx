import React from 'react';
import { X, CheckCircle, Smartphone } from 'lucide-react';

interface PayOSMockModalProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PayOSMockModal: React.FC<PayOSMockModalProps> = ({
  amount,
  onSuccess,
  onCancel,
}) => {
  return (
    <div className="modal-overlay" style={{ zIndex: 1000 }}>
      <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '32px' }}>
        <button className="modal-close" onClick={onCancel}>
          <X size={20} />
        </button>
        
        <h2 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Thanh toán qua PayOS</h2>
        
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Số tiền cần thanh toán</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)', margin: '8px 0' }}>
            {amount.toLocaleString()}đ
          </div>
        </div>

        <div style={{ 
          background: 'white', 
          padding: '24px', 
          borderRadius: '12px', 
          display: 'inline-block',
          marginBottom: '24px',
          border: '1px solid var(--border)'
        }}>
          {/* Mock QR Code */}
          <div style={{ 
            width: '200px', 
            height: '200px', 
            background: 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 20px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ background: 'white', padding: '8px', borderRadius: '8px' }}>
              <span style={{ fontWeight: 'bold', color: '#111' }}>PayOS</span>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Smartphone size={16} />
          <span>Sử dụng App Ngân hàng để quét mã</span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onCancel}>
            Hủy
          </button>
          <button className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={onSuccess}>
            <CheckCircle size={16} />
            Đã thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};
