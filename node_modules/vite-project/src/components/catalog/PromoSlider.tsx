import React from 'react';

interface PromoSliderProps {
  onCardClick: (type: string) => void;
}

export const PromoSlider: React.FC<PromoSliderProps> = ({ onCardClick }) => {
  return (
    <div 
      className="horizontal-banner-slider"
      style={{
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        paddingBottom: '16px',
        marginBottom: '24px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        scrollSnapType: 'x mandatory',
      }}
    >
      <style>{`
        .horizontal-banner-slider::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {/* Card 1: Blog */}
      <div 
        onClick={() => onCardClick('blog')}
        className="slider-card"
        style={{
          flex: '0 0 100%',
          scrollSnapAlign: 'start',
          background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.15) 0%, rgba(10, 10, 10, 0.6) 100%)',
          border: '1px solid rgba(57, 255, 20, 0.3)',
          borderRadius: '12px',
          padding: '28px',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '200px',
          boxShadow: '0 4px 25px rgba(0, 0, 0, 0.5)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 35px rgba(57, 255, 20, 0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 25px rgba(0, 0, 0, 0.5)';
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Blog Dân In 3D
            </span>
            <span style={{ fontSize: '24px' }}>✍️</span>
          </div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#fff', fontWeight: 'bold' }}>
            Bí quyết in nhựa PETG láng mịn
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Hướng dẫn chi tiết cách cấu hình nhiệt độ đầu đùn, bàn nhiệt và kiểm soát tốc độ quạt để tránh hoàn toàn tình trạng vón cục nhựa PETG...
          </p>
        </div>
        <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 'bold', marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          Đọc ngay cẩm nang &rarr;
        </span>
      </div>

      {/* Card 2: Bán chạy */}
      <div 
        onClick={() => onCardClick('bestsellers')}
        className="slider-card"
        style={{
          flex: '0 0 100%',
          scrollSnapAlign: 'start',
          background: 'linear-gradient(135deg, rgba(255, 179, 0, 0.15) 0%, rgba(10, 10, 10, 0.6) 100%)',
          border: '1px solid rgba(255, 179, 0, 0.3)',
          borderRadius: '12px',
          padding: '28px',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '200px',
          boxShadow: '0 4px 25px rgba(0, 0, 0, 0.5)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 35px rgba(255, 179, 0, 0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 25px rgba(0, 0, 0, 0.5)';
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', color: '#ffb300', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Xu hướng & Bán chạy
            </span>
            <span style={{ fontSize: '24px' }}>🔥</span>
          </div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#fff', fontWeight: 'bold' }}>
            Mẫu In Bán Chạy Nhất Tuần
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Xem ngay danh sách tổng hợp những mẫu thiết kế, tệp STL và sản phẩm in 3D đang có lượt mua nhiều nhất trên sàn giao dịch...
          </p>
        </div>
        <span style={{ fontSize: '13px', color: '#ffb300', fontWeight: 'bold', marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          Khám phá danh sách &rarr;
        </span>
      </div>

      {/* Card 3: Thông tin cho người mới */}
      <div 
        onClick={() => onCardClick('beginners')}
        className="slider-card"
        style={{
          flex: '0 0 100%',
          scrollSnapAlign: 'start',
          background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.15) 0%, rgba(10, 10, 10, 0.6) 100%)',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          borderRadius: '12px',
          padding: '28px',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '200px',
          boxShadow: '0 4px 25px rgba(0, 0, 0, 0.5)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 35px rgba(0, 229, 255, 0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 25px rgba(0, 0, 0, 0.5)';
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', color: '#00e5ff', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Cho Người Mới Bắt Đầu
            </span>
            <span style={{ fontSize: '24px' }}>💡</span>
          </div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#fff', fontWeight: 'bold' }}>
            Cẩm nang nhập môn in 3D
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Tìm hiểu đặc tính khác biệt giữa các vật liệu nhựa in thông dụng: PLA dễ in, PETG dẻo gia chống nước và ABS chịu lực bền bỉ...
          </p>
        </div>
        <span style={{ fontSize: '13px', color: '#00e5ff', fontWeight: 'bold', marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          Tìm hiểu chất liệu &rarr;
        </span>
      </div>

      {/* Card 4: Hardware & Software */}
      <div 
        onClick={() => onCardClick('slicers')}
        className="slider-card"
        style={{
          flex: '0 0 100%',
          scrollSnapAlign: 'start',
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(10, 10, 10, 0.6) 100%)',
          border: '1px solid rgba(236, 72, 153, 0.3)',
          borderRadius: '12px',
          padding: '28px',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '200px',
          boxShadow: '0 4px 25px rgba(0, 0, 0, 0.5)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 35px rgba(236, 72, 153, 0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 25px rgba(0, 0, 0, 0.5)';
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', color: '#ec4899', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Phần mềm in 3D
            </span>
            <span style={{ fontSize: '24px' }}>⚙️</span>
          </div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#fff', fontWeight: 'bold' }}>
            So sánh Cura và Bambu Studio
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Nên chọn phần mềm cắt lớp (Slicer) nào cho máy in của bạn? So sánh khả năng thiết lập của Cura và Bambu Studio...
          </p>
        </div>
        <span style={{ fontSize: '13px', color: '#ec4899', fontWeight: 'bold', marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          So sánh tính năng &rarr;
        </span>
      </div>
    </div>
  );
};
