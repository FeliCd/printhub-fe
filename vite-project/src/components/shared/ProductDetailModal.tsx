import React, { useState } from 'react';
import { X, ShoppingCart, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Product } from '@/types';
import { useApp } from '@/contexts/AppContext';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, options?: { color?: string; material?: string; engravingText?: string; subjectFormula?: string }) => void;
  onDeleteProduct?: (id: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const { currentUser } = useApp();

  const [color, setColor] = useState(product.availableColors?.[0] || 'Neon Green (#39FF14)');
  const [material] = useState('PLA Chịu Lực (100% Nguyên Sinh)');
  const [engravingText, setEngravingText] = useState('Nguyễn Văn A - SE190182');
  const [subjectFormula, setSubjectFormula] = useState(product.subjectFormula || 'Bộ Công Thức Toán 12 & Hình Học');

  const colorHexMap: Record<string, string> = {
    'Neon Green (#39FF14)': '#39FF14',
    'Đen Nhám (Matte Black)': '#1A1A1A',
    'Trắng Sứ (Porcelain White)': '#EFEFEF',
    'Xanh Cyan (Cyan Blue)': '#00E5FF',
    'Hồng Pastel (Pastel Pink)': '#FF4081',
  };

  const selectedHex = colorHexMap[color] || '#39FF14';

  const handleAdd = () => {
    onAddToCart(product, {
      color,
      material,
      engravingText: product.isCustomizable ? engravingText : undefined,
      subjectFormula: product.isCustomizable ? subjectFormula : undefined,
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '850px', width: '90%' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="product-detail-layout" style={{ gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Left Column: Live 2D Preview & Ruler Graphic */}
          <div>
            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#0D0D0D', border: '1px solid var(--border)', padding: '16px' }}>
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '180px', borderRadius: '8px', objectFit: 'cover', marginBottom: '16px', opacity: 0.8 }}
              />

              {/* Live 2D Ruler Preview Bar */}
              <div style={{ marginTop: '8px', background: '#121212', borderRadius: '8px', padding: '14px', border: `2px solid ${selectedHex}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                    <Sparkles size={14} style={{ color: selectedHex, verticalAlign: 'middle', marginRight: '4px' }} />
                    LIVE 2D PREVIEW — THƯỚC IN 3D
                  </span>
                  <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: selectedHex }}>
                    {color}
                  </span>
                </div>

                {/* Simulated 3D Ruler Graphic */}
                <div
                  style={{
                    height: '56px',
                    background: '#1A1A1A',
                    borderRadius: '6px',
                    border: '1px solid #333',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '6px 12px',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
                  }}
                >
                  {/* Ruler Ticks */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', opacity: 0.6 }}>
                    {Array.from({ length: 21 }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: '1px',
                          height: i % 5 === 0 ? '12px' : i % 2 === 0 ? '8px' : '4px',
                          background: selectedHex
                        }}
                      />
                    ))}
                  </div>

                  {/* Custom Engraved Text & Formula Preview */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontFamily: 'var(--mono)',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: selectedHex,
                        letterSpacing: '1px',
                        textShadow: `0 0 8px ${selectedHex}88`
                      }}
                    >
                      {engravingText || '[Nhập tên khắc...]'}
                    </span>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      ∫ sin(x)dx | V=a³
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality & Material Specs */}
            <div style={{ marginTop: '16px', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> BẢO HÀNH 1 ĐỔI 1 TRONG 1 HỌC KỲ
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                Sản phẩm in 3D công nghệ FDM độ đặc 100%, bề mặt dạng lưới lattice chống cong vênh, khắc laser chìm không phai màu theo thời gian.
              </p>
            </div>
          </div>

          {/* Right Column: Customization Options & Form */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="info-tag tag-approved" style={{ marginBottom: '8px' }}>
                {product.category || 'VĂN PHÒNG PHẨM IN 3D B2C'}
              </span>
              <h2 style={{ fontSize: '20px', margin: '8px 0' }}>{product.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
                {product.description}
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg-secondary)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Giá trọn bộ 3 cây</span>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--primary)', fontFamily: 'var(--mono)' }}>
                    {product.price.toLocaleString()}đ
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tồn kho xưởng</span>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#39FF14' }}>
                    Sẵn sàng in ({product.stock} phôi)
                  </div>
                </div>
              </div>

              {/* Customizer Inputs */}
              {product.isCustomizable && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  {/* Engraving Input */}
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      Nội dung khắc tên / MSSV / Lớp:
                    </label>
                    <input
                      type="text"
                      className="input"
                      value={engravingText}
                      onChange={(e) => setEngravingText(e.target.value)}
                      placeholder="Ví dụ: Lê Quốc Khánh - SE190182"
                      maxLength={30}
                      style={{ width: '100%', fontFamily: 'var(--mono)' }}
                    />
                  </div>

                  {/* Formula / Subject Selection */}
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      Bộ công thức in chìm:
                    </label>
                    <select
                      className="input"
                      value={subjectFormula}
                      onChange={(e) => setSubjectFormula(e.target.value)}
                      style={{ width: '100%' }}
                    >
                      <option value="Bộ Công Thức Toán 12 & Hình Học">Toán 12 - Đạo hàm, Tích phân, Hình không gian</option>
                      <option value="Bộ Công Thức Vật Lý Đại Cương">Vật Lý - Cơ học, Điện từ, Quang học</option>
                      <option value="Bộ Công Thức Hóa Học">Hóa Học - Bảng tuần hoàn & Hóa hữu cơ</option>
                      <option value="Bộ Thước Tiêu Chuẩn (Vạch chia cm)">Thước Kẻ Tiêu Chuẩn Vạch Chia (Không Công Thức)</option>
                    </select>
                  </div>

                  {/* Color Selection */}
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                      Màu nhựa in 3D:
                    </label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {['Neon Green (#39FF14)', 'Đen Nhám (Matte Black)', 'Trắng Sứ (Porcelain White)', 'Xanh Cyan (Cyan Blue)', 'Hồng Pastel (Pastel Pink)'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          className={`btn ${color === c ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '4px' }}
                          onClick={() => setColor(c)}
                        >
                          {c.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div>
              {currentUser?.role === 'ADMIN' ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', padding: '8px' }}>
                  Tài khoản Admin đang ở chế độ xem sản phẩm xưởng
                </div>
              ) : (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '15px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                  onClick={handleAdd}
                >
                  <ShoppingCart size={18} /> Thêm Vào Giỏ Hàng ({product.price.toLocaleString()}đ)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
