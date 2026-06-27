import React from 'react';
import { X } from 'lucide-react';

interface PromoModalProps {
  activePromoModal: string;
  onClose: () => void;
}

export const PromoModal: React.FC<PromoModalProps> = ({ activePromoModal, onClose }) => {
  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal-content" style={{ maxWidth: '600px', width: '90%' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        {activePromoModal === 'blog' && (
          <div>
            <span className="info-tag tag-approved" style={{ marginBottom: '12px' }}>BLOG & KINH NGHIỆM</span>
            <h2 style={{ fontSize: '22px', margin: '8px 0', color: '#fff' }}>Bí quyết in nhựa PETG láng mịn & Không vón cục</h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginTop: '16px' }}>
              <p>Nhựa PETG là sự kết hợp tuyệt vời giữa độ dẻo dai của ABS và độ dễ in của PLA. Tuy nhiên, many người gặp vấn đề vón cục hoặc kéo râu (stringing). Dưới đây là lời khuyên hữu ích:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Nhiệt độ in:</strong> Khuyên dùng từ 230°C - 245°C cho đầu đùn, và 75°C - 85°C cho bàn nhiệt.</li>
                <li><strong>Tốc độ quạt gió:</strong> Đặt khoảng 20% - 50%. Quạt gió quá mạnh sẽ làm PETG giảm liên kết lớp, quạt quá yếu sẽ gây biến dạng chi tiết nhỏ.</li>
                <li><strong>Tốc độ in:</strong> Nên in chậm hơn PLA, khoảng 40 - 60 mm/s để nhựa chảy đều và bám dính tốt nhất.</li>
                <li><strong>Rút nhựa (Retraction):</strong> Tăng khoảng cách retraction lên khoảng 1.5 - 2mm đối với Direct Drive hoặc 4 - 6mm đối với Bowden để tránh đọng nhựa ở đầu phun.</li>
              </ul>
            </div>
          </div>
        )}

        {activePromoModal === 'bestsellers' && (
          <div>
            <span className="info-tag tag-approved" style={{ marginBottom: '12px', background: '#ffb300', color: '#000' }}>XU HƯỚNG BÁN CHẠY</span>
            <h2 style={{ fontSize: '22px', margin: '8px 0', color: '#fff' }}>Top 3 Thiết Kế Được Đặt In Nhiều Nhất Tuần</h2>
            <div style={{ marginTop: '20px' }}>
              {[
                { rank: 1, name: 'Articulated Dragon Toy', downloads: '1,240 lượt đặt', price: '99,000đ', type: 'File STL Kỹ thuật số' },
                { rank: 2, name: 'Pikachu Pokémon Planter', downloads: '890 lượt đặt', price: '145,000đ', type: 'Mô hình Vật lý' },
                { rank: 3, name: 'Print-in-Place Fidget Cube', downloads: '620 lượt đặt', price: '45,000đ', type: 'Mô hình Vật lý' }
              ].map(item => (
                <div 
                  key={item.rank}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '6px',
                    marginBottom: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: item.rank === 1 ? '#ffd700' : '#c0c0c0' }}>
                      #{item.rank}
                    </span>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#fff' }}>{item.name}</div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.type}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--primary)' }}>{item.price}</div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.downloads}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePromoModal === 'beginners' && (
          <div>
            <span className="info-tag tag-approved" style={{ marginBottom: '12px', background: '#00e5ff', color: '#000' }}>HƯỚNG DẪN MỚI BẮT ĐẦU</span>
            <h2 style={{ fontSize: '22px', margin: '8px 0', color: '#fff' }}>Cẩm nang phân biệt các loại chất liệu nhựa in</h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginTop: '16px' }}>
              <p>Khi mới bắt đầu in 3D, việc lựa chọn đúng loại nhựa (Filament) sẽ quyết định 80% sự thành bại của sản phẩm:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '12px' }}>
                  <strong style={{ color: '#fff' }}>1. Nhựa PLA (Polylactic Acid)</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '13px' }}>Nhựa thân thiện môi trường từ tinh bột ngô. Cực kỳ dễ in, không mùi độc hại, màu sắc đa dạng. Phù hợp làm đồ chơi, mô hình trưng bày trong nhà.</p>
                </div>
                <div style={{ borderLeft: '3px solid #ffb300', paddingLeft: '12px' }}>
                  <strong style={{ color: '#fff' }}>2. Nhựa PETG (Polyethylene Terephthalate Glycol)</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '13px' }}>Bền bỉ, chịu va đập và chịu nhiệt tốt hơn PLA, chống nước tốt. Thích hợp làm các bộ phận chịu lực ngoài trời hoặc bình đựng nước.</p>
                </div>
                <div style={{ borderLeft: '3px solid #ec4899', paddingLeft: '12px' }}>
                  <strong style={{ color: '#fff' }}>3. Nhựa ABS (Acrylonitrile Butadiene Styrene)</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '13px' }}>Rất bền, chịu nhiệt cao lên đến 100°C. Tuy nhiên khó in vì dễ bị cong góc khi nguội đột ngột, cần buồng in kín và phòng thông gió tốt do có mùi khét.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePromoModal === 'slicers' && (
          <div>
            <span className="info-tag tag-approved" style={{ marginBottom: '12px', background: '#ec4899', color: '#fff' }}>PHẦN MỀM SLICER</span>
            <h2 style={{ fontSize: '22px', margin: '8px 0', color: '#fff' }}>Cura vs Bambu Studio: Phần mềm nào tốt hơn?</h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginTop: '16px' }}>
              <p>Phần mềm cắt lớp (Slicer) giúp chuyển file STL sang G-code cho máy in đọc. Hãy cùng so sánh 2 lựa chọn hàng đầu hiện nay:</p>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: '8px', color: '#fff' }}>Tính năng</th>
                    <th style={{ textAlign: 'left', padding: '8px', color: 'var(--primary)' }}>UltiMaker Cura</th>
                    <th style={{ textAlign: 'left', padding: '8px', color: '#ec4899' }}>Bambu Studio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Tương thích</td>
                    <td style={{ padding: '8px' }}>Tất cả các máy in trên thị trường</td>
                    <td style={{ padding: '8px' }}>Tối ưu tuyệt đối cho máy Bambu Lab</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Giao diện</td>
                    <td style={{ padding: '8px' }}>Cổ điển, nhiều thông số phức tạp</td>
                    <td style={{ padding: '8px' }}>Hiện đại, trực quan, hỗ trợ tab</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>In đa màu</td>
                    <td style={{ padding: '8px' }}>Hỗ trợ cơ bản (cần cài plugin)</td>
                    <td style={{ padding: '8px' }}>Tự động hóa hoàn toàn với hệ thống AMS</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
