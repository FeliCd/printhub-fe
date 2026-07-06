import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

interface CustomOrderModalProps {
  onClose: () => void;
  onSubmit: (data: {
    requirements: string;
    attachmentUrl: string;
    category: string;
    material: string;
    quantity: number;
    infill?: string;
    resolution?: string;
    color?: string;
    finish?: string;
    priority?: string;
    sizeScale?: string;
  }) => void;
}

export const CustomOrderModal: React.FC<CustomOrderModalProps> = ({ onClose, onSubmit }) => {
  const [requirements, setRequirements] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [category, setCategory] = useState('Cơ khí');
  const [material, setMaterial] = useState('PLA');
  const [quantity, setQuantity] = useState(1);
  
  // New 3D printing options
  const [infill, setInfill] = useState('15% (Tiêu chuẩn)');
  const [resolution, setResolution] = useState('0.20mm (Tiêu chuẩn)');
  const [color, setColor] = useState('Đen');
  const [finish, setFinish] = useState('Để mộc (Mộc)');
  const [priority, setPriority] = useState('Tiêu chuẩn (3-5 ngày)');
  const [sizeScale, setSizeScale] = useState('Tỉ lệ 100% gốc');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirements) return;
    onSubmit({
      requirements,
      attachmentUrl,
      category,
      material,
      quantity,
      infill,
      resolution,
      color,
      finish,
      priority,
      sizeScale
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        <h2 style={{ marginBottom: '4px', fontSize: '20px' }}>Tạo yêu cầu in 3D theo thiết kế riêng</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Thiết lập cấu hình in chi tiết để nhận báo giá chính xác nhất từ các Nhà in (Maker).
        </p>
        
        <form onSubmit={handleSubmit}>
          {/* Row 1: Category & Material */}
          <div className="form-control-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '12px', marginBottom: '4px' }}>Danh mục in ấn</label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ padding: '8px' }}
              >
                <option value="Cơ khí">Cơ khí / Linh kiện</option>
                <option value="Trang trí">Trang trí / Decor</option>
                <option value="Cosplay">Cosplay / Đồ chơi</option>
                <option value="Gadget">Gadget / Thiết bị</option>
                <option value="Linh kiện máy in">Linh kiện máy in 3D</option>
                <option value="Kiến trúc">Mô hình kiến trúc</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '12px', marginBottom: '4px' }}>Vật liệu nhựa in</label>
              <select
                className="form-control"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                style={{ padding: '8px' }}
              >
                <option value="PLA">PLA (Phổ biến, dễ in)</option>
                <option value="ABS">ABS (Chịu lực, chịu nhiệt)</option>
                <option value="PETG">PETG (Bền bỉ, chịu nước)</option>
                <option value="Nylon-CF">Nylon-CF (Cực chịu lực)</option>
                <option value="TPU">TPU (Nhựa dẻo, đàn hồi)</option>
                <option value="Resin">Resin (Độ chi tiết siêu cao)</option>
                <option value="Không chỉ định">Không chỉ định (Maker tự tư vấn)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Infill & Resolution */}
          <div className="form-control-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '12px', marginBottom: '4px' }}>Độ đặc ruột (Infill Density)</label>
              <select
                className="form-control"
                value={infill}
                onChange={(e) => setInfill(e.target.value)}
                style={{ padding: '8px' }}
              >
                <option value="15% (Tiêu chuẩn)">15% (Tiêu chuẩn/Trưng bày)</option>
                <option value="30% (Chắc chắn)">30% (Chắc chắn/Mô hình khớp)</option>
                <option value="50% (Chịu lực tốt)">50% (Chịu lực tốt/Bánh răng)</option>
                <option value="100% (Đặc hoàn toàn)">100% (Đặc hoàn toàn/Cơ cấu máy)</option>
              </select>
            </div>
            
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '12px', marginBottom: '4px' }}>Độ dày lớp / Độ phân giải</label>
              <select
                className="form-control"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                style={{ padding: '8px' }}
              >
                <option value="0.20mm (Tiêu chuẩn)">0.20mm (Tiêu chuẩn - Đẹp & Nhanh)</option>
                <option value="0.12mm (Mịn)">0.12mm (Mịn - Chi tiết rõ nét)</option>
                <option value="0.28mm (Thô)">0.28mm (Thô - Tối ưu thời gian)</option>
              </select>
            </div>
          </div>

          {/* Row 3: Color & Surface Finish */}
          <div className="form-control-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '12px', marginBottom: '4px' }}>Màu sắc yêu cầu</label>
              <select
                className="form-control"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{ padding: '8px' }}
              >
                <option value="Đen">Đen (Black)</option>
                <option value="Trắng">Trắng (White)</option>
                <option value="Đỏ">Đỏ (Red)</option>
                <option value="Xanh lá">Xanh lá (Green)</option>
                <option value="Xanh dương">Xanh dương (Blue)</option>
                <option value="Xám">Xám (Grey)</option>
                <option value="Trong suốt">Trong suốt (Clear)</option>
                <option value="Theo tư vấn">Maker tự đề xuất màu</option>
              </select>
            </div>
            
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '12px', marginBottom: '4px' }}>Xử lý bề mặt (Surface Finish)</label>
              <select
                className="form-control"
                value={finish}
                onChange={(e) => setFinish(e.target.value)}
                style={{ padding: '8px' }}
              >
                <option value="Để mộc (Mộc)">Để mộc (FDM standard - mộc giá rẻ)</option>
                <option value="Đánh bóng mịn (Sanding)">Đánh bóng chà nhám (Smooth finish)</option>
                <option value="Sơn lót / Sơn màu">Sơn lót & Sơn màu theo thiết kế</option>
              </select>
            </div>
          </div>

          {/* Row 4: Priority & Quantity */}
          <div className="form-control-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '12px', marginBottom: '4px' }}>Độ ưu tiên đơn hàng</label>
              <select
                className="form-control"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{ padding: '8px' }}
              >
                <option value="Tiêu chuẩn (3-5 ngày)">Tiêu chuẩn (3-5 ngày)</option>
                <option value="Hỏa tốc (1-2 ngày)">Hỏa tốc (1-2 ngày - Phụ phí +20%)</option>
              </select>
            </div>
            
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '12px', marginBottom: '4px' }}>Số lượng sản phẩm</label>
              <input
                type="number"
                className="form-control"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                required
                style={{ padding: '8px' }}
              />
            </div>
          </div>

          {/* Row 5: Size/Scale & Attachment URL */}
          <div className="form-control-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '12px', marginBottom: '4px' }}>Kích thước / Tỉ lệ in</label>
              <input
                type="text"
                className="form-control"
                value={sizeScale}
                onChange={(e) => setSizeScale(e.target.value)}
                placeholder="Ví dụ: Tỉ lệ 100% gốc, Cao 15cm..."
                style={{ padding: '8px' }}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '12px', marginBottom: '4px' }}>File bản vẽ / thiết kế đính kèm</label>
              <input
                type="text"
                className="form-control"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                placeholder="Ví dụ: robot_hand_blueprint.stl"
                style={{ padding: '8px' }}
              />
            </div>
          </div>

          {/* Descriptive textarea */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', marginBottom: '4px' }}>Mô tả chi tiết yêu cầu bổ sung</label>
            <textarea
              className="form-control"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Nhập các lưu ý đặc biệt, mục đích sử dụng để Maker hỗ trợ tốt nhất..."
              style={{ height: '80px', resize: 'none', padding: '8px' }}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', gap: '8px', padding: '10px' }}>
            <Send size={16} />
            Đăng yêu cầu in lên Bảng tin
          </button>
        </form>
      </div>
    </div>
  );
};
