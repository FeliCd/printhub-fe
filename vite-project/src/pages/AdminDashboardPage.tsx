import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Printer, Download, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { orders } = useApp();
  const [exported, setExported] = useState(false);

  // Extract all engraved items
  const engravedItems: { orderId: string; name: string; text: string; color: string; status: string }[] = [];

  orders.forEach((o) => {
    o.items.forEach((item) => {
      engravedItems.push({
        orderId: o.id,
        name: item.product.name,
        text: item.engravingText || 'Nguyễn Văn A - SE190182',
        color: item.selectedColor || 'Neon Green',
        status: o.status,
      });
    });
  });

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'STT,MaDonHang,TenSanPham,NoiDungKhacTen,MauNhuaPLA,TrangThai\n' +
      engravedItems
        .map(
          (item, idx) =>
            `${idx + 1},${item.orderId},"${item.name}","${item.text}","${item.color}",${item.status}`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Danh_Sach_Khac_Ten_In3D_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Printer className="logo-accent" size={32} />
            Quản Lý Xưởng In 3D & Tiến Độ Khắc Tên
          </h1>
          <p className="page-subtitle">Quản lý lịch chạy máy in FDM, tồn kho nhựa PLA và xuất danh sách khắc tên hàng loạt cho xưởng</p>
        </div>
        <button
          className="btn btn-primary"
          style={{ gap: '8px', padding: '12px 18px', fontWeight: 'bold' }}
          onClick={handleExportCSV}
        >
          <Download size={18} /> Xuất File Danh Sách Khắc Tên (.CSV / Excel)
        </button>
      </div>

      {exported && (
        <div style={{ background: 'rgba(57, 255, 20, 0.15)', border: '1px solid #39FF14', padding: '12px', borderRadius: '8px', marginBottom: '16px', color: '#39FF14', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} /> Đã xuất file CSV chứa {engravedItems.length} dòng dữ liệu khắc tên thành công!
        </div>
      )}

      {/* Production Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tổng cây thước cần in</span>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary)', fontFamily: 'var(--mono)', marginTop: '4px' }}>
            {engravedItems.length * 3} cây
          </div>
          <span style={{ fontSize: '11px', color: '#39FF14' }}>Dự kiến: 1.2 kg nhựa PLA</span>
        </div>

        <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Đơn cọc PayOS đã duyệt</span>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#00E5FF', fontFamily: 'var(--mono)', marginTop: '4px' }}>
            {orders.length} đơn
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>100% đảm bảo cọc</span>
        </div>

        <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tồn kho nhựa PLA</span>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FF4081', fontFamily: 'var(--mono)', marginTop: '4px' }}>
            14.5 kg
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>5 cuộn nhựa sẵn sàng</span>
        </div>

        <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Doanh thu dự kiến</span>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFF', fontFamily: 'var(--mono)', marginTop: '4px' }}>
            {(orders.reduce((s, o) => s + o.totalAmount, 0)).toLocaleString()}đ
          </div>
          <span style={{ fontSize: '11px', color: '#39FF14' }}>Lợi nhuận gộp: ~40%</span>
        </div>
      </div>

      {/* Engraving Batch Table */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet className="logo-accent" size={20} />
            Danh Sách Khắc Tên Chờ Chạy Máy In & Khắc Laser ({engravedItems.length} hàng)
          </h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px' }}>
                <th style={{ padding: '12px' }}>STT</th>
                <th style={{ padding: '12px' }}>Mã Đơn</th>
                <th style={{ padding: '12px' }}>Sản Phẩm Thước</th>
                <th style={{ padding: '12px' }}>Nội Dung Khắc Tên</th>
                <th style={{ padding: '12px' }}>Màu Nhựa PLA</th>
                <th style={{ padding: '12px' }}>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {engravedItems.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px', fontFamily: 'var(--mono)' }}>{idx + 1}</td>
                  <td style={{ padding: '12px', fontFamily: 'var(--mono)', color: 'var(--primary)' }}>{item.orderId}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.name}</td>
                  <td style={{ padding: '12px', color: '#39FF14', fontFamily: 'var(--mono)', fontWeight: 'bold' }}>{item.text}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ background: 'rgba(255,255,255,0.08)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px' }}>
                      {item.color}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className="info-tag tag-approved" style={{ fontSize: '11px' }}>
                      ⚙️ Sẵn sàng chạy máy
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
