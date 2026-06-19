import React, { useState } from 'react';
import type { Address } from '../types';
import { useApp } from '../context/AppContext';
import { User, MapPin, Shield, ShoppingBag, MessageSquareWarning } from 'lucide-react';

interface ProfilePageProps {
  makerProfile: {
    status: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
    equipmentInfo: string;
    bio: string;
    portfolioUrl: string;
    trustScore: number;
  };
  addresses: Address[];
  onAddAddress: (addressData: { name: string; phone: string; addressLine: string; province: string }) => void;
  onSetDefaultAddress: (id: number) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  makerProfile,
  addresses,
  onAddAddress,
  onSetDefaultAddress,
}) => {
  const [addressName, setAddressName] = useState('');
  const [addressPhone, setAddressPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [addressProv, setAddressProv] = useState('Hồ Chí Minh');

  const { walletPasscode, setWalletPasscode, currentUser, orders, setIsDisputeModalOpen } = useApp();
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [securitySuccess, setSecuritySuccess] = useState<string | null>(null);

  // Tab control
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'ORDERS'>('PROFILE');

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError(null);
    setSecuritySuccess(null);

    if (currentPass !== walletPasscode) {
      setSecurityError('Mật mã passcode hiện tại không đúng.');
      return;
    }

    if (newPass.length !== 6 || confirmPass.length !== 6) {
      setSecurityError('Passcode mới phải gồm đầy đủ 6 chữ số.');
      return;
    }

    if (newPass !== confirmPass) {
      setSecurityError('Xác nhận passcode mới không khớp.');
      return;
    }

    if (newPass === walletPasscode) {
      setSecurityError('Passcode mới không được trùng với passcode cũ.');
      return;
    }

    setWalletPasscode(newPass);
    setSecuritySuccess('Cập nhật mật mã passcode bảo mật ví thành công!');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

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

  const handleTriggerDispute = (orderId: string) => {
    // Copy to clipboard
    navigator.clipboard.writeText(orderId);
    alert(`Đã sao chép mã đơn hàng: ${orderId}. Vui lòng dán mã này vào biểu mẫu khiếu nại!`);
    setIsDisputeModalOpen(true);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return { text: 'Chờ xử lý', color: '#ff9f0a', bg: 'rgba(255, 159, 10, 0.1)' };
      case 'PROCESSING': return { text: 'Đang in / Chuẩn bị', color: '#007aff', bg: 'rgba(0, 122, 255, 0.1)' };
      case 'SHIPPED': return { text: 'Đang giao hàng', color: '#af52de', bg: 'rgba(175, 82, 222, 0.1)' };
      case 'COMPLETED': return { text: 'Giao thành công', color: 'var(--primary)', bg: 'rgba(57, 255, 20, 0.1)' };
      case 'CANCELLED': return { text: 'Đã hủy', color: '#ff3b30', bg: 'rgba(255, 59, 48, 0.1)' };
      default: return { text: status, color: 'var(--text-primary)', bg: 'var(--border)' };
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">Quản lý Tài khoản & Đơn hàng</h1>
          <p className="page-subtitle">Xem thông tin định danh hồ sơ thành viên, địa chỉ nhận hàng và lịch sử mua sắm</p>
        </div>
      </div>

      {/* Tab Navigation for Buyer */}
      {currentUser?.role === 'BUYER' && (
        <div className="tab-nav" style={{ marginBottom: '24px' }}>
          <button
            className={`tab-btn ${activeTab === 'PROFILE' ? 'active' : ''}`}
            onClick={() => setActiveTab('PROFILE')}
          >
            Hồ sơ & Địa chỉ
          </button>
          <button
            className={`tab-btn ${activeTab === 'ORDERS' ? 'active' : ''}`}
            onClick={() => setActiveTab('ORDERS')}
          >
            Lịch sử mua hàng ({orders.length})
          </button>
        </div>
      )}

      {/* Render TAB: PROFILE */}
      {activeTab === 'PROFILE' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* Left column: Profile & Security */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Profile detail */}
            {currentUser?.role === 'MAKER' ? (
              <div className="glass-card" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <User size={18} className="text-muted" />
                  <h2 style={{ margin: 0 }}>Hồ sơ Nhà in (Maker Profile)</h2>
                </div>
                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                        color: 'var(--bg-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '24px',
                      }}
                    >
                      M
                    </div>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>DragonCreator3D</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Điểm tín nhiệm:{' '}
                        <strong style={{ color: 'var(--primary)' }}>{makerProfile.trustScore}/100</strong>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Thông tin thiết bị in</label>
                    <input type="text" className="form-control" readOnly value={makerProfile.equipmentInfo} />
                  </div>

                  <div className="form-group">
                    <label>Tiểu sử / Giới thiệu</label>
                    <textarea
                      className="form-control"
                      readOnly
                      value={makerProfile.bio}
                      style={{ height: '80px', resize: 'none' }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Trang cá nhân / Portfolio URL</label>
                    <input type="text" className="form-control" readOnly value={makerProfile.portfolioUrl} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <User size={18} className="text-muted" />
                  <h2 style={{ margin: 0 }}>Hồ sơ Khách hàng (Buyer Profile)</h2>
                </div>
                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: '#007aff',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '24px',
                      }}
                    >
                      B
                    </div>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{currentUser?.name || 'Nguyễn Văn Anh'}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                        Cấp hội viên:{' '}
                        <strong style={{ color: '#ffcc00', backgroundColor: 'rgba(255, 204, 0, 0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>
                          Hội viên Vàng (Gold)
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Loại tài khoản bảo mật</label>
                    <input type="text" className="form-control" readOnly value="Tài khoản mua hàng cá nhân" />
                  </div>

                  <div className="form-group">
                    <label>Đơn hàng đã hoàn thành</label>
                    <input type="text" className="form-control" readOnly value={`${orders.filter(o => o.status === 'COMPLETED').length} đơn hàng`} />
                  </div>

                  <div className="form-group">
                    <label>Mức chiết khấu mua hàng</label>
                    <input type="text" className="form-control" readOnly value="Giảm thêm -5% phí ship nội bộ" />
                  </div>
                </div>
              </div>
            )}

            {/* Security & Passcode Settings */}
            <div className="glass-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Shield size={18} className="text-muted" />
                <h2 style={{ margin: 0 }}>Bảo mật Ví (Passcode)</h2>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '20px' }}>
                Mật mã passcode gồm 6 số bảo vệ số dư tài khoản của bạn khi giao dịch thanh toán nội bộ.
              </p>
              <form onSubmit={handleSecuritySubmit}>
                <div className="form-group">
                  <label>Passcode hiện tại</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Nhập passcode hiện tại"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                  />
                </div>
                <div className="form-control-row">
                  <div className="form-group">
                    <label>Passcode mới</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Mã mới (6 số)"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Xác nhận mã mới</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Nhập lại mã mới"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                    />
                  </div>
                </div>
                
                {securityError && (
                  <p style={{ color: '#ff3b30', fontSize: '12px', marginBottom: '16px', fontWeight: '500' }}>
                    {securityError}
                  </p>
                )}
                {securitySuccess && (
                  <p style={{ color: 'var(--primary)', fontSize: '12px', marginBottom: '16px', fontWeight: '500' }}>
                    {securitySuccess}
                  </p>
                )}

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Cập nhật Passcode ví
                </button>
              </form>
            </div>
          </div>

          {/* Address Book */}
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
        </div>
      )}

      {/* Render TAB: ORDERS */}
      {activeTab === 'ORDERS' && (
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <ShoppingBag size={18} className="text-muted" />
            <h2 style={{ margin: 0 }}>Lịch sử đặt mua hàng (Catalog Purchases)</h2>
          </div>
          
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Bạn chưa thực hiện bất kỳ giao dịch mua hàng nào trên Catalog.
              </div>
            ) : (
              orders.map((order) => {
                const st = getStatusLabel(order.status);
                return (
                  <div 
                    key={order.id} 
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '20px',
                      backgroundColor: 'var(--bg-secondary)'
                    }}
                  >
                    {/* Order header */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid var(--border)',
                      paddingBottom: '12px',
                      marginBottom: '16px',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontFamily: 'var(--mono)', fontWeight: 'bold', color: 'var(--primary)' }}>{order.id}</span>
                          <span className="status-badge" style={{ backgroundColor: st.bg, color: st.color, padding: '2px 8px', fontSize: '11px' }}>
                            {st.text}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Ngày đặt: {order.date} | Mã vận đơn: <code style={{ color: 'var(--text-secondary)' }}>{order.trackingNumber}</code>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Tổng thanh toán:</span>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--primary)', fontFamily: 'var(--mono)' }}>
                          {order.totalAmount.toLocaleString()}đ
                        </div>
                      </div>
                    </div>

                    {/* Order items list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }}
                          />
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 2px 0', fontSize: '13px' }}>{item.product.name}</h4>
                            <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                              <span>Loại: {item.product.type === 'DIGITAL' ? 'File STL' : 'Mô hình in'}</span>
                              {item.product.type === 'PHYSICAL' && (item.selectedColor || item.selectedMaterial) && (
                                <>
                                  <span>|</span>
                                  <span>Màu: {item.selectedColor || 'Đen'}</span>
                                  <span>|</span>
                                  <span>Nhựa: {item.selectedMaterial || 'PLA'}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', fontSize: '12px' }}>
                            <div style={{ fontFamily: 'var(--mono)' }}>{item.product.price.toLocaleString()}đ</div>
                            <div style={{ color: 'var(--text-muted)' }}>x {item.quantity}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Dispute actions / details */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid var(--border)',
                      paddingTop: '12px',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Phương thức thanh toán: <strong>{order.paymentMethod === 'WALLET' ? 'Ví điện tử' : 'Chuyển khoản / VNPay'}</strong>
                      </div>
                      
                      {/* Only allow disputes for SHIPPED or COMPLETED orders */}
                      {(order.status === 'SHIPPED' || order.status === 'COMPLETED') && (
                        <button 
                          className="btn btn-secondary" 
                          style={{
                            borderColor: '#ff3b30',
                            color: '#ff3b30',
                            fontSize: '12px',
                            padding: '6px 12px',
                            gap: '6px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          onClick={() => handleTriggerDispute(order.id)}
                        >
                          <MessageSquareWarning size={14} />
                          Khiếu nại đơn này
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
