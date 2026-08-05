import React, { useState } from 'react';
import { FileSpreadsheet, Users, ArrowRight, Download, ShieldCheck } from 'lucide-react';

interface StudentItem {
  name: string;
  studentId: string;
  rulerType: string;
  color: string;
}

export const BulkOrderPage: React.FC = () => {
  const [className, setClassName] = useState('Lớp 12A1 - THPT Chuyên');
  const [contactPhone, setContactPhone] = useState('0987654321');
  const [students] = useState<StudentItem[]>([
    { name: 'Nguyễn Văn An', studentId: '12A1-01', rulerType: 'Bộ 3 cây (Toán)', color: 'Neon Green' },
    { name: 'Trần Thị Bình', studentId: '12A1-02', rulerType: 'Bộ 3 cây (Toán)', color: 'Cyber Cyan' },
    { name: 'Lê Hoàng Cường', studentId: '12A1-03', rulerType: 'Bộ 3 cây (Toán)', color: 'Hot Pink' },
    { name: 'Phạm Minh Đức', studentId: '12A1-04', rulerType: 'Bộ 3 cây (Toán)', color: 'Pure White' },
    { name: 'Vũ Thị Em', studentId: '12A1-05', rulerType: 'Bộ 3 cây (Toán)', color: 'Neon Green' },
  ]);

  const unitPrice = 45000; // 45k / bộ 3 cây
  const count = students.length;
  let discountRate = 0;
  if (count >= 50) discountRate = 0.15;
  else if (count >= 20) discountRate = 0.10;
  else if (count >= 5) discountRate = 0.05;

  const rawTotal = count * unitPrice;
  const discountAmount = rawTotal * discountRate;
  const finalTotal = rawTotal - discountAmount;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock parsing excel file
      alert(`Đã nhận file "${file.name}". Đang tự động trích xuất danh sách danh sách học sinh...`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#111] via-[#1A1A1A] to-[#111] border border-white/10 rounded-2xl p-8 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/30 text-[#39FF14] text-xs font-semibold mb-3">
            <Users className="w-4 h-4" /> Dành Cho Lớp Học, CLB & Sự Kiện Trường
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Đặt Hàng Sỉ Bộ Thước Cá Nhân Hóa (Excel Import)</h1>
          <p className="text-gray-400 mt-2 max-w-2xl text-sm">
            Tải lên danh sách học sinh theo mẫu Excel để in khắc tên hàng loạt. Tự động áp dụng chiết khấu tập thể đến <span className="text-[#39FF14] font-bold">15%</span>.
          </p>
        </div>
        <button
          onClick={() => alert('Đang tải file Excel mẫu (PrintHub_Mau_Danh_Sach_In_Thuoc.xlsx)...')}
          className="bg-white/5 border border-white/15 hover:bg-white/10 text-white text-sm font-semibold px-5 py-3 rounded-xl flex items-center gap-2 transition-all"
        >
          <Download className="w-4 h-4 text-[#39FF14]" /> Tải File Mẫu Excel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload & Form Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* File Upload Zone */}
          <div className="bg-[#121212] border-2 border-dashed border-white/15 hover:border-[#39FF14]/60 transition-colors rounded-2xl p-8 text-center relative group cursor-pointer">
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="w-14 h-14 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-7 h-7 text-[#39FF14]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Kéo thả hoặc Nhấp để tải file Excel danh sách</h3>
            <p className="text-xs text-gray-400">Hỗ trợ định dạng .XLSX, .XLS, .CSV (Hệ thống tự nhận diện cột Họ Tên, MSSV/Lớp, Màu sắc)</p>
          </div>

          {/* Contact Details Form */}
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white mb-2">Thông Tin Đại Diện Đặt Hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Tên Tập Thể / Lớp / CLB:</label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#39FF14]"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Số Điện Thoại Trưởng Nhóm / Cán Sự:</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#39FF14]"
                />
              </div>
            </div>
          </div>

          {/* Student List Table Preview */}
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Danh Sách Học Sinh Trích Xuất ({students.length})</h3>
              <span className="text-xs text-[#39FF14] bg-[#39FF14]/10 px-3 py-1 rounded-full font-mono font-semibold">
                Đã kiểm định format 100%
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 uppercase">
                    <th className="pb-3 font-semibold">STT</th>
                    <th className="pb-3 font-semibold">Họ và Tên</th>
                    <th className="pb-3 font-semibold">MSSV / Mã Lớp</th>
                    <th className="pb-3 font-semibold">Màu Nhựa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {students.map((st, idx) => (
                    <tr key={idx} className="hover:bg-white/5">
                      <td className="py-2.5">{idx + 1}</td>
                      <td className="py-2.5 font-bold text-white">{st.name}</td>
                      <td className="py-2.5 text-gray-400">{st.studentId}</td>
                      <td className="py-2.5 text-[#39FF14]">{st.color}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pricing & Checkout Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-6 backdrop-blur-xl sticky top-6">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">Tóm Tắt Đơn Hàng Tập Thể</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Số lượng sản phẩm:</span>
                <span className="text-white font-mono font-bold">{count} bộ 3 thước</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Đơn giá lẻ tiêu chuẩn:</span>
                <span className="text-white font-mono">{unitPrice.toLocaleString()}đ / bộ</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tổng giá trị ban đầu:</span>
                <span className="text-white font-mono">{rawTotal.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between text-[#39FF14]">
                <span>Chiết khấu nhóm ({(discountRate * 100)}%):</span>
                <span className="font-mono font-bold">-{discountAmount.toLocaleString()}đ</span>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-base font-bold text-white">Tổng Thanh Toán:</span>
                <span className="text-2xl font-bold font-mono text-[#39FF14]">
                  {finalTotal.toLocaleString()} VNĐ
                </span>
              </div>
            </div>

            <div className="bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-xl p-4 text-xs text-gray-300 space-y-2">
              <div className="flex items-center gap-2 text-[#39FF14] font-bold">
                <ShieldCheck className="w-4 h-4" /> Cam kết B2C PrintHub_3D:
              </div>
              <p>
                • Đơn hàng sỉ cá nhân hóa miễn phí 100% chi phí khắc laser tên riêng.
                <br />
                • Thanh toán chuyển khoản 100% qua PayOS VietQR tự động để sản xuất theo tiến độ.
                <br />
                • Áp dụng chính sách Bảo hành 1 đổi 1 trong 1 học kỳ cho từng cây thước trong lớp.
              </p>
            </div>

            <button
              onClick={() => alert('Đã khởi tạo đơn hàng sỉ tập thể thành công! Đang chuyển sang cổng thanh toán PayOS VietQR...')}
              className="w-full bg-[#39FF14] hover:bg-[#32e010] text-black font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all flex items-center justify-center gap-2 text-base"
            >
              Thanh Toán VietQR Đặt Hàng Sỉ <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
