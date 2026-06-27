import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  LogIn,
  LogOut,
  Search,
  ArrowRight,
  Eye,
  X,
  Lock,
} from 'lucide-react';
import type { Product } from '@/types';

export const CatalogPreviewPage: React.FC = () => {
  const {
    products,
    isAuthenticated,
    currentUser,
    handleLogout,
  } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter products by search query
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

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Layers className="text-[#39FF14] drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]" size={28} />
            <span className="text-lg font-bold tracking-wider">
              Print<span className="text-[#39FF14]">Hub 3D</span>
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-xs sm:text-sm text-gray-400 hidden sm:inline">
                  Xin chào, <span className="text-white font-medium">{currentUser?.name}</span>
                </span>
                <button
                  onClick={() => {
                    if (currentUser?.role === 'ADMIN') {
                      navigate('/admin/dashboard');
                    } else {
                      navigate('/catalog');
                    }
                  }}
                  className="px-4 py-1.5 rounded-full bg-[#39FF14]/20 border border-[#39FF14]/50 text-[#39FF14] text-xs font-semibold hover:bg-[#39FF14]/30 transition-all duration-300 flex items-center gap-1.5"
                >
                  Vào Console <ArrowRight size={12} />
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    navigate('/');
                  }}
                  className="p-1.5 rounded-full hover:bg-white/10 text-red-400 transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-full bg-[#39FF14] hover:bg-[#32e612] text-black font-semibold text-xs transition-all duration-300 shadow-[0_0_10px_rgba(57,255,20,0.3)] flex items-center gap-1.5"
              >
                <LogIn size={14} />
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Header Area */}
      <section className="bg-gradient-to-b from-black/60 to-[#0A0A0A] py-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Bản xem trước Catalog <span className="text-[#39FF14]">3D Models</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mb-6">
            Duyệt trước danh sách các file thiết kế STL và sản phẩm in ấn 3D hiện có trên hệ thống PrintHub.
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, chất liệu, nhà thiết kế..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 focus:ring-1 focus:ring-[#39FF14]/50 transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Main Grid Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 mx-auto mb-4">
              <Search size={22} />
            </div>
            <h3 className="font-semibold text-base mb-1">Không tìm thấy sản phẩm</h3>
            <p className="text-xs text-gray-500">Thử tìm kiếm với từ khóa khác.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#39FF14]/40 transition-all duration-300 flex flex-col group"
              >
                {/* Product Image */}
                <div className="h-48 relative overflow-hidden bg-black/40">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${p.type === 'DIGITAL' ? 'bg-[#39FF14]/20 border border-[#39FF14]/50 text-[#39FF14]' : 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'}`}>
                    {p.type === 'DIGITAL' ? 'File 3D (.STL)' : 'Mô hình In'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                      {p.category}
                    </span>
                    <h4 className="text-base font-bold text-white line-clamp-1 mt-1">
                      {p.name}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Bởi <span className="text-gray-300 font-medium">{p.makerName}</span>
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t border-white/5 pt-3">
                    <span className="text-sm font-semibold text-[#39FF14] font-mono">
                      {p.price.toLocaleString()}đ
                    </span>
                    <button
                      onClick={() => setSelectedProduct(p)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-[#39FF14] hover:text-black transition-colors flex items-center gap-1.5 text-xs font-semibold px-3"
                      title="Xem chi tiết"
                    >
                      <Eye size={12} />
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Simplified Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden relative shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/15 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Product Image */}
              <div className="md:w-1/2 h-64 md:h-auto bg-black/40">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="md:w-1/2 p-6 flex flex-col justify-between gap-6">
                <div>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-3 ${selectedProduct.type === 'DIGITAL' ? 'bg-[#39FF14]/20 border border-[#39FF14]/50 text-[#39FF14]' : 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'}`}>
                    {selectedProduct.type === 'DIGITAL' ? 'STL KỸ THUẬT SỐ' : 'MÔ HÌNH VẬT LÝ'}
                  </span>
                  <h2 className="text-xl font-bold text-white mb-2">{selectedProduct.name}</h2>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    {selectedProduct.description || 'Không có mô tả chi tiết cho sản phẩm này.'}
                  </p>

                  <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-3 mb-4">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Nhà thiết kế</span>
                      <span className="text-sm font-semibold text-gray-300">{selectedProduct.makerName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Giá bán</span>
                      <span className="text-sm font-semibold text-[#39FF14] font-mono">{selectedProduct.price.toLocaleString()}đ</span>
                    </div>
                  </div>

                  {selectedProduct.type === 'DIGITAL' && (
                    <div className="bg-white/5 rounded-lg p-3 text-xs flex flex-col gap-2">
                      <div className="flex justify-between text-gray-400">
                        <span>Bản quyền: <strong>{selectedProduct.licenseType}</strong></span>
                        <span>Lượt tải: <strong>{selectedProduct.downloadCount}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Lock size={12} />
                        <span>Chỉ hiển thị file gốc khi đã đăng nhập</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        if (currentUser?.role === 'ADMIN') {
                          navigate('/admin/dashboard');
                        } else {
                          navigate('/catalog');
                        }
                      }}
                      className="w-full py-2.5 rounded-lg bg-[#39FF14] hover:bg-[#32e612] text-black font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      Vào Console đặt mua ngay <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        navigate('/login');
                      }}
                      className="w-full py-2.5 rounded-lg bg-white hover:bg-neutral-200 text-black font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      Đăng nhập để đặt mua <LogIn size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/40 py-6 text-center text-xs text-gray-500 mt-auto">
        <p>© 2026 PrintHub 3D. All rights reserved. Built with Spline 3D & Tailwind.</p>
      </footer>
    </div>
  );
};
