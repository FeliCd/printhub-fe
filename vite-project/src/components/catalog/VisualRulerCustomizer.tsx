import React, { useState } from 'react';
import { Sparkles, Check, ShoppingBag, Eye } from 'lucide-react';

interface VisualRulerCustomizerProps {
  onAddToCart?: (customization: {
    rulerType: string;
    customName: string;
    customStudentId: string;
    color: string;
    fontStyle: string;
    quantity: number;
    price: number;
  }) => void;
}

export const VisualRulerCustomizer: React.FC<VisualRulerCustomizerProps> = ({ onAddToCart }) => {
  const [rulerType, setRulerType] = useState<'straight' | 'triangle' | 'protractor'>('straight');
  const [customName, setCustomName] = useState('NGUYỄN VĂN A');
  const [customStudentId, setCustomStudentId] = useState('MSSV: 180293 - K18');
  const [color, setColor] = useState('#39FF14');
  const fontStyle = 'font-mono';
  const quantity = 1;

  const colors = [
    { name: 'Neon Green', hex: '#39FF14' },
    { name: 'Cyber Cyan', hex: '#00F0FF' },
    { name: 'Hot Pink', hex: '#FF007A' },
    { name: 'Pure White', hex: '#FFFFFF' },
    { name: 'Matte Black', hex: '#1C1C1E' },
  ];

  const rulerTypes = [
    { id: 'straight', name: 'Thước Thẳng 15cm', basePrice: 15000, desc: 'Tích hợp công thức Toán Đại số' },
    { id: 'triangle', name: 'Thước Tam Giác (Êke)', basePrice: 15000, desc: 'Tích hợp công thức Hình học' },
    { id: 'protractor', name: 'Thước Đo Góc 180°', basePrice: 15000, desc: 'Tích hợp thước đo góc công nghệ' },
  ];

  const currentPrice = rulerTypes.find((r) => r.id === rulerType)?.basePrice || 15000;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({
        rulerType: rulerTypes.find((r) => r.id === rulerType)?.name || 'Bộ thước',
        customName,
        customStudentId,
        color,
        fontStyle,
        quantity,
        price: currentPrice * quantity,
      });
    }
  };

  return (
    <div className="bg-[#121212]/90 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-[#39FF14] animate-pulse" />
        <h2 className="text-xl font-bold text-white tracking-wide">Trình Thiết Kế Thước 3D Trực Quan (Live Preview)</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SVG Live Preview Container */}
        <div className="lg:col-span-7 bg-[#0A0A0A] border border-white/5 rounded-xl p-8 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden group">
          <div className="absolute top-4 left-4 flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <Eye className="w-3.5 h-3.5 text-[#39FF14]" /> Viewport Mô Phỏng In 3D
          </div>

          {/* SVG RULER RENDER */}
          {rulerType === 'straight' && (
            <svg className="w-full max-w-[480px] h-36 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-105" viewBox="0 0 500 120">
              {/* Main Ruler Body */}
              <rect x="10" y="20" width="480" height="80" rx="8" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="3" />
              {/* Inner Lattice Pattern Accent */}
              <rect x="20" y="30" width="460" height="60" rx="4" fill="none" stroke={color} strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.3" />
              
              {/* Millimeter Ticks */}
              {Array.from({ length: 31 }).map((_, i) => {
                const x = 25 + i * 15;
                const isCm = i % 2 === 0;
                return (
                  <g key={i}>
                    <line x1={x} y1="20" x2={x} y2={isCm ? 42 : 32} stroke={color} strokeWidth={isCm ? "2" : "1"} strokeOpacity="0.9" />
                    {isCm && (
                      <text x={x} y="54" fill={color} fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        {i / 2}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Formula Laser Engravings */}
              <text x="35" y="72" fill="#888" fontSize="8" fontFamily="monospace">f(x)=a.x²+b.x+c | sin²α+cos²α=1</text>

              {/* CUSTOM ENGRAVED NAME */}
              <text
                x="460"
                y="75"
                fill={color}
                fontSize="14"
                fontWeight="bold"
                className={fontStyle}
                textAnchor="end"
                style={{ textShadow: `0 0 10px ${color}` }}
              >
                {customName || 'TÊN CỦA BẠN'}
              </text>
              <text
                x="460"
                y="90"
                fill="#BBB"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="end"
              >
                {customStudentId || 'MSSV/LỚP'}
              </text>
            </svg>
          )}

          {rulerType === 'triangle' && (
            <svg className="w-full max-w-[380px] h-52 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-105" viewBox="0 0 300 240">
              <polygon points="20,220 280,220 20,20" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="3" />
              <polygon points="50,190 210,190 50,70" fill="none" stroke={color} strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.4" />
              <text x="70" y="160" fill={color} fontSize="13" fontWeight="bold" textAnchor="start" style={{ textShadow: `0 0 8px ${color}` }}>
                {customName || 'TÊN CỦA BẠN'}
              </text>
              <text x="70" y="175" fill="#BBB" fontSize="9" fontFamily="monospace">
                {customStudentId}
              </text>
            </svg>
          )}

          {rulerType === 'protractor' && (
            <svg className="w-full max-w-[380px] h-48 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-105" viewBox="0 0 300 180">
              <path d="M 20,160 A 130,130 0 0,1 280,160 Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="3" />
              <path d="M 60,160 A 90,90 0 0,1 240,160 Z" fill="none" stroke={color} strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.4" />
              <text x="150" y="110" fill={color} fontSize="13" fontWeight="bold" textAnchor="middle" style={{ textShadow: `0 0 8px ${color}` }}>
                {customName || 'TÊN CỦA BẠN'}
              </text>
              <text x="150" y="128" fill="#BBB" fontSize="9" fontFamily="monospace" textAnchor="middle">
                {customStudentId}
              </text>
            </svg>
          )}

          <p className="text-xs text-gray-500 mt-4 text-center">
            * Nhựa PLA+ nguyên sinh bền nhẹ, đường khắc chìm Laser công nghệ cao nét căng không bay màu.
          </p>
        </div>

        {/* Customization Controls Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          {/* 1. Select Ruler Type */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">1. Chọn Loại Thước</label>
            <div className="grid grid-cols-1 gap-2">
              {rulerTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setRulerType(type.id as any)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    rulerType === type.id
                      ? 'border-[#39FF14] bg-[#39FF14]/10 text-white shadow-[0_0_15px_rgba(57,255,20,0.2)]'
                      : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm">{type.name}</div>
                    <div className="text-xs text-gray-400">{type.desc}</div>
                  </div>
                  <div className="font-mono text-[#39FF14] font-bold text-sm">
                    {type.basePrice.toLocaleString('vi-VN')}đ
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Plastic Color Selection */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">2. Chọn Màu Nhựa In 3D</label>
            <div className="flex items-center gap-3">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.hex)}
                  title={c.name}
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                    color === c.hex ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {color === c.hex && <Check className={`w-4 h-4 ${c.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Personalized Text Input */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">3. Nội Dung Khắc Khắc Cá Nhân Khái Hóa</label>
            <div>
              <span className="text-xs text-gray-400 mb-1 block">Tên / Họ tên nổi bật (Tối đa 20 ký tự):</span>
              <input
                type="text"
                maxLength={20}
                value={customName}
                onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                placeholder="VD: NGUYỄN VĂN A"
                className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#39FF14]"
              />
            </div>
            <div>
              <span className="text-xs text-gray-400 mb-1 block">Mã số sinh viên / Lớp / Slogan ngắn:</span>
              <input
                type="text"
                maxLength={25}
                value={customStudentId}
                onChange={(e) => setCustomStudentId(e.target.value)}
                placeholder="VD: MSSV: 180293 - Lớp 12A1"
                className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#39FF14]"
              />
            </div>
          </div>

          {/* Total & Add to Cart Button */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400 block">Tổng tiền tạm tính:</span>
              <span className="text-2xl font-bold font-mono text-[#39FF14]">
                {(currentPrice * quantity).toLocaleString('vi-VN')} VNĐ
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-[#39FF14] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#32e010] transition-all duration-200 flex items-center gap-2 shadow-[0_0_20px_rgba(57,255,20,0.4)]"
            >
              <ShoppingBag className="w-5 h-5" /> Thêm Vào Giỏ Hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
