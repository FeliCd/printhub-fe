import React from 'react';
import { Sparkles } from 'lucide-react';
import { VisualRulerCustomizer } from '@/components/catalog/VisualRulerCustomizer';
import { useApp } from '@/contexts/AppContext';

export const Ruler3DPage: React.FC = () => {
  const { handleAddToCart } = useApp();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#111] via-[#1A1A1A] to-[#111] border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/30 text-[#39FF14] text-xs font-semibold mb-3">
          <Sparkles className="w-4 h-4 animate-pulse" /> Trình Tạo Thước 3D Trực Quan
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Cấu Hình & Tự Thiết Kế Thước 3D (Ruler 3D)</h1>
        <p className="text-gray-400 mt-2 max-w-2xl text-sm">
          Tùy chỉnh chọn loại thước, màu sắc nhựa in 3D, khắc tên riêng và mã số sinh viên theo yêu cầu. Xem trực tiếp mô hình hiển thị trước khi đặt hàng.
        </p>
      </div>

      {/* Visual Ruler Customizer Component */}
      <VisualRulerCustomizer
        onAddToCart={(custom) => {
          handleAddToCart({
            id: Date.now(),
            name: `${custom.rulerType} - Khắc Tên: ${custom.customName}`,
            type: 'PHYSICAL',
            price: custom.price,
            stock: 99,
            image: 'https://images.unsplash.com/photo-1584697964400-2ae6b28a2085?w=500&auto=format&fit=crop&q=60',
            description: `Khắc: ${custom.customName} (${custom.customStudentId}), Màu: ${custom.color}`,
            category: 'Thước Kẻ Cá Nhân Hóa',
            isCustomizable: true,
          });
          alert('Đã thêm bộ thước cá nhân hóa vào giỏ hàng thành công!');
        }}
      />
    </div>
  );
};
