import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import type { Address } from '@/types';

interface AddressBookProps {
  addresses: Address[];
  onAddAddress: (addressData: { name: string; phone: string; addressLine: string; province: string }) => void;
  onSetDefaultAddress: (id: number) => void;
}

export const AddressBook: React.FC<AddressBookProps> = ({
  addresses,
  onAddAddress,
  onSetDefaultAddress,
}) => {
  const [addressName, setAddressName] = useState('');
  const [addressPhone, setAddressPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [addressProv, setAddressProv] = useState('Hồ Chí Minh');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressName || !addressPhone || !addressLine) return;
    onAddAddress({
      name: addressName,
      phone: addressPhone,
      addressLine,
      province: addressProv,
    });
    setAddressName('');
    setAddressPhone('');
    setAddressLine('');
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <MapPin size={18} className="text-muted" />
        <h2 style={{ margin: 0 }}>Sổ địa chỉ giao hàng</h2>
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '20px' }}>
        <div className="form-control-row">
          <div className="form-group">
            <label>Người nhận</label>
            <input
              type="text"
              className="form-control"
              value={addressName}
              onChange={(e) => setAddressName(e.target.value)}
              placeholder="Tên người nhận"
              required
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              className="form-control"
              value={addressPhone}
              onChange={(e) => setAddressPhone(e.target.value)}
              placeholder="SĐT liên hệ"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Địa chỉ chi tiết</label>
          <input
            type="text"
            className="form-control"
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
            placeholder="Số nhà, tên đường, phường..."
            required
          />
        </div>
        <div className="form-group">
          <label>Tỉnh / Thành phố</label>
          <input
            type="text"
            className="form-control"
            value={addressProv}
            onChange={(e) => setAddressProv(e.target.value)}
            placeholder="Tỉnh/thành phố..."
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Thêm địa chỉ mới
        </button>
      </form>

      {/* List of addresses */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {addresses.map((a) => (
          <div
            key={a.id}
            style={{ border: '1px solid var(--border)', padding: '12px', borderRadius: '8px', position: 'relative' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <strong style={{ fontSize: '14px' }}>{a.name}</strong>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{a.phone}</span>
              {a.isDefault && (
                <span className="info-tag tag-approved" style={{ fontSize: '9px', padding: '2px 6px' }}>
                  Mặc định
                </span>
              )}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {a.addressLine}, {a.province}
            </p>
            {!a.isDefault && (
              <button
                onClick={() => onSetDefaultAddress(a.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontSize: '11px',
                  cursor: 'pointer',
                  padding: 0,
                  marginTop: '8px',
                }}
              >
                Đặt làm mặc định
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
