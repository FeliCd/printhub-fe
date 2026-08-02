import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, Download } from 'lucide-react';

interface CustomOrderModalProps {
  onClose: () => void;
  onSubmit: (data: {
    requirements: string;
    attachmentUrl: string;
    category: string;
    material: string;
    quantity: number;
    color?: string;
    isBulkOrder?: boolean;
    bulkStudentList?: { name: string; color: string; classId?: string }[];
  }) => void;
}

export const CustomOrderModal: React.FC<CustomOrderModalProps> = ({ onClose, onSubmit }) => {
  const [className, setClassName] = useState('Lớp 12A1 - Chuyên Toán');
  const [schoolName, setSchoolName] = useState('THPT Chuyên Nguyễn Bỉnh Khiêm');
  const [quantity, setQuantity] = useState(35);
  const [defaultColor] = useState('Neon Green (#39FF14)');
  const [importedList, setImportedList] = useState<{ name: string; color: string; classId?: string }[]>([
    { name: 'Nguyễn Văn Anh', color: 'Neon Green', classId: '12A1' },
    { name: 'Trần Minh Tuấn', color: 'Đen Nhám', classId: '12A1' },
    { name: 'Lê Thị Hương', color: 'Hồng Pastel', classId: '12A1' },
    { name: 'Phạm Đức Long', color: 'Xanh Cyan', classId: '12A1' },
    { name: 'Hoàng Quốc Việt', color: 'Neon Green', classId: '12A1' },
  ]);
  const [fileName, setFileName] = useState('Danh_Sach_Khac_Ten_Lop_12A1.xlsx');
  const [notes, setNotes] = useState('Khắc thêm Logo Lớp 12A1 phía góc phải thước thẳng.');

  const unitPrice = 45000;
  const discountRate = quantity >= 40 ? 0.15 : quantity >= 20 ? 0.10 : 0.05;
  const rawTotal = quantity * unitPrice;
  const discountAmount = Math.round(rawTotal * discountRate);
  const finalTotal = rawTotal - discountAmount;

  const handleSimulateExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setImportedList([
        { name: 'Nguyễn Văn Anh', color: 'Neon Green', classId: '12A1' },
        { name: 'Trần Minh Tuấn', color: 'Đen Nhám', classId: '12A1' },
        { name: 'Lê Thị Hương', color: 'Hồng Pastel', classId: '12A1' },
        { name: 'Phạm Đức Long', color: 'Xanh Cyan', classId: '12A1' },
        { name: 'Hoàng Quốc Việt', color: 'Neon Green', classId: '12A1' },
        { name: 'Đặng Mai Phương', color: 'Trắng Sứ', classId: '12A1' },
        { name: 'Bùi Hoàng Nam', color: 'Neon Green', classId: '12A1' },
      ]);
      setQuantity(35);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      requirements: `[ĐƠN SỈ LỚP/CLB] ${className} - ${schoolName}. Ghi chú: ${notes}`,
      attachmentUrl: fileName,
      category: 'Đơn sỉ Lớp / CLB',
      material: 'PLA In 3D 100% (Khắc Laser)',
      quantity: quantity,
      color: defaultColor,
      isBulkOrder: true,
      bulkStudentList: importedList,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '720px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        <h2 style={{ marginBottom: '4px', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileSpreadsheet className="logo-accent" size={24} />
          Đặt Sỉ Bộ Thước Kẻ Cho Lớp / CLB (Import Excel)
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Tải file mẫu Excel, điền danh sách học sinh + màu sắc chọn, sau đó upload lên web để nhận chiết khấu sỉ lên tới 15%.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Form Information */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Tên Lớp / CLB / Đơn vị:</label>
              <input
                type="text"
                className="input"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Trường học / Địa chỉ giao:</label>
              <input
                type="text"
                className="input"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </div>
          </div>

          {/* Step 2: Download Template & Excel Upload */}
          <div style={{ background: 'var(--bg-secondary)', border: '1px dashed var(--primary)', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#FFF' }}>1. Tải File Mẫu Excel Danh Sách Học Sinh</strong>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Mẫu gồm các cột: STT, Họ và tên, Lớp, Màu sắc nhựa chọn</div>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '12px', padding: '6px 12px', gap: '6px' }}
                onClick={() => alert('Đang tải file Mau_Khac_Ten_Thuoc_Ke_PrintHub3D.xlsx...')}
              >
                <Download size={14} /> Tải File Excel Mẫu
              </button>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              <strong style={{ fontSize: '13px', color: '#FFF', display: 'block', marginBottom: '8px' }}>
                2. Upload File Excel Danh Sách Đã Điền
              </strong>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'rgba(57, 255, 20, 0.08)',
                  border: '1px solid #39FF14',
                  padding: '12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#39FF14'
                }}
              >
                <Upload size={18} />
                <span>{fileName ? `Đã chọn: ${fileName}` : 'Bấm vào đây để chọn file .XLSX / .CSV'}</span>
                <input type="file" accept=".xlsx, .xls, .csv" onChange={handleSimulateExcelUpload} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {/* Step 3: Imported Preview */}
          {importedList.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase' }}>
                  Xem trước danh sách parsed từ Excel ({quantity} bạn):
                </span>
                <span style={{ fontSize: '11px', color: '#39FF14' }}>
                  Chiết khấu sỉ: -{discountRate * 100}%
                </span>
              </div>
              <div style={{ maxHeight: '120px', overflowY: 'auto', background: '#000', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '12px' }}>
                {importedList.map((st, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #222' }}>
                    <span>{i + 1}. {st.name} ({st.classId || className})</span>
                    <span style={{ color: 'var(--text-muted)' }}>Màu: {st.color}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing summary */}
          <div style={{ background: 'var(--surface)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '16px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Tổng đơn giá gốc ({quantity} bộ x 45k):</span>
              <span style={{ fontFamily: 'var(--mono)' }}>{rawTotal.toLocaleString()}đ</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#39FF14' }}>
              <span>Chiết khấu sỉ (-{discountRate * 100}%):</span>
              <span style={{ fontFamily: 'var(--mono)' }}>-{discountAmount.toLocaleString()}đ</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border)', fontWeight: 'bold', fontSize: '15px' }}>
              <span>Thành tiền sau chiết khấu:</span>
              <span style={{ color: 'var(--primary)', fontFamily: 'var(--mono)' }}>{finalTotal.toLocaleString()}đ</span>
            </div>
          </div>

          {/* Note textarea */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Ghi chú yêu cầu thêm cho xưởng:</label>
            <textarea
              className="input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập ghi chú giao hàng hoặc khắc logo..."
              style={{ width: '100%', height: '60px' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontWeight: 'bold' }}>
            Gửi Đơn Sỉ & Nhận Báo Giá Ưu Đãi
          </button>
        </form>
      </div>
    </div>
  );
};
