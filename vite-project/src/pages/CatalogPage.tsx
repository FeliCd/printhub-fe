import React, { useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import type { Product } from '../types';
import { useApp } from '../context/AppContext';

interface CatalogPageProps {
  products: Product[];
  userRole: 'BUYER' | 'MAKER' | 'ADMIN';
  onAddProductClick: () => void;
  onProductClick: (product: Product) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  products,
  userRole,
  onAddProductClick,
  onProductClick,
}) => {
  const { searchQuery, setSearchQuery } = useApp();
  const [filterTab, setFilterTab] = useState<'ALL' | 'MINE'>('ALL');
  const [activePromoModal, setActivePromoModal] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.makerName.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query))
    );
  });

  const displayProducts = filteredProducts.filter((p) => {
    if (userRole === 'MAKER' && filterTab === 'MINE') {
      return p.makerName === 'DragonCreator3D';
    }
    return true;
  });

  return (
    <div>
      {/* Page Header Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">
            {userRole === 'ADMIN' ? 'Quản lý Sản phẩm & Bản thiết kế' : 'Sản phẩm & Bản thiết kế 3D'}
          </h1>
          <p className="page-subtitle">
            {userRole === 'ADMIN'
              ? 'Duyệt và kiểm soát các sản phẩm, tệp tin STL được đăng bán trên sàn giao dịch'
              : 'Khám phá các thiết bị in, mô hình in sẵn và tệp tin STL có bản quyền'}
          </p>
        </div>
        {userRole === 'MAKER' && filterTab === 'ALL' && (
          <button className="btn btn-primary" onClick={onAddProductClick}>
            <Plus size={16} /> Đăng bán sản phẩm
          </button>
        )}
      </div>

      {/* Horizontal Slider for Buyer */}
      {userRole === 'BUYER' && (
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
            onClick={() => setActivePromoModal('blog')}
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
            onClick={() => setActivePromoModal('bestsellers')}
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
            onClick={() => setActivePromoModal('beginners')}
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
            onClick={() => setActivePromoModal('slicers')}
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
      )}

      {/* Maker Dashboard Banner */}
      {userRole === 'MAKER' && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(57, 255, 20, 0.08) 0%, rgba(10, 10, 10, 0) 100%)',
          borderLeft: '4px solid var(--primary)',
          padding: '16px 20px',
          borderRadius: '0 8px 8px 0',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(57, 255, 20, 0.1)',
          borderRight: '1px solid rgba(57, 255, 20, 0.05)',
          borderBottom: '1px solid rgba(57, 255, 20, 0.05)'
        }}>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ margin: '0 0 4px 0', color: 'var(--primary)', fontSize: '15px', fontWeight: 'bold' }}>
              Bảng điều khiển Nhà in (Maker Dashboard)
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
              Chào mừng trở lại! Bạn có thể quản lý các mẫu thiết kế của mình hoặc đăng bán sản phẩm mới lên Catalog.
            </p>
          </div>
          {filterTab === 'MINE' && (
            <button className="btn btn-primary" onClick={onAddProductClick}>
              <Plus size={16} /> Đăng bán sản phẩm
            </button>
          )}
        </div>
      )}

      {/* Role Filter Tabs */}
      {userRole === 'MAKER' && (
        <div className="tab-nav" style={{ marginBottom: '24px' }}>
          <button 
            className={`tab-btn ${filterTab === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterTab('ALL')}
          >
            Tất cả sản phẩm
          </button>
          <button 
            className={`tab-btn ${filterTab === 'MINE' ? 'active' : ''}`}
            onClick={() => setFilterTab('MINE')}
          >
            Mẫu thiết kế của tôi ({products.filter(p => p.makerName === 'DragonCreator3D').length})
          </button>
        </div>
      )}

      {/* Grid Cards */}
      {displayProducts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '64px 32px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          marginTop: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)'
          }}>
            <Search size={28} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>Không tìm thấy kết quả</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>
              {filterTab === 'MINE' 
                ? 'Bạn chưa có thiết kế nào khớp với bộ lọc này.' 
                : `Không tìm thấy sản phẩm nào khớp với từ khóa "${searchQuery}"`}
            </p>
          </div>
          {filterTab === 'ALL' && (
            <button className="btn btn-secondary" onClick={() => setSearchQuery('')} style={{ marginTop: '8px' }}>
              Xóa bộ lọc tìm kiếm
            </button>
          )}
        </div>
      ) : (
        <div className="product-grid">
          {displayProducts.map((p) => {
            const isMyProduct = userRole === 'MAKER' && p.makerName === 'DragonCreator3D';
            return (
              <div 
                key={p.id} 
                className="product-card" 
                onClick={() => onProductClick(p)}
                style={{
                  border: isMyProduct ? '1px solid rgba(57, 255, 20, 0.4)' : '1px solid var(--border)',
                  boxShadow: isMyProduct ? '0 0 10px rgba(57, 255, 20, 0.05)' : 'none'
                }}
              >
                <span className={`product-badge ${p.type === 'DIGITAL' ? 'badge-digital' : 'badge-physical'}`}>
                  {p.type === 'DIGITAL' ? 'File 3D (.STL)' : 'Mô hình In'}
                </span>
                {isMyProduct && (
                  <span 
                    className="product-badge" 
                    style={{ 
                      right: '12px', 
                      left: 'auto', 
                      backgroundColor: 'rgba(57, 255, 20, 0.15)', 
                      border: '1px solid var(--primary)', 
                      color: 'var(--primary)',
                      textTransform: 'uppercase',
                      fontWeight: 'bold',
                      fontSize: '10px'
                    }}
                  >
                    Mẫu của bạn
                  </span>
                )}
                <div className="product-image">
                  <img src={p.image} alt={p.name} />
                </div>
                <div className="product-info">
                  <div className="product-maker" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{p.makerName}</span>
                    {isMyProduct && <span style={{ color: 'var(--primary)', fontSize: '10px', fontWeight: 'bold' }}>Quản lý</span>}
                  </div>
                  <h3 className="product-name">{p.name}</h3>
                  {p.type === 'DIGITAL' && (
                    <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 'bold' }}>
                      Bản quyền: {p.licenseType === 'COMMERCIAL' ? 'Cho phép Thương mại' : 'Chỉ dùng cá nhân'}
                    </div>
                  )}
                  <div className="product-price" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{p.price.toLocaleString()}đ</span>
                    {isMyProduct && (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                        Kho: {p.stock}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PROMO DETAIL MODAL */}
      {activePromoModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '600px', width: '90%' }}>
            <button className="modal-close" onClick={() => setActivePromoModal(null)}>
              <X size={24} />
            </button>
            
            {activePromoModal === 'blog' && (
              <div>
                <span className="info-tag tag-approved" style={{ marginBottom: '12px' }}>BLOG & KINH NGHIỆM</span>
                <h2 style={{ fontSize: '22px', margin: '8px 0', color: '#fff' }}>Bí quyết in nhựa PETG láng mịn & Không vón cục</h2>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginTop: '16px' }}>
                  <p>Nhựa PETG là sự kết hợp tuyệt vời giữa độ dẻo dai của ABS và độ dễ in của PLA. Tuy nhiên, nhiều người gặp vấn đề vón cục hoặc kéo râu (stringing). Dưới đây là lời khuyên hữu ích:</p>
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
      )}
    </div>
  );
};
