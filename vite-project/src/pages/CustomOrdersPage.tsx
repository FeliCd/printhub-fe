import React from 'react';
import { Users, FileSpreadsheet } from 'lucide-react';
import type { CustomOrder } from '@/types';

interface CustomOrdersPageProps {
  customOrders: CustomOrder[];
  onAddRequestClick: () => void;
  onBuyerAcceptQuote: (orderId: string, paymentType: 'DEPOSIT' | 'FULL') => void;
  onBuyerCompleteCustom: (orderId: string) => void;
  onBuyerSendMessage: (orderId: string, text: string) => void;
}

const BULK_STEPS = [
  { step: 1, label: 'Tải File Mẫu Excel', desc: 'Điền danh sách học sinh & màu sắc' },
  { step: 2, label: 'Upload Danh Sách', desc: 'Web tự tính tổng tiền + chiết khấu sỉ' },
  { step: 3, label: 'Đặt Cọc PayOS', desc: 'Shop duyệt & xác nhận đơn in' },
  { step: 4, label: 'In & Giao Tận Lớp', desc: 'Xưởng in 3D & đóng gói theo danh sách' },
];

export const CustomOrdersPage: React.FC<CustomOrdersPageProps> = ({
  customOrders,
  onAddRequestClick,
}) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users className="logo-accent" size={32} />
            Đặt Sỉ Bộ Thước Kẻ Cho Lớp / CLB (Import Excel)
          </h1>
          <p className="page-subtitle">
            Chương trình gom đơn tập thể dành cho Lớp học, CLB học thuật & Trường học kèm ưu đãi chiết khấu sỉ đến 15%.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onAddRequestClick} style={{ gap: '8px' }}>
          <FileSpreadsheet size={18} /> Đặt Đơn Sỉ Mới (Import Excel)
        </button>
      </div>

      {/* Step Infographic */}
      <div className="flow-steps-container" style={{ marginBottom: '24px' }}>
        {BULK_STEPS.map((fs, idx) => (
          <React.Fragment key={fs.step}>
            <div className="flow-step-item">
              <div className="flow-step-number">{fs.step}</div>
              <div className="flow-step-label">{fs.label}</div>
              <div className="flow-step-desc">{fs.desc}</div>
            </div>
            {idx < BULK_STEPS.length - 1 && (
              <div className="flow-step-arrow">{"→"}</div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Custom Bulk Orders List */}
      <div className="glass-card">
        <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Danh sách Đơn Sỉ Tập Thể Đã Đặt ({customOrders.length})</h2>

        {customOrders.length === 0 ? (
          <div style={{ padding: '48px 32px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Chưa có đơn sỉ nào. Bấm "Đặt Đơn Sỉ Mới" để upload file Excel danh sách lớp bạn!
          </div>
        ) : (
          customOrders.map((co) => (
            <div key={co.id} className="request-card" style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--primary)', fontWeight: 'bold' }}>
                    {co.id}
                  </span>
                  <h3 style={{ margin: '4px 0', fontSize: '16px' }}>{co.requirements}</h3>
                </div>
                <span className="info-tag tag-approved">
                  {co.status === 'PENDING_DEPOSIT' ? 'Chờ xác nhận cọc' : 'Xưởng đang in 3D'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px' }}>
                <div>Số lượng: <strong style={{ color: '#FFF' }}>{co.quantity || 35} bộ</strong></div>
                <div>Vật liệu: <strong style={{ color: '#FFF' }}>PLA Khắc Laser</strong></div>
                <div>File danh sách: <strong style={{ color: '#39FF14' }}>{co.attachmentUrl || 'Danh_Sach_Lop.xlsx'}</strong></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
