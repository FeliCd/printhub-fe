import React, { useState } from 'react';
import { X } from 'lucide-react';


interface NewProductModalProps {
  onClose: () => void;
  onSubmit: (productData: {
    name: string;
    type: 'PHYSICAL' | 'DIGITAL';
    price: number;
    stock: number;
    image: string;
    description: string;
    licenseType?: 'PERSONAL' | 'COMMERCIAL';
  }) => void;
}

export const NewProductModal: React.FC<NewProductModalProps> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'PHYSICAL' | 'DIGITAL'>('PHYSICAL');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(1);
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [licenseType, setLicenseType] = useState<'PERSONAL' | 'COMMERCIAL'>('PERSONAL');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0) return;
    onSubmit({
      name,
      type,
      price,
      stock,
      image,
      description,
      licenseType: type === 'DIGITAL' ? licenseType : undefined,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px', padding: '32px' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        <h2>Đăng bán mẫu mới</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label>Tên sản phẩm</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên sản phẩm..."
              required
            />
          </div>
          <div className="form-group">
            <label>Loại sản phẩm</label>
            <select
              className="form-control"
              value={type}
              onChange={(e) => setType(e.target.value as 'PHYSICAL' | 'DIGITAL')}
            >
              <option value="PHYSICAL">Vật lý (Mô hình nhựa in sẵn)</option>
              <option value="DIGITAL">Kỹ thuật số (File .STL có bản quyền)</option>
            </select>
          </div>
          <div className="form-control-row">
            <div className="form-group">
              <label>Giá bán (VND)</label>
              <input
                type="number"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div className="form-group">
              <label>Số lượng kho</label>
              <input
                type="number"
                className="form-control"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value) || 1)}
                required
              />
            </div>
          </div>
          {type === 'DIGITAL' && (
            <div className="form-group">
              <label>Quyền sử dụng thiết kế (License)</label>
              <select
                className="form-control"
                value={licenseType}
                onChange={(e) => setLicenseType(e.target.value as 'PERSONAL' | 'COMMERCIAL')}
              >
                <option value="PERSONAL">Personal - Chỉ phục vụ nghiên cứu, in cá nhân</option>
                <option value="COMMERCIAL">Commercial - Cho phép in bán thương mại</option>
              </select>
            </div>
          )}
          <div className="form-group">
            <label>URL ảnh sản phẩm</label>
            <input
              type="text"
              className="form-control"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Nhập liên kết ảnh đẹp sản phẩm..."
            />
          </div>
          <div className="form-group">
            <label>Mô tả chi tiết</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nêu thông số in hoặc tính năng mô hình..."
              style={{ height: '60px', resize: 'none' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
            Xác nhận đăng bán
          </button>
        </form>
      </div>
    </div>
  );
};
