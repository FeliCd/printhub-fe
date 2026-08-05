import React, { useState } from 'react';
import { Printer, Download, Truck, PackageCheck, Search } from 'lucide-react';

interface ProductionJob {
  id: string;
  orderNumber: string;
  customerName: string;
  rulerType: string;
  engravedName: string;
  engravedStudentId: string;
  color: string;
  quantity: number;
  status: 'PAID_WAITING' | 'IN_PRODUCTION' | 'KCS_PASSED' | 'SHIPPING';
  createdAt: string;
}

export const AdminProductionPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [jobs, setJobs] = useState<ProductionJob[]>([
    {
      id: 'JOB-101',
      orderNumber: 'ORD-9821',
      customerName: 'Nguyễn Thanh Hùng',
      rulerType: 'Bộ 3 Thước (Toán)',
      engravedName: 'NGUYỄN THANH HÙNG',
      engravedStudentId: 'Lớp 12A2 - THPT NKKN',
      color: 'Neon Green',
      quantity: 1,
      status: 'PAID_WAITING',
      createdAt: '2026-08-02 08:30',
    },
    {
      id: 'JOB-102',
      orderNumber: 'ORD-9822',
      customerName: 'Lê Thị Hương',
      rulerType: 'Thước Thẳng 15cm',
      engravedName: 'LÊ THỊ HƯƠNG',
      engravedStudentId: 'MSSV: 202488',
      color: 'Cyber Cyan',
      quantity: 2,
      status: 'IN_PRODUCTION',
      createdAt: '2026-08-02 08:45',
    },
    {
      id: 'JOB-103',
      orderNumber: 'ORD-9823',
      customerName: 'Đoàn Văn Nam (Đặt Sỉ)',
      rulerType: 'Combo Lớp 40 Bộ',
      engravedName: '40 TÊN THEO EXCEL',
      engravedStudentId: 'Lớp 11B3',
      color: 'Hot Pink',
      quantity: 40,
      status: 'KCS_PASSED',
      createdAt: '2026-08-02 07:15',
    },
  ]);

  const handleUpdateStatus = (id: string, newStatus: ProductionJob['status']) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, status: newStatus } : job))
    );
  };

  const handleExportBatchCSV = () => {
    const csvHeader = 'Mã Đơn,Tên Khách,Loại Thước,Nội Dung Khắc Tên,MSSV/Lớp,Màu Nhựa,Số Lượng\n';
    const csvRows = jobs
      .map(
        (j) =>
          `"${j.orderNumber}","${j.customerName}","${j.rulerType}","${j.engravedName}","${j.engravedStudentId}","${j.color}",${j.quantity}`
      )
      .join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PrintHub_Batch_Engraving_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredJobs = jobs.filter((j) => {
    const matchesFilter = filterStatus === 'ALL' || j.status === filterStatus;
    const matchesSearch =
      j.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.engravedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-white space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#39FF14] bg-[#39FF14]/10 px-3 py-1 rounded-full border border-[#39FF14]/30 mb-2">
            <Printer className="w-4 h-4" /> Internal Fulfillment & Production Dashboard
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Quản Lý Sản Xuất & In Ấn B2C PrintHub</h1>
          <p className="text-gray-400 text-sm mt-1">
            Theo dõi tiến độ cắt lát G-code, chạy máy in 3D, khắc laser tên riêng và tạo vận đơn giao hàng.
          </p>
        </div>

        <button
          onClick={handleExportBatchCSV}
          className="bg-[#39FF14] text-black font-bold px-5 py-3 rounded-xl hover:bg-[#32e010] transition-all flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(57,255,20,0.3)]"
        >
          <Download className="w-4 h-4" /> Export File Lô In CSV (Cho Máy In)
        </button>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#121212] border border-white/10 p-4 rounded-xl">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'ALL', label: 'Tất Cả' },
            { id: 'PAID_WAITING', label: 'Chờ In (Đã Cọc 100%)' },
            { id: 'IN_PRODUCTION', label: 'Đang In 3D' },
            { id: 'KCS_PASSED', label: 'KCS Đạt' },
            { id: 'SHIPPING', label: 'Đang Giao Hàng' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === tab.id
                  ? 'bg-white/15 text-[#39FF14] border border-[#39FF14]/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Tìm theo Mã đơn / Tên khắc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/60 border border-white/15 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#39FF14]"
          />
        </div>
      </div>

      {/* Production Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-[#121212] border border-white/10 hover:border-white/20 transition-all rounded-2xl p-6 space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <span className="font-mono text-xs text-[#39FF14] font-bold">{job.orderNumber}</span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    job.status === 'PAID_WAITING'
                      ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                      : job.status === 'IN_PRODUCTION'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      : job.status === 'KCS_PASSED'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                      : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                  }`}
                >
                  {job.status === 'PAID_WAITING' && 'Chờ In (Đã Cọc)'}
                  {job.status === 'IN_PRODUCTION' && 'Đang In 3D...'}
                  {job.status === 'KCS_PASSED' && 'KCS Đạt Chuẩn'}
                  {job.status === 'SHIPPING' && 'Đã Giao Vận'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Khách hàng:</span>
                  <span className="font-semibold text-white">{job.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Loại sản phẩm:</span>
                  <span className="font-semibold text-white">{job.rulerType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Màu nhựa:</span>
                  <span className="font-mono font-bold text-[#39FF14]">{job.color}</span>
                </div>

                <div className="bg-black/60 border border-white/10 rounded-xl p-3 mt-3">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Nội Dung Khắc Khắc Khắc Khắc:</span>
                  <div className="font-mono text-sm font-bold text-white tracking-wide">{job.engravedName}</div>
                  <div className="font-mono text-xs text-gray-400">{job.engravedStudentId}</div>
                </div>
              </div>
            </div>

            {/* Action Status Update Buttons */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-2">
              {job.status === 'PAID_WAITING' && (
                <button
                  onClick={() => handleUpdateStatus(job.id, 'IN_PRODUCTION')}
                  className="w-full bg-[#39FF14]/10 border border-[#39FF14]/40 hover:bg-[#39FF14]/20 text-[#39FF14] font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Bắt Đầu In 3D
                </button>
              )}
              {job.status === 'IN_PRODUCTION' && (
                <button
                  onClick={() => handleUpdateStatus(job.id, 'KCS_PASSED')}
                  className="w-full bg-blue-500/20 border border-blue-500/40 hover:bg-blue-500/30 text-blue-300 font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <PackageCheck className="w-3.5 h-3.5" /> Duyệt KCS Đạt
                </button>
              )}
              {job.status === 'KCS_PASSED' && (
                <button
                  onClick={() => handleUpdateStatus(job.id, 'SHIPPING')}
                  className="w-full bg-purple-500/20 border border-purple-500/40 hover:bg-purple-500/30 text-purple-300 font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5" /> Tạo Mã Vận Đơn GHN
                </button>
              )}
              {job.status === 'SHIPPING' && (
                <div className="w-full text-center text-xs text-gray-400 font-mono py-2 bg-white/5 rounded-xl border border-white/10">
                  ✓ Đã giao vận thành công
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
