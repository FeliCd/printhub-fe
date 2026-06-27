import React, { useState } from 'react';
import { X } from 'lucide-react';

interface DisputeModalProps {
  onClose: () => void;
  onSubmit: (data: { orderId: string; reason: string; evidenceUrl: string }) => void;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({ onClose, onSubmit }) => {
  const [orderId, setOrderId] = useState('');
  const [reason, setReason] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !reason) return;
    onSubmit({ orderId, reason, evidenceUrl });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px', padding: '32px' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        <h2>Mở khiếu nại tranh chấp đơn</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label>Mã đơn hàng cần khiếu nại</label>
            <input
              type="text"
              className="form-control"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Nhập ORDER ID..."
              required
            />
          </div>
          <div className="form-group">
            <label>Lý do khiếu nại / Mô tả chi tiết lỗi</label>
            <textarea
              className="form-control"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Mô tả sản phẩm gãy, không giống hình, file lỗi..."
              style={{ height: '80px', resize: 'none' }}
              required
            />
          </div>
          <div className="form-group">
            <label>Đường dẫn hình ảnh bằng chứng (URL)</label>
            <input
              type="text"
              className="form-control"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              placeholder="Liên kết ảnh chụp lỗi sản phẩm..."
            />
          </div>
          <button type="submit" className="btn btn-danger" style={{ width: '100%', marginTop: '12px' }}>
            Gửi đơn khiếu nại lên sàn
          </button>
        </form>
      </div>
    </div>
  );
};
